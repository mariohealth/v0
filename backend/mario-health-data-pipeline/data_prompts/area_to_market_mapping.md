# Execution Prompt: Stage-1 Mapping — Proprietary Markets → Statistical Areas

## Purpose

This prompt executes **Stage-1 of the healthcare market mapping workflow**.

Your task is to map **proprietary Healthcare Shopping Zones (markets)** to **named statistical areas** in a way that is behaviorally realistic, LLM-tractable, and suitable for later deterministic expansion to ZIP codes.

This prompt **does not enumerate ZIPs** and must not attempt ZIP-level reasoning. The output serves as conceptual input for a separate deterministic ZIP expansion process.

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

3. **Operational Layer (Next Stage):** ZIP Codes
   - Deterministic expansion from statistical areas
   - Performed outside LLM using Census crosswalks
   - Not part of this prompt

**Your Goal at This Stage:**
> "Which named statistical areas are realistically served by this market for routine and specialty care?"

**NOT:**
> "Which specific ZIP codes should map to this market?" (that comes later)

---

## Why This Staged Approach?

**Stage-1 (Statistical Areas) enables:**
- Conceptual reasoning at the right level of abstraction
- Use of named entities (cities, metros) that LLMs understand
- Leveraging of regional geographic knowledge
- Manageable scope per region

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

2. **Regional Market Prompt (`markets_<region>_UPDATED.md`)**
   - Defines region-specific geography, transit, and known market splits
   - Documents congestion corridors, water barriers, mountain passes
   - Explains regional mobility factors

3. **Regional Market File (`markets_<region>_COMPLETE.csv`)**
   - Authoritative list of valid `market_id` values for this region
   - Market notes contain catchment area guidance
   - **Total: 435 markets across 8 regions covering 49 states + DC**

**You may not create, rename, merge, or split markets during this mapping process.**

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
- Recognizing when CBSAs must be split across multiple markets
- Knowing when counties better represent healthcare catchments
- Applying the 45-minute rule and travel friction logic
- Prioritizing behavioral realism over Census formalism

---

## Scope of a Single Run

Each run applies to **one region only** (e.g., Mountain West, Southeast).

**Statistical Area Scope:**
- All CBSAs with centroid or significant geography within region's states
- Micropolitan areas within region's states
- Counties within region's states (fallback only, see rules)
- Cross-region statistical areas only if behaviorally justified (e.g., border markets)

