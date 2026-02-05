# QA Prompt: Comprehensive Healthcare Shopping Zones Validation

## Purpose

You are conducting a comprehensive Quality Assurance review of all Healthcare Shopping Zone CSVs that have been generated across multiple US regions. Your objective is to ensure:

1. **National completeness** - No major markets were missed between regions
2. **Regional accuracy** - Each CSV properly implements its regional prompt requirements
3. **Format consistency** - All CSVs follow the master prompt's data structure
4. **Behavioral realism** - Markets reflect realistic 45-minute routine care access patterns

---

## Context

Healthcare Shopping Zones have been defined for multiple US regions using a master national framework plus regional-specific prompts. Each region was processed separately, creating potential gaps at regional boundaries or missed markets within regions.

**Master Framework:** `master_market.md` defines the national ruleset including:
- 45-minute rule for routine care
- market_id naming conventions
- Transit and congestion considerations
- The principle that behavioral accuracy > statistical neatness

**Regional Prompts:** Each region has a detailed prompt with:
- Geographic scope (states covered)
- Expected market count ranges
- Specific metro splits required
- Regional mobility factors

---

## Available Files for Review

### Regional CSV Files
The following regional CSVs should be available for review:
1. **markets_northeast.csv** - PA, NJ, NY, CT, MA, RI, VT, NH, ME (9 states, ~61 markets expected)
2. **markets_midatlantic.csv** - MD, DC, DE, VA, WV (5 states, ~29 markets expected)
3. **markets_southeast.csv** - NC, SC, GA, FL, AL, MS, TN (7 states, ~65 markets expected)
4. **markets_texas_plains.csv** - TX, OK, KS, MO, IA, NE, SD, ND, AR, LA (10 states, ~91 markets expected)
5. **markets_mountainwest.csv** - CO, UT, ID, MT, WY, NV, NM (7 states, ~51 markets expected)
6. **markets_california.csv** - CA (1 state, ~41 markets expected)
7. **markets_pacificnorthwest.csv** - WA, OR (2 states, ~20 markets expected)
8. **markets_midwest.csv** - IL, IN, OH, MI, WI, MN (6 states, ~55 markets expected)

### Regional Prompt Files
The corresponding regional prompts that should be referenced:
1. `markets_northeast.md`
2. `markets_midatlantic.md`
3. `markets_southeast.md`
4. `markets_texas_plains.md`
5. `markets_mountainwest.md`
6. `markets_california.md`
7. `markets_pacificnorthwest.md`
8. `markets_midwest.md`

### Master Framework
- `master_market.md` - National ruleset

---

## QA Validation Framework

### Phase 1: National Coverage Completeness

**Objective:** Ensure all 50 US states + DC are covered with no gaps.

**Tasks:**
1. **Create a state coverage matrix:**
   - List all 50 states + DC
   - Map each state to its regional CSV
   - Identify any states not covered by any region

2. **Expected state assignments:**
   - **Northeast (9):** PA, NJ, NY, CT, MA, RI, VT, NH, ME
   - **Mid-Atlantic (5):** MD, DC, DE, VA, WV
   - **Southeast (7):** NC, SC, GA, FL, AL, MS, TN
   - **Texas & Plains (10):** TX, OK, KS, MO, IA, NE, SD, ND, AR, LA
   - **Mountain West (7):** CO, UT, ID, MT, WY, NV, NM
   - **California (1):** CA
   - **Pacific Northwest (2):** WA, OR
   - **Midwest (6):** IL, IN, OH, MI, WI, MN
   - **TOTAL:** 47 states + DC = 48 jurisdictions

3. **States not covered (expected):**
   - **Alaska** - Not covered (special case, noted as excluded)
   - **Hawaii** - Not covered (special case, noted as excluded)
   - **Arizona** - CHECK if missing (Phoenix 5M metro, Tucson 1M metro)
   - **Kentucky** - CHECK coverage (should be via OH-CINCINNATI cross-border or separate markets)
   - **New Mexico** - Should be in Mountain West

