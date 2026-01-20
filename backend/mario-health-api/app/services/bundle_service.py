from typing import List, Optional, Dict, Any
from decimal import Decimal
from supabase import Client
from fastapi import HTTPException

from app.models.bundle import (
    BundleListResponse,
    BundleList,
    BundleDetail,
    BundleEstimateResponse,
    BundleHospitalsResponse,
    BundleGroupSummary,
    CodeSummary,
    RateRange,
    CodeEstimate,
    GroupEstimate,
    EstimateBreakdown,
    SurpriseCharge,
    CodeWithoutPricing,
    HospitalInfo,
    InsuranceInfo,
    EstimateMetadata,
    FREQUENCY_WEIGHTS,
)

class BundleService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def list_bundles(self) -> BundleListResponse:
        """
        List all available bundles.
        """
        result = self.supabase.table("bundles").select("*").eq("is_active", True).execute()
        
        bundles = []
        for b in result.data:
            bundles.append(BundleList(
                id=b["id"],
                slug=b["slug"],
                name=b["name"],
                description=b.get("description"),
                category=b.get("category"),
                primary_cpt_code=b.get("primary_cpt_code"),
                typical_setting=b.get("typical_setting"),
                estimated_duration_hours=float(b["estimated_duration_hours"]) if b.get("estimated_duration_hours") else None
            ))
            
        return BundleListResponse(bundles=bundles)

    def get_bundle_detail(self, slug: str) -> Optional[BundleDetail]:
        """
        Get bundle details with all groups and codes.
        """
        # 1. Get bundle
        b_result = self.supabase.table("bundles").select("*").eq("slug", slug).single().execute()
        if not b_result.data:
            return None
        
        bundle = b_result.data
        bundle_id = bundle["id"]
        
        # 2. Get groups
        g_result = self.supabase.table("bundle_groups") \
            .select("*") \
            .eq("bundle_id", bundle_id) \
            .order("display_order") \
            .execute()
            
        groups_data = g_result.data
        
        # 3. Get all codes for these groups
        group_ids = [g["id"] for g in groups_data]
        if not group_ids:
             codes_map = {}
        else:
            c_result = self.supabase.table("bundle_group_codes") \
                .select("*, codes(*)") \
                .in_("bundle_group_id", group_ids) \
                .order("display_order") \
                .execute()
                
            codes_map = {} # group_id -> list of codes
            for item in c_result.data:
                gid = item["bundle_group_id"]
                if gid not in codes_map:
                    codes_map[gid] = []
                
                code_def = item.get("codes", {})
                if not code_def:
                    continue
                    
                freq = item.get("frequency")
                weight = FREQUENCY_WEIGHTS.get(freq, 0.0) if freq else 0.0
                
                codes_map[gid].append(CodeSummary(
                    id=code_def["id"],
                    code=code_def["code"],
                    code_type=code_def["code_type"],
                    name=code_def["name"],
                    frequency=freq,
                    frequency_weight=weight,
                    is_default=item.get("is_default", False),
                    display_order=item.get("display_order", 0),
                    why_billed=item.get("why_billed")
                ))

        # Assemble
        groups = []
        for g in groups_data:
            groups.append(BundleGroupSummary(
                id=g["id"],
                name=g["name"],
                selection_type=g["selection_type"],
                is_required=g.get("is_required", True),
                phase=g.get("phase"),
                display_order=g["display_order"],
                codes=codes_map.get(g["id"], [])
            ))
            
        return BundleDetail(
            id=bundle["id"],
            slug=bundle["slug"],
            name=bundle["name"],
            description=bundle.get("description"),
            category=bundle.get("category"),
            primary_cpt_code=bundle.get("primary_cpt_code"),
            typical_setting=bundle.get("typical_setting"),
            global_period_days=bundle.get("global_period_days"),
            groups=groups
        )

    def calculate_bundle_estimate(
        self, slug: str, hospital_id: str, carrier_plan_id: str
    ) -> Optional[BundleEstimateResponse]:
        """
        Calculate price estimate for a bundle.
        """
        # 1. Fetch Bundle details
        bundle_detail = self.get_bundle_detail(slug)
        if not bundle_detail:
            raise HTTPException(status_code=404, detail="Bundle not found")

        # 2. Check Hospital Existence (Defensive)
        h_res = self.supabase.table("hospitals").select("name, city, state").eq("id", hospital_id).single().execute()
        if not h_res.data:
            raise HTTPException(status_code=400, detail="Unknown hospital_id")
        
        # 3. Fetch Pricing
        all_code_refs = []
        for group in bundle_detail.groups:
            for code in group.codes:
                all_code_refs.append(code.code)

        unique_codes = list(set(all_code_refs))
        
        pricing_map = {}
        if unique_codes:
            # Query specific fields to reduce payload
            pricing_result = self.supabase.table("code_pricing_facility_agg") \
                .select("billing_code, billing_code_type, min_professional_rate, avg_professional_rate, max_professional_rate, min_institutional_rate, avg_institutional_rate, max_institutional_rate") \
                .eq("hospital_id", hospital_id) \
                .eq("carrier_plan_id", carrier_plan_id) \
                .in_("billing_code", unique_codes) \
                .execute()
                
            for row in pricing_result.data:
                key = (row["billing_code"], row["billing_code_type"])
                pricing_map[key] = row
            
        # 4. Calculate Estimates
        # Initialize Totals
        grand_total = {"min": Decimal(0), "avg": Decimal(0), "max": Decimal(0)}
        prof_total = {"min": Decimal(0), "avg": Decimal(0), "max": Decimal(0)}
        inst_total = {"min": Decimal(0), "avg": Decimal(0), "max": Decimal(0)}
        
        total_by_phase = {}
        
        group_estimates = []
        surprise_charges = []
        codes_without_pricing = []
        
        total_codes_count = 0
        priced_codes_count = 0
        
        def to_dec(val):
            return Decimal(str(val)) if val is not None else Decimal(0)

        for group in bundle_detail.groups:
            group_codes_calc_data = [] # Stores dicts with {w, prof: {min, avg, max}, inst: {min, avg, max}, total: {min, avg, max}}
            codes_for_response = []
            
            for code in group.codes:
                total_codes_count += 1
                prices = pricing_map.get((code.code, code.code_type))
                
                if not prices:
                    # Missing Pricing
                    codes_without_pricing.append(CodeWithoutPricing(
                        code_id=code.id,
                        code=code.code,
                        code_type=code.code_type,
                        name=code.name,
                        frequency=code.frequency or "unknown",
                        reason="No negotiated rate found"
                    ))
                    # Add code to response with 0s, but exclude from calculation (handled by not adding to group_codes_calc_data)
                    codes_for_response.append(CodeEstimate(
                        code_id=code.id,
                        code=code.code,
                        code_type=code.code_type,
                        name=code.name,
                        frequency=code.frequency or "unknown",
                        frequency_weight=code.frequency_weight or 1.0,
                        display_order=code.display_order,
                        professional_rate={"min": Decimal(0), "avg": Decimal(0), "max": Decimal(0)},
                        institutional_rate={"min": Decimal(0), "avg": Decimal(0), "max": Decimal(0)},
                        why_billed=code.why_billed
                    ))
                    continue

                priced_codes_count += 1
                
                # Extract rates
                p_min = to_dec(prices.get("min_professional_rate"))
                p_avg = to_dec(prices.get("avg_professional_rate"))
                p_max = to_dec(prices.get("max_professional_rate"))
                
                i_min = to_dec(prices.get("min_institutional_rate"))
                i_avg = to_dec(prices.get("avg_institutional_rate"))
                i_max = to_dec(prices.get("max_institutional_rate"))
                
                # Code Totals
                c_total_min = p_min + i_min
                c_total_avg = p_avg + i_avg
                c_total_max = p_max + i_max
                
                weight = Decimal(str(code.frequency_weight or 1.0))
                
                # Store calculation data
                calc_data = {
                    "w": weight,
                    "f": code.frequency,
                    "prof": {"min": p_min, "avg": p_avg, "max": p_max},
                    "inst": {"min": i_min, "avg": i_avg, "max": i_max},
                    "total": {"min": c_total_min, "avg": c_total_avg, "max": c_total_max}
                }
                group_codes_calc_data.append(calc_data)
                
                # Add to response
                codes_for_response.append(CodeEstimate(
                    code_id=code.id,
                    code=code.code,
                    code_type=code.code_type,
                    name=code.name,
                    frequency=code.frequency or "unknown",
                    frequency_weight=code.frequency_weight or 1.0,
                    display_order=code.display_order,
                    professional_rate={"min": p_min, "avg": p_avg, "max": p_max},
                    institutional_rate={"min": i_min, "avg": i_avg, "max": i_max},
                    why_billed=code.why_billed
                ))

                # Surprise Charge Check
                if group.phase == "surprise":
                     surprise_charges.append(SurpriseCharge(
                        code_id=code.id,
                        code=code.code,
                        name=code.name,
                        frequency=code.frequency,
                        frequency_weight=code.frequency_weight,
                        estimated_contribution=c_total_avg * weight,
                        rate={"min": c_total_min, "avg": c_total_avg, "max": c_total_max},
                        why_billed=code.why_billed or "Surprise charge"
                     ))

            # --- Group Logic ---
            g_min, g_exp, g_max = Decimal(0), Decimal(0), Decimal(0)
            g_prof_min, g_prof_exp, g_prof_max = Decimal(0), Decimal(0), Decimal(0)
            g_inst_min, g_inst_exp, g_inst_max = Decimal(0), Decimal(0), Decimal(0)
            
            if group_codes_calc_data:
                
                def calc_logic(items, mode):
                    # items: list of dicts with min/avg/max, w, f
                    # mode: selection_type
                    
                    _min, _exp, _max = Decimal(0), Decimal(0), Decimal(0)
                    
                    if mode == "ALL":
                        # min = sum(code.min where freq='always')
                        # expected = sum(code.expected * weight)
                        # max = sum(code.max) (unweighted)
                        _min = sum([x["min"] for x in items if x["f"] == "always"], Decimal(0))
                        _exp = sum([x["avg"] * x["w"] for x in items], Decimal(0))
                        _max = sum([x["max"] for x in items], Decimal(0))
                        
                    elif mode == "ONE":
                        # min = min(code.min)
                        # expected = weighted_average(code.expected, weights)
                        # max = max(code.max)
                        _min = min([x["min"] for x in items])
                        _max = max([x["max"] for x in items])
                        
                        total_w = sum([x["w"] for x in items], Decimal(0))
                        weighted_sum = sum([x["avg"] * x["w"] for x in items], Decimal(0))
                        _exp = weighted_sum / total_w if total_w > 0 else Decimal(0)
                        
                    elif mode == "ZERO_OR_MORE":
                        # min = 0
                        # expected = sum(code.expected * weight)
                        # max = sum(code.max)
                        _min = Decimal(0)
                        _exp = sum([x["avg"] * x["w"] for x in items], Decimal(0))
                        _max = sum([x["max"] for x in items], Decimal(0))
                        
                    elif mode == "ZERO_OR_ONE":
                        # min = 0
                        # expected = weighted_average(code.expected, weights)
                        # max = max(code.max)
                        _min = Decimal(0)
                        _max = max([x["max"] for x in items])
                        
                        total_w = sum([x["w"] for x in items], Decimal(0))
                        weighted_sum = sum([x["avg"] * x["w"] for x in items], Decimal(0))
                        _exp = weighted_sum / total_w if total_w > 0 else Decimal(0)
                        
                    elif mode == "ONE_OR_MORE":
                        # min = min(code.min)
                        # expected = sum(code.expected * weight)
                        # max = sum(code.max)
                        _min = min([x["min"] for x in items])
                        _exp = sum([x["avg"] * x["w"] for x in items], Decimal(0))
                        _max = sum([x["max"] for x in items], Decimal(0))
                        
                    return _min, _exp, _max

                # Extract components
                total_items = [{"min": x["total"]["min"], "avg": x["total"]["avg"], "max": x["total"]["max"], "w": x["w"], "f": x["f"]} for x in group_codes_calc_data]
                prof_items = [{"min": x["prof"]["min"], "avg": x["prof"]["avg"], "max": x["prof"]["max"], "w": x["w"], "f": x["f"]} for x in group_codes_calc_data]
                inst_items = [{"min": x["inst"]["min"], "avg": x["inst"]["avg"], "max": x["inst"]["max"], "w": x["w"], "f": x["f"]} for x in group_codes_calc_data]
                
                g_min, g_exp, g_max = calc_logic(total_items, group.selection_type)
                g_prof_min, g_prof_exp, g_prof_max = calc_logic(prof_items, group.selection_type)
                g_inst_min, g_inst_exp, g_inst_max = calc_logic(inst_items, group.selection_type)


            # Accumulate Grand Totals
            grand_total["min"] += g_min
            grand_total["avg"] += g_exp
            grand_total["max"] += g_max
            
            prof_total["min"] += g_prof_min
            prof_total["avg"] += g_prof_exp
            prof_total["max"] += g_prof_max
            
            inst_total["min"] += g_inst_min
            inst_total["avg"] += g_inst_exp
            inst_total["max"] += g_inst_max
            
            # Phase Breakdown
            p = group.phase or "procedure"
            if p not in total_by_phase:
                total_by_phase[p] = RateRange(min=Decimal(0), expected=Decimal(0), max=Decimal(0))
            
            total_by_phase[p].min = (total_by_phase[p].min or Decimal(0)) + g_min
            total_by_phase[p].expected = (total_by_phase[p].expected or Decimal(0)) + g_exp
            total_by_phase[p].max = (total_by_phase[p].max or Decimal(0)) + g_max
            
            # Append Group Estimate
            group_estimates.append(GroupEstimate(
                group_id=group.id,
                group_name=group.name,
                phase=group.phase,
                selection_type=group.selection_type,
                display_order=group.display_order,
                codes=codes_for_response,
                subtotal=RateRange(min=g_min, expected=g_exp, max=g_max)
            ))

        # 5. Insurance Info (Optional/Minimal)
        i_info = InsuranceInfo(
            carrier_id="unknown",
            carrier_name=None,
            plan_id=carrier_plan_id,
            plan_name=None
        )
        
        warning_msg = None
        try:
             i_res = self.supabase.table("insurance_plans").select("name, carrier_id, insurance_carriers(name)").eq("id", carrier_plan_id).single().execute()
             if i_res.data:
                i_info.plan_name = i_res.data.get("name")
                i_info.carrier_id = i_res.data.get("carrier_id", "unknown")
                if i_res.data.get("insurance_carriers"):
                    i_info.carrier_name = i_res.data["insurance_carriers"].get("name")
             else:
                 warning_msg = "Insurance plan lookup failed; returning estimates for carrier_plan_id only."
        except:
            warning_msg = "Insurance plan lookup failed; returning estimates for carrier_plan_id only."

        # Collect checks for warnings
        warnings = []
        if warning_msg:
            warnings.append(warning_msg)
            
        if codes_without_pricing:
            warnings.append(f"{len(codes_without_pricing)} codes do not have negotiated rates")
            
        # Check for unknown frequencies
        codes_with_unknown_freq = 0
        for group in bundle_detail.groups:
            for c in group.codes:
                if not c.frequency or c.frequency_weight == 0.0:
                    codes_with_unknown_freq += 1
        
        if codes_with_unknown_freq > 0:
            warnings.append(f"{codes_with_unknown_freq} codes have unknown frequency")

        # Hospital Info Construction (already fetched)
        hospital_info = HospitalInfo(
            id=hospital_id,
            name=h_res.data["name"],
            city=h_res.data.get("city"),
            state=h_res.data.get("state")
        )

        # Metadata
        coverage_pct = (priced_codes_count / total_codes_count * 100) if total_codes_count > 0 else 0
        
        return BundleEstimateResponse(
            bundle={
                "id": bundle_detail.id,
                "name": bundle_detail.name,
                "slug": bundle_detail.slug
            },
            hospital=hospital_info,
            insurance=i_info,
            estimate=EstimateBreakdown(
                total=RateRange(min=grand_total["min"], expected=grand_total["avg"], max=grand_total["max"]),
                professional_total=RateRange(min=prof_total["min"], expected=prof_total["avg"], max=prof_total["max"]),
                institutional_total=RateRange(min=inst_total["min"], expected=inst_total["avg"], max=inst_total["max"]),
                breakdown_by_phase=total_by_phase,
                breakdown_by_group=group_estimates,
                surprise_charges=surprise_charges,
                codes_without_pricing=codes_without_pricing
            ),
            metadata=EstimateMetadata(
                codes_with_pricing=priced_codes_count,
                codes_without_pricing=len(codes_without_pricing),
                pricing_coverage_percent=round(coverage_pct, 1)
            ),
            warnings=warnings
        )

    def get_bundle_hospitals(
        self,
        slug: str,
        zip_code: Optional[str] = None,
        radius_miles: float = 25.0,
        carrier_plan_id: Optional[str] = None,
    ) -> BundleHospitalsResponse:
        """
        Get hospitals that have pricing data for this bundle.
        """
        # Placeholder as requested
        return BundleHospitalsResponse(hospitals=[])
