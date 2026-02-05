# Execution Prompt: Stage-1 Mapping — Proprietary Markets → Statistical Areas (with Sub-County Granularity)

## Purpose

This prompt executes **Stage-1 of the healthcare market mapping workflow**.

Your task is to map **proprietary Healthcare Shopping Zones (markets)** to **named statistical areas** in a way that is behaviorally realistic, programmatically unambiguous, and suitable for deterministic expansion to ZIP codes.

**CRITICAL CHANGE FROM V1:** This version adds **sub-county ZIP-level granularity** when multiple markets share the same county. The many-to-one county mapping problem is solved by explicitly listing ZIP codes when statistical areas alone cannot distinguish markets.

---

## THE MANY-TO-ONE MAPPING PROBLEM (Critical Understanding)

### The Problem V1 Created

**V1 Approach (BROKEN):**
```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core
WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,Eastside portion across Lake Washington
WA-SEATTLE-SOUTHKING,County,53033,King County WA,primary,South King County portion
```

**Why this breaks programmatic consumption:**
```python
zip_code = "98101"  # Downtown Seattle
county = get_county(zip_code)  # Returns: 53033
markets = get_markets_for_county(county)  # Returns: ["WA-SEATTLE-MAIN", "WA-SEATTLE-EASTSIDE", "WA-SEATTLE-SOUTHKING"]
# ERROR: Cannot determine which market. Rationale field is human text, not structured data.
```

**The rationale field says "central urban core" vs "Eastside portion" but computers cannot parse prose to determine boundaries.**

### The V2 Solution

**When multiple markets share a county, explicitly list ZIP codes for each market:**

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103,98104,98105,98107,98109,98112,98115,98116,98117,98118,98119,98121,98122,98125,98126,98133,98134,98136,98144,98146,98154,98164,98174,98177,98178,98195,98199",King County WA,primary,Central Seattle urban core west of Lake Washington including downtown Capitol Hill Ballard University District Fremont Wallingford served by UW Medicine Swedish Virginia Mason Harborview
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006,98007,98008,98011,98027,98029,98033,98034,98039,98040,98052,98053,98056,98059,98072,98074,98075,98077",King County WA,primary,Eastside across Lake Washington including Bellevue Redmond Kirkland Sammamish Issaquah Mercer Island connected via I-90 SR-520 bridges served by Overlake Evergreen Health
WA-SEATTLE-SOUTHKING,County,53033,"98001,98002,98003,98023,98030,98031,98032,98042,98055,98057,98058,98063,98064,98065,98092,98188,98198",King County WA,primary,South King County including Renton Kent Auburn Federal Way SeaTac Tukwila Burien Des Moines served by Valley Medical Center
```

**Programmatic consumption now works:**
```python
zip_code = "98101"
county = get_county(zip_code)  # Returns: 53033

# Check if county has sub-county splits
if has_zip_level_splits(county):
    market = get_market_for_zip(zip_code)  # Returns: WA-SEATTLE-MAIN (98101 in that zip_list)
else:
    # Simple county lookup for markets without splits
    market = get_market_for_county(county)