4. **Verify border coverage:**
   - Check major metros that straddle state lines:
     - Kansas City (KS/MO) - Should be in Texas & Plains as MO-KANSASCITY
     - Portland-Vancouver (OR/WA) - Should be in Pacific Northwest as OR-PORTLAND
     - Omaha-Council Bluffs (NE/IA) - Should be in Texas & Plains
     - St. Louis (MO/IL) - Missouri side should be in Texas & Plains as MO-STLOUIS serving both MO/IL
     - Cincinnati (OH/KY) - Should be in Midwest as OH-CINCINNATI serving both OH/KY
     - Philadelphia (PA/NJ) - Should be in Northeast
     - DC metro (DC/MD/VA) - Should be in Mid-Atlantic
     - Memphis (TN/AR/MS) - Should be in Southeast
     - Texarkana (TX/AR) - Should be in Texas & Plains
     - Fargo-Moorhead (ND/MN) - Should be in Texas & Plains as ND-FARGO

5. **Critical check: Arizona and Kentucky**
   - **Arizona:** Phoenix (5M), Tucson (1M), Flagstaff, Yuma - if not found, CRITICAL GAP
   - **Kentucky:** Louisville (1.3M), Lexington (500K), Bowling Green - check if covered via OH-CINCINNATI or if there are gaps

**Expected finding:** 48 of 51 jurisdictions covered (AK, HI excluded by design; AZ may be missing; KY should be partial via OH-CINCINNATI)

---

### Phase 2: Major Market Coverage Validation

**Objective:** Ensure all major US metros are represented with appropriate granularity.

**Top 50 US Metro Areas to Validate:**

For each metro below, verify:
- ✅ Metro is present in appropriate regional CSV
- ✅ Metro is split appropriately if large/sprawling
- ✅ Metro anchor systems are correctly identified
- ❌ Flag if metro is missing or under-split

**Major Metros List (validate presence):**

**Top 10 (MUST have multiple markets if large):**
1. New York-Newark CSA (~20M) - Expect 6-10 markets in Northeast
2. Los Angeles CSA (~13M) - Expect 10-12 markets in California
3. Chicago CSA (~10M) - Expect 6-10 markets in Midwest
4. Dallas-Fort Worth CSA (~8M) - Expect 6-8 markets in Texas & Plains
5. Houston CSA (~7.5M) - Expect 4-6 markets in Texas & Plains
6. Washington DC CSA (~6.5M) - Expect 4-6 markets in Mid-Atlantic
7. Philadelphia CSA (~6.5M) - Expect 3-5 markets in Northeast
8. Miami-Fort Lauderdale CSA (~6.5M) - Expect 3-4 markets in Southeast
9. Atlanta CSA (~6.3M) - Expect 4-6 markets in Southeast
10. Boston CSA (~6M) - Expect 3-4 markets in Northeast

**Next 15 Major Metros (must be present):**
11. Phoenix (~5M) - CHECK if covered (likely MISSING - not in any region)
12. San Francisco Bay Area (~8M) - Expect 6-8 markets in California
13. Riverside-San Bernardino (Inland Empire) (~5M) - Expect 3-4 markets in California
14. Detroit (~4.5M) - Expect 3-5 markets in Midwest
15. Seattle (~4M) - Expect 3-5 markets in Pacific Northwest
16. Minneapolis-St. Paul (~4M) - Expect 1-3 markets in Midwest
17. San Diego (~3.3M) - Expect 2-3 markets in California
18. Tampa-St. Petersburg (~3.3M) - Expect 2 markets in Southeast
19. Denver (~3M) - Expect 3-4 markets in Mountain West
20. St. Louis (~3M) - Should be in Texas & Plains as MO-STLOUIS
21. Baltimore (~2.8M) - Expect 1-2 markets in Mid-Atlantic
22. Charlotte (~2.8M) - Should be in Southeast
23. Portland OR (~2.5M) - Should be in Pacific Northwest
24. Sacramento (~2.5M) - Should be in California
25. San Antonio (~2.5M) - Should be in Texas & Plains

