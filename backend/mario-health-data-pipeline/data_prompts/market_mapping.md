# Mapping Prompt: Census Statistical Areas → Healthcare Shopping Zones

## Purpose
This prompt defines the **standardized methodology** for creating the census-to-market mapping file:

> **Mapping US Census statistical areas (CBSAs and CSAs) to proprietary Healthcare Shopping Zones** defined in regional `markets_<region>.csv` files.

This mapping operationalizes the conceptual markets for analytics, network adequacy, leakage analysis, and employer-based reporting.

---

## How This Prompt Relates to Other Prompts

### Required References
You must explicitly reference:

1. **National Base Prompt – Healthcare Market Master (`master_market.md`)**  
   - Governs market philosophy, scale, and realism
   - Defines 45-minute rule and behavioral principles
2. **Regional Market Prompt (`markets_<region>.md`)**  
   - Provides region-specific geography, transit, and anchor context
   - Documents regional mobility factors
3. **Regional Market Output (`markets_<region>.csv`)**  
   - Authoritative list of valid `market_id` values for this region
   - **Do not invent new markets during mapping**

---

## Prompt Architecture Decision (Important)

### ✅ Use **ONE mapping prompt per region**

**Rationale:**
- Mapping logic is highly region-specific (transit, congestion, borders)
- Regional market files already exist (`markets_<region>.csv`)
- Prevents cross-region logic bleed
- Easier QA and revision control

Each mapping prompt should only map Census areas that **geographically intersect** that region.

**Regional Files:**
1. Mountain West (8 states: CO, UT, ID, MT, WY, NV, NM, AZ) - 62 markets
2. Southeast (8 states: NC, SC, GA, FL, AL, MS, TN, KY) - 71 markets
3. Northeast (9 states: PA, NJ, NY, CT, MA, RI, VT, NH, ME) - 62 markets
4. Mid-Atlantic (5 states: MD, DC, DE, VA, WV) - 30 markets
5. Texas & Plains (10 states: TX, OK, KS, MO, IA, NE, SD, ND, AR, LA) - 92 markets
6. California (1 state: CA) - 42 markets
7. Pacific Northwest (2 states: WA, OR) - 21 markets
8. Midwest (6 states: IL, IN, OH, MI, WI, MN) - 55 markets

**Total:** 435 markets covering 49 states + DC (excluding AK, HI)

---

## Role Definition

You are a **Health Economics and Geospatial Data Analyst** responsible for translating **statistical geographies** into **behavioral healthcare markets**.

You understand:
- CBSA and CSA definitions and limitations
- Patient flow and referral behavior
- Travel-time friction and modal asymmetry
- When overlaps are meaningful vs misleading
- Cross-border healthcare utilization patterns

Your job is not to simplify – it is to **accurately represent reality**.

---

## Input Files (Per Region)

You will be given:
- `markets_<region>.csv` (market master for the region)
- A list of CBSAs and CSAs that fall within or touch the region
- US Census CBSA/CSA definitions and geographic boundaries

---

## Output File Specification

### File name

```text
census_to_market_<region>.csv
```

### Required Columns

| Column | Definition | Example |
|--------|------------|---------|
| census_id | 5-digit CBSA code or 3-digit CSA code | 38060 |
| census_name | Official Census name | Phoenix-Mesa-Chandler, AZ |
| census_type | CBSA or CSA | CBSA |
| market_id | Market ID from `markets_<region>.csv` | AZ-PHOENIX-EAST |
| relationship_type | primary / secondary / tertiary | primary |
| mapping_rationale | ≤1 sentence justification | Mesa residents primarily use East Valley hospitals within 20-min drive |

### Additional Validation Columns (Optional)

| Column | Definition | Example |
|--------|------------|---------|
| population_estimate | CBSA/CSA population (if available) | 4,948,203 |
| primary_counties | Major counties in CBSA | Maricopa County |

---

## Core Mapping Rules (Mandatory)

### 1. Many-to-Many Mapping Is Allowed and Expected