```

---

## WHEN TO USE ZIP-LEVEL GRANULARITY

### Rule: Use ZIP lists ONLY when multiple markets share the same statistical area

**Decision tree:**

```
Does more than 1 market map to the same County/CBSA?
│
├─ NO → Use statistical area alone (County or CBSA), no zip_list needed
│
└─ YES → Must add zip_list for each market to distinguish them
```

**Examples of when ZIP lists are REQUIRED:**

1. **King County WA (53033)** — 3 markets share it:
   - WA-SEATTLE-MAIN → needs zip_list
   - WA-SEATTLE-EASTSIDE → needs zip_list
   - WA-SEATTLE-SOUTHKING → needs zip_list

2. **Los Angeles County CA** — likely 5-8 markets share it:
   - Each market needs explicit zip_list

3. **Cook County IL (Chicago)** — likely 3-4 markets share it:
   - Each market needs explicit zip_list

**Examples of when ZIP lists are NOT needed:**

1. **Pierce County WA (53053)** — Only 1 market (WA-SEATTLE-TACOMA):
   - No zip_list needed, county alone is sufficient

2. **Spokane County WA (53063)** — Only 1 market (WA-SPOKANE):
   - No zip_list needed

3. **Marion County OR (41047)** — Only 1 market (OR-SALEM):
   - No zip_list needed

**Summary: ~80% of markets will NOT need ZIP lists. Only polycentric metros with intra-county splits need them.**

---

## SCHEMA CHANGES FROM V1

### New Required Column: `zip_list`

**Column specifications:**

| Column | Required? | Format | Purpose |
|--------|-----------|--------|---------|
| market_id | Always | String | Market identifier |
| statistical_area_type | Always | CBSA/County | Type of statistical area |
| statistical_area_id | Always | String | CBSA code or County FIPS |
| **zip_list** | **Conditional** | **Comma-separated** | **ZIP codes when multiple markets share statistical area** |
| statistical_area_name | Always | String | Human-readable name |
| relationship_type | Always | primary/secondary | Routine vs specialty care |
| mapping_rationale | Always | String | Behavioral justification |

**zip_list rules:**

1. **Leave EMPTY (blank cell)** when only 1 market uses this statistical area
2. **Must POPULATE** when 2+ markets share the same statistical area
3. **Format:** Comma-separated, no spaces: `98101,98102,98103`
4. **Coverage:** List ALL ZIPs that belong to this market within this county
5. **Completeness:** ZIPs in zip_list must cover the entire market's portion of the shared county
6. **No overlap:** A ZIP should appear in only one market's zip_list for a given county

### CSV Format Examples

**Simple market (no zip_list needed):**
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
OR-SALEM,CBSA,41420,,Salem OR,primary,Metropolitan area represents state capital market
```