**Next 25 (validate presence):**
26. Orlando - Southeast
27. Austin - Texas & Plains
28. Cincinnati (~2.3M) - Should be in Midwest as OH-CINCINNATI
29. Cleveland (~2.1M) - Should be in Midwest
30. Kansas City (~2.2M) - Should be in Texas & Plains as MO-KANSASCITY
31. Las Vegas (~2.2M) - Should be in Mountain West
32. Columbus OH (~2.1M) - Should be in Midwest
33. Indianapolis (~2.1M) - Should be in Midwest
34. San Jose - Part of Bay Area in California
35. Nashville (~2M) - Should be in Southeast
36. Virginia Beach (~1.8M) - Should be in Mid-Atlantic
37. Providence (~1.6M) - Should be in Northeast
38. Milwaukee (~1.6M) - Should be in Midwest
39. Jacksonville (~1.6M) - Should be in Southeast
40. Oklahoma City (~1.4M) - Should be in Texas & Plains
41. Raleigh-Durham (~2.1M) - Should be in Southeast
42. Memphis (~1.4M) - Should be in Southeast
43. Louisville (~1.3M) - CHECK if covered (may be in OH-CINCINNATI or missing)
44. Richmond (~1.3M) - Should be in Mid-Atlantic
45. New Orleans (~1.3M) - Should be in Texas & Plains
46. Salt Lake City (~1.2M) - Should be in Mountain West
47. Buffalo (~1.2M) - Should be in Northeast
48. Hartford (~1.2M) - Should be in Northeast
49. Birmingham (~1.2M) - Should be in Southeast
50. Tucson (~1M) - CHECK if covered (likely MISSING - AZ not in any region)

**CRITICAL GAPS TO FLAG:**
- If any Top 10 metro is missing or severely under-split
- If any Top 25 metro is missing
- If major state capitals are missing
- Phoenix and Tucson (entire Arizona state likely missing)
- Louisville KY (may be missing if not in OH-CINCINNATI)

---

### Phase 3: Regional CSV Validation

**For each regional CSV, validate:**

#### 3.1 Format Validation
- ✅ All required columns present: market_id, market_name, anchor_city, anchor_systems, primary_states, market_type, notes
- ✅ market_id follows naming convention: STATE-CITY-QUALIFIER
- ✅ market_id uses 2-letter state codes (not state names)
- ✅ market_id uses hyphens only (no underscores, spaces)
- ✅ market_id is ≤32 characters
- ✅ Rows are alphabetically sorted by market_id
- ✅ No duplicate market_ids
- ✅ No missing values in required columns

#### 3.2 Regional Prompt Compliance

**Northeast (61 expected):**
- ✅ NYC split into 6-10 markets (Manhattan, Bronx, Brooklyn, Queens, Staten Island, Long Island, Westchester, etc.)
- ✅ Boston area has 3-4 markets (Core, North Shore, South Shore, Worcester separate)
- ✅ Philadelphia split appropriately (PA side + NJ side)
- ✅ Upstate NY cities are separate (Albany, Syracuse, Rochester, Buffalo)
- ✅ Hartford, Providence, New Haven present

**Mid-Atlantic (29 expected):**
- ✅ DC-Baltimore split into 4-6 markets (NOT integrated)
- ✅ Baltimore is separate from DC (not integrated despite proximity)
- ✅ WMATA coverage limited to Metro-accessible core only
- ✅ Hampton Roads is present (Norfolk/Virginia Beach area)
- ✅ West Virginia has multiple markets (Charleston, Huntington, Morgantown, etc.)
- ✅ Richmond VA is present

**Southeast (65 expected):**
- ✅ Atlanta split into 4-6 markets (sprawl accounting)
- ✅ South Florida split into 3-4 markets (Miami-Dade, Broward, Palm Beach, etc.)
- ✅ Tampa-St. Pete split into 2 markets (bay bridge friction)
- ✅ Florida has 20+ markets (linear coast properly segmented)
- ✅ NC Triangle has 2-3 markets (Raleigh, Durham, Chapel Hill)
- ✅ Charlotte, Nashville, Memphis, Birmingham, Jacksonville present
- ✅ Transit has zero impact (car-dependent region)

**Texas & Plains UPDATED (91 expected):**
- ✅ DFW split into 6-8 markets (Dallas ≠ Fort Worth)
- ✅ Houston split into 4-6 markets (no-zoning sprawl)
- ✅ Austin and San Antonio are separate (not integrated by I-35)
- ✅ Kansas City is present (integrated KS/MO cross-border market: MO-KANSASCITY)
- ✅ St. Louis is present (MO-STLOUIS serves both MO and IL)
- ✅ Missouri has 8 markets
- ✅ Iowa has 7 markets (Des Moines, Iowa City, Cedar Rapids, etc.)
- ✅ South Dakota has 5 markets (Sioux Falls, Rapid City, etc.)
- ✅ North Dakota has 5 markets (Fargo, Bismarck, etc.)
- ✅ Texas has 36 markets
- ✅ West Texas isolation (El Paso, Amarillo, Lubbock, Midland separate)
- ✅ Oklahoma City, Tulsa, Little Rock, New Orleans present

