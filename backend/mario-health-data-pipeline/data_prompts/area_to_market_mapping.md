# Execution Prompt: Stage-1 Mapping — Proprietary Markets → Statistical Areas

## Purpose

This prompt executes **Stage-1 of the healthcare market mapping workflow**.

Your task is to map **proprietary Healthcare Shopping Zones (markets)** to **named statistical areas** in a way that is behaviorally realistic, LLM-tractable, and suitable for later deterministic expansion to ZIP codes.

This prompt **does not enumerate ZIPs** and must not attempt ZIP-level reasoning. The output serves as conceptual input for a separate deterministic ZIP expansion process.

---

## CRITICAL CONCEPTUAL CLARIFICATION

### The Fundamental Mapping Direction

**EACH MARKET CONSUMES ONE OR MORE STATISTICAL AREAS.**

The mapping is:
```
One Market → Multiple Statistical Areas (CBSAs, Micropolitans, Counties)
```

**NOT:**
```
Multiple Markets → One Statistical Area (WRONG)
```

### Why This Matters

When you have granular markets like:
- `WA-SEATTLE-MAIN` (Seattle Core)
- `WA-SEATTLE-EASTSIDE` (Bellevue/Eastside)
- `WA-SEATTLE-TACOMA` (Tacoma)
- `WA-SEATTLE-EVERETT` (Snohomish County)
- `WA-SEATTLE-SOUTHKING` (South King County)

**Each of these markets must map to DIFFERENT statistical areas.**

**WRONG APPROACH (what you must NOT do):**
```csv
WA-SEATTLE-MAIN,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-EASTSIDE,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-TACOMA,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-EVERETT,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-SOUTHKING,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
```
↑ This makes the granular markets MEANINGLESS. All point to the same CBSA.

**CORRECT APPROACH (what you must do):**
```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core
WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,Eastside portion across Lake Washington
WA-SEATTLE-TACOMA,County,53053,Pierce County WA,primary,Tacoma and Pierce County
WA-SEATTLE-EVERETT,County,53061,Snohomish County WA,primary,Everett and Snohomish County
WA-SEATTLE-SOUTHKING,County,53033,King County WA,primary,South King County portion
```
↑ Each market maps to distinct counties or portions, making the granularity meaningful.

**OR, if smaller CBSAs exist within the large metro:**
```csv
WA-SEATTLE-MAIN,CBSA,42644,Seattle-Bellevue-Everett WA,primary,Core Seattle market
WA-SEATTLE-TACOMA,CBSA,45104,Tacoma WA,primary,Separate Tacoma market
WA-OLYMPIA,CBSA,36500,Olympia-Lacey-Tumwater WA,primary,Separate state capital market
```
↑ Each market claims a distinct CBSA or division.

### The Point of Granular Markets

**Granular markets were created to reflect REAL behavioral differences:**
- Different anchor hospital systems
- Different routine-care travel patterns
- Different catchment areas
- Barriers (water, congestion, distance) that separate them

**If all granular markets map to the same CBSA, the granularity is LOST.**

You must use counties, county subdivisions, smaller CBSAs, or micropolitan areas to maintain the distinction.

---

## Conceptual Frame (You Must Accept This)

**The Layered Mapping Architecture:**

1. **Truth Layer:** Proprietary Healthcare Shopping Zones (435 markets)
   - Already defined, validated, and stable
   - Must NOT be redefined, renamed, merged, or split

2. **Intermediate Layer (This Stage):** Statistical Areas (CBSAs, Micropolitans, Counties)
   - Capture geographic and behavioral intent
   - Named entities that enable conceptual reasoning
   - LLM-friendly for reasoning about catchment areas
   - **EACH MARKET CONSUMES DISTINCT STATISTICAL AREA(S)**

3. **Operational Layer (Next Stage):** ZIP Codes
   - Deterministic expansion from statistical areas
   - Performed outside LLM using Census crosswalks
   - Not part of this prompt

**Your Goal at This Stage:**
> "Which named statistical areas does this market serve for routine and specialty care?"

**CRITICAL REFRAME:**
You are NOT asking "which CBSA should I assign to this market?"

You are asking "which statistical areas (counties, CBSAs, micropolitans) are part of this market's catchment area?"

**NOT:**
> "Which specific ZIP codes should map to this market?" (that comes later)

---

## Why This Staged Approach?

**Stage-1 (Statistical Areas) enables:**
- Conceptual reasoning at the right level of abstraction
- Use of named entities (cities, metros) that LLMs understand
- Leveraging of regional geographic knowledge
- Manageable scope per region
- **Preservation of market granularity through distinct statistical area assignments**

**Stage-2 (ZIP Expansion) enables:**
- Deterministic, reproducible ZIP assignments
- Use of official Census crosswalks (CBSA→ZIP, County→ZIP)
- Efficient processing of 40,000+ ZIPs nationally
- Clean separation of conceptual vs operational work

---

## Required References

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

**CRITICAL: If redundant markets exist (e.g., WA-VANCOUVER when OR-PORTLAND already covers integrated market), you must flag this as an error in the markets CSV, not attempt to map both to the same areas.**

---

## Regional Context (Know Your Region)

### Available Regions

| Region | States | Markets | Key Mapping Considerations |
|--------|--------|---------|---------------------------|
| Mountain West | CO, UT, ID, MT, WY, NV, NM, AZ (8) | 62 | Mountains separate CBSAs, Phoenix CBSA splits 4 ways, extreme distances |
| Southeast | NC, SC, GA, FL, AL, MS, TN, KY (8) | 71 | Car-dependent, Atlanta/Miami sprawl, Louisville cross-border, Northern KY to OH-CINCINNATI |
| Northeast | PA, NJ, NY, CT, MA, RI, VT, NH, ME (9) | 62 | NYC CBSA splits 6+ ways, congestion barriers, limited transit impact |
| Mid-Atlantic | MD, DC, DE, VA, WV (5) | 30 | DC-Baltimore CSA split, WMATA limited, Potomac/Chesapeake barriers |
| Texas & Plains | TX, OK, KS, MO, IA, NE, SD, ND, AR, LA (10) | 92 | Vast distances, Dallas/Houston split, cross-border markets |
| California | CA (1) | 42 | SF Bay 6+ CBSAs to 6-8 markets, LA Basin fragmentation, chronic congestion |
| Pacific Northwest | WA, OR (2) | 21 | Puget Sound water barriers, Cascade absolute separation, ferry-dependent areas |
| Midwest | IL, IN, OH, MI, WI, MN (6) | 55 | Chicago CBSA splits, OH-CINCINNATI cross-border, Great Lakes boundaries |

---

## Role Definition

You are acting as a **Health Economics and Geospatial Data Analyst** performing **conceptual market coverage modeling**.

Your expertise includes:
- Understanding CBSA definitions and their behavioral limitations
- Recognizing when large CBSAs must be split across multiple markets using counties or smaller statistical areas
- Knowing when counties better represent healthcare catchments
- Applying the 45-minute rule and travel friction logic
- Prioritizing behavioral realism over Census formalism
- **Ensuring each granular market receives distinct statistical area assignments**

---

## Scope of a Single Run

Each run applies to **one region only** (e.g., Mountain West, Southeast).

**Statistical Area Scope:**
- All CBSAs with centroid or significant geography within region's states
- Micropolitan areas within region's states
- Counties within region's states
- Cross-region statistical areas only if behaviorally justified (e.g., border markets)

**Market Scope:**
- Only use market_ids from `markets_<region>.csv`
- **Every market in the CSV must appear in the output**
- Cross-region market references allowed when documented (e.g., secondary referral to adjacent region's academic center)
- **If markets appear redundant, flag as data quality issue rather than mapping both to identical areas**

---

## Mapping Target Definition (Critical)

### Understanding the Hierarchy of Statistical Areas

**Option 1: Use CBSAs and Micropolitans (Preferred when they preserve granularity)**

If each market in a region has its own distinct CBSA or micropolitan:
```csv
OR-SALEM,CBSA,41420,Salem OR,primary
OR-EUGENE,CBSA,21660,Eugene-Springfield OR,primary
OR-CORVALLIS,CBSA,18700,Corvallis OR,primary
```
↑ Each market gets its own CBSA. Granularity preserved.

**Option 2: Use Counties (Required when large CBSA spans multiple markets)**

When a large CBSA (e.g., Seattle-Tacoma-Bellevue) contains multiple granular markets:
```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle portion
WA-SEATTLE-TACOMA,County,53053,Pierce County WA,primary,Tacoma portion
WA-SEATTLE-EVERETT,County,53061,Snohomish County WA,primary,Everett portion
```
↑ Counties split the CBSA to preserve market granularity.

**Option 3: Hybrid Approach (Use both when appropriate)**

Some markets use their own CBSA, others share a large CBSA and need county splits:
```csv
OR-PORTLAND,CBSA,38900,Portland-Vancouver-Hillsboro OR-WA,primary
WA-SEATTLE-MAIN,County,53033,King County WA,primary
WA-OLYMPIA,CBSA,36500,Olympia-Lacey-Tumwater WA,primary
```

### CRITICAL RULE: Large CBSAs That Span Multiple Markets

**When a single CBSA contains multiple proprietary markets, you MUST use finer-grained statistical areas (counties) to preserve market distinctions.**

**Example: Seattle-Tacoma-Bellevue CBSA (42660) contains 5 markets**

**WRONG (destroys granularity):**
```csv
WA-SEATTLE-MAIN,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-EASTSIDE,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-TACOMA,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-EVERETT,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-SOUTHKING,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
```
↑ All markets map to same CBSA. Distinction lost.

**CORRECT (preserves granularity using counties):**
```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core
WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,Eastside Bellevue Redmond Kirkland
WA-SEATTLE-SOUTHKING,County,53033,King County WA,primary,Renton Kent Federal Way south suburbs
WA-SEATTLE-TACOMA,County,53053,Pierce County WA,primary,Tacoma and Pierce County
WA-SEATTLE-EVERETT,County,53061,Snohomish County WA,primary,Everett and Snohomish County
```
↑ Each market maps to distinct counties or documented portions. Granularity preserved.

**Note on overlapping counties:**
- If multiple markets share a county (e.g., three Seattle markets all in King County), the rationale MUST specify which geographic portion
- Downstream ZIP expansion will use spatial analysis to split the county appropriately
- The goal here is conceptual clarity, not pixel-perfect boundaries

### Metropolitan vs Micropolitan Statistical Areas

**Metropolitan Statistical Areas:**
- Urban areas with 50,000+ population
- Example: Portland-Vancouver-Hillsboro, OR-WA Metro (CBSA 38900)
- Example: Eugene-Springfield, OR Metro (CBSA 21660)

**Micropolitan Statistical Areas:**
- Urban areas with 10,000-50,000 population
- Example: Bend, OR Micro (CBSA 13460)
- Example: Corvallis, OR Micro (CBSA 18700)

**Why CBSAs are preferred:**
- Anchor-city based (aligns with hospital referral behavior)
- Named entities (LLM can reason about them conceptually)
- Official Census definitions with stable codes
- Cover most US population
- Later expansion to ZIPs is deterministic via Census crosswalks

**Each CBSA must be identified by:**
- **statistical_area_type:** `CBSA`
- **statistical_area_id:** 5-digit CBSA code (e.g., `38900`)
- **statistical_area_name:** Official Census name (e.g., `Portland-Vancouver-Hillsboro, OR-WA`)

### County Usage Rules (Strict)

**You MUST use counties when:**
1. **A large CBSA spans multiple proprietary markets** (e.g., Seattle-Tacoma-Bellevue CBSA contains 5 distinct markets)
2. **No CBSA or micropolitan covers a rural market** (e.g., remote counties in Wyoming or Eastern Oregon)

**You MAY use counties when:**
3. **A market serves both a CBSA and surrounding non-CBSA areas** (list both the CBSA and the county remainder)

**You must NOT use counties when:**
- A distinct CBSA or micropolitan adequately represents the entire market
- Using a county would be redundant with an existing CBSA mapping

**When using county mappings:**
- **statistical_area_type:** `County`
- **statistical_area_id:** 5-digit FIPS code (e.g., `53033` for King County, WA)
- **statistical_area_name:** `[County Name] County, [State]` (e.g., `King County, WA`)

**County rationale must specify:**
- Why county is used instead of CBSA
- Which portion of the county if it's shared across multiple markets
- Whether it's the entire county or specific geographic areas

---

## Redundant Market Detection (Critical Quality Control)

**BEFORE you begin mapping, check for redundant markets in the CSV.**

### What Makes Markets Redundant?

Two markets are redundant if:
1. **They serve the same geographic area** (same CBSA, same counties, same population)
2. **They have the same anchor systems**
3. **No behavioral distinction exists** (no barrier, no travel friction, no distinct referral pattern)

**Example from Pacific Northwest:**
- `OR-PORTLAND` (Portland Metro, cross-border with Vancouver WA via MAX light rail)
- `WA-VANCOUVER` (Southwest Washington, "redundant if integrated via MAX")

**Problem:** The markets CSV notes indicate these may be redundant. You cannot map both to the same statistical areas without destroying the distinction.

### What To Do When You Find Redundancy

**DO NOT attempt to map redundant markets to different statistical areas just to preserve them.**

**Instead:**
1. **Flag the redundancy clearly in your output**
2. **Recommend removing the redundant market from the markets CSV**
3. **Map only the primary market** (e.g., OR-PORTLAND for the integrated Portland-Vancouver market)
4. **Document which market should be removed and why**

**Example output:**
```
# DATA QUALITY ISSUE: Redundant Markets Detected

## Issue
- OR-PORTLAND and WA-VANCOUVER appear to cover the same geographic area
- Both map to CBSA 38900 (Portland-Vancouver-Hillsboro, OR-WA)
- Markets CSV notes indicate WA-VANCOUVER is "redundant if integrated via MAX"
- No distinct statistical areas can be assigned to WA-VANCOUVER

## Recommendation
- Remove WA-VANCOUVER from markets CSV
- OR-PORTLAND adequately covers the integrated cross-border market
- If future analysis determines Vancouver WA should be separate, re-add with distinct catchment definition

## Mapping
- Only OR-PORTLAND is mapped below
- WA-VANCOUVER is excluded due to redundancy
```

---

## The "One Market, Multiple Statistical Areas" Pattern

### Pattern 1: Market Serves One Distinct CBSA
**Simplest case. Use when market = CBSA.**

```csv
OR-SALEM,CBSA,41420,Salem OR,primary,Metropolitan area represents entire state capital market
```

### Pattern 2: Market Serves CBSA Plus Surrounding Counties
**Use when market extends beyond CBSA boundaries.**

```csv
AZ-FLAGSTAFF,CBSA,22380,Flagstaff AZ,primary,Micropolitan area is core of market
AZ-FLAGSTAFF,County,04005,Coconino County AZ,primary,Remainder of county outside Flagstaff micro served by same facilities
```

### Pattern 3: Large CBSA Split Across Multiple Markets Using Counties
**Use when a single CBSA contains multiple granular markets.**

**The CBSA itself is NOT listed. Only the counties that split it.**

```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core portion of King County
WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,Eastside Bellevue Redmond Kirkland portion of King County
WA-SEATTLE-SOUTHKING,County,53033,King County WA,primary,Renton Kent Federal Way southern portion of King County
WA-SEATTLE-TACOMA,County,53053,Pierce County WA,primary,Tacoma and Pierce County separate from King County
WA-SEATTLE-EVERETT,County,53061,Snohomish County WA,primary,Everett and Snohomish County separate from King and Pierce
```

**Note:** Multiple markets share King County (53033). The rationale specifies which portion. Downstream spatial analysis will handle ZIP-level splits.

### Pattern 4: Market with Secondary Referral Relationships
**Use when a market refers complex cases to another market's academic center.**

```csv
OR-BEND,CBSA,13460,Bend OR,primary,Micropolitan area represents core Central Oregon market
OR-BEND,CBSA,38900,Portland-Vancouver-Hillsboro OR-WA,secondary,Complex tertiary cases referred to OHSU 160 miles west across Cascades
OR-BEND,CBSA,44060,Spokane-Spokane Valley WA,secondary,Some complex cases referred to Providence Sacred Heart 400 miles northeast
```

**Secondary relationships:**
- Document when residents travel >45 minutes for specialty/tertiary care
- Only include if supported by referral patterns
- Do not invent these; use regional prompt guidance

### Pattern 5: Rural County Without CBSA Coverage
**Use only when no CBSA or micropolitan exists.**

```csv
WY-SHERIDAN,County,56033,Sheridan County WY,primary,No CBSA covers Sheridan; county represents distinct healthcare catchment with local hospital
```

---

## Output File Specification

### Required Columns

| Column | Definition |
|--------|------------|
| market_id | Stable market identifier from markets CSV (e.g., OR-PORTLAND, WA-SEATTLE-MAIN) |
| statistical_area_type | `CBSA` or `County` |
| statistical_area_id | 5-digit CBSA code or 5-digit county FIPS |
| statistical_area_name | Official Census name |
| relationship_type | `primary` or `secondary` |
| mapping_rationale | 1-2 sentences explaining why this statistical area is assigned to this market |

### File Naming Convention

`market_to_statistical_area_<region>.csv`

Examples:
- `market_to_statistical_area_pacific_northwest.csv`
- `market_to_statistical_area_mountain_west.csv`

### Sorting

**Sort by market_id alphabetically, then by relationship_type (primary before secondary).**

---

## What You Must NOT Do

❌ **Do NOT map multiple granular markets to the same CBSA without county-level distinctions**
- If WA-SEATTLE-MAIN, WA-SEATTLE-EASTSIDE, WA-SEATTLE-TACOMA all map to CBSA 42660, the granularity is lost
- Use counties to preserve distinctions

❌ **Do NOT invent statistical area names**
- Use official Census CBSA names
- Use official county names with format: `[County] County, [ST]`
- Do NOT create nicknames or informal labels

❌ **Do NOT map redundant markets to different areas just to preserve them**
- If two markets serve the same geography, flag the redundancy
- Recommend removing the redundant market
- Do not force-fit artificial distinctions

❌ **Do NOT use counties as default when distinct CBSAs exist**
- CBSAs and micropolitans are preferred when they adequately represent the market
- Counties are for CBSA splits or rural areas without CBSA coverage
- Must justify county usage in rationale

❌ **Do NOT ignore market notes in the CSV**
- Market notes document catchment areas, barriers, and distinctions
- If notes say "ferry-dependent", "separated by Cascades", "distinct anchor system", honor those distinctions in statistical area assignments
- Regional prompts provide critical context

❌ **Do NOT leave markets unmapped**
- Every market in markets CSV must appear in output
- If a market appears impossible to map distinctly, flag as data quality issue

---

## Quality Control Checklist

### Per-Market Validation

Before finalizing each market's mappings, confirm:

1. ✅ **Primary areas truly reflect routine-care behavior**
   - Would residents of these statistical areas use this market for PCP visits?
   - Are the anchor hospitals for this market located in these areas?
   - Does this align with the ~45-minute travel threshold?

2. ✅ **This market has DISTINCT statistical area assignments from other markets**
   - If another market in this region maps to the same CBSA, have I used counties to split them?
   - If multiple markets share a county, have I specified which portion in the rationale?
   - Is the distinction behaviorally meaningful?

3. ✅ **Secondary areas represent realistic spillover**
   - Is there evidence of specialty referral from these areas?
   - Is it 45-60 minutes or accessible via transit?
   - Is this a documented referral pattern in regional prompts?

4. ✅ **County usage is clearly justified**
   - Is the county used because a large CBSA spans multiple markets?
   - OR is there genuinely no CBSA or micropolitan covering this area?
   - Does the rationale explain why county is necessary?

5. ✅ **All IDs and names are valid and real**
   - CBSA codes match official Census definitions
   - County FIPS codes are correct (5 digits)
   - Names match official Census naming conventions

6. ✅ **Rationale is specific and behavioral**
   - Does it explain which portion of a statistical area (if shared)?
   - Does it reference barriers, anchors, or travel patterns?
   - Is it 1-2 sentences, not a paragraph?

### Regional Validation

After mapping all markets, verify:

1. ✅ **Every market in markets CSV has at least one primary statistical area**
   - No orphaned markets
   - Every market_id from CSV appears in output

2. ✅ **Large CBSAs are split using counties when they contain multiple markets**
   - Seattle-Tacoma-Bellevue CBSA → 5 markets use counties
   - Phoenix CBSA → 4 markets use counties or smaller CBSAs
   - NYC CBSA → 6+ markets use counties or boroughs
   - Each market has distinct county assignments

3. ✅ **No two markets map to identical statistical areas without clear distinction**
   - If two markets both map to "King County, WA", the rationale specifies different portions
   - If two markets both map to the same CBSA, one should be flagged as redundant
   - Geographic or behavioral distinction is clear

4. ✅ **Cross-border CBSAs properly documented**
   - OR-PORTLAND includes Portland-Vancouver CBSA spanning OR/WA
   - Louisville KY-IN CBSA properly assigned
   - Cincinnati OH-KY-IN CBSA properly assigned
   - State borders respected unless CBSA explicitly crosses

5. ✅ **Regional barriers reflected in mappings**
   - Cascade Mountains: Eastern and Western markets use different statistical areas
   - Puget Sound ferries: Ferry-dependent areas use separate counties or CBSAs
   - Water barriers: Markets on opposite sides use different statistical areas

6. ✅ **Redundant markets flagged**
   - If OR-PORTLAND and WA-VANCOUVER both map to CBSA 38900, flag redundancy
   - Recommend which market to keep
   - Do not force artificial distinctions

7. ✅ **Statistical area coverage is reasonable**
   - Most population centers are covered
   - No major CBSAs accidentally omitted
   - County fallbacks are justified
   - Rural areas without CBSAs use counties appropriately

---

## Example Mappings (Corrected)

### Example 1: Simple Market with One Distinct CBSA
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
OR-SALEM,CBSA,41420,Salem OR,primary,Metropolitan area represents entire state capital market 50 miles south of Portland with Salem Health anchor
```

### Example 2: Market Serving CBSA Plus Surrounding Rural Counties
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
OR-BEND,CBSA,13460,Bend OR,primary,Micropolitan area represents core Central Oregon market anchored by St. Charles Health System
OR-BEND,County,41017,Deschutes County OR,primary,Remainder of county outside Bend micro served by same St. Charles facilities
```

### Example 3: Large CBSA Split Across Multiple Markets Using Counties (CORRECTED)
**This is the critical pattern for preserving granularity.**

```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core with UW Medicine Swedish Virginia Mason Harborview anchors
WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,Eastside Bellevue Redmond Kirkland across Lake Washington via I-90 SR-520 bridges
WA-SEATTLE-SOUTHKING,County,53033,King County WA,primary,South King County including Renton Kent Federal Way with Valley Medical Center anchor
WA-SEATTLE-TACOMA,County,53053,Pierce County WA,primary,Tacoma and Pierce County 35 miles south with distinct MultiCare and CHI Franciscan systems
WA-SEATTLE-EVERETT,County,53061,Snohomish County WA,primary,Everett and Snohomish County 30 miles north with Providence Regional anchor
```

**Note:** No direct CBSA 42660 mapping appears. The large CBSA is decomposed into constituent counties to preserve market granularity.

### Example 4: Cross-Border Integrated Market
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
OR-PORTLAND,CBSA,38900,"Portland-Vancouver-Hillsboro, OR-WA",primary,Cross-border metropolitan area integrated by MAX light rail and I-5 I-205 bridges serving both Portland OR and Vancouver WA
```

### Example 5: Market with Secondary Referral (Specialty Care)
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
OR-MEDFORD,CBSA,32780,Medford OR,primary,Metropolitan area represents southern Oregon Rogue Valley market anchored by Asante Health System
OR-MEDFORD,CBSA,38900,"Portland-Vancouver-Hillsboro, OR-WA",secondary,Complex tertiary cases referred to OHSU in Portland 270 miles north
```

### Example 6: Ferry-Dependent Peninsula (Separate Due to Water Barrier)
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
WA-BREMERTON,CBSA,14740,"Bremerton-Silverdale-Port Orchard, WA",primary,Ferry-dependent Kitsap Peninsula metropolitan area separated from Seattle by 60-minute Puget Sound ferry crossing
```

### Example 7: Rural County Without CBSA Coverage
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
WA-SANJUAN,County,53055,San Juan County WA,primary,Island county accessible only by ferry with local critical access hospital serving resident population
```

### Example 8: Eastern Market Separated by Mountain Barrier
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
WA-SPOKANE,CBSA,44060,"Spokane-Spokane Valley, WA",primary,Eastern Washington metropolitan hub separated from Seattle by Cascade Mountains serving 550K metro and vast rural catchment
WA-SPOKANE,County,16055,Kootenai County ID,secondary,Some cross-border referral from Coeur d Alene ID 30 miles east
```

---

## Execution Checklist

### Before Starting

- [ ] Load `master_market.md` (national framework, 45-minute rule)
- [ ] Load `markets_<region>.md` (regional mobility factors, documented splits, barriers)
- [ ] Load `markets_<region>.csv` (valid market_ids and notes on catchment areas)
- [ ] Obtain Census CBSA definitions for region's states
- [ ] Obtain county FIPS codes for region's states
- [ ] Review which large CBSAs must be split across multiple markets
- [ ] Identify any potentially redundant markets before mapping

### During Mapping

- [ ] Map each market to appropriate statistical areas (CBSAs preferred, counties when needed)
- [ ] When multiple markets share a large CBSA, use counties to split them
- [ ] Ensure each market has DISTINCT statistical area assignments
- [ ] Use micropolitan CBSAs where they exist
- [ ] Use county fallback when CBSA is too broad OR no CBSA exists
- [ ] Assign secondary relationships only with evidence from regional prompts
- [ ] Document cross-border CBSAs properly
- [ ] Flag redundant markets rather than forcing artificial distinctions
- [ ] Specify which portion of shared counties in rationale

### After Mapping

- [ ] Verify every market from CSV has at least one primary statistical area
- [ ] Verify large CBSAs are split using counties across multiple markets
- [ ] Verify no two markets have identical statistical area assignments without clear distinction
- [ ] Verify cross-border CBSAs properly assigned
- [ ] Verify county usage is justified in each rationale
- [ ] Verify all CBSA codes and county FIPS codes are correct
- [ ] Verify redundant markets are flagged (if any)
- [ ] Sort output by market_id alphabetically
- [ ] Generate clean CSV file

---

## Final Instruction

Output **only** the completed `market_to_statistical_area_<region>.csv` file.

**Format:**
```
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
[rows sorted by market_id alphabetically]
```

**If redundant markets detected, include a comment block at the top:**
```
# DATA QUALITY ISSUE: Redundant Markets Detected
# [Explanation of redundancy]
# [Recommendation to remove specific market(s)]
# [Only non-redundant markets mapped below]
```

**This file will be used as the sole conceptual input to deterministic ZIP expansion.** The downstream process will:
1. Take each statistical area-to-market mapping
2. Look up all ZIPs in that CBSA or county (Census crosswalk)
3. Assign those ZIPs to the mapped market(s)
4. Handle shared counties using spatial analysis based on rationale notes

**Your responsibility at this stage:**
- Identify which statistical areas each market serves (conceptually)
- Ensure each market has DISTINCT statistical area assignments
- Use counties to split large CBSAs across multiple granular markets
- Flag redundant markets rather than mapping both to identical areas
- Provide clear behavioral rationale for each assignment
- Enable clean deterministic expansion later

**NOT your responsibility at this stage:**
- Enumerate specific ZIP codes
- Determine exactly where within a county the split occurs
- Perform spatial analysis or distance calculations
- Resolve data quality issues in the markets CSV (flag them instead)

**Prioritize:**
1. **Preservation of market granularity** (each market gets distinct statistical areas)
2. Behavioral realism (does this statistical area truly serve this market?)
3. Use of official Census entities (CBSAs preferred, counties when CBSA is too broad)
4. Clear rationale for each assignment (enables validation and ZIP expansion)
5. Flagging data quality issues (redundant markets, impossible mappings)

The goal is to answer: **"Which named statistical areas (CBSAs, micropolitans, counties) are part of each healthcare market's catchment area, such that each market has DISTINCT coverage?"**