**Complex county split (zip_list required):**
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103",King County WA,primary,Central Seattle urban core
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006",King County WA,primary,Eastside across Lake Washington
```

---

## HOW TO BUILD ZIP LISTS (Step-by-Step)

### Step 1: Identify Counties That Need Splits (5 minutes)

Review your market definitions and identify any counties where multiple markets exist:

**Example questions:**
- Do WA-SEATTLE-MAIN, WA-SEATTLE-EASTSIDE, WA-SEATTLE-SOUTHKING all map to King County? → YES → Needs splits
- Does Pierce County only have WA-SEATTLE-TACOMA? → YES → No splits needed
- Do multiple SF Bay Area markets share Alameda County? → YES → Needs splits

### Step 2: Obtain ZIP Code Map for Each County Needing Splits (10 minutes per county)

**Recommended tools:**
- ZCTA Viewer: https://www.census.gov/geo/maps-data/data/zcta_rel_overview.html
- ZIP Code Maps: https://www.unitedstateszipcodes.org/[state]/
- Google: "[County Name] ZIP code map"

**Look for:**
- Natural boundaries (water, highways, mountains)
- City names within ZIPs
- Anchor hospital locations

### Step 3: Draft ZIP Assignments Based on Behavioral Boundaries (30-60 minutes per county)

**Use these behavioral rules:**

1. **Anchor proximity:** ZIPs near the market's anchor hospital(s) belong to that market
2. **Natural barriers:** 
   - Lake Washington → separates Seattle-Main from Eastside
   - Major highways → can separate neighborhoods
   - Rivers, mountains → clear dividing lines
3. **City boundaries:** ZIPs in Bellevue → Eastside market, ZIPs in Renton → SouthKing market
4. **Commute patterns:** Where do residents typically go for routine care?

**Example for King County:**

**WA-SEATTLE-MAIN ZIPs:**
- Downtown Seattle: 98101, 98104, 98121, 98154, 98164, 98174
- Capitol Hill: 98102, 98112, 98122
- University District: 98105, 98195
- Ballard: 98107, 98117
- Fremont/Wallingford: 98103, 98115
- Queen Anne: 98109, 98119
- West Seattle: 98116, 98126, 98136

**WA-SEATTLE-EASTSIDE ZIPs:**
- Bellevue: 98004, 98005, 98006, 98007, 98008
- Redmond: 98052, 98053
- Kirkland: 98033, 98034
- Sammamish: 98074, 98075
- Issaquah: 98027, 98029
- Mercer Island: 98040

**WA-SEATTLE-SOUTHKING ZIPs:**
- Renton: 98055, 98057, 98058, 98059
- Kent: 98030, 98031, 98032, 98042
- Auburn: 98001, 98002, 98092
- Federal Way: 98003, 98023, 98063
- SeaTac: 98188, 98198
- Tukwila: 98168

### Step 4: Validate ZIP Assignments (15 minutes per county)

**Check:**
1. **Coverage:** Do all county ZIPs appear in exactly one market's list?
2. **No gaps:** Are there ZIPs you missed?
3. **No overlaps:** Does any ZIP appear in multiple markets' lists?
4. **Behavioral sense:** Would a resident of each ZIP realistically use that market's anchor?

**Validation questions:**
- "Would a Bellevue resident (98004) drive to UW Medical Center in Seattle?" 
  - If sometimes → Consider which market captures majority
  - If rarely → Keep in Eastside market
- "Would a Renton resident (98055) use Valley Medical or Swedish?" 
  - If Valley Medical → SouthKing market
  - If Swedish → Consider moving to Seattle-Main

### Step 5: Document in CSV (10 minutes per county)

Format as comma-separated list (no spaces):
```csv
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103,98104,98105,98107,98109,98112,98115,98116,98117,98118,98119,98121,98122,98125,98126,98133,98134,98136,98144,98146,98154,98164,98174,98177,98178,98195,98199",King County WA,primary,Central Seattle urban core
```

**Total time per county split:** 1.5 - 2.5 hours

**Metros needing this (estimated nationwide):**
- ~15-25 large polycentric metros
- ~3-5 hours per metro (1-3 counties needing splits)
- **Total effort nationwide: 50-125 hours**

---

## CONCEPTUAL CLARIFICATION (Unchanged from V1)

### The Fundamental Mapping Direction

**EACH MARKET CONSUMES ONE OR MORE STATISTICAL AREAS.**

The mapping is:
```
One Market → Multiple Statistical Areas (CBSAs, Counties, or County+ZIPs)
```

**NOT:**
```
Multiple Markets → One Statistical Area with vague rationale text (WRONG — now FIXED with zip_list)
```

### Example: Seattle Metro (V2 Fixed Approach)

**5 granular markets within King/Pierce/Snohomish counties:**

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103,98104,98105,98107,98109,98112,98115,98116,98117,98118,98119,98121,98122,98125,98126,98133,98134,98136,98144,98146,98154,98164,98174,98177,98178,98195,98199",King County WA,primary,Central Seattle urban core west of Lake Washington
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006,98007,98008,98011,98027,98029,98033,98034,98039,98040,98052,98053,98056,98059,98072,98074,98075,98077",King County WA,primary,Eastside across Lake Washington via I-90 SR-520 bridges
WA-SEATTLE-SOUTHKING,County,53033,"98001,98002,98003,98023,98030,98031,98032,98042,98055,98057,98058,98063,98064,98065,98092,98188,98198",King County WA,primary,South King County with Valley Medical Center anchor
WA-SEATTLE-TACOMA,County,53053,,Pierce County WA,primary,Tacoma with distinct MultiCare system (entire Pierce County)
WA-SEATTLE-TACOMA,CBSA,45104,,Tacoma-Lakewood WA,primary,Tacoma metro division
WA-SEATTLE-EVERETT,County,53061,,Snohomish County WA,primary,Everett with Providence Regional anchor (entire Snohomish County)
WA-SEATTLE-EVERETT,CBSA,31020,,Everett WA,primary,Everett metro division
```

**Key observations:**
- King County (53033) has 3 markets → each has explicit zip_list
- Pierce County (53053) has 1 market → no zip_list needed (blank)
- Snohomish County (53061) has 1 market → no zip_list needed (blank)
- Tacoma and Everett also map to their CBSA divisions (additional coverage)

**This is now programmatically unambiguous.**

---

## Required References (Unchanged from V1)

You must conceptually reference:

1. **National Base Prompt – Healthcare Market Master (`master_market.md`)**
   - Defines universal principles (45-minute rule, travel friction, patient behavior)
   - Governs what makes a healthcare market behaviorally realistic

2. **Regional Market Prompt (`markets_<region>.md`)**
   - Defines region-specific geography, transit, and known market splits
   - Documents congestion corridors, water barriers, mountain passes
   - Explains regional mobility factors