**Mountain West (51 expected):**
- ✅ Denver Front Range split into 3-4 markets (Denver, Boulder, Fort Collins, Colorado Springs)
- ✅ Las Vegas and Reno are separate (450 miles apart, zero integration)
- ✅ Salt Lake / Wasatch Front evaluated for split (may be 2-3 markets)
- ✅ Montana has 7 markets (Billings, Missoula separated by Continental Divide)
- ✅ Ski resort markets recognized (Vail, Aspen, Park City, Jackson)
- ✅ Albuquerque, Santa Fe, Boise, Spokane present

**California (41 expected):**
- ✅ LA Basin split into 10-12 markets
- ✅ Orange County separate from LA (2 OC markets: North/South)
- ✅ San Fernando Valley separate from Westside (Santa Monica Mountains barrier)
- ✅ Bay Area split into 6-8 markets
- ✅ San Francisco ≠ San Jose (not integrated despite Caltrain)
- ✅ Inland Empire separate from LA (3-4 markets)
- ✅ Central Valley cities NOT consolidated (8 separate markets: Redding, Chico, Sacramento, Stockton, Modesto, Fresno, Visalia, Bakersfield)
- ✅ San Diego has 2-3 markets
- ✅ Central Coast markets present (Santa Cruz, Monterey, San Luis Obispo, Santa Barbara)

**Pacific Northwest (20 expected):**
- ✅ Seattle metro split into 3-5 markets (Core, Eastside, South King, Tacoma, Everett)
- ✅ Tacoma separate from Seattle (35 miles, MultiCare system)
- ✅ Portland-Vancouver WA integration evaluated (OR-PORTLAND covers both OR/WA)
- ✅ Spokane separate from Seattle (Cascade barrier)
- ✅ Eastern WA/OR separate from Western (Cascade barrier creates 7 Eastern markets)
- ✅ Ferry-dependent communities separate (Bremerton)
- ✅ Salem, Eugene, Bend present

**Midwest (55 expected):**
- ✅ Chicago metro split into 6-10 markets (Core, North Side, South Side, West Side, collar counties)
- ✅ Chicago Core separate from North/South/West sides
- ✅ Gary IN evaluated for integration or separation (should be IN-GARY separate market)
- ✅ Detroit metro split into 3-5 markets (Core, Oakland, Macomb, Ann Arbor, Downriver)
- ✅ Ann Arbor separate from Detroit (40 miles, Michigan Medicine academic center)
- ✅ Minneapolis-St. Paul integration evaluated (should be MN-TWINCITIES integrated)
- ✅ Cleveland and Akron are separate (35 miles apart: OH-CLEVELAND and OH-AKRON)
- ✅ Cincinnati integrates OH/KY (OH-CINCINNATI covers both sides)
- ✅ Columbus, Indianapolis, Milwaukee present
- ✅ Mayo Clinic Rochester MN separate from Twin Cities (80 miles: MN-ROCHESTER)
- ✅ Great Lakes barriers enforced (Chicago ≠ Michigan, Cleveland ≠ Detroit)
- ✅ St. Louis NOT duplicated (already in Texas & Plains)
- ✅ Quad Cities NOT duplicated (already in Texas & Plains)

#### 3.3 Content Quality Validation
For each market in each CSV:
- ✅ Anchor systems are named correctly (real health systems)
- ✅ Notes are substantive (explain why market is defined this way)
- ✅ Notes reference specific barriers (mountains, lakes, bridges, distance, congestion, winter)
- ✅ Market types are appropriate (Core Metro, Suburban, Regional, Rural Hub)
- ✅ Primary states are correct
- ✅ Cross-border markets explicitly note integration (e.g., "serves both MO and IL")

---

### Phase 4: Cross-Regional Boundary Validation

**Objective:** Ensure markets don't fall through cracks at regional boundaries.

**State Boundary Markets to Check:**

1. **PA/MD/VA/WV borders:**
   - Pittsburgh (PA) in Northeast ✓
   - Hagerstown (MD) in Mid-Atlantic ✓
   - Morgantown (WV) in Mid-Atlantic ✓

2. **VA/NC border:**
   - Virginia Beach/Norfolk in Mid-Atlantic ✓
   - Outer Banks coverage