**Market Scope:**
- Only use market_ids from `markets_<region>_COMPLETE.csv`
- Cross-region market references allowed when documented (e.g., secondary referral to adjacent region's academic center)

---

## Mapping Target Definition (Critical)

### Primary Mapping Unit: Core-Based Statistical Areas (CBSAs)

**Preferred mapping targets are named CBSAs, including:**

**Metropolitan Statistical Areas:**
- Urban areas with 50,000+ population
- Example: Phoenix-Mesa-Chandler, AZ Metro (CBSA 38060)
- Example: Louisville/Jefferson County, KY-IN Metro (CBSA 31140)

**Micropolitan Statistical Areas:**
- Urban areas with 10,000-50,000 population
- Example: Flagstaff, AZ Micro (CBSA 22380)
- Example: Prescott Valley-Prescott, AZ Micro (CBSA 39140)

**Why CBSAs are preferred:**
- Anchor-city based (aligns with hospital referral behavior)
- Named entities (LLM can reason about them conceptually)
- Official Census definitions with stable codes
- Cover most US population
- Later expansion to ZIPs is deterministic via Census crosswalks

**Each CBSA must be identified by:**
- **statistical_area_type:** `CBSA`
- **statistical_area_id:** 5-digit CBSA code (e.g., `38060`)
- **statistical_area_name:** Official Census name (e.g., `Phoenix-Mesa-Chandler, AZ`)

### Important: Large CBSAs May Map to Multiple Markets

**Critical Understanding:**
Many large CBSAs are NOT single healthcare markets. You must recognize this and map accordingly.

**Examples of CBSAs that split across multiple markets:**

**Phoenix-Mesa-Chandler, AZ (CBSA 38060) → 4 markets:**
```csv
AZ-PHOENIX-CENTRAL,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Downtown and central Phoenix
AZ-PHOENIX-EAST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Tempe Mesa Scottsdale Chandler Gilbert portions
AZ-PHOENIX-WEST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Glendale Peoria Surprise Goodyear portions
AZ-PHOENIX-NORTH,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Anthem Cave Creek northern portions
```

**New York-Newark-Jersey City, NY-NJ-PA (CBSA 35620) → 6+ markets:**
```csv
NY-NYC-MANHATTAN,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Manhattan core
NY-NYC-BROOKLYN,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Brooklyn portion
NY-NYC-QUEENS,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Queens portion
NJ-NORTHJERSEY,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Northern NJ portion
NY-WESTCHESTER,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Westchester County portion
# etc.
```

**This is expected and correct.** Do NOT force one CBSA → one market.

### County Fallback Rule (Strict and Limited)

**You may map a market to individual counties ONLY when no CBSA adequately represents the population served.**

**County fallback is allowed ONLY if all of the following are true:**

1. **The geography is not part of any CBSA or micropolitan area**, OR
2. **The existing CBSA is behaviorally meaningless** (e.g., extremely large rural aggregation spanning multiple distinct markets), AND
3. **The county functions as a distinct healthcare catchment** with local hospital infrastructure

**When using county fallback:**
- **statistical_area_type:** `County`
- **statistical_area_id:** 5-digit County FIPS code (e.g., `04025` for Yavapai County, AZ)
- **statistical_area_name:** "[County Name], [State]" (e.g., `Yavapai County, AZ`)
- **mapping_rationale:** Must explicitly justify why CBSA is insufficient

**Do NOT group counties together** unless the region prompt explicitly documents them as integrated.

**County use must be the exception, not the default.** Most markets should map primarily to CBSAs.

**Valid County Fallback Example:**
```csv
# Rural area not in any CBSA
AZ-PRESCOTT,County,04025,Yavapai County AZ,primary,No CBSA covers Prescott; county represents healthcare catchment
```

**Invalid County Fallback Example:**
```csv
# BAD: CBSA exists (Prescott Valley-Prescott Micro 39140)
AZ-PRESCOTT,County,04025,Yavapai County AZ,primary,County used instead of available micropolitan
# CORRECT VERSION:
AZ-PRESCOTT,CBSA,39140,Prescott Valley-Prescott AZ,primary,Micropolitan area represents Prescott market
```

---

## Output File Specification

### File Name

```text
market_to_statistical_area_<region>.csv
```

Examples:
- `market_to_statistical_area_mountainwest.csv`
- `market_to_statistical_area_southeast.csv`

### Required Schema

| Column                | Definition                                                | Example |
| --------------------- | --------------------------------------------------------- | ------- |
| market_id             | Proprietary market identifier from `markets_<region>.csv` | AZ-PHOENIX-CENTRAL |
| statistical_area_type | `CBSA` or `County`                                        | CBSA |
| statistical_area_id   | CBSA code (5-digit) or County FIPS (5-digit)              | 38060 |
| statistical_area_name | Official Census name                                      | Phoenix-Mesa-Chandler, AZ |
| relationship_type     | `primary` / `secondary`                                   | primary |
| mapping_rationale     | ≤1 sentence behavioral justification                      | Downtown and central Phoenix portion of metro |

### Sorting Requirements
- Primary sort: `market_id` (alphabetical)
- Secondary sort: `relationship_type` (primary, then secondary)
- Tertiary sort: `statistical_area_id` (numeric/alphabetical)

---

## Core Mapping Rules

### Rule 1: Relationship Type Semantics

**Primary:**
- Statistical areas that represent the **core routine-care catchment** for the market
- Where most patients in the market reside
- Where the market's anchor hospitals are located
- Satisfies the ~45-minute routine-care travel threshold

**Secondary:**
- Statistical areas with **regular specialty spillover or referral flow**
- Adjacent areas that sometimes use this market for specialty care
- Areas where some residents choose this market as alternative
- 45-60 minute travel acceptable for specialty (not routine) care

**Assignment Guidelines:**
- Most markets will have 1-5 primary statistical areas
- Some markets will have 0-2 secondary statistical areas
- Avoid assigning more than **2 secondary areas per market** unless explicitly justified

**Example:**
```csv
# Louisville market - primary areas
KY-LOUISVILLE-METRO,CBSA,31140,Louisville/Jefferson County KY-IN,primary,Core metro including southern Indiana
KY-LOUISVILLE-METRO,CBSA,21060,Elizabethtown-Fort Knox KY,secondary,Southern area with some Louisville spillover

# Flagstaff market - primary only
AZ-FLAGSTAFF,CBSA,22380,Flagstaff AZ,primary,Micropolitan area represents Flagstaff market
AZ-FLAGSTAFF,County,04005,Coconino County AZ,primary,Remainder of county not in Flagstaff micro but served by same facilities
```

### Rule 2: Many-to-Many Is Expected and Required

**Critical Understanding:**
- **One market maps to multiple statistical areas:** Most markets serve 2-5 CBSAs/counties
- **One statistical area maps to multiple markets:** Large CBSAs split across markets

**This is not an error. This reflects reality.**

**Example of One-to-Many (Market → Statistical Areas):**
```csv
# Phoenix Central market serves portions of multiple CBSAs
AZ-PHOENIX-CENTRAL,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Downtown and central portions
AZ-PHOENIX-CENTRAL,CBSA,12420,Casa Grande AZ,secondary,Southern edge with some Phoenix access
```

**Example of Many-to-One (Statistical Area → Markets):**
```csv
# Phoenix CBSA (38060) serves 4 different markets
AZ-PHOENIX-CENTRAL,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Downtown and central portions
AZ-PHOENIX-EAST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,East Valley portions
AZ-PHOENIX-WEST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,West Valley portions
AZ-PHOENIX-NORTH,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Northern portions
```

**Do NOT force exclusivity.** Do NOT assume one CBSA = one market.

### Rule 3: Behavioral Heuristics (Mandatory)

**When assigning statistical areas to markets, use:**

**Travel Time Logic:**
- Approximate 45-minute routine-care travel threshold
- Consider typical weekday traffic conditions
- Account for geographic barriers (water, mountains, congestion)

**Known Transit Corridors:**
- WMATA Metro (DC area)
- MBTA (Boston area)
- NYC Subway
- MAX (Portland-Vancouver)
- Most regions are car-dependent (transit has limited impact)

**Geographic Barriers:**
- Water: Puget Sound, Chesapeake Bay, rivers with limited bridges
- Mountains: Cascades, Rockies, Appalachians, Mogollon Rim
- Congestion: I-10 Phoenix, I-95 Northeast, I-285 Atlanta, I-405 California

**Dominant Hospital Systems:**
- Where are major hospitals located within the statistical area?
- Which systems do residents of this area recognize and use?
- Market notes in regional CSV document dominant systems

**Referral Patterns:**
- Where do local providers send specialty referrals?
- Which academic medical centers serve as tertiary destinations?

**Regional Prompt Guidance:**
- Regional prompts document known splits and integrations
- Market CSV notes document specific catchment areas
- Honor documented cross-border markets (OH-CINCINNATI, KY-LOUISVILLE-METRO, etc.)

**Avoid:**
- Purely administrative reasoning ("it's in the same CBSA so it must be one market")
- Ignoring documented barriers
- Assuming proximity equals integration

### Rule 4: Naming Discipline

**Use official Census names exactly:**
- CBSA names from Census Bureau CBSA definitions
- County names in format: "[County Name], [State Abbreviation]"
- Do NOT invent sub-CBSA labels
- Do NOT create informal geographic nicknames
- Do NOT alias statistical areas to market names

**Correct Examples:**
```csv
38060,Phoenix-Mesa-Chandler, AZ
31140,Louisville/Jefferson County, KY-IN
04013,Maricopa County, AZ
```

**Incorrect Examples:**
```csv
# BAD: Invented sub-CBSA
38060,Phoenix East Valley Area
# BAD: Informal nickname
38060,Greater Phoenix Metro
# BAD: Market name used as statistical area
38060,Phoenix Central Market
```

### Rule 5: Cross-Border Statistical Areas

**When a CBSA or county spans state lines:**
- The official name includes all states (e.g., "Louisville/Jefferson County, KY-IN")
- Map to the market that actually serves residents
- Reference documented cross-border markets from regional prompts

**Documented Cross-Border Markets:**
- **OH-CINCINNATI:** Serves Cincinnati, OH and Northern Kentucky
  - Maps to Cincinnati-Wilmington-Maysville CSA components
- **KY-LOUISVILLE-METRO:** Serves Louisville, KY and Southern Indiana
  - Maps to Louisville/Jefferson County, KY-IN CBSA (31140)
- **OR-PORTLAND:** Serves Portland, OR and Vancouver, WA
  - Maps to Portland-Vancouver-Hillsboro, OR-WA CBSA (38900)
- **MO-KANSASCITY:** Serves Kansas City, MO and Kansas side
  - Maps to Kansas City, MO-KS CBSA (28140)
- **MO-STLOUIS:** Serves St. Louis, MO and Illinois Metro East
  - Maps to St. Louis, MO-IL CBSA (41180)
- **ND-FARGO:** Serves Fargo, ND and Moorhead, MN
  - Maps to Fargo, ND-MN CBSA (22020)

**Example:**
```csv
OH-CINCINNATI,CBSA,17140,Cincinnati OH-KY-IN,primary,Core metro serving both Ohio and Northern Kentucky
KY-LOUISVILLE-METRO,CBSA,31140,Louisville/Jefferson County KY-IN,primary,Core metro spanning Ohio River to southern Indiana
```

---

## Regional Mapping Strategies

### Mountain West (CO, UT, ID, MT, WY, NV, NM, AZ)

**Phoenix CBSA (38060) Splitting Strategy:**
```csv
AZ-PHOENIX-CENTRAL,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Downtown and central Phoenix core
AZ-PHOENIX-EAST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,East Valley Tempe Mesa Scottsdale Chandler Gilbert
AZ-PHOENIX-WEST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,West Valley Glendale Peoria Surprise Goodyear
AZ-PHOENIX-NORTH,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,North Valley Anthem Cave Creek Deer Valley
```

**Tucson Separate from Phoenix:**
```csv
AZ-TUCSON,CBSA,46060,Tucson AZ,primary,Metro 120 miles from Phoenix completely separate
AZ-TUCSON,CBSA,38060,Phoenix-Mesa-Chandler AZ,secondary,Complex cases referred to Phoenix 120 miles north
```

**Mountain Barriers Create Separations:**
- Western Slope CO CBSAs separate from Front Range CBSAs (Rocky Mountain barrier)
- Eastern WA CBSAs separate from Western WA CBSAs (Cascade barrier)
- Las Vegas CBSA (29820) to NV-LASVEGAS, NOT Reno (450 miles)

**Micropolitan Areas Common:**
- Flagstaff AZ, Prescott AZ, Bend OR, Logan UT, etc.
- Use micropolitan CBSAs where they exist
- County fallback only if no micro exists

### Southeast (NC, SC, GA, FL, AL, MS, TN, KY)

**Atlanta CBSA Splitting Strategy:**
```csv
GA-ATLANTA-CORE,CBSA,12060,Atlanta-Sandy Springs-Alpharetta GA,primary,I-285 core portions
GA-ATLANTA-NORTH,CBSA,12060,Atlanta-Sandy Springs-Alpharetta GA,primary,Northern suburbs Gwinnett
GA-ATLANTA-EAST,CBSA,12060,Atlanta-Sandy Springs-Alpharetta GA,primary,Eastern suburbs
# etc. - split based on I-285 perimeter and directional geography
```

**Florida Linear Coasts:**
- Each coastal CBSA is separate market
- Jacksonville (27260) ≠ Daytona Beach (19660) ≠ Melbourne (37340)
- I-95 corridor connects but does not integrate

**Louisville Cross-Border:**
```csv
KY-LOUISVILLE-METRO,CBSA,31140,Louisville/Jefferson County KY-IN,primary,Core metro including southern Indiana bridges
KY-LOUISVILLE-EAST,CBSA,31140,Louisville/Jefferson County KY-IN,primary,Eastern Jefferson and Oldham County portions
```

**Northern Kentucky to OH-CINCINNATI (NOT Southeast):**
```csv
# These mappings would appear in MIDWEST region file, not Southeast:
OH-CINCINNATI,CBSA,17140,Cincinnati OH-KY-IN,primary,Metro includes Northern Kentucky Covington Newport
```

### Northeast (PA, NJ, NY, CT, MA, RI, VT, NH, ME)

**NYC CBSA (35620) Extreme Splitting:**
```csv
NY-NYC-MANHATTAN,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Manhattan core
NY-NYC-BROOKLYN,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Brooklyn
NY-NYC-QUEENS,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Queens
NY-NYC-BRONX,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Bronx
NJ-NORTHJERSEY,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Northern NJ portions
NY-WESTCHESTER,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Westchester County
NY-LONGISLAND,CBSA,35620,New York-Newark-Jersey City NY-NJ-PA,primary,Long Island Nassau Suffolk
# Potentially more splits depending on market definitions
```

**Boston Area:**
```csv
MA-BOSTON-CORE,CBSA,14460,Boston-Cambridge-Newton MA-NH,primary,Core Boston proper
MA-CAMBRIDGE,CBSA,14460,Boston-Cambridge-Newton MA-NH,primary,Cambridge Somerville portions
MA-NORTHSHORE,CBSA,14460,Boston-Cambridge-Newton MA-NH,primary,North Shore Beverly Salem
# Worcester is separate CBSA (49340), separate market
```

**Congestion Creates Splits:**
- Bridge/tunnel barriers separate markets despite CBSA unity
- I-95 corridor congestion reinforces separations

### Mid-Atlantic (MD, DC, DE, VA, WV)

**DC-Baltimore CSA Must Split:**
```csv
# DC markets
DC-CORE,CBSA,47900,Washington-Arlington-Alexandria DC-VA-MD-WV,primary,DC proper
VA-ARLINGTON,CBSA,47900,Washington-Arlington-Alexandria DC-VA-MD-WV,primary,Arlington Alexandria portions
MD-BETHESDA,CBSA,47900,Washington-Arlington-Alexandria DC-VA-MD-WV,primary,Montgomery County Bethesda portions

# Baltimore markets - separate CBSA component
MD-BALTIMORE,CBSA,12580,Baltimore-Columbia-Towson MD,primary,Baltimore metro completely independent from DC
```

**Chesapeake Bay Barrier:**
```csv
MD-EASTERNSHORE,CBSA,44300,Salisbury MD-DE,primary,Eastern Shore isolated by Bay Bridge bottleneck
MD-EASTERNSHORE,County,24019,Dorchester County MD,primary,Not in Salisbury CBSA but served by same systems
```

### Texas & Plains (TX, OK, KS, MO, IA, NE, SD, ND, AR, LA)

**Dallas-Fort Worth Polycentric:**
```csv
TX-DALLAS-CENTRAL,CBSA,19100,Dallas-Fort Worth-Arlington TX,primary,Dallas core portions
TX-FORTWORTH,CBSA,19100,Dallas-Fort Worth-Arlington TX,primary,Fort Worth distinct core
# Additional directional splits as needed
```

**Houston Directional:**
```csv
TX-HOUSTON-MED,CBSA,26420,Houston-The Woodlands-Sugar Land TX,primary,Medical Center and nearby portions
TX-HOUSTON-NORTH,CBSA,26420,Houston-The Woodlands-Sugar Land TX,primary,Northern suburbs Woodlands
TX-HOUSTON-EAST,CBSA,26420,Houston-The Woodlands-Sugar Land TX,primary,Eastern Baytown Pasadena
# etc.
```

**Cross-Border:**
```csv
MO-KANSASCITY,CBSA,28140,Kansas City MO-KS,primary,Metro spans state line including Kansas side
MO-STLOUIS,CBSA,41180,St. Louis MO-IL,primary,Metro includes Illinois Metro East
```

### California (CA)

**SF Bay Area Fragmentation:**
```csv
CA-SF-CENTRAL,CBSA,41860,San Francisco-Oakland-Berkeley CA,primary,San Francisco proper
CA-OAKLAND,CBSA,41860,San Francisco-Oakland-Berkeley CA,primary,Oakland and immediate East Bay
CA-PENINSULA,CBSA,41940,San Jose-Sunnyvale-Santa Clara CA,primary,Peninsula Palo Alto San Mateo
CA-SOUTHBAY,CBSA,41940,San Jose-Sunnyvale-Santa Clara CA,primary,South Bay San Jose Santa Clara
# Additional splits as needed
```

**LA Basin Fragmentation:**
```csv
CA-LA-CENTRAL,CBSA,31080,Los Angeles-Long Beach-Anaheim CA,primary,Downtown and central LA
CA-LA-WEST,CBSA,31080,Los Angeles-Long Beach-Anaheim CA,primary,Westside Santa Monica Venice
CA-LA-VALLEY,CBSA,31080,Los Angeles-Long Beach-Anaheim CA,primary,San Fernando Valley
CA-ORANGE,CBSA,31080,Los Angeles-Long Beach-Anaheim CA,primary,Orange County portions
# Many more splits - LA Basin has 10-12 markets
```

### Pacific Northwest (WA, OR)

**Seattle-Tacoma Area:**
```csv
WA-SEATTLE-CORE,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary,Seattle proper
WA-BELLEVUE,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary,Eastside Bellevue Redmond across Lake Washington
WA-TACOMA,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary,Tacoma 35 miles south separate despite CBSA
```

**Cascade Barrier:**
- Western WA CBSAs completely separate from Eastern WA CBSAs
- No cross-Cascade integration for routine care

**Portland-Vancouver:**
```csv
OR-PORTLAND,CBSA,38900,Portland-Vancouver-Hillsboro OR-WA,primary,Metro integrates OR and WA via MAX and bridges
```

### Midwest (IL, IN, OH, MI, WI, MN)

**Chicago CBSA Splitting:**
```csv
IL-CHICAGO-CORE,CBSA,16980,Chicago-Naperville-Elgin IL-IN-WI,primary,Loop and city core
IL-CHICAGO-NORTH,CBSA,16980,Chicago-Naperville-Elgin IL-IN-WI,primary,North Side
IL-CHICAGO-SUBURBS,CBSA,16980,Chicago-Naperville-Elgin IL-IN-WI,primary,Suburban ring
# Additional directional splits
```

**OH-CINCINNATI Cross-Border:**
```csv
OH-CINCINNATI,CBSA,17140,Cincinnati OH-KY-IN,primary,Metro includes Northern Kentucky via I-75 bridges
```

---

## What You Must NOT Do

❌ **Do NOT enumerate ZIPs or ZCTAs**
- This stage is conceptual only
- ZIP expansion happens deterministically later
- Do NOT attempt to reason about specific ZIP codes

❌ **Do NOT approximate ZIP behavior indirectly**
- Do NOT say "ZIPs in the eastern portion of this CBSA"
- Say "Eastern portions of metro" conceptually
- The deterministic expansion will handle ZIP-level precision

❌ **Do NOT redefine, rename, merge, or split markets**
- Only use market_ids from `markets_<region>_COMPLETE.csv`
- Markets are already defined and validated
- Your job is to map them to statistical areas, not redesign them

❌ **Do NOT treat CBSAs as internally homogeneous**
- Large CBSAs span multiple markets
- Must map same CBSA to multiple markets when appropriate
- Phoenix CBSA → 4 markets, NYC CBSA → 6+ markets

❌ **Do NOT invent statistical area names**
- Use official Census CBSA names
- Use official county names
- Do NOT create nicknames or informal labels

❌ **Do NOT use counties as default**
- CBSAs and micropolitans are preferred
- Counties only when no CBSA adequately represents area
- Must justify county fallback in rationale

❌ **Do NOT ignore regional prompt guidance**
- Regional prompts document splits, barriers, cross-border markets
- Market CSV notes document catchment areas
- Honor documented patterns

---

## Quality Control Checklist

### Per-Market Validation

Before finalizing each market's mappings, confirm:

1. ✅ **Primary areas truly reflect routine-care behavior**
   - Would residents of these statistical areas use this market for PCP visits?
   - Are the anchor hospitals for this market located in these areas?
   - Does this align with the ~45-minute travel threshold?

2. ✅ **Secondary areas represent realistic spillover**
   - Is there evidence of specialty referral from these areas?
   - Is it 45-60 minutes or accessible via transit?
   - Is this a documented referral pattern?

3. ✅ **County fallbacks are clearly justified**
   - Is there genuinely no CBSA or micropolitan covering this area?
   - Does the county represent a distinct healthcare catchment?
   - Is the rationale explicit about why CBSA is insufficient?

4. ✅ **All IDs and names are valid and real**
   - CBSA codes match official Census definitions
   - County FIPS codes are correct
   - Names match official Census naming

5. ✅ **Large CBSA splits are recognized**
   - Is this CBSA large enough to span multiple markets?
   - Have I mapped it to all appropriate markets?
   - Does the rationale explain which portion of the CBSA?

### Regional Validation

After mapping all markets, verify:

1. ✅ **Every market has at least one primary statistical area**
   - No orphaned markets
   - Every market in regional CSV appears in mappings

2. ✅ **Large CBSAs map to multiple markets where appropriate**
   - Phoenix CBSA → 4 Phoenix markets
   - NYC CBSA → 6+ NYC-area markets
   - Atlanta, Houston, Chicago, LA similarly split

3. ✅ **Cross-border markets properly documented**
   - OH-CINCINNATI includes Cincinnati OH-KY-IN CBSA
   - KY-LOUISVILLE-METRO includes Louisville KY-IN CBSA
   - OR-PORTLAND includes Portland OR-WA CBSA
   - MO-KANSASCITY, MO-STLOUIS, ND-FARGO similarly handled

4. ✅ **Regional barriers reflected in mappings**
   - Mountain barriers: CBSAs on opposite sides map to different markets
   - Water barriers: Bay/river crossings create market separations
   - Congestion barriers: I-285, I-95, etc. create splits

5. ✅ **Statistical area coverage is reasonable**
   - Most population centers are covered
   - No major CBSAs accidentally omitted
   - County fallbacks are truly exceptional

---

## Example Mappings

### Example 1: Simple Market with One CBSA
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
AZ-TUCSON,CBSA,46060,Tucson AZ,primary,Micropolitan area represents entire Tucson market
AZ-TUCSON,CBSA,38060,Phoenix-Mesa-Chandler AZ,secondary,Complex specialty cases referred to Phoenix 120 miles north
```

### Example 2: Large CBSA Split Across Multiple Markets
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
AZ-PHOENIX-CENTRAL,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,Downtown and central Phoenix portions of metro
AZ-PHOENIX-EAST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,East Valley Tempe Mesa Scottsdale portions of metro
AZ-PHOENIX-WEST,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,West Valley Glendale Peoria portions of metro
AZ-PHOENIX-NORTH,CBSA,38060,Phoenix-Mesa-Chandler AZ,primary,North Valley Anthem Cave Creek portions of metro
```

### Example 3: Market Serving Multiple CBSAs
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
AZ-FLAGSTAFF,CBSA,22380,Flagstaff AZ,primary,Micropolitan area is core of market
AZ-FLAGSTAFF,County,04005,Coconino County AZ,primary,Remainder of county outside Flagstaff micro served by same facilities
```

### Example 4: Cross-Border CBSA
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
KY-LOUISVILLE-METRO,CBSA,31140,Louisville/Jefferson County KY-IN,primary,Core metro spans Ohio River to southern Indiana via I-64 and I-65 bridges
KY-LOUISVILLE-EAST,CBSA,31140,Louisville/Jefferson County KY-IN,primary,Eastern Jefferson and Oldham County portions of metro
```

### Example 5: County Fallback (Justified)
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
WY-SHERIDAN,County,56033,Sheridan County WY,primary,No CBSA covers Sheridan; county represents distinct healthcare catchment
```

### Example 6: Secondary Referral Pattern
```csv
market_id,statistical_area_type,statistical_area_id,statistical_area_name,relationship_type,mapping_rationale
KY-LEXINGTON,CBSA,30460,Lexington-Fayette KY,primary,Metro represents core Lexington market
KY-LEXINGTON,CBSA,17140,Cincinnati OH-KY-IN,secondary,Some complex cases referred to Cincinnati Children's 80 miles north
```

---

## Execution Checklist

### Before Starting

- [ ] Load `master_market.md` (national framework)
- [ ] Load `markets_<region>_UPDATED.md` (regional mobility factors, documented splits)
- [ ] Load `markets_<region>_COMPLETE.csv` (valid market_ids and notes)
- [ ] Obtain Census CBSA definitions for region's states
- [ ] Review which CBSAs are documented to split across markets

### During Mapping

- [ ] Map each market to appropriate CBSAs (primary mapping unit)
- [ ] Recognize when large CBSAs span multiple markets
- [ ] Map same CBSA to multiple markets when appropriate
- [ ] Use micropolitan CBSAs where they exist
- [ ] Use county fallback ONLY when truly justified
- [ ] Assign secondary relationships only with evidence
- [ ] Document cross-border CBSAs properly

### After Mapping

- [ ] Verify every market has at least one primary statistical area
- [ ] Verify large CBSAs map to multiple markets appropriately
- [ ] Verify cross-border CBSAs properly assigned
- [ ] Verify county fallbacks are justified
- [ ] Check statistical area IDs and names are official
- [ ] Sort output correctly
- [ ] Generate clean CSV file

---

## Final Instruction

Output **only** the completed `market_to_statistical_area_<region>.csv` file.

**This file will be used as the sole conceptual input to deterministic ZIP expansion.** The downstream process will:
1. Take each CBSA-to-market mapping
2. Look up all ZIPs in that CBSA (Census crosswalk)
3. Assign those ZIPs to the mapped market(s)
4. Handle large CBSA splits using spatial analysis or additional rules

**Your responsibility at this stage:**
- Identify which statistical areas each market serves (conceptually)
- Recognize when CBSAs split across multiple markets
- Provide behavioral rationale for assignments
- Enable clean deterministic expansion later

**NOT your responsibility at this stage:**
- Enumerate specific ZIP codes
- Determine exactly where within a CBSA the split occurs
- Perform spatial analysis or distance calculations

**Prioritize:**
1. Behavioral realism (does this statistical area truly serve this market?)
2. Recognition of CBSA heterogeneity (large CBSAs split across markets)
3. Use of official Census entities (CBSAs preferred, counties as fallback)
4. Clear rationale for each assignment (enables validation and ZIP expansion)

The goal is to answer: **"Which named statistical areas (CBSAs, micropolitans, counties) are realistically served by each healthcare market?"**