3. **Regional Market File (`markets_<region>.csv`)**
   - Authoritative list of valid `market_id` values for this region
   - Market notes contain catchment area guidance
   - **Total: 435 markets across 8 regions covering 49 states + DC**
   - **If a market appears in this CSV, it MUST receive distinct statistical area mappings**

**You may not create, rename, merge, or split markets during this mapping process.**

---

## Regional Context (Know Your Region)

### Available Regions

| Region | States | Markets | Key Mapping Considerations |
|--------|--------|---------|---------------------------|
| Mountain West | CO, UT, ID, MT, WY, NV, NM, AZ (8) | 62 | Phoenix CBSA likely needs Maricopa County ZIP splits (4 markets) |
| Southeast | NC, SC, GA, FL, AL, MS, TN, KY (8) | 71 | Atlanta metro may need Fulton/Dekalb County ZIP splits, Miami-Dade splits |
| Northeast | PA, NJ, NY, CT, MA, RI, VT, NH, ME (9) | 62 | NYC boroughs need ZIP splits, Philadelphia may need splits |
| Mid-Atlantic | MD, DC, DE, VA, WV (5) | 30 | DC-Arlington may need ZIP splits if multiple markets in same county |
| Texas & Plains | TX, OK, KS, MO, IA, NE, SD, ND, AR, LA (10) | 92 | Dallas County likely needs ZIP splits, Harris County (Houston) splits |
| California | CA (1) | 42 | LA County needs ZIP splits (5-8 markets), Alameda/Santa Clara (SF Bay) splits |
| Pacific Northwest | WA, OR (2) | 21 | King County needs ZIP splits (3 markets confirmed) |
| Midwest | IL, IN, OH, MI, WI, MN (6) | 55 | Cook County (Chicago) likely needs ZIP splits |

**Planning estimate:** ~15-20 counties nationwide will need ZIP-level splits across ~50-80 markets.

---

## Role Definition

You are a **Healthcare Market Geography Specialist** with expertise in:
- US Census statistical areas (CBSAs, micropolitans, counties)
- ZIP code geography and county-to-ZIP crosswalks
- Healthcare utilization patterns and behavioral boundaries
- Natural and infrastructure-based geographic barriers
- Regional health system footprints

**Your objective:** Map each market to statistical areas (with ZIP-level granularity when needed for sub-county splits) that accurately represent where residents seek routine and specialty care.

---

## Mapping Rules (Updated for V2)

### Rule 1: Preserve Market Granularity Through Distinct Assignments

**Each market MUST have distinct coverage.** Options for achieving this:

**A) Different statistical areas (preferred when possible):**
```csv
WA-SEATTLE-TACOMA,County,53053,,Pierce County WA,primary,Entire Pierce County
WA-SEATTLE-EVERETT,County,53061,,Snohomish County WA,primary,Entire Snohomish County
```
✅ Different counties → programmatically distinct

**B) Same statistical area + different ZIP lists (required when A not possible):**
```csv
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103",King County WA,primary,Central Seattle
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006",King County WA,primary,Eastside
```
✅ Same county BUT different ZIPs → programmatically distinct

**C) WRONG APPROACH (no longer acceptable):**
```csv
WA-SEATTLE-MAIN,County,53033,,King County WA,primary,Central Seattle portion
WA-SEATTLE-EASTSIDE,County,53033,,King County WA,primary,Eastside portion
```
❌ Same county, no ZIP lists → programmatically ambiguous

### Rule 2: Use ZIP Lists Only When Necessary

**Do NOT use ZIP lists if only one market uses a statistical area.**

**Example - Pierce County has only WA-SEATTLE-TACOMA:**
```csv
WA-SEATTLE-TACOMA,County,53053,,Pierce County WA,primary,Entire Pierce County served by MultiCare
```
✅ Correct - zip_list is blank because only 1 market uses this county

**WRONG:**
```csv
WA-SEATTLE-TACOMA,County,53053,"98001,98002,98003,98004,98005...[all Pierce County ZIPs]",Pierce County WA,primary,Entire Pierce County
```
❌ Unnecessary - zip_list not needed when no ambiguity exists

### Rule 3: Prefer CBSAs Over Counties When Possible

**If a CBSA/micropolitan area exists and fully represents the market, use it:**

```csv
OR-SALEM,CBSA,41420,,Salem OR,primary,Metropolitan area represents state capital market
```

**Use counties as secondary coverage or when CBSA is too broad:**

```csv
OR-SALEM,CBSA,41420,,Salem OR,primary,Metropolitan core of state capital market
OR-SALEM,County,41047,,Marion County OR,primary,County coverage beyond metro boundary
```

### Rule 4: When Splitting Large CBSAs, Use Counties + ZIP Lists

**Large CBSAs (Seattle-Tacoma-Bellevue CBSA 42660, LA metro, Chicago) must be decomposed:**

```csv
# DO NOT map all 5 markets to CBSA 42660
# Instead, use constituent counties with ZIP lists where needed:

WA-SEATTLE-MAIN,County,53033,"98101,98102...",King County WA,primary,Central Seattle
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005...",King County WA,primary,Eastside
WA-SEATTLE-SOUTHKING,County,53033,"98001,98023...",King County WA,primary,South King County
WA-SEATTLE-TACOMA,County,53053,,Pierce County WA,primary,Tacoma (entire Pierce)
WA-SEATTLE-EVERETT,County,53061,,Snohomish County WA,primary,Everett (entire Snohomish)
```

### Rule 5: ZIP List Completeness and Non-Overlap

**When using ZIP lists for a shared county:**

1. **Completeness:** All county ZIPs must appear in exactly one market's zip_list
2. **No gaps:** Don't leave ZIPs unassigned
3. **No overlaps:** A ZIP cannot appear in multiple markets' lists for the same county
4. **Format:** Comma-separated, no spaces, sorted numerically

**Validation:**
```python
# All ZIPs in King County must appear in exactly one of these three lists:
seattle_main_zips = set([98101, 98102, 98103, ...])
seattle_eastside_zips = set([98004, 98005, 98006, ...])
seattle_southking_zips = set([98001, 98023, 98030, ...])

# Check coverage
all_king_county_zips = get_zips_for_county(53033)
assigned_zips = seattle_main_zips | seattle_eastside_zips | seattle_southking_zips

assert assigned_zips == all_king_county_zips  # Complete coverage
assert len(seattle_main_zips & seattle_eastside_zips) == 0  # No overlap
assert len(seattle_eastside_zips & seattle_southking_zips) == 0  # No overlap
assert len(seattle_main_zips & seattle_southking_zips) == 0  # No overlap
```

### Rule 6: Secondary Relationships (Unchanged)

**Secondary = specialty/tertiary care only, NOT routine care**

```csv
OR-MEDFORD,CBSA,32780,,Medford OR,primary,Rogue Valley routine care anchor
OR-MEDFORD,CBSA,38900,,"Portland-Vancouver, OR-WA",secondary,Complex tertiary cases to OHSU 270 miles north
```

**Evidence required for secondary:**
- Long distance (typically >60 miles)
- Academic medical center referral pattern
- Documented in regional prompts
- Clearly specialty-only (not routine care)

### Rule 7: Cross-Border CBSAs

**When a CBSA spans state lines AND markets integrate:**

```csv
OR-PORTLAND,CBSA,38900,,"Portland-Vancouver-Hillsboro, OR-WA",primary,Integrated cross-border market via MAX light rail
```

**When state lines create separate markets despite CBSA:**
```csv
# Use counties to split:
OR-PORTLAND,County,41051,,Multnomah County OR,primary,Oregon side of Portland metro
WA-VANCOUVER,County,53011,,Clark County WA,primary,Washington side if treating as separate market
```

### Rule 8: Flag Redundant Markets

**If two markets map to identical areas (even with ZIP lists), flag as data quality issue:**

```csv
# DATA QUALITY ISSUE: Redundant Markets Detected
# OR-PORTLAND and WA-VANCOUVER both map to CBSA 38900
# Recommendation: Delete WA-VANCOUVER if MAX integration confirmed
# Only OR-PORTLAND mapped below
```

---

## Output Format Specification

### CSV Header (V2 Format with zip_list column)

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
```

### Field Specifications

| Field | Type | Rules | Example |
|-------|------|-------|---------|
| market_id | String | Must match markets CSV exactly | WA-SEATTLE-MAIN |
| statistical_area_type | Enum | CBSA or County only | County |
| statistical_area_id | String | CBSA code (5-digit) or County FIPS (5-digit) | 53033 |
| **zip_list** | **String** | **Comma-separated ZIPs, blank if not needed** | **98101,98102,98103** |
| statistical_area_name | String | Human-readable name | King County WA |
| relationship_type | Enum | primary or secondary | primary |
| mapping_rationale | String | Behavioral justification 1-2 sentences | Central Seattle urban core west of Lake Washington |

### Example Output (Complete Market Mapping)

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
OR-BEND,CBSA,13460,,Bend OR,primary,Micropolitan area represents core Central Oregon market anchored by St. Charles Health System
OR-BEND,County,41017,,Deschutes County OR,primary,County coverage includes areas beyond Bend micro served by St. Charles facilities
OR-PORTLAND,CBSA,38900,,"Portland-Vancouver-Hillsboro, OR-WA",primary,Cross-border metropolitan area integrated by MAX light rail and I-5 I-205 bridges
OR-SALEM,CBSA,41420,,Salem OR,primary,Metropolitan area represents state capital market 50 miles south of Portland anchored by Salem Health
OR-SALEM,County,41047,,Marion County OR,primary,County coverage beyond metro served by Salem Health facilities
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006,98007,98008,98011,98027,98029,98033,98034,98039,98040,98052,98053,98056,98059,98072,98074,98075,98077",King County WA,primary,Eastside portion of King County across Lake Washington including Bellevue Redmond Kirkland served by Overlake and Evergreen Health via I-90 SR-520 bridges
WA-SEATTLE-EVERETT,CBSA,31020,,Everett WA,primary,Metropolitan division represents Snohomish County market 30 miles north anchored by Providence Regional
WA-SEATTLE-EVERETT,County,53061,,Snohomish County WA,primary,County coverage ensures all of Snohomish County served by Providence Regional facilities
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103,98104,98105,98107,98109,98112,98115,98116,98117,98118,98119,98121,98122,98125,98126,98133,98134,98136,98144,98146,98154,98164,98174,98177,98178,98195,98199",King County WA,primary,Central Seattle urban core portion of King County with UW Medicine Swedish Virginia Mason Harborview anchors serving dense Puget Sound center west of Lake Washington
WA-SEATTLE-SOUTHKING,County,53033,"98001,98002,98003,98023,98030,98031,98032,98042,98055,98057,98058,98063,98064,98065,98092,98188,98198",King County WA,primary,South King County portion including Renton Kent Federal Way Auburn served by Valley Medical Center anchor separate from Seattle core
WA-SEATTLE-TACOMA,CBSA,45104,,Tacoma-Lakewood WA,primary,Metropolitan division represents Pierce County market 35 miles south of Seattle anchored by MultiCare and CHI Franciscan
WA-SEATTLE-TACOMA,County,53053,,Pierce County WA,primary,County coverage ensures all of Pierce County served by Tacoma anchor systems
WA-SPOKANE,CBSA,44060,,"Spokane-Spokane Valley, WA",primary,Eastern Washington metropolitan hub separated from Seattle by Cascade Mountains
WA-SPOKANE,County,53063,,Spokane County WA,primary,County coverage ensures eastern Washington areas served by Spokane anchors
WA-SPOKANE,County,16055,,Kootenai County ID,secondary,Some cross-border referral from Coeur d Alene ID 30 miles east for specialty services
```

**Observations:**
- King County (53033) rows have zip_list populated (3 markets share it)
- Pierce County (53053) row has blank zip_list (only 1 market)
- Snohomish County (53061) row has blank zip_list (only 1 market)
- OR markets have blank zip_list (no shared counties in this sample)

---

## Self-Validation Checklist (Updated for V2)

### Before Submitting Output

- [ ] Every market from CSV has at least one primary statistical area
- [ ] **Any county/CBSA used by 2+ markets has zip_list populated for each market**
- [ ] **zip_list is blank (empty) for statistical areas used by only 1 market**
- [ ] ZIP lists are comma-separated with no spaces
- [ ] ZIP lists have no overlaps within same county
- [ ] ZIP lists provide complete coverage of shared counties
- [ ] Large CBSAs are split using counties (not all markets pointing to same CBSA)
- [ ] Cross-border CBSAs properly assigned
- [ ] County usage is justified in each rationale
- [ ] All CBSA codes and county FIPS codes are correct
- [ ] Redundant markets are flagged (if any)
- [ ] Output sorted by market_id alphabetically
- [ ] Secondary relationships have clear specialty-only justification

---

## Execution Checklist

### Before Starting

- [ ] Load `master_market.md` (national framework, 45-minute rule)
- [ ] Load `markets_<region>.md` (regional mobility factors, documented splits, barriers)
- [ ] Load `markets_<region>.csv` (valid market_ids and notes on catchment areas)
- [ ] Obtain Census CBSA definitions for region's states
- [ ] Obtain county FIPS codes for region's states
- [ ] **Obtain county-to-ZIP crosswalk files for counties that will need splits**
- [ ] Review which large CBSAs must be split across multiple markets
- [ ] Identify counties where multiple markets will share the same county
- [ ] Identify any potentially redundant markets before mapping

### During Mapping

- [ ] Map each market to appropriate statistical areas (CBSAs preferred, counties when needed)
- [ ] When multiple markets share a county, **build ZIP lists for each market**
- [ ] Ensure ZIP lists have complete coverage and no overlaps
- [ ] Use blank zip_list when statistical area is unique to one market
- [ ] Ensure each market has DISTINCT coverage (via different stat areas OR different ZIP lists)
- [ ] Use micropolitan CBSAs where they exist
- [ ] Assign secondary relationships only with evidence from regional prompts
- [ ] Document cross-border CBSAs properly
- [ ] Flag redundant markets rather than forcing artificial distinctions

### During ZIP List Building (for shared counties)

- [ ] Obtain ZIP code map for county
- [ ] Identify natural boundaries (water, highways, city limits)
- [ ] Assign ZIPs based on anchor proximity and behavioral patterns
- [ ] Verify complete coverage (all county ZIPs assigned)
- [ ] Verify no overlaps (each ZIP in exactly one market)
- [ ] Format as comma-separated (no spaces)
- [ ] Document behavioral justification in rationale

### After Mapping

- [ ] Verify every market from CSV has at least one primary statistical area
- [ ] **Verify counties with multiple markets have zip_list for each market**
- [ ] **Verify counties with single market have blank zip_list**
- [ ] Verify ZIP lists are complete and non-overlapping
- [ ] Verify no two markets have identical coverage without clear distinction
- [ ] Verify cross-border CBSAs properly assigned
- [ ] Verify county usage is justified in each rationale
- [ ] Verify all CBSA codes and county FIPS codes are correct
- [ ] Verify redundant markets are flagged (if any)
- [ ] Sort output by market_id alphabetically
- [ ] Generate clean CSV file with proper zip_list column

---

## Example Mappings (V2 with ZIP Lists)

### Example 1: Simple Market (No ZIP List Needed)
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
OR-SALEM,CBSA,41420,,Salem OR,primary,Metropolitan area represents entire state capital market 50 miles south of Portland with Salem Health anchor
OR-SALEM,County,41047,,Marion County OR,primary,County coverage beyond metro boundary served by Salem Health
```
**Note:** Marion County only used by OR-SALEM → zip_list is blank

### Example 2: County Split with ZIP Lists (King County)
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103,98104,98105,98107,98109,98112,98115,98116,98117,98118,98119,98121,98122,98125,98126,98133,98134,98136,98144,98146,98154,98164,98174,98177,98178,98195,98199",King County WA,primary,Central Seattle urban core west of Lake Washington including downtown Capitol Hill Ballard University District served by UW Medicine Swedish Virginia Mason
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006,98007,98008,98011,98027,98029,98033,98034,98039,98040,98052,98053,98056,98059,98072,98074,98075,98077",King County WA,primary,Eastside across Lake Washington including Bellevue Redmond Kirkland Sammamish Issaquah Mercer Island via I-90 SR-520 bridges served by Overlake Evergreen Health
WA-SEATTLE-SOUTHKING,County,53033,"98001,98002,98003,98023,98030,98031,98032,98042,98055,98057,98058,98063,98064,98065,98092,98188,98198",King County WA,primary,South King County including Renton Kent Auburn Federal Way SeaTac Tukwila Burien served by Valley Medical Center
```
**Note:** King County shared by 3 markets → each has explicit zip_list

### Example 3: Mix of Unique and Shared Counties
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
WA-SEATTLE-TACOMA,CBSA,45104,,Tacoma-Lakewood WA,primary,Metropolitan division represents Pierce County market
WA-SEATTLE-TACOMA,County,53053,,Pierce County WA,primary,Entire Pierce County served by MultiCare and CHI Franciscan
WA-SEATTLE-EVERETT,CBSA,31020,,Everett WA,primary,Metropolitan division represents Snohomish County market
WA-SEATTLE-EVERETT,County,53061,,Snohomish County WA,primary,Entire Snohomish County served by Providence Regional
```
**Note:** Pierce and Snohomish counties each used by only 1 market → zip_list blank

### Example 4: Cross-Border Market (No Split Needed)
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
OR-PORTLAND,CBSA,38900,,"Portland-Vancouver-Hillsboro, OR-WA",primary,Cross-border metropolitan area integrated by MAX light rail and I-5 I-205 bridges serving both Portland OR and Vancouver WA as single market
```
**Note:** CBSA 38900 only used by OR-PORTLAND → zip_list blank

### Example 5: Secondary Referral
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
OR-MEDFORD,CBSA,32780,,Medford OR,primary,Metropolitan area represents Rogue Valley routine care market
OR-MEDFORD,CBSA,38900,,"Portland-Vancouver-Hillsboro, OR-WA",secondary,Complex tertiary cases referred to OHSU in Portland 270 miles north
```
**Note:** Secondary relationships don't need zip_list (they represent spillover, not primary coverage)

---

## Final Instruction

Output **only** the completed `market_to_statistical_area_<region>.csv` file in V2 format.

**Format:**
```
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
[rows sorted by market_id alphabetically]
```

**Critical V2 Requirements:**

1. **Include zip_list column** (even if blank for most rows)
2. **Populate zip_list** when 2+ markets share same county/CBSA
3. **Leave zip_list blank** when only 1 market uses the statistical area
4. **Ensure ZIP lists are complete and non-overlapping** within shared counties
5. **Format ZIP lists** as comma-separated without spaces

**If redundant markets detected, include a comment block at the top:**
```
# DATA QUALITY ISSUE: Redundant Markets Detected
# [Explanation of redundancy]
# [Recommendation to remove specific market(s)]
# [Only non-redundant markets mapped below]
```

**Downstream consumption will work as follows:**
```python
# For each row in mapping CSV:
if row['zip_list']:  # Not blank
    # Use ZIP-level assignment
    for zip in row['zip_list'].split(','):
        assign_zip_to_market(zip, row['market_id'])
else:  # zip_list is blank
    # Use statistical area assignment
    zips = get_zips_for_statistical_area(row['statistical_area_id'])
    for zip in zips:
        assign_zip_to_market(zip, row['market_id'])
```

**Your responsibility at this stage:**
- Identify which statistical areas each market serves
- **When multiple markets share a statistical area, explicitly list ZIPs for each**
- Ensure each market has DISTINCT coverage (different areas OR different ZIPs)
- Build complete, non-overlapping ZIP lists for shared counties
- Use blank zip_list when no ambiguity exists
- Provide clear behavioral rationale for each assignment
- Flag redundant markets rather than forcing distinctions

**NOT your responsibility at this stage:**
- Verify ZIP code existence (use best available data)
- Perform complex spatial analysis within ZIPs
- Determine sub-ZIP granularity
- Resolve data quality issues in the markets CSV (flag them instead)

**Prioritize:**
1. **Programmatic unambiguity** (each market has distinct coverage via areas OR ZIPs)
2. **Preservation of market granularity** (no many-to-one stat area without ZIP lists)
3. Behavioral realism (does this coverage truly serve this market?)
4. Use of official Census entities (CBSAs preferred, counties when needed)
5. Clear rationale for each assignment
6. Flagging data quality issues (redundant markets, impossible mappings)

The goal is to answer: **"Which named statistical areas (and specific ZIPs when needed) are part of each healthcare market's catchment area, such that each market has programmatically unambiguous coverage?"**
