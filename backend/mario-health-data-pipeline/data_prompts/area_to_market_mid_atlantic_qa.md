# QA Prompt: Validating Stage-1 Market → Statistical Area Mapping (V2 with ZIP-Level Granularity) — MID-ATLANTIC REGION

## TLDR

**What:** Validate that healthcare markets are correctly mapped to Census statistical areas with ZIP-level splits where needed for MD, DC, DE, VA, WV.

**Why:** This mapping drives downstream ZIP assignments that determine network adequacy, price benchmarking, and regulatory compliance. The V2 schema adds ZIP-level granularity to solve many-to-one county mapping problems.

**How:** Check 10 dimensions using severity-based flagging. Surface issues, don't fix them.

**Output:** Structured findings report with executive summary, flagged issues table, and pattern analysis.

**Critical V2 Change:** Validate that `zip_list` column is used correctly — populated when multiple markets share a statistical area, blank otherwise.

**Regional Complexity:** Mid-Atlantic has the highest market fragmentation of any region due to: DC-Baltimore CSA polycentric structure, extreme congestion (I-495, I-95), major water barriers (Potomac River, Chesapeake Bay), Appalachian Mountain isolation, and state border effects across 5 jurisdictions.

---

## Purpose

This prompt quality-assures the **Stage-1 mapping file (V2 format)** linking **proprietary Healthcare Shopping Zones (markets)** to **statistical areas (CBSAs/counties) with ZIP-level splits** for the **Mid-Atlantic region (MD/DC/DE/VA/WV)**.

### V2 Schema Requirements