3. **TN/KY border:**
   - Nashville (TN) in Southeast ✓
   - Louisville (KY) - CHECK coverage
   - Memphis (TN) in Southeast ✓

4. **OH/KY/IN border:**
   - Cincinnati (OH/KY) in Midwest as OH-CINCINNATI ✓
   - Louisville (KY) - CHECK if covered or gap

5. **IL/MO border:**
   - St. Louis (MO/IL) in Texas & Plains as MO-STLOUIS serving both ✓
   - Illinois side should NOT be duplicated in Midwest ✓

6. **IA/IL border:**
   - Quad Cities (IA/IL) in Texas & Plains as IA-DAVENPORT ✓
   - Illinois side should NOT be duplicated in Midwest ✓

7. **MN/ND border:**
   - Fargo-Moorhead (ND/MN) in Texas & Plains as ND-FARGO ✓
   - Minnesota side should NOT be duplicated in Midwest ✓

8. **CO/WY border:**
   - Cheyenne WY (may integrate with Denver or be separate)

9. **ID/WA border:**
   - Spokane WA / Coeur d'Alene ID in Mountain West as ID-COEURDALENE ✓
   - Note: Spokane is in Pacific Northwest as WA-SPOKANE ✓

10. **OR/CA border:**
    - Medford OR in Pacific Northwest ✓
    - Redding CA in California ✓
    - Properly separated ✓

**For each boundary area, verify:**
- ✅ Markets on both sides of border are present
- ✅ No major cities "fall through cracks" between regions
- ✅ Cross-border integrated markets are handled consistently
- ✅ No duplicate markets across regions

---

### Phase 5: Arizona and Kentucky Gap Analysis

**CRITICAL CHECK:** Arizona appears to be missing from all regional coverage.

**Arizona Assessment:**
- **Population:** ~7.5M people
- **Major metros:**
  - Phoenix (~5M) - 5th largest US metro
  - Tucson (~1M)
  - Flagstaff
  - Yuma
  - Prescott
- **Expected markets:** 6-10 markets

**If Arizona is NOT found in any regional CSV:**
- ✅ Flag as CRITICAL NATIONAL GAP
- ✅ Recommend adding Arizona to Mountain West region
- ✅ Update Mountain West CSV to include AZ markets

**Kentucky Assessment:**
- **Population:** ~4.5M people
- **Partial coverage:** Northern Kentucky (Covington, Newport) should be in OH-CINCINNATI (Midwest)
- **Potentially missing markets:**
  - Louisville (~1.3M metro) - CHECK if covered
  - Lexington (~500K)
  - Bowling Green
  - Owensboro
  - Paducah
- **Expected additional markets:** 3-5 markets if not covered via OH-CINCINNATI

**If Louisville and central/western Kentucky are NOT found:**
- ✅ Flag as SIGNIFICANT GAP
- ✅ Recommend adding to Southeast or creating standalone markets
- ✅ Note: Northern KY properly covered via OH-CINCINNATI cross-border market

---

### Phase 6: Aggregate Statistics Validation

**National Totals:**
1. Count total markets across all CSVs
2. Count total states/jurisdictions covered
3. Calculate markets per million population (should be ~1.5-2.0 nationally)
4. Identify regions with anomalous density

**Expected National Total:** 410-450 markets for covered regions (without AZ and KY gaps)

**Regional Density Check:**
Calculate markets per million for each region:
- **Northeast:** 61 markets / 44M people = 1.4 per million
- **Mid-Atlantic:** 29 markets / 17M people = 1.7 per million
- **Southeast:** 65 markets / 75M people = 0.87 per million
- **Texas & Plains:** 91 markets / 57M people = 1.6 per million
- **Mountain West:** 51 markets / 18M people = 2.8 per million (high due to distance barriers)
- **California:** 41 markets / 39M people = 1.05 per million
- **Pacific Northwest:** 20 markets / 12M people = 1.7 per million
- **Midwest:** 55 markets / 45M people = 1.2 per million

**Anomaly flags:**
- Mountain West density (2.8) is high due to frontier/distance barriers ✓ Expected
- California density (1.05) is low but reflects extreme metro concentration requiring splits ✓ Expected
- Southeast density (0.87) is low - may indicate under-splitting ⚠️ Review Atlanta, Florida

---

## Output Format