- A single CBSA **may map to multiple markets** (e.g., large sprawling metros)
- A market will typically receive multiple CBSAs
- This is not an error – it reflects real healthcare behavior

**Example:**
```csv
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-CENTRAL,primary,Downtown Phoenix residents use central medical district
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-EAST,primary,Mesa and Tempe residents use East Valley hospitals
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-WEST,primary,Glendale residents use West Valley hospitals
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-NORTH,primary,Northern suburbs use North Valley hospitals
```

### 2. Primary vs Secondary vs Tertiary

Use the following definitions strictly:

- **Primary**: Where most residents seek routine care (PCP, imaging, labs, common procedures)
  - Must be within ~45 minutes door-to-door
  - Majority of routine visits go here
  - Usually 1-3 primary markets per CBSA

- **Secondary**: Common spillover for specialty care or alternative routine access
  - May be 45-60 minutes away
  - Used for specialists, second opinions, certain procedures
  - Strong referral relationships exist
  - Usually 0-3 secondary markets per CBSA

- **Tertiary**: Selective use for advanced/quaternary services only
  - Typically academic medical centers
  - Used for complex cases, rare conditions, clinical trials
  - May be 60+ minutes away
  - Usually 0-2 tertiary markets per CBSA

**Mapping Requirements:**
- Each CBSA should have **at least one primary** market
- Large CBSAs may have **multiple primary** markets (split by geography)
- Secondary and tertiary are optional based on actual referral patterns

**Example of Mixed Mapping:**
```csv
17140,Cincinnati OH-KY-IN,CBSA,OH-CINCINNATI,primary,Core market serving Cincinnati metro and Northern Kentucky
17140,Cincinnati OH-KY-IN,CBSA,KY-LEXINGTON,secondary,Some Northern KY residents use UK HealthCare for specialty
17140,Cincinnati OH-KY-IN,CBSA,OH-COLUMBUS,tertiary,Complex cases referred to OSU Wexner for quaternary care
```

### 3. Respect the 45-Minute Rule

If routine travel between a CBSA and a market:
- Exceeds ~45 minutes in moderate weekday traffic
- Requires multiple bridge/tunnel crossings with congestion
- Requires multiple transit transfers

Then that market **cannot** be primary (may be secondary or tertiary).

**Clock the Journey Realistically:**
- Include parking time (5-10 minutes in urban areas)
- Include walking from parking (3-5 minutes)
- Use Google Maps "typical traffic" for 9am Tuesday or 2pm Wednesday
- Account for regional congestion patterns documented in regional prompts

### 4. Transit Asymmetry Matters

- One-directional transit (e.g., suburb → core via commuter rail) may justify secondary mapping
- Reverse or off-peak difficulty limits routine-care relevance
- Limited station coverage near hospitals reduces practical utility

**Do not assume bidirectional equivalence.**

**Example:**
- Metro-North (NYC): Commuters can access Manhattan hospitals via subway transfer → Secondary
- MARC (Baltimore-DC): Peak-direction only, poor reverse → Does NOT enable primary access

### 5. CSA Handling Rules

**CRITICAL:** CSAs are often too large to represent healthcare markets.

- CSAs should **not** be used as the primary unit of analysis
- Map at the **CBSA level** whenever possible
- Use CSAs only when:
  - A smaller CBSA needs context about its larger metro connection
  - Documentation purposes (noting which CSA a CBSA belongs to)
  - Legacy reporting requires CSA aggregation

**Most mappings should occur at the CBSA level.**

**Example of CSA Usage:**
```csv
# Map the individual CBSAs, not the CSA
31080,Los Angeles-Long Beach-Anaheim CA,CBSA,CA-LA-CENTRAL,primary,Downtown and central LA
31100,Santa Ana-Anaheim-Irvine CA,CBSA,CA-LA-ORANGE,primary,Orange County distinct market
40140,Riverside-San Bernardino-Ontario CA,CBSA,CA-INLANDEMPIRE-WEST,primary,Inland Empire separate from LA
# CSA would be too large: Los Angeles-Long Beach CSA includes all of above + more
```

---

## Special Mapping Scenarios

### Scenario 1: Large Sprawling CBSAs

**When a CBSA spans multiple healthcare markets:**
- Create **multiple primary mappings** to different markets
- Use geographic qualifiers in rationale
- Ensure complete coverage (all areas assigned)

**Example: Phoenix CBSA**
```csv
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-CENTRAL,primary,Downtown and central Phoenix residents
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-EAST,primary,Mesa Tempe Scottsdale Chandler Gilbert residents
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-WEST,primary,Glendale Peoria Surprise Goodyear residents
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-NORTH,primary,Anthem Cave Creek northern suburbs
```

### Scenario 2: Cross-Border CBSAs

**When a CBSA spans state lines:**
- Map to the market that actually serves residents
- Reference cross-border market notes in regional CSV
- State borders may create hard splits for Medicaid/licensing

**Example: Cincinnati CBSA**
```csv
17140,Cincinnati OH-KY-IN,CBSA,OH-CINCINNATI,primary,Integrated metro serving both Ohio and Northern Kentucky sides
# Note: OH-CINCINNATI market explicitly covers Northern KY (per Midwest region)
# Southern/Central KY (Louisville, Lexington) NOT covered by Cincinnati
```

### Scenario 3: Small CBSAs Near Large Markets

**When a small CBSA is near but not part of large metro:**
- Primary = local market if residents stay local for routine care
- Secondary = large metro if strong referral/specialty patterns
- Do NOT assume proximity = integration

**Example: Prescott, AZ**
```csv
39140,Prescott Valley-Prescott AZ,CBSA,AZ-PRESCOTT,primary,Prescott residents use local Yavapai Regional Medical Center
39140,Prescott Valley-Prescott AZ,CBSA,AZ-PHOENIX-CENTRAL,secondary,Complex cases referred to Phoenix academic centers
39140,Prescott Valley-Prescott AZ,CBSA,AZ-FLAGSTAFF,tertiary,Some residents use Flagstaff for specialty care
```

### Scenario 4: Rural CBSAs with Limited Access

**When a CBSA has minimal local healthcare infrastructure:**
- Primary = nearest regional hub within reasonable distance
- May have 60+ minute primary access (frontier reality)
- Document distance in rationale

**Example: Eastern Montana**
```csv
# Rural CBSA with limited infrastructure
[census_id],[census_name],CBSA,MT-BILLINGS,primary,Eastern Montana hub serves 100+ mile catchment as closest tertiary center
```

### Scenario 5: Micropolitan Areas

**When Census includes Micropolitan Statistical Areas:**
- Apply same logic as CBSAs
- These are smaller markets but still need mapping
- Often map to regional hub markets

---

## Mapping Heuristics (Use Consistently)

You may rely on:

### Evidence of Healthcare Behavior
- **Dominant hospital systems** used by residents (via market share data if available)
- **Known referral flows** (where local providers send patients)
- **Insurance network structures** (which systems are in-network for local employers)
- **Ambulance service areas** (where EMS transports patients)

### Geographic Factors
- **Distance and travel time** under typical conditions
- **Natural barriers** (water, mountains, deserts)
- **Man-made barriers** (limited bridge/tunnel crossings, toll roads)
- **State borders** (Medicaid, licensing, network design)

### System Behavior
- **Hospital system service areas** (where systems market and build facilities)
- **Academic medical center catchments** (tertiary/quaternary referral areas)
- **Historical patterns** (established relationships over decades)

### Regional Documentation
- **Regional prompt mobility factors** (congestion, transit, terrain)
- **Market notes** in regional CSV (document specific catchments)
- **Cross-border market designations** (explicitly documented integrations)

**Avoid:**
- Speculative or aspirational mappings
- Assuming proximity = integration
- Ignoring documented barriers
- Creating mappings based on "should" vs "do"

---

## Quality Validation Rules

### Before Finalizing Mappings

**CBSA-Level Validation:**
1. ✅ Does every CBSA have at least one primary market?
2. ✅ Are multiple primary markets justified by size/sprawl?
3. ✅ Are secondary/tertiary markets based on real referral patterns?
4. ✅ Does the 45-minute rule hold for primary markets?
5. ✅ Are cross-border CBSAs properly mapped?

**Market-Level Validation:**
1. ✅ Does every market in the regional CSV appear in at least one mapping?
2. ✅ Are market populations reasonable given CBSA populations?
3. ✅ Do market catchments align with market notes in regional CSV?

**Regional Validation:**
1. ✅ Do mappings respect regional mobility factors (congestion, transit, terrain)?
2. ✅ Are water barriers (bays, rivers) properly reflected?
3. ✅ Are mountain barriers (passes, elevation) properly reflected?
4. ✅ Are state borders respected (except documented cross-border markets)?

**Cross-Regional Validation:**
1. ✅ Do cross-border CBSAs only map to markets in appropriate regions?
2. ✅ Are mappings consistent with documented cross-border markets (e.g., OH-CINCINNATI covers Northern KY)?
3. ✅ No duplicate mappings across regions for same CBSA?

---

## Special Considerations by Region

### Mountain West (CO, UT, ID, MT, WY, NV, NM, AZ)
- **Mountains create hard barriers:** Passes close in winter, 2-4 hour drives
- **Extreme distances:** 100-200+ miles between hubs is normal
- **Phoenix sprawl:** Single CBSA maps to 4 markets (Central, East, North, West)
- **Tucson separate:** Despite same state, 120 miles from Phoenix = separate
- **Frontier reality:** Some CBSAs have 60+ min primary access (accepted for specialty)

### Southeast (NC, SC, GA, FL, AL, MS, TN, KY)
- **Car-dependent:** Transit does NOT reduce friction (except minimal MARTA, Metrorail)
- **Extreme sprawl:** Atlanta, Miami, Tampa have severe intra-metro friction
- **Linear coasts:** Florida I-95 and Gulf Coast are not integrated despite proximity
- **Louisville:** Spans into Indiana via bridges (integrated cross-border)
- **Northern Kentucky:** OH-CINCINNATI covers Covington/Newport (do NOT duplicate in Southeast)

### Northeast (PA, NJ, NY, CT, MA, RI, VT, NH, ME)
- **Congestion dominates:** I-95 corridor, NYC bridges, Boston tunnels
- **NYC splits required:** Manhattan, Brooklyn, Queens, Bronx, NJ, Westchester, Long Island
- **Transit matters:** Red Line (Boston), NYC Subway can reduce friction WHERE stations exist
- **Commuter rail:** Metro-North, NJ Transit, LIRR are peak-direction (not medical access)
- **Water barriers:** East River, Hudson River, Long Island Sound create hard splits

### Mid-Atlantic (MD, DC, DE, VA, WV)
- **WMATA Metro:** Reduces friction DC ↔ Arlington/Alexandria ↔ Bethesda (LIMITED area)
- **Baltimore separate:** 45+ min from DC, no transit, completely independent
- **Potomac River:** Multiple bridges but still creates friction
- **Chesapeake Bay:** Bay Bridge is bottleneck to Eastern Shore MD
- **Appalachian terrain:** Western MD, WV mountains create isolation

### Texas & Plains (TX, OK, KS, MO, IA, NE, SD, ND, AR, LA)
- **Vast distances:** 100-200+ miles between regional hubs
- **Dallas-Fort Worth:** Polycentric metro requires splits
- **Houston sprawl:** Directional splits (North, South, East, West, Medical Center)
- **Cross-border markets:** MO-STLOUIS (MO/IL), MO-KANSASCITY (KS/MO), ND-FARGO (ND/MN)
- **Oil/energy economy:** Boom-bust affects healthcare infrastructure

### California (CA)
- **SF Bay Area:** 6-8 markets (SF, Oakland, Peninsula, South Bay, East Bay, North Bay)
- **LA Basin:** 10-12 markets (extreme fragmentation by basin/valley)
- **I-405, I-5, I-10:** Chronic congestion creates intra-metro barriers
- **San Diego:** 2-3 markets despite being "single" metro
- **Central Valley:** Linear development, separate markets every 40-60 miles

### Pacific Northwest (WA, OR)
- **Puget Sound water barriers:** Seattle, Eastside (Bellevue), Tacoma may be separate
- **Cascade Mountains:** Absolute east-west barrier (3+ hour drives, winter closures)
- **Portland-Vancouver:** OR-PORTLAND integrates with Vancouver WA via MAX light rail
- **Ferry-dependent:** Bremerton, Bainbridge, Whidbey Island are separate markets
- **Eastern WA/OR:** Separate from Western WA/OR (Spokane, Tri-Cities independent)

### Midwest (IL, IN, OH, MI, WI, MN)
- **Chicago splits:** City + suburban rings (6-10 markets for metro)
- **Great Lakes:** Water creates barriers (lake effect, limited crossings)
- **OH-CINCINNATI:** Covers Northern Kentucky (Covington, Newport) - cross-border
- **Detroit:** Multiple markets due to sprawl and system competition
- **Minneapolis:** Currently single market but may warrant split review

---

## What NOT to Do

❌ **Do NOT create new market_ids**
- Only use market_ids from `markets_<region>.csv`
- If you think a market is missing, flag it but do NOT invent

❌ **Do NOT force CBSAs into single markets if behavior is split**
- Large sprawling metros SHOULD map to multiple primary markets
- Phoenix, LA, NYC, Chicago, Atlanta, Dallas, Houston all split

❌ **Do NOT assume CSA = market**
- CSAs are statistical constructs, often too large
- Map at CBSA level

❌ **Do NOT write verbose explanations**
- Rationale should be ≤1 sentence (concise, factual)

❌ **Do NOT assume proximity = integration**
- Check 45-minute rule, barriers, state borders
- Nearby does NOT mean same market

❌ **Do NOT ignore documented barriers**
- Regional prompts document congestion, water, mountains, state borders
- Market CSV notes document specific catchments
- Honor documented cross-border markets (OH-CINCINNATI, OR-PORTLAND, etc.)

---

## Self-Validation Checklist (Per CBSA)

Before finalizing each mapping:

**Routine Care Test:**
1. ✅ Would residents actually drive to this market for PCP visits?
2. ✅ Is the journey <45 minutes door-to-door in typical traffic?
3. ✅ Are there hospital systems in this market that residents recognize/use?

**Behavioral Realism Test:**
1. ✅ Does this mapping align with known referral patterns?
2. ✅ Would a local provider agree with this assignment?
3. ✅ Does this match insurance network structures?

**Regional Context Test:**
1. ✅ Does this honor mobility factors in regional prompt?
2. ✅ Does this align with market notes in regional CSV?
3. ✅ Are barriers (water, mountains, borders) respected?

**Completeness Test:**
1. ✅ Is this CBSA fully covered by primary market(s)?
2. ✅ Are secondary/tertiary justified or just speculative?
3. ✅ If multiple primary markets, is the split geographically logical?

---

## Output Format

### CSV Structure
```csv
census_id,census_name,census_type,market_id,relationship_type,mapping_rationale
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-CENTRAL,primary,Downtown Phoenix residents use central medical district within 30-min
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-EAST,primary,Mesa Tempe Scottsdale residents use East Valley hospitals within 30-min
```

### Sorting
- Sort by `census_id` (ascending)
- Within same `census_id`, sort by `relationship_type` (primary, secondary, tertiary)
- Within same relationship type, sort by `market_id` (alphabetical)

### File Naming
```
census_to_market_mountainwest.csv
census_to_market_southeast.csv
census_to_market_northeast.csv
census_to_market_midatlantic.csv
census_to_market_texasplains.csv
census_to_market_california.csv
census_to_market_pacificnorthwest.csv
census_to_market_midwest.csv
```

---

## Example Mappings

### Example 1: Large Sprawling CBSA (Phoenix)
```csv
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-CENTRAL,primary,Downtown and central Phoenix residents use central medical district
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-EAST,primary,Mesa Tempe Scottsdale residents use East Valley hospitals 30-45 min from downtown
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-WEST,primary,Glendale Peoria Surprise residents use West Valley hospitals 30-45 min from downtown
38060,Phoenix-Mesa-Chandler AZ,CBSA,AZ-PHOENIX-NORTH,primary,Anthem Cave Creek residents use North Valley hospitals 30-40 min from downtown
```

### Example 2: Cross-Border CBSA (Cincinnati)
```csv
17140,Cincinnati OH-KY-IN,CBSA,OH-CINCINNATI,primary,Integrated metro serving both Ohio and Northern Kentucky via I-75 bridges
17140,Cincinnati OH-KY-IN,CBSA,KY-LEXINGTON,secondary,Some Northern KY residents use UK HealthCare for specialty care 80 miles south
```

### Example 3: Regional Hub with Tertiary (Louisville)
```csv
31140,Louisville/Jefferson County KY-IN,CBSA,KY-LOUISVILLE-METRO,primary,Core Louisville and southern Indiana residents use Norton Baptist UofL systems
31140,Louisville/Jefferson County KY-IN,CBSA,KY-LOUISVILLE-EAST,primary,Oldham County eastern suburbs use Brownsboro corridor hospitals
31140,Louisville/Jefferson County KY-IN,CBSA,TN-NASHVILLE,secondary,Some complex cases referred to Vanderbilt 180 miles south
```

### Example 4: Small CBSA Near Large Metro (Prescott)
```csv
39140,Prescott Valley-Prescott AZ,CBSA,AZ-PRESCOTT,primary,Residents use Yavapai Regional Medical Center 100 miles from Phoenix
39140,Prescott Valley-Prescott AZ,CBSA,AZ-PHOENIX-CENTRAL,secondary,Complex specialty cases referred to Phoenix academic centers
```

### Example 5: Separate Despite Proximity (Tucson)
```csv
46060,Tucson AZ,CBSA,AZ-TUCSON,primary,Residents use Banner UMC Tucson and TMC Healthcare locally
46060,Tucson AZ,CBSA,AZ-PHOENIX-CENTRAL,secondary,Complex tertiary cases referred to Phoenix Mayo Clinic 120 miles north
# Note: Despite being in same state, 120 miles and 2 hours creates separate primary markets
```

---

## Execution Instructions

For each region:

1. **Load regional context:**
   - Read `master_market.md` (national framework)
   - Read `markets_<region>.md` (regional mobility factors)
   - Read `markets_<region>.csv` (valid market_ids)

2. **Obtain Census data:**
   - List all CBSAs that geographically intersect the region
   - Note CSAs for context but map primarily at CBSA level

3. **Create mappings:**
   - For each CBSA, determine primary market(s)
   - Add secondary markets where referral patterns justify
   - Add tertiary markets only for documented academic referral centers
   - Write concise rationale (≤1 sentence)

4. **Validate:**
   - Check every CBSA has at least one primary
   - Check every market appears in at least one mapping
   - Check 45-minute rule for primary mappings
   - Check regional mobility factors honored

5. **Output:**
   - CSV with required columns
   - Sorted by census_id, then relationship_type, then market_id
   - File named `census_to_market_<region>.csv`

---

## Final Instruction

**Accuracy and interpretability matter more than elegance.**

These mappings will be used for:
- Network adequacy analysis (checking provider coverage)
- Market sizing (calculating market populations)
- Leakage analysis (identifying care seeking outside market)
- Employer reporting (assigning employees to markets)

**Getting this wrong has real consequences.** Be thorough, be precise, honor the documented barriers and mobility factors, and represent actual healthcare behavior.