**The mapping file now includes a `zip_list` column:**

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
```

**Critical V2 validation:**
- `zip_list` must be **populated** when 2+ markets share the same statistical area
- `zip_list` must be **blank** when only 1 market uses the statistical area
- ZIP lists must have **complete coverage** (all county ZIPs assigned)
- ZIP lists must have **no overlaps** (each ZIP in exactly one market)

### Validation Objectives

The mapping must be:

1. **Behaviorally realistic** — Reflects how patients actually seek care
2. **Geographically sound** — Respects barriers, transit, and travel friction
3. **Programmatically unambiguous** — Each ZIP maps to exactly one market
4. **Operationally usable** — Enables clean ZIP expansion without manual intervention

This is a **review and validation task**, NOT a remapping exercise.

### Downstream Impact (Why This Matters)

This mapping directly feeds:
- **ZIP code expansion** → Network adequacy calculations
- **Market definitions** → Price comparison boundaries
- **Regulatory compliance** → Federal adequacy standards across 5 states + DC
- **Provider contracting** → Market-based rate negotiations
- **Multi-state plan design** → Critical for DMV (DC-MD-VA) integrated products

**A bad mapping here cascades into bad data everywhere downstream.**

---

## Files You Must Reference

Review the mapping against these authoritative inputs:

| File | Purpose |
|------|---------|
| `master_market.md` | National framework (45-min rule, friction factors) |
| `markets_mid_atlantic.md` | Regional geography (Potomac River, Bay Bridge, Appalachia, beltway congestion) |
| `markets_mid_atlantic.csv` | Canonical market list (30 markets for MD/DC/DE/VA/WV) |
| `market_to_area_mid_atlantic.csv` | **The V2 file under QA review** (with zip_list column) |

**Do not assume context beyond these materials.**

---

## Role Definition

You are an **Independent Health Economics & Geospatial QA Auditor** with expertise in:
- Mid-Atlantic healthcare market dynamics
- Multi-state regulatory environments (MD, DC, DE, VA, WV)
- ZIP code geography and Census statistical areas
- Transportation friction modeling (bridges, tunnels, mountains, beltway congestion)

### Your Responsibilities

✅ **Surface:** Logical inconsistencies, behavioral implausibility, mapping errors, ZIP list problems
✅ **Flag:** Issues with severity ratings and corrective actions
✅ **Document:** Patterns and systemic risks
✅ **Validate:** ZIP list completeness, coverage, and non-overlap
✅ **Check:** Multi-state boundary integrity and state-specific Medicaid split effects

❌ **Do NOT:** Silently fix issues, redefine markets, modify the mapping, collapse ambiguity, create ZIP lists

---

## Regional Context (Mid-Atlantic Specifics)

Your QA **must actively apply** these regional realities:

### 1. Geographic Barriers (Absolute and Severe)

**ABSOLUTE BARRIERS (markets NEVER share statistical areas across these):**

**Appalachian Mountains (WV/Western VA/Western MD):**
- Creates hard east-west isolation across entire western region
- I-68 (MD/WV), I-81 (VA), I-77 (WV) are limited mountain corridors
- Winter weather compounds isolation 4-5 months annually
- **Test:** WV markets should NEVER share statistical areas with DC/Baltimore/Richmond except border counties
- **Test:** Western VA markets (Roanoke, Blacksburg) isolated from Richmond/NoVA
- **Test:** Western MD markets (Cumberland, Hagerstown) separate from Baltimore/DC

**Chesapeake Bay + Bay Bridge (MD):**
- **Only one crossing** to Eastern Shore MD (US-50 Bay Bridge)
- 30-60 min queues typical on weekends, creates hard split
- Eastern Shore MD is geographically closer to Delaware than mainland MD
- **Test:** Eastern Shore markets (Salisbury, Easton) should NEVER share statistical areas with Baltimore or DC
- **Test:** Kent County MD, Queen Anne's County MD, Talbot County MD, etc. must be in Eastern Shore markets only

**Potomac River Crossings (DC/MD ↔ VA):**
- Limited bridges create north-south friction despite WMATA
- Woodrow Wilson Bridge (I-495/I-95), American Legion Bridge (I-495), Key Bridge are major bottlenecks
- 20-40 min delays typical for Wilson Bridge during daytime
- **Test:** Unless WMATA directly connects markets, Potomac crossings create friction boundary
- **Test:** Arlington/Alexandria may integrate with DC via WMATA, but other NoVA markets (Loudoun, Prince William) should be separate

**Hampton Roads Tunnels (VA):**
- I-64 tunnel, I-664 tunnel, HRBT create Peninsula ↔ Southside friction
- 30-60 min delays during typical traffic
- However, markets may still be integrated if Sentara/Riverside operate regionally
- **Test:** If Hampton Roads is split into Peninsula vs Southside, ZIP lists required

**SEVERE BARRIERS (markets may share statistical areas ONLY with strong justification):**

**I-495 Capital Beltway (DC/MD/VA):**
- Crossing can take 60+ min during typical daytime hours
- Creates friction even within DC-Baltimore CSA
- **Test:** Outer suburbs (Loudoun VA, Frederick MD) should typically be separate from DC core
- **Test:** If DC-METRO-CORE and outer suburban markets share Montgomery County MD, ZIP lists are REQUIRED

**I-95 Corridor (MD/VA/DC):**
- Chronic congestion through Baltimore beltway and DC beltway
- Baltimore to DC is 45+ min despite 40-mile distance
- **Test:** Baltimore and DC must NEVER be same market (separate even though in same CSA)

**I-64 Corridor (Richmond to Hampton Roads):**
- 60+ min between Richmond and Norfolk
- **Test:** Richmond and Hampton Roads must be completely separate markets

### 2. Transit Reality Check (CRITICAL FOR DC-BALTIMORE CSA)

**Meaningful for healthcare access:**

✅ **WMATA Metro (DC/MD/VA) — Collapses SOME markets:**
- Red Line: Connects Bethesda MD ↔ DC medical district ↔ Silver Spring MD
- Orange/Blue/Silver Lines: Connect Arlington VA ↔ Alexandria VA ↔ DC
- **CRITICAL LIMITATION:** Metro does NOT extend to:
  - Baltimore (45+ min from DC, no transit)
  - Richmond (60+ min from DC, no transit)
  - Frederick MD (outer I-270 corridor)
  - Loudoun County VA (Dulles corridor)
  - Prince William County VA (I-95 corridor)
  - Annapolis MD (Bay Bridge corridor)

**WMATA integration test:**
1. Does Metro directly serve both markets' anchor hospitals?
2. Is frequency ≥15 min at peak?
3. Is trip time <45 min door-to-door including transfers?
4. Do residents actually use Metro for medical appointments (not just work)?

**If ALL YES:** Markets may be integrated (e.g., DC ↔ Arlington/Alexandria ↔ Bethesda)
**If ANY NO:** Markets should be separate despite Metro presence

⚠️ **MARC Commuter Rail (MD) — Does NOT collapse markets:**
- Peak-direction only (toward DC in AM, toward suburbs in PM)
- Poor reverse-direction service for medical appointments
- No direct hospital access at most stations
- **Test:** MARC should NOT justify integrating Baltimore with DC
- **Test:** MARC should NOT justify integrating Frederick with DC

⚠️ **VRE Commuter Rail (VA) — Does NOT collapse markets:**
- Peak-direction to DC only
- Requires Metro transfer to reach most hospitals
- **Test:** VRE should NOT justify integrating outer VA with DC

❌ **NOT meaningful for routine care:**
- Baltimore Light Rail / Metro Subway — Limited coverage, doesn't materially reduce friction
- Ferries — No significant ferry systems for healthcare access in this region

### 3. Known Market Fragmentation Patterns

**CRITICAL: DC-BALTIMORE CSA (Washington-Baltimore-Arlington CSA) — MUST BE SPLIT**

The Washington-Baltimore CSA (10M people, CBSA 47900 + components) is FAR TOO LARGE to be a single healthcare market. Expected splits:

**Minimum 5-7 distinct markets required:**

1. **DC-METRO-CORE** — DC + Arlington/Alexandria + Bethesda (WMATA-integrated core)
2. **MD-BALTIMORE** — Baltimore City + Baltimore County (Johns Hopkins/UMMS dominance)
3. **MD-SILVER-SPRING** — Montgomery County MD suburbs (may partially overlap with DC core)
4. **VA-ARLINGTON** — Northern Virginia (may partially overlap with DC core via WMATA)
5. **VA-LOUDOUN** — Outer Loudoun County (60+ min from DC, separate)
6. **VA-PRINCE-WILLIAM** — I-95 corridor suburbs (separate from DC by beltway congestion)
7. **MD-FREDERICK** — Western I-270 corridor (60+ min from both DC and Baltimore)

**Key counties requiring ZIP-level scrutiny:**

**Montgomery County MD (24031) — Likely SHARED by 2-3 markets:**
- **DC-METRO-CORE** — Inner Montgomery (Bethesda, Silver Spring) via WMATA Red Line
- **MD-SILVER-SPRING** — Suburban Montgomery distinct from DC core
- **MD-FREDERICK** — Outer I-270 corridor (Gaithersburg, Germantown)
- **Test:** If multiple markets map to 24031, each MUST have zip_list populated
- **Test:** ZIP lists must distinguish Bethesda (20814-20817) from Gaithersburg (20878-20886)

**Arlington County VA (51013) — Likely SHARED by 2 markets:**
- **DC-METRO-CORE** — Inner Arlington via WMATA Orange/Blue lines
- **VA-ARLINGTON** — Suburban Arlington with distinct identity
- **Test:** If both map to 51013, each MUST have zip_list populated
- **Test:** ZIP boundaries should follow WMATA accessibility patterns

**Alexandria City VA (51510) — Likely SHARED by 2 markets:**
- **DC-METRO-CORE** — Old Town Alexandria via WMATA Yellow/Blue lines
- **VA-ARLINGTON** — Suburban Alexandria portions
- **Test:** If both map to 51510, each MUST have zip_list populated

**Fairfax County VA (51059) — Potentially SHARED by 2-3 markets:**
- **VA-ARLINGTON** — Inner Fairfax (Falls Church, Tysons)
- **VA-LOUDOUN** — Outer Fairfax if integrated
- **VA-PRINCE-WILLIAM** — Southern Fairfax if market extends north
- **Test:** If multiple markets map to 51059, each MUST have zip_list populated
- **Test:** Highly likely this county needs ZIP-level splits

**Baltimore Region — Independent hub, DO NOT integrate with DC:**
- **MD-BALTIMORE** covers Baltimore City + Baltimore County + surrounding counties
- 45+ min from DC with no transit connection
- Johns Hopkins and University of Maryland are independent anchors, not DC satellites
- **Test:** Baltimore should NEVER share statistical areas with DC-METRO-CORE
- **Test:** Baltimore should have separate CBSA (12580) as primary

**Richmond Region — Independent hub, separate from both DC and Hampton Roads:**
- 60+ min from DC via I-95 congestion
- 60+ min from Norfolk via I-64
- VCU Health and Bon Secours are independent anchors
- **Test:** Richmond (CBSA 40060) should be completely separate from DC and Hampton Roads
- **Test:** No statistical area overlap with DC or Hampton Roads markets

**Hampton Roads Region — May be single market or Peninsula/Southside split:**
- **Option 1:** Single integrated market (Sentara/Riverside operate regionally)
- **Option 2:** Split into Peninsula (Newport News, Hampton) vs Southside (Norfolk, Virginia Beach)
- **Test:** If split, each must have distinct counties OR ZIP lists if sharing counties
- **Test:** Tunnel friction (I-64, I-664) should be documented in rationale

**West Virginia Markets — Maximum isolation:**
- **All WV markets** should be completely separate from each other AND from neighboring states
- Appalachian terrain creates hard splits between:
  - Morgantown (closer to Pittsburgh than Charleston)
  - Charleston (state capital, central)
  - Huntington (Ohio River, closer to Ohio/Kentucky than Charleston)
  - Martinsburg (eastern panhandle, closer to Hagerstown MD than WV core)
  - Beckley, Parkersburg (isolated by terrain)
- **Test:** No WV market shares statistical areas with another WV market except contiguous counties
- **Test:** Only Martinsburg should integrate with Hagerstown MD (cross-border CBSA 25180)

**Eastern Shore MD — Hard split from mainland:**
- Bay Bridge creates absolute barrier
- Salisbury, Easton markets are geographically closer to DE than Baltimore
- **Test:** No Eastern Shore county should be in Baltimore or DC markets
- **Test:** Wicomico, Somerset, Worcester, Dorchester, Talbot, Kent, Queen Anne's, Caroline counties should all be in Eastern Shore markets only

**Delaware Markets — Integrated with PA/MD, NOT each other necessarily:**
- Wilmington integrates with Philadelphia I-95 corridor, NOT Baltimore
- Dover, Rehoboth are separate from Wilmington
- **Test:** Wilmington should reference Philadelphia integration in rationale
- **Test:** Wilmington should NOT share statistical areas with Baltimore markets

### 4. State Border Effects (5 states + DC = complex)

**Maryland ↔ Virginia (Potomac River):**
- Medicaid programs differ significantly
- Provider licensing requires separate credentials
- Network design rarely crosses for routine care except WMATA-accessible core
- **Test:** Default to state border split unless WMATA directly connects

**Maryland ↔ Delaware:**
- I-95 corridor integrates Northern DE with Philadelphia, NOT Baltimore
- Eastern Shore DE may integrate with Salisbury MD
- **Test:** New Castle County DE should NOT be in Baltimore market
- **Test:** Sussex County DE may integrate with Salisbury MD market

**Virginia ↔ West Virginia:**
- Appalachian terrain creates hard geographic split
- Limited crossings except I-81 corridor
- **Test:** Only Winchester VA ↔ Martinsburg WV integration (CBSA 49020)
- **Test:** All other VA/WV borders are hard splits

**Virginia ↔ North Carolina:**
- Hampton Roads may have minor integration with NC Outer Banks
- **Test:** Otherwise, state border is hard split

**DC ↔ MD ↔ VA (DMV region):**
- WMATA enables some integration in core
- However, state Medicaid differences still matter
- **Test:** Integration only justified when WMATA directly connects AND <45 min door-to-door

---

## QA Dimensions (Systematic Checks)

### Dimension 1: Market Coverage Completeness

**What to check:**
- Every market has ≥1 primary statistical area
- Primary area contains the market's anchor city
- All 30 markets from CSV are mapped
- **V2:** zip_list column exists in CSV header

**Red flags:**
- Market missing entirely from mapping file
- Primary statistical area doesn't contain anchor city (e.g., MD-SALISBURY mapped to Baltimore CBSA)
- Market has only secondary relationships, no primary
- **V2:** zip_list column missing from header

**Mid-Atlantic specific checks:**
- [ ] DC-METRO-CORE has DC proper (11001) as primary
- [ ] MD-BALTIMORE has Baltimore City (24510) and/or Baltimore County (24005) as primary
- [ ] VA-RICHMOND has Richmond City (51760) as primary
- [ ] VA-HAMPTON-ROADS has Norfolk (51710) and/or Virginia Beach (51810) as primary
- [ ] All 5 WV markets (Morgantown, Charleston, Huntington, Martinsburg, Beckley, Parkersburg) present
- [ ] Eastern Shore markets (Salisbury, Easton) have Eastern Shore counties only

**Severity:** CRITICAL — Incomplete coverage breaks downstream ZIP expansion

---

### Dimension 2: Primary Relationship Validity (Core Test)

**What to check:**
- Statistical area plausibly represents routine-care behavior
- 45-minute door-to-door threshold respected
- Geography and barriers appropriately considered
- **V2:** If multiple markets share statistical area, each has zip_list
- **Mid-Atlantic:** Potomac/Bay/Mountain barriers respected

**Good primary examples:**
```csv
MD-SALISBURY,CBSA,41540,,Salisbury MD-DE,primary → Correct (Salisbury anchor, Eastern Shore isolation)
VA-RICHMOND,CBSA,40060,,Richmond VA,primary → Correct (Richmond metro, separate from DC)
WV-CHARLESTON,CBSA,16620,,Charleston WV,primary → Correct (WV capital, Appalachian isolation)
```

**Bad primary examples:**
```csv
DC-METRO-CORE,County,24031,,Montgomery County MD,primary → WRONG (if MD-SILVER-SPRING also maps to 24031, zip_list required)
MD-BALTIMORE,CBSA,47900,,Washington-Baltimore-Arlington CSA,primary → WRONG (CSA too large, use CBSA 12580 instead)
MD-SALISBURY,County,24003,,Anne Arundel County MD,primary → WRONG (wrong side of Bay Bridge, should be Eastern Shore counties only)
VA-ARLINGTON,County,11001,,District of Columbia,primary → WRONG (Arlington anchor is in VA, not DC)
WV-MORGANTOWN,County,24043,,Washington County MD,primary → WRONG (crosses state border without justification, wrong anchor)
```

**Mid-Atlantic severity levels:**
- **CRITICAL:** 
  - Primary area crosses Appalachian barrier without justification
  - Primary area crosses Chesapeake Bay without justification  
  - Primary area crosses Potomac without WMATA integration
  - Baltimore integrated with DC (45+ min, no transit)
  - Richmond integrated with DC or Hampton Roads (60+ min)
  - Eastern Shore counties in Baltimore/DC markets
  - Many-to-one mapping without zip_list (especially Montgomery County MD, Arlington County VA)

- **HIGH:** 
  - Primary area likely >45 min for routine care
  - State border crossed without clear integration rationale
  - WMATA integration claimed but Metro doesn't serve anchor hospitals
  - Outer suburbs (Frederick, Loudoun, Prince William) integrated with DC core

- **MEDIUM:** 
  - Primary area marginally plausible but suspicious
  - Rationale doesn't address obvious friction (beltway, bridges)
  - Transit mentioned but details unclear

---

### Dimension 3: Secondary Relationship Discipline

**What to check:**
- Secondary = specialty spillover or tertiary referrals only
- Clear geographic/transit justification
- ≤2 secondary areas per market (exceptions need strong rationale)
- **V2:** Secondary relationships should NOT have zip_list (they're spillover, not primary coverage)

**Good secondary examples:**
```csv
VA-WINCHESTER,CBSA,47900,,Washington-Baltimore-Arlington DC-VA-MD-WV,secondary,Complex tertiary cases referred to Johns Hopkins or MedStar Georgetown in DC for specialized services
MD-EASTON,CBSA,12580,,Baltimore-Columbia-Towson MD,secondary,Some tertiary referrals to Johns Hopkins in Baltimore for complex cases
WV-BECKLEY,CBSA,16620,,Charleston WV,secondary,Complex cases referred to Charleston Area Medical Center for Level 1 trauma
```

**Bad secondary examples:**
```csv
DC-METRO-CORE,County,24031,,Montgomery County MD,secondary → WRONG (DC core should have Montgomery as primary OR not at all, not secondary)
MD-BALTIMORE,CBSA,47900,,Washington-Baltimore-Arlington CSA,secondary → WRONG (this is same CSA containing both markets, not a referral relationship)
VA-ARLINGTON,County,51059,,Fairfax County VA,secondary → WRONG (if Arlington serves Fairfax, it should be primary; if not, shouldn't be listed)
```

**Mid-Atlantic specific checks:**
- [ ] Rural VA/WV markets may have secondary to academic centers (Johns Hopkins, VCU, UVA, CAMC)
- [ ] Suburban markets should NOT have secondary to their own metro anchor
- [ ] Secondary relationships should cross ≥50 miles (otherwise should be primary)
- [ ] Secondary should reference specific tertiary services (Level 1 trauma, pediatric subspecialties, complex surgery)

**Severity:**
- **HIGH:** Secondary looks like it should be primary (same anchor, <45 min)
- **HIGH:** Secondary has zip_list populated (nonsensical)
- **MEDIUM:** >2 secondary relationships without clear rationale
- **LOW:** Secondary rationale vague but directionally plausible

---

### Dimension 4: V2 ZIP List Validation (CRITICAL FOR MID-ATLANTIC)

**What to check:**
- Counties shared by 2+ markets have zip_list for each market
- Counties used by only 1 market have blank zip_list
- ZIP lists are comma-separated with no spaces
- No ZIP overlaps within shared counties
- ZIP coverage appears complete (>95% of county ZIPs assigned)

**Expected counties requiring ZIP lists in Mid-Atlantic:**

**Montgomery County MD (24031) — VERY LIKELY:**
- If DC-METRO-CORE, MD-SILVER-SPRING, and/or MD-FREDERICK all map to 24031
- Inner Montgomery (Bethesda 20814-20817, Silver Spring 20901-20906) vs outer (Gaithersburg 20878-20886, Germantown 20874)
- **Test:** Each market mapping to 24031 must have distinct zip_list
- **Test:** ZIP boundaries should follow WMATA Red Line accessibility + I-270 corridor

**Arlington County VA (51013) — LIKELY:**
- If DC-METRO-CORE and VA-ARLINGTON both map to 51013
- Inner Arlington (22201-22209 near Metro) vs outer Arlington
- **Test:** Each market must have distinct zip_list

**Alexandria City VA (51510) — LIKELY:**
- If DC-METRO-CORE and VA-ARLINGTON both map to 51510
- Old Town Alexandria (22301-22314 near Metro) vs outer Alexandria
- **Test:** Each market must have distinct zip_list

**Fairfax County VA (51059) — POSSIBLE:**
- Very large county that may span multiple markets
- Inner Fairfax (Falls Church, Tysons) vs Outer Fairfax (Reston, Herndon)
- **Test:** If multiple markets map to 51059, each must have zip_list

**Counties that should NOT have ZIP lists (single market only):**
- Baltimore City MD (24510) — Only MD-BALTIMORE
- Baltimore County MD (24005) — Only MD-BALTIMORE
- Richmond City VA (51760) — Only VA-RICHMOND
- Norfolk City VA (51710) — Only VA-HAMPTON-ROADS
- All WV counties (single market per county except maybe Martinsburg sharing with MD)
- Eastern Shore MD counties (single market per county)

**ZIP List Quality Checks:**

For each county with zip_list populated:

1. **Completeness:** Do ZIP lists cover >95% of county ZIPs?
   - Use Census ZCTA to County crosswalk
   - Missing ZIPs should be unpopulated areas (parks, water, military bases)
   - **Severity:** CRITICAL if >5% missing, HIGH if 2-5% missing, MEDIUM if <2% missing

2. **Overlap:** Does any ZIP appear in multiple markets' lists for same county?
   - **Severity:** CRITICAL if overlap exists (creates many-to-one mapping)
   - **Fix:** Assign each ZIP to nearest anchor or document ambiguity

3. **Behavioral accuracy:** Do ZIP assignments match natural boundaries?
   - Montgomery County: WMATA Red Line stations as dividing line
   - Arlington: I-66, Route 50 as potential dividers
   - Lake/river barriers should align with ZIP boundaries
   - **Severity:** MEDIUM if boundaries seem arbitrary, LOW if defensible

4. **Format:** `"98101,98102,98103"` (comma-separated, no spaces, in quotes)
   - **Severity:** HIGH if format broken (breaks programmatic parsing)

---

### Dimension 5: Large CBSA Decomposition

**What to check:**
- CSAs are decomposed into Metropolitan Divisions or counties
- CBSAs >2M population are scrutinized for sub-market splits
- Decomposition respects behavioral boundaries

**Mid-Atlantic large CBSAs requiring scrutiny:**

**Washington-Baltimore-Arlington CSA (CBSA 47900) — 10M people:**
- **MUST be decomposed** into 5-7+ distinct markets
- **Test:** No market should use entire CSA 47900 as primary
- **Test:** Markets should use Metropolitan Divisions or counties instead:
  - Washington-Arlington-Alexandria MD (47894)
  - Baltimore-Columbia-Towson MD (12580)
  - Frederick-Gaithersburg-Rockville MD (20700)
  - Individual counties for suburban splits

**Richmond VA (CBSA 40060) — 1.3M people:**
- May be single market or split into Richmond City vs suburbs
- **Test:** If single market, CBSA 40060 is acceptable
- **Test:** If split, use counties (Richmond City 51760, Henrico 51087, Chesterfield 51041, etc.)

**Virginia Beach-Norfolk-Newport News VA-NC (CBSA 47260) — 1.8M people:**
- May be single market or split into Peninsula vs Southside
- **Test:** If single market, CBSA 47260 is acceptable
- **Test:** If split, use counties to distinguish Peninsula (Newport News 51700, Hampton 51650) vs Southside (Norfolk 51710, Virginia Beach 51810)

**Baltimore-Columbia-Towson MD (CBSA 12580) — 2.8M people:**
- May be single market or split into Baltimore City vs suburbs
- **Test:** If single market, CBSA 12580 is acceptable
- **Test:** If split, use counties (Baltimore City 24510 vs Baltimore County 24005 vs Howard 24027, etc.)

**Severity:**
- **CRITICAL:** Entire CSA 47900 used as primary for any market (too large)
- **HIGH:** CBSA >2M used without justification for potential sub-markets
- **MEDIUM:** CBSA 1-2M used, but rationale doesn't address potential splits

---

### Dimension 6: Cross-Border CBSA Handling

**What to check:**
- CBSAs spanning state lines are appropriately assigned
- Rationale acknowledges cross-border nature
- State Medicaid differences considered

**Mid-Atlantic cross-border CBSAs:**

**Washington-Arlington-Alexandria DC-VA-MD-WV (CBSA 47900 components):**
- Includes DC, NoVA, Montgomery/Prince George's MD, Jefferson WV
- **Test:** Rationale should acknowledge DMV integration via WMATA OR state splits
- **Test:** If DC-METRO-CORE spans DC/MD/VA, WMATA integration must be documented

**Hagerstown-Martinsburg MD-WV (CBSA 25180):**
- Includes Washington County MD and Berkeley/Jefferson Counties WV
- **Test:** MD-HAGERSTOWN and WV-MARTINSBURG may share this CBSA
- **Test:** Rationale should acknowledge I-81 corridor integration

**Wilmington DE-MD-NJ (CBSA 48864):**
- Includes New Castle County DE, Cecil County MD, Salem County NJ
- **Test:** DE-WILMINGTON should reference Philadelphia integration, NOT Baltimore
- **Test:** Cecil County MD may be in this CBSA or in Baltimore market depending on behavior

**Salisbury MD-DE (CBSA 41540):**
- Includes Wicomico/Somerset/Worcester MD and Sussex DE
- **Test:** MD-SALISBURY should include this cross-border CBSA
- **Test:** Rationale should note Eastern Shore isolation from both states' mainland

**Winchester VA-WV (CBSA 49020):**
- Includes Frederick County VA, Winchester City VA, Hampshire County WV
- **Test:** VA-WINCHESTER should reference cross-border WV panhandle integration

**Severity:**
- **MEDIUM:** Cross-border CBSA not acknowledged in rationale
- **LOW:** Cross-border acknowledged but details sparse

---

### Dimension 7: County-Level Mapping Justification

**What to check:**
- County used instead of CBSA has clear rationale
- County represents natural market boundary OR fills CBSA gap
- Multiple counties for same market are geographically contiguous

**Appropriate county usage in Mid-Atlantic:**

**Rural markets without CBSAs:**
- WV counties (many lack CBSAs, county = market)
- Rural VA counties (Appalachian, Shenandoah Valley)
- Eastern Shore MD counties (isolated by Bay Bridge)
- Southern MD counties (Charles, Calvert, St. Mary's)

**Suburban ring markets:**
- Counties surrounding but not in core metro CBSA
- Example: Prince William VA, Loudoun VA if separate from DC core CBSA

**CBSA components when decomposing large metros:**
- Individual counties within Baltimore CBSA if splitting City vs County
- Individual counties within Hampton Roads if splitting Peninsula vs Southside

**Inappropriate county usage:**
- Using counties when CBSA exists and is appropriate
- Using non-contiguous counties without justification
- Using counties that cross behavioral boundaries without ZIP splits

**Severity:**
- **MEDIUM:** County used when CBSA exists, but rationale weak
- **LOW:** County used appropriately but rationale could be clearer

---

### Dimension 8: Geographic Accuracy (Barrier Compliance)

**What to check:**
- No market crosses absolute barriers in primary relationship
- Water barriers (Bay Bridge, Potomac, tunnels) respected
- Mountain barriers (Appalachian, Blue Ridge) respected
- Congestion barriers (I-495, I-95) acknowledged in rationale

**Absolute barrier tests (all CRITICAL severity if violated):**

**Chesapeake Bay Bridge (MD):**
- [ ] No Eastern Shore county (Kent, Queen Anne's, Talbot, Dorchester, Caroline, Wicomico, Somerset, Worcester) in Baltimore or DC markets
- [ ] No Anne Arundel or mainland county in Salisbury or Easton markets
- [ ] Bay Bridge friction documented in Eastern Shore market rationales

**Appalachian Mountains (WV/Western VA/Western MD):**
- [ ] No WV market (except Martinsburg) shares statistical areas with DC, Baltimore, Richmond, or NoVA
- [ ] No Western VA market (Roanoke, Blacksburg) shares statistical areas with Richmond or NoVA
- [ ] No Western MD market (Cumberland, Hagerstown) shares statistical areas with Baltimore or DC
- [ ] Mountain barrier documented in rationales

**Potomac River (DC/MD ↔ VA):**
- [ ] DC/NoVA integration only via WMATA-accessible areas
- [ ] Non-WMATA NoVA markets (Loudoun, Prince William) separate from DC/MD
- [ ] Southern MD (Charles, Calvert, St. Mary's) not integrated with NoVA despite proximity
- [ ] Potomac crossings documented when integration claimed

**I-95/I-495 Congestion (DC/MD/VA):**
- [ ] Baltimore separate from DC (no shared statistical areas)
- [ ] Richmond separate from DC (no shared statistical areas)
- [ ] Outer suburbs (Frederick, Loudoun, Prince William) typically separate from DC core
- [ ] Congestion documented in rationales when relevant

**Hampton Roads Tunnels (VA):**
- [ ] If Peninsula/Southside are separate markets, counties don't overlap
- [ ] If integrated market, tunnel friction acknowledged in rationale

**Severity:**
- **CRITICAL:** Absolute barrier crossed without justification (Bay, Appalachia)
- **HIGH:** Severe barrier crossed with weak justification (Potomac without WMATA, beltway congestion)
- **MEDIUM:** Barrier documented but integration still questionable

---

### Dimension 9: Transit Integration Validation

**What to check:**
- WMATA Metro integration claims are accurate
- Metro directly serves both markets' anchor hospitals
- Trip time <45 min door-to-door including transfers
- Commuter rail (MARC, VRE) NOT used to justify integration

**WMATA Metro validation:**

**Valid WMATA integration (may justify combining markets):**
- DC ↔ Bethesda/Silver Spring via Red Line (Medical Center station)
- DC ↔ Arlington via Orange/Blue/Silver Lines (Virginia Hospital Center accessible)
- DC ↔ Alexandria via Yellow/Blue Lines (Inova Alexandria accessible)

**Invalid WMATA integration (should NOT combine markets):**
- DC ↔ outer Montgomery County (Gaithersburg, Germantown — beyond Red Line)
- DC ↔ Loudoun County (Dulles corridor — Silver Line doesn't reach Leesburg)
- DC ↔ Prince William County (I-95 corridor — no Metro service)
- DC ↔ Frederick (I-270 corridor — no Metro service)
- DC ↔ Annapolis (separate corridor — no Metro service)

**MARC/VRE commuter rail — Should NOT justify integration:**
- Baltimore ↔ DC via MARC (peak direction only, poor reverse service)
- Fredericksburg ↔ DC via VRE (peak direction only, requires Metro transfer)
- Manassas ↔ DC via VRE (peak direction only, limited medical access)

**Test questions:**
1. Does Metro directly connect both anchors? (Red Line connects Bethesda → DC? YES)
2. Is frequency ≥15 min at peak? (Red Line? YES. MARC? NO.)
3. Is trip <45 min door-to-door? (Arlington → DC via Orange Line? YES. Frederick → DC? NO.)
4. Do residents use it for medical appointments? (Bethesda → DC? Plausible. Brunswick → DC via MARC? No.)

**Severity:**
- **HIGH:** WMATA integration claimed but Metro doesn't serve one anchor
- **HIGH:** MARC/VRE used to justify market integration (peak direction only)
- **MEDIUM:** WMATA integration plausible but trip time >45 min
- **LOW:** Transit mentioned but not relied upon for integration

---

### Dimension 10: Redundant Market Detection

**What to check:**
- Markets with identical or near-identical statistical area coverage
- Markets differentiated only by subtle ZIP boundaries
- Markets that should be merged into single market

**Potential redundancy patterns in Mid-Atlantic:**

**DC-METRO-CORE vs MD-SILVER-SPRING vs VA-ARLINGTON:**
- If all three map to identical statistical areas (DC, Montgomery, Arlington, Alexandria)
- If differentiation is only via ZIP lists, scrutinize behavioral justification
- **Test:** Are these truly distinct routine care markets OR should they be merged?
- **Consider:** WMATA may collapse into single market, OR suburban identity may justify splits

**Hampton Roads — Peninsula vs Southside:**
- If both map to same CBSA 47260 without county/ZIP differentiation
- **Test:** Is split necessary OR should Hampton Roads be single market?
- **Consider:** Tunnel friction vs Sentara regional operations

**Outer NoVA markets (Loudoun, Prince William, Fairfax suburbs):**
- If multiple markets map to same counties without ZIP differentiation
- **Test:** Are these distinct routine care markets OR should they be merged?

**Eastern Shore MD markets (Salisbury, Easton):**
- If both map to same counties without ZIP differentiation
- **Test:** Are these distinct markets OR should Eastern Shore be single market?
- **Consider:** Salisbury = lower shore, Easton = upper shore — geography may justify split

**Severity:**
- **HIGH:** Markets have identical coverage with no distinguishing factors
- **MEDIUM:** Markets have near-identical coverage, differentiation weak
- **LOW:** Markets overlap partially but have clear anchors

**Resolution:**
- Document redundancy clearly
- Suggest merging OR provide behavioral evidence for split
- Flag for stakeholder review

---

## Regional Validation Checklist (Mid-Atlantic)

Before finalizing your QA report, verify:

### V2 Schema Compliance

- [ ] zip_list column exists in CSV header
- [ ] Montgomery County MD (24031) — if shared by 2+ markets, each has zip_list populated
- [ ] Arlington County VA (51013) — if shared by 2+ markets, each has zip_list populated
- [ ] Alexandria City VA (51510) — if shared by 2+ markets, each has zip_list populated
- [ ] Fairfax County VA (51059) — if shared by 2+ markets, each has zip_list populated
- [ ] No ZIP overlaps within shared counties
- [ ] ZIP lists provide >95% coverage of shared counties

### DC-Baltimore CSA Split (CRITICAL)

- [ ] DC-METRO-CORE and MD-BALTIMORE are completely separate markets
- [ ] No statistical area shared between DC and Baltimore markets
- [ ] Baltimore has CBSA 12580 as primary, NOT CSA 47900
- [ ] DC markets have Metropolitan Division 47894 or counties, NOT CSA 47900
- [ ] Outer suburbs (Frederick, Loudoun, Prince William) are separate from DC core
- [ ] If Montgomery County MD is shared, ZIP lists distinguish Bethesda from Gaithersburg

### Geographic Barrier Compliance

- [ ] No Eastern Shore MD county in Baltimore or DC markets (Bay Bridge barrier)
- [ ] No WV market (except Martinsburg) shares areas with DC/Baltimore/Richmond/NoVA (Appalachian barrier)
- [ ] No Western VA market shares areas with Richmond/NoVA (Blue Ridge barrier)
- [ ] No Western MD market shares areas with DC/Baltimore (mountain barrier)
- [ ] Baltimore and DC completely separate (I-95 congestion + no transit)
- [ ] Richmond completely separate from DC and Hampton Roads (I-95/I-64 distance)

### WMATA Transit Integration

- [ ] WMATA integration only claimed for Metro-accessible core (DC, Arlington, Alexandria, Bethesda/Silver Spring)
- [ ] MARC commuter rail NOT used to integrate Baltimore with DC
- [ ] VRE commuter rail NOT used to integrate outer VA with DC
- [ ] Transit rationales include specific Metro lines and stations
- [ ] Trip time <45 min door-to-door documented for claimed integration

### State Border Effects

- [ ] Cross-border CBSAs properly acknowledged (Hagerstown-Martinsburg, Salisbury MD-DE, Winchester VA-WV, Wilmington DE-MD-NJ)
- [ ] Delaware markets reference Philadelphia integration (Wilmington) or Eastern Shore isolation (Rehoboth, Dover)
- [ ] Potomac River crossings only integrated via WMATA core
- [ ] WV markets isolated from neighboring states (except Martinsburg border integration)

### Data Completeness

- [ ] All 30 markets from CSV are present in mapping
- [ ] Each market has ≥1 primary statistical area
- [ ] No invalid CBSA codes or county FIPS codes
- [ ] Rationales reference specific Mid-Atlantic geography when relevant
- [ ] Congestion corridors (I-495, I-95, I-64) documented when relevant
- [ ] Water barriers (Potomac, Chesapeake Bay, Hampton Roads tunnels) documented when relevant

---

## Decision Frameworks for Edge Cases

### Framework 1: When ZIP List Is Needed (Mid-Atlantic Specific)

**High-probability counties requiring ZIP lists:**

**Montgomery County MD (24031):**
- Inner Montgomery (Bethesda, Chevy Chase, Silver Spring) → DC-METRO-CORE or MD-SILVER-SPRING
- Outer Montgomery (Gaithersburg, Germantown, Rockville) → MD-FREDERICK or MD-SILVER-SPRING
- **Boundary:** WMATA Red Line extent + I-270 corridor
- **Test:** If DC-METRO-CORE, MD-SILVER-SPRING, OR MD-FREDERICK map to 24031, each MUST have zip_list

**Arlington County VA (51013):**
- Inner Arlington (Rosslyn, Courthouse, Ballston — Metro-accessible) → DC-METRO-CORE or VA-ARLINGTON
- Outer Arlington (beyond Metro corridor) → VA-ARLINGTON only
- **Boundary:** WMATA Orange/Blue/Silver line stations
- **Test:** If both DC-METRO-CORE and VA-ARLINGTON map to 51013, each MUST have zip_list

**Fairfax County VA (51059):**
- Inner Fairfax (Falls Church, Tysons, McLean) → VA-ARLINGTON
- Outer Fairfax (Reston, Herndon, Centreville) → VA-LOUDOUN or VA-ARLINGTON or VA-PRINCE-WILLIAM
- Very large county likely spanning multiple behavioral markets
- **Test:** If 2+ markets map to 51059, each MUST have zip_list

**If missing zip_list when needed:**
- **Severity:** CRITICAL
- **Description:** Many-to-one mapping without disambiguation
- **Impact:** Blocks ZIP expansion for major population centers (Montgomery County = 1M+ people, Arlington = 250K+, Fairfax = 1.1M+)
- **Fix:** Build ZIP lists using V2 prompt guide and Census ZCTA crosswalks

### Framework 2: When ZIP Overlap Is Detected

**Ask:**
1. Are overlapping ZIPs on a natural boundary (river, highway)?
2. Is overlap <5 ZIPs? → Flag as HIGH
3. Is overlap >5 ZIPs? → Flag as CRITICAL

**Common Mid-Atlantic boundary ambiguities:**
- ZIPs spanning I-495 beltway (which side is "inner" vs "outer"?)
- ZIPs spanning Potomac River (DC/MD vs VA split?)
- ZIPs spanning Lake Washington equivalent (none in Mid-Atlantic, but similar patterns)

**Action:**
- Document specific ZIPs that overlap
- Suggest moving ZIPs to market nearest their population centroid
- Check if ZIP actually spans behavioral boundary (some ZIPs are very large in rural areas)
- Flag for stakeholder review if legitimately ambiguous

### Framework 3: When Coverage Gap Is Detected

**Ask:**
1. Are missing ZIPs populated areas? → If YES, CRITICAL gap
2. Are missing ZIPs unpopulated (parks, military, water)? → If YES, MEDIUM issue
3. Is gap >10% of county ZIPs? → If YES, CRITICAL
4. Is gap 5-10%? → HIGH
5. Is gap <5%? → MEDIUM

**Mid-Atlantic common gap scenarios:**
- **Military bases:** Fort Belvoir VA, Aberdeen Proving Ground MD, Quantico VA, Patuxent Naval Air Station MD
- **National parks:** Shenandoah National Park VA, Appalachian Trail areas
- **Water:** Chesapeake Bay ZIPs, Potomac River ZIPs
- **Government:** DC federal enclaves, NSA Fort Meade MD

**Action:**
- List specific missing ZIPs
- Determine if populated (critical) or unpopulated (lower severity)
- If populated, assign to nearest market anchor
- If unpopulated but >10% of county, still flag as data quality issue

### Framework 4: WMATA Integration Test (Mid-Atlantic Specific)

**For any claimed DC-area market integration, apply this test:**

**Step 1: Metro Line Check**
- Does Metro directly connect both market anchors?
- Which specific Metro line(s)?
- Are there major stations near hospitals in both markets?

**Step 2: Frequency Check**
- Is frequency ≥15 min during midday (10am-3pm)?
- Red Line: YES (6-8 min peak, 12 min midday)
- Orange/Blue/Silver Lines: YES (6-10 min peak, 12-15 min midday)
- Green/Yellow Lines: YES but limited hospital access

**Step 3: Trip Time Check**
- Door-to-door time including:
  - Drive/walk to Metro station (5-10 min)
  - Wait for train (avg 6 min at 12 min frequency)
  - Train travel time (lookup specific route)
  - Walk from Metro to hospital (5-10 min)
- **Threshold:** <45 min total

**Step 4: Behavioral Plausibility**
- Do residents actually use Metro for medical appointments?
- Is reverse-direction service adequate (not just peak commuter flow)?
- Are there parking/access barriers at origin station?

**If ALL PASS:** WMATA integration may justify combining markets
**If ANY FAIL:** Markets should be separate despite Metro presence

**Example applications:**
- ✅ Bethesda → DC: Red Line direct, 20 min train, Medical Center station, plausible
- ✅ Arlington → DC: Orange Line direct, 15 min train, frequent service, plausible
- ❌ Gaithersburg → DC: Red Line exists but 40+ min train + 15 min station access = 55+ min total
- ❌ Frederick → DC: No Metro service at all
- ❌ Baltimore → DC: No Metro connection (MARC is peak direction only)

---

## Example QA Finding (Mid-Atlantic V2 Format)

### Issue ID: 1

**Market(s):** DC-METRO-CORE, MD-SILVER-SPRING

**Statistical Area:** County 24031 (Montgomery County MD)

**Issue Type:** missing_zip_list

**Severity:** CRITICAL

**Description:**
Two distinct markets (DC-METRO-CORE and MD-SILVER-SPRING) both map to identical County 24031 Montgomery County MD as primary, but both have blank zip_list field. This creates a many-to-one mapping where programmatic ZIP expansion cannot distinguish which market a Montgomery County ZIP belongs to.

Montgomery County contains ~1.05M people and includes diverse areas:
- Inner Montgomery (Bethesda 20814-20817, Chevy Chase 20815, Silver Spring 20901-20910) — WMATA Red Line accessible, <30 min to DC medical district
- Mid Montgomery (Rockville 20850-20855, Gaithersburg 20877-20886) — I-270 corridor, 45-60 min to DC
- Outer Montgomery (Germantown 20874-20876, Damascus 20872) — I-270 corridor, 60+ min to DC

The rationale fields contain human-readable text like "WMATA-accessible inner suburbs" vs "outer I-270 corridor" but these cannot be parsed programmatically.

This blocks downstream processing for Montgomery County, which is the most populous county in Maryland and contains major health systems (Adventist HealthCare, Holy Cross Health, Suburban Hospital).

**Impact:**
- ZIP code expansion fails for all Montgomery County ZIPs
- Network adequacy calculations incomplete for Montgomery County (1M+ people)
- Price benchmarking cannot distinguish DC-integrated vs suburban MD markets
- Cannot determine which Adventist/Holy Cross facilities are in which market
- Critical DMV (DC-MD-VA) integrated market boundaries undefined

**Suggested Fix:**
Populate zip_list for each market using WMATA Red Line access + I-270 corridor as behavioral boundaries:

**DC-METRO-CORE (if Bethesda integrated with DC):**
```
"20814,20815,20816,20817,20852,20853,20854"
```
Rationale: Inner Montgomery County including Bethesda accessible via WMATA Red Line Medical Center station serving Suburban Hospital and National Institutes of Health with <30 min trip time to DC medical district

**MD-SILVER-SPRING (suburban Montgomery identity):**
```
"20901,20902,20903,20904,20905,20906,20910,20912,20850,20851,20852,20853,20854,20855,20866,20868,20874,20876,20877,20878,20879,20882,20886"
```
Rationale: Montgomery County suburbs served by Adventist HealthCare and Holy Cross Health with distinct suburban identity separate from DC core and including I-270 corridor areas beyond WMATA Red Line extent

**Alternative approach:** If MD-SILVER-SPRING is intended to include Bethesda, then DC-METRO-CORE should NOT map to Montgomery County MD at all (use DC proper + Arlington/Alexandria only).

**Validation Required:**
- Verify ZIP lists provide complete coverage (all Montgomery County ZIPs assigned)
- Verify no overlaps (each ZIP in exactly one list)
- Ground-truth with Montgomery County ZIP map
- Validate behavioral accuracy: Do Bethesda residents use DC hospitals via Metro? Do Gaithersburg residents use suburban MD hospitals instead?
- Consult local health plans on network design patterns

**Recommended Resolution Timeline:**
1. Obtain Montgomery County ZIP code map from Census Bureau
2. Map WMATA Red Line station catchment areas (0.5 mile radius)
3. Assign ZIPs based on Red Line accessibility + drive time to DC vs suburban anchors
4. Validate with 2-3 local health plan actuaries or hospital CFOs
5. Update mapping CSV with zip_list populated

---

### Issue ID: 2

**Market(s):** MD-BALTIMORE, DC-METRO-CORE

**Statistical Area:** CBSA 47900 (Washington-Baltimore-Arlington CSA)

**Issue Type:** inappropriate_csa_usage

**Severity:** CRITICAL

**Description:**
Both MD-BALTIMORE and DC-METRO-CORE map to CBSA 47900 (Washington-Baltimore-Arlington CSA) as primary statistical area. This CSA contains ~10M people and spans 280+ miles, violating the 45-minute routine care rule.

The CSA combines:
- Baltimore metro (2.8M people, CBSA 12580)
- Washington metro (6.3M people, CBSA 47894)
- Frederick MD metro
- Hagerstown-Martinsburg metro
- Multiple other components

Baltimore and DC are 45+ minutes apart via I-95 with chronic congestion through both beltways (I-695 Baltimore, I-495 DC). There is no transit connection (MARC is peak-direction commuter rail only, not bidirectional medical access).

Johns Hopkins Medicine and University of Maryland Medical Center (Baltimore) operate as independent anchors, NOT as satellites of DC health systems. Residents of Baltimore do not routinely travel to DC for primary care, imaging, or routine procedures.

**Impact:**
- Violates fundamental 45-minute routine care threshold
- Incorrectly suggests Baltimore and DC are integrated healthcare markets
- Would combine distinct provider networks (Johns Hopkins vs MedStar/GWU/Inova)
- Incorrect for rate setting, network adequacy, and market concentration analysis
- Violates behavioral realism (no one drives Baltimore → DC for routine checkup)

**Suggested Fix:**

**MD-BALTIMORE should map to:**
```csv
MD-BALTIMORE,CBSA,12580,,Baltimore-Columbia-Towson MD,primary,Metropolitan area represents independent anchor 45+ min from DC with Johns Hopkins and University of Maryland Medical Center dominance separate healthcare market
```

**DC-METRO-CORE should map to:**
```csv
DC-METRO-CORE,CBSA,47894,,Washington-Arlington-Alexandria DC-VA-MD-WV,primary,Metropolitan division represents DC-area core integrated by WMATA Metro serving DC proper Arlington Alexandria and inner Montgomery County MD
```

**REMOVE all references to CSA 47900** from primary relationships. CSA 47900 may appear only in secondary relationships if Baltimore patients travel to DC for complex tertiary care (which would be documented as secondary referral pattern, not routine care).

**Validation:**
- Confirm CBSA 12580 contains Baltimore City + Baltimore County + surrounding counties
- Confirm CBSA 47894 contains DC + Arlington + Alexandria + Montgomery/Prince George's MD
- Verify these are distinct routine care markets with separate provider networks
- Document that I-95 congestion + lack of transit prevents integration

---

### Issue ID: 3

**Market(s):** MD-SALISBURY, MD-EASTON

**Statistical Area:** County 24045 (Wicomico County MD)

**Issue Type:** potential_redundancy

**Severity:** MEDIUM

**Description:**
Both MD-SALISBURY (anchor: Salisbury) and MD-EASTON (anchor: Easton) map to overlapping Eastern Shore Maryland counties, suggesting potential redundancy. Specifically, if both markets claim the same counties without ZIP-level differentiation, they may represent a single behavioral market that has been artificially split.

The regional prompt documents:
- MD-SALISBURY: "Lower Eastern Shore" with TidalHealth Peninsula Regional anchor
- MD-EASTON: "Upper Eastern Shore" with University of Maryland Shore Medical Center anchor

Geographic review:
- Salisbury is in Wicomico County (southern Eastern Shore)
- Easton is in Talbot County (northern Eastern Shore)
- Distance: ~50 miles via US-50
- Both isolated from mainland MD by Bay Bridge bottleneck

**Potential scenarios:**

**Scenario A — Split is justified (ACCEPTABLE):**
- MD-SALISBURY serves southern Eastern Shore (Wicomico, Somerset, Worcester counties)
- MD-EASTON serves northern/central Eastern Shore (Talbot, Kent, Queen Anne's, Caroline, Dorchester counties)
- Geographic distance + two distinct anchor systems justify separate markets
- Each market maps to distinct, non-overlapping counties

**Scenario B — Markets are redundant (FLAG FOR REVIEW):**
- Both map to same counties (e.g., both claim Dorchester County)
- Distance between anchors <45 min for routine care
- Single health system (University of Maryland Shore) operates regionally across both
- Split creates artificial distinction without behavioral justification

**Action Required:**
1. Review county assignments for both markets
2. Verify no county overlap (each Eastern Shore county should be in EITHER Salisbury OR Easton, not both)
3. Confirm distinct anchor systems (TidalHealth vs UM Shore Medical)
4. Validate 50-mile distance justifies separate routine care markets
5. If overlap exists OR behavioral distinction unclear, recommend merging into single "MD-EASTERN-SHORE" market

**Suggested Resolution:**
- If counties are distinct and distance justifies split: ACCEPTABLE, no changes needed
- If counties overlap: CRITICAL severity, require ZIP lists OR merge markets
- If counties distinct but behavioral justification weak: Recommend stakeholder review

---

## Self-Validation Checklist (V2 Mid-Atlantic Updates)

### V2 Schema Validation

- [ ] Verified zip_list column exists in CSV header
- [ ] Identified all statistical areas used by 2+ markets in Mid-Atlantic
- [ ] Verified each market sharing Montgomery County MD (24031) has zip_list populated
- [ ] Verified each market sharing Arlington County VA (51013) has zip_list populated
- [ ] Verified each market sharing Alexandria City VA (51510) has zip_list populated
- [ ] Verified each market sharing Fairfax County VA (51059) has zip_list populated
- [ ] Verified markets with unique statistical areas have blank zip_list
- [ ] Checked ZIP list format (comma-separated, no spaces, numeric only)
- [ ] Checked for ZIP overlaps within shared counties
- [ ] Checked for coverage gaps within shared counties (>5% = CRITICAL)
- [ ] Assessed behavioral accuracy of ZIP assignments (Metro access, I-270 corridor, etc.)

### Traditional Validation (Unchanged)

- [ ] Every market from CSV has at least one primary statistical area
- [ ] Primary areas plausibly represent routine-care behavior (<45 min)
- [ ] Secondary relationships clearly specialty-only (>50 miles typically)
- [ ] Large CBSAs appropriately decomposed (CSA 47900 NOT used as primary)
- [ ] Cross-border CBSAs properly assigned and acknowledged
- [ ] County usage justified in rationales
- [ ] All CBSA codes and county FIPS codes verified correct
- [ ] Redundant markets flagged (Hampton Roads split?, Eastern Shore split?, DC-area suburban markets?)

### Mid-Atlantic Regional Specifics (CRITICAL)

**DC-Baltimore CSA Split:**
- [ ] DC and Baltimore are completely separate markets (no shared statistical areas)
- [ ] Baltimore maps to CBSA 12580, NOT CSA 47900
- [ ] DC maps to Metropolitan Division 47894 or counties, NOT CSA 47900
- [ ] CSA 47900 appears ONLY in secondary relationships (if at all)
- [ ] Outer suburbs (Frederick, Loudoun, Prince William) separate from DC core
- [ ] Baltimore is 45+ min and no transit documented in rationales

**Chesapeake Bay Barrier:**
- [ ] No Eastern Shore county (Kent, Queen Anne's, Talbot, Dorchester, Caroline, Wicomico, Somerset, Worcester) in Baltimore or DC markets
- [ ] No Anne Arundel or other mainland county in Salisbury or Easton markets
- [ ] Bay Bridge friction explicitly documented in Eastern Shore rationales
- [ ] Delaware Eastern Shore (Sussex County) may integrate with Salisbury MD

**Potomac River Barrier:**
- [ ] DC/NoVA integration only via WMATA-accessible core
- [ ] Non-WMATA NoVA (Loudoun, Prince William) separate from DC/MD
- [ ] Southern MD (Charles, Calvert, St. Mary's) separate from NoVA
- [ ] Potomac crossings documented when integration claimed
- [ ] Woodrow Wilson Bridge, American Legion Bridge congestion noted if relevant

**Appalachian Mountain Barrier:**
- [ ] No WV market (except Martinsburg) shares statistical areas with DC/Baltimore/Richmond/NoVA
- [ ] No Western VA market shares areas with Richmond/NoVA
- [ ] No Western MD market shares areas with DC/Baltimore
- [ ] Morgantown WV isolated from Charleston WV (closer to Pittsburgh)
- [ ] Mountain isolation explicitly documented in rationales

**WMATA Metro Integration:**
- [ ] WMATA integration only for Metro-accessible core (DC, Arlington, Alexandria, Bethesda/Silver Spring)
- [ ] Specific Metro lines documented (Red, Orange, Blue, Silver, Yellow)
- [ ] Specific stations near hospitals documented (Medical Center, Pentagon City, etc.)
- [ ] Trip time <45 min door-to-door verified
- [ ] MARC NOT used to integrate Baltimore with DC
- [ ] VRE NOT used to integrate outer VA with DC

**State Border Effects:**
- [ ] Hagerstown-Martinsburg MD-WV integration documented (CBSA 25180)
- [ ] Salisbury MD-DE integration documented (CBSA 41540)
- [ ] Winchester VA-WV integration documented (CBSA 49020)
- [ ] Wilmington DE references Philadelphia, NOT Baltimore
- [ ] All other state borders are hard splits

---

## Final Instruction

Evaluate this V2 mapping as if it will be used to:
- Justify healthcare price comparisons to employers across 5 states + DC
- Demonstrate network adequacy to regulators in MD, DC, DE, VA, WV
- Define market concentration for antitrust analysis in major metros (DC, Baltimore, Richmond, Hampton Roads)
- Support provider rate negotiations with multi-state health systems (Inova, MedStar, Johns Hopkins, Sentara)
- **Enable programmatic ZIP expansion across 5 different state Medicaid programs without manual intervention**

**Standard:** If a knowledgeable local stakeholder (hospital CFO at Johns Hopkins, health plan actuary at CareFirst, regional health economist at Georgetown, transportation planner at WMATA, data engineer building ZIP expansion) would reasonably dispute a mapping, it must be flagged.

**V2 Standard:** If programmatic ZIP expansion would fail or produce ambiguous results, it's CRITICAL severity.

**Mid-Atlantic Standard:** If mapping violates clear geographic barriers (Bay Bridge, Appalachian Mountains, Potomac River without WMATA), it's CRITICAL severity.

**Confidence test:** 
- Would you stake your professional reputation on this mapping being correct AND programmatically unambiguous?
- Would a DC-area hospital CFO agree Baltimore is a separate market?
- Would a Maryland regulator agree Eastern Shore is isolated by Bay Bridge?
- Would a Virginia health plan agree Hampton Roads tunnels create market friction?
- Would a data engineer be able to unambiguously assign every Mid-Atlantic ZIP to exactly one market?

---

**End of Mid-Atlantic V2 QA Prompt**