Provide a comprehensive QA report with the following sections:

### Section 1: National Coverage Summary
```
STATES/JURISDICTIONS COVERED: [count] of 51
MISSING: [list any missing states]
CRITICAL GAPS: [Arizona, Kentucky details]
```

### Section 2: Major Metro Validation
```
TOP 10 METROS:
✅ New York - Present (X markets)
✅ Los Angeles - Present (X markets)
✅ Chicago - Present (X markets)
[continue for all Top 50]

MISSING MAJOR METROS: [summarize]
UNDER-SPLIT METROS: [flag any that need more granularity]
```

### Section 3: Regional CSV Compliance
```
For each region:
FILE: [filename]
- Format: ✅ PASS / ❌ FAIL [details]
- Prompt Compliance: ✅ PASS / ⚠️ WARNING [details]
- Market Count: Actual vs Expected
- Key Validations: [specific checks from Phase 3.2]
```

### Section 4: Cross-Regional Boundaries
```
BOUNDARY AREA: [location]
✅ [coverage details]
⚠️ [warnings or gaps]
```

### Section 5: Arizona and Kentucky Gap Assessment
```
ARIZONA:
❌ NOT COVERED - Phoenix (5M), Tucson (1M)
RECOMMENDATION: Add to Mountain West region

KENTUCKY:
⚠️ PARTIAL - Northern KY covered via OH-CINCINNATI
❌ Louisville, Lexington, central/western KY likely missing
RECOMMENDATION: [specific action]
```

### Section 6: Aggregate Statistics
```
TOTAL MARKETS: [X]
TOTAL STATES COVERED: [X] of 51
MISSING POPULATION: ~[X]M (AZ + uncovered KY)
MARKETS PER MILLION BY REGION: [table]
NATIONAL AVERAGE: [X] markets per million
```

### Section 7: Critical Findings & Recommendations
```
CRITICAL ISSUES:
1. [Highest priority gaps/errors]
2. [Format violations]
3. [Missing metro areas]

RECOMMENDATIONS:
1. HIGH PRIORITY: [fixes needed]
2. MEDIUM PRIORITY: [improvements]
3. LOW PRIORITY: [minor adjustments]
```

---

## Success Criteria

A successful QA validation should confirm:
- ✅ 48+ of 51 jurisdictions are covered (AK/HI excluded by design)
- ✅ All Top 10 US metros are present with appropriate splits
- ✅ All Top 25 US metros are present
- ✅ No major cities fall through regional boundary cracks
- ✅ All regional CSVs comply with their respective prompts
- ✅ All CSVs follow master prompt format requirements
- ✅ Total national market count is realistic (410-450 for currently covered areas)
- ✅ Cross-border markets handled consistently (no duplicates, proper integration)
- ⚠️ Arizona gap identified and recommendation provided
- ⚠️ Kentucky gap assessed and recommendation provided

---

## Important Notes

1. **Be thorough but pragmatic:** Flag CRITICAL gaps (missing states, Top 10 metros, duplicates) but don't get lost in minor formatting issues.

2. **Check actual files:** Use bash/view tools to read actual CSV contents, don't rely on assumptions.

3. **Cross-reference prompts:** When validating regional compliance, actually check what the regional prompt required.

4. **Focus on behavioral realism:** If a market seems too large (>60 min crossing time), flag it even if it passes format checks.

5. **Arizona is likely the biggest gap:** Based on available regions, Arizona (7.5M people, Phoenix 5M metro) appears to be missing entirely.

6. **Kentucky is partially covered:** Northern Kentucky should be in OH-CINCINNATI, but Louisville and rest of state may be missing.

7. **Cross-border markets are critical:** Verify that MO-STLOUIS (MO/IL), MO-KANSASCITY (KS/MO), OH-CINCINNATI (OH/KY), OR-PORTLAND (OR/WA), ND-FARGO (ND/MN), IA-DAVENPORT (IA/IL) are properly handled without duplication.

---

## Execution Instructions

1. Start by creating a state coverage matrix (all 51 jurisdictions)
2. Check each regional CSV for the states it claims to cover
3. Validate Top 50 metros systematically
4. Check each CSV against its regional prompt requirements
5. Examine cross-regional boundaries for gaps and duplicates
6. Assess Arizona and Kentucky gaps specifically
7. Compile comprehensive findings report
8. Prioritize critical gaps over minor issues