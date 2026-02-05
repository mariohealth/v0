# Execution Prompt: ZIP → Healthcare Shopping Zone Mapping

## Purpose
This prompt executes the **ZIP-first mapping strategy** by assigning patient and provider ZIP codes to proprietary **Healthcare Shopping Zones** for price comparison and shoppability analysis.

This prompt is operational. It assumes that market design is complete and **must not redefine markets**.

---

## Required References (You Must Use These)

Before mapping, you must explicitly reference:

1. **National Base Prompt – Healthcare Market Master (`master_market.md`)**  
   - Defines what a Healthcare Shopping Zone is
   - Governs travel-friction logic and the 45-minute rule
   - Establishes behavioral realism principles

2. **Regional Market Prompt (`markets_<region>_UPDATED.md`)**  
   - Provides region-specific geography, transit, and barriers
   - Documents congestion corridors, water barriers, mountain passes
   - Explains regional mobility factors and friction patterns

3. **Regional Market File (`markets_<region>_COMPLETE.csv`)**  
   - Authoritative list of valid `market_id` values for this region
   - Market notes contain catchment area guidance
   - **435 total markets across 8 regions covering 49 states + DC**

You may not create, rename, merge, or split markets during mapping. Only assign ZIPs to existing markets.

---

## Regional Context (Know Your Region)

### Available Regions and Market Counts

| Region | States | Markets | Key Characteristics |
|--------|--------|---------|---------------------|
| Mountain West | CO, UT, ID, MT, WY, NV, NM, AZ (8) | 62 | Mountains, extreme distances, Phoenix sprawl, desert heat |
| Southeast | NC, SC, GA, FL, AL, MS, TN, KY (8) | 71 | Car-dependent, extreme sprawl (Atlanta, Miami), linear FL coasts |
| Northeast | PA, NJ, NY, CT, MA, RI, VT, NH, ME (9) | 62 | Congestion, NYC splits, water barriers, limited transit impact |
| Mid-Atlantic | MD, DC, DE, VA, WV (5) | 30 | WMATA limited, Baltimore separate, Potomac/Chesapeake barriers |
| Texas & Plains | TX, OK, KS, MO, IA, NE, SD, ND, AR, LA (10) | 92 | Vast distances, Dallas/Houston sprawl, cross-border markets |
| California | CA (1) | 42 | SF Bay fragmentation, LA Basin 10+ markets, chronic congestion |
| Pacific Northwest | WA, OR (2) | 21 | Puget Sound water, Cascade barrier, ferry-dependent areas |
| Midwest | IL, IN, OH, MI, WI, MN (6) | 55 | Chicago splits, Great Lakes, OH-CINCINNATI cross-border |

**Total: 435 markets covering ~330M people (99%+ of US population excluding AK, HI)**

---

## Role Definition

You are a **Health Economics and Geospatial Data Analyst** optimizing healthcare price comparison accuracy.

Your responsibility is to determine which healthcare markets are **realistically shoppable** for residents of each ZIP code, based on:
- Travel time and friction
- Known hospital systems and referral patterns
- Geographic barriers (water, mountains, congestion)
- Regional mobility factors (transit, state borders)

Your output enables patients to compare prices among providers they can actually reach for care.

---

## Scope of a Single Run

Each run of this prompt applies to **one region only**.

**ZIP Scope:**
- All residential ZIPs within the region's states
- Provider ZIPs where healthcare facilities exist
- Cross-border ZIPs that integrate with regional markets (e.g., Southern Indiana ZIPs → KY-LOUISVILLE-METRO)

**Market Scope:**
- Only use market_ids from `markets_<region>_COMPLETE.csv`
- Cross-region secondary mappings allowed when behaviorally justified (e.g., complex cases referred to academic centers in adjacent regions)

**Exclude:**
- PO Box-only ZIPs (no residential population)
- Military-exclusive ZIPs unless serving civilian population
- ZIPs in Alaska and Hawaii (not covered by framework)

---

## Output File Specification

### File Name

```text
zip_to_market_<region>.csv
```

Examples:
- `zip_to_market_mountainwest.csv`
- `zip_to_market_southeast.csv`
- `zip_to_market_northeast.csv`

### Required Columns

| Column | Definition | Example |
|--------|------------|---------|
| zip_code | 5-digit ZIP code | 85001 |
| market_id | Market identifier from regional CSV | AZ-PHOENIX-CENTRAL |
| relationship_type | primary / secondary / tertiary | primary |
| mapping_rationale | ≤1 sentence justification | Downtown Phoenix residents use central medical district within 15-min drive |

### Optional Columns (Recommended for Validation)

| Column | Definition | Example |
|--------|------------|---------|
| estimated_travel_time | Approximate minutes to market hospitals | 15 |
| primary_barrier | Key friction factor if any | None / I-10 congestion / Lake Washington / Mountain pass |

### Sorting Requirements
- Primary sort: `zip_code` (ascending, 5-digit numeric)
- Secondary sort: `relationship_type` (primary, then secondary, then tertiary)
- Tertiary sort: `market_id` (alphabetical)

---

## Core Mapping Rules (Mandatory)

### Rule 1: Primary Market Assignment

**Each ZIP must have exactly one primary market**, defined as:

**Criteria:**
- The market residents **most commonly use** for routine care (PCP, imaging, labs, common procedures)
- Satisfies the **~45-minute routine-care travel threshold** door-to-door
- Minimizes travel friction under normal weekday conditions (not rush hour extremes, not ideal off-peak)
- Aligns with dominant hospital system presence in the area

**If no market clearly dominates:**
- Select the **least-friction option** (shortest realistic travel time)
- Document the ambiguity in mapping_rationale
- Consider if ZIP is truly on a boundary (may justify secondary mapping)

**Examples of Valid Primary Assignments:**
```csv
85001,AZ-PHOENIX-CENTRAL,primary,Downtown Phoenix ZIP within 15-min of central medical district
85251,AZ-PHOENIX-EAST,primary,Scottsdale ZIP uses HonorHealth and Mayo Scottsdale in East Valley
47130,KY-LOUISVILLE-METRO,primary,Jeffersonville IN ZIP crosses I-65 bridges to Louisville hospitals in 20-min
```

**Invalid Primary Assignments:**
```csv
# BAD: >60 min travel for routine care
85920,AZ-PHOENIX-CENTRAL,primary,Flagstaff ZIP 140 miles from Phoenix
# CORRECT VERSION:
85920,AZ-FLAGSTAFF,primary,Flagstaff ZIP uses local Flagstaff Medical Center
85920,AZ-PHOENIX-CENTRAL,secondary,Complex cases referred to Phoenix academic centers

# BAD: Ignoring documented barrier
98110,WA-SEATTLE-CORE,primary,Bainbridge Island ZIP requires 35-min ferry
# CORRECT VERSION:
98110,WA-BAINBRIDGE,primary,Ferry-dependent island is separate market
```

### Rule 2: Secondary Market Assignment

**ZIPs may map to secondary markets when:**

**Valid Secondary Scenarios:**

1. **Specialty Care Spillover:**
   - Primary market lacks certain specialists
   - Residents commonly referred to secondary market for specific services
   - 45-60 minute travel acceptable for specialty (not routine) care

2. **Alternative Access via Transit:**
   - Primary market is local, but transit enables alternative
   - One-direction transit to major medical center
   - Used by subset of residents (e.g., those near transit stations)

3. **Border ZIP Serving Two Markets:**
   - ZIP equidistant from two markets
   - Some residents use one, some use the other
   - Primary = majority preference, Secondary = significant minority

4. **Academic Medical Center Referral:**
   - Primary market handles routine care
   - Complex/specialty cases referred to academic center
   - Well-established referral relationship

**Maximum Secondary Markets:**
- Most ZIPs: 0-1 secondary markets
- Border ZIPs: 1-2 secondary markets maximum
- Avoid: 3+ secondary markets (suggests imprecision)

**Examples:**
```csv
# Valid: Border ZIP with specialty referral
85050,AZ-PHOENIX-NORTH,primary,Northern Phoenix ZIP closest to Deer Valley hospitals
85050,AZ-PHOENIX-CENTRAL,secondary,Some residents access downtown academic centers for specialty

# Valid: Cross-border referral
40601,KY-LEXINGTON,primary,Lexington ZIP uses UK HealthCare locally
40601,OH-CINCINNATI,secondary,Some cases referred to Cincinnati Children's 80 miles north

# Valid: Transit-enabled alternative
02138,MA-CAMBRIDGE,primary,Cambridge residents use local Cambridge Health Alliance
02138,MA-BOSTON-LONGWOOD,secondary,Red Line enables access to Longwood medical area for specialty
```

### Rule 3: Tertiary Market Assignment (Optional, Use Sparingly)

**Tertiary markets should rarely be assigned.** Use only when:
- Academic medical center serves as quaternary referral destination
- Used for rare/complex conditions, clinical trials, specialized procedures
- 60+ minutes away, not routine access
- Well-documented referral pattern exists

**Recommendation:** Start mapping without tertiary. Add only if analytics require it.

**If using tertiary:**
```csv
# Rare quaternary referral
86001,AZ-FLAGSTAFF,primary,Flagstaff residents use local Flagstaff Medical Center
86001,AZ-PHOENIX-CENTRAL,secondary,Specialty cases to Phoenix
86001,AZ-TUCSON,tertiary,Rare complex cases to Banner UMC Tucson research programs
```

### Rule 4: Travel Friction Evaluation (ZIP-Level)

**Evaluate friction using multiple factors, not just distance:**

**Travel Time Estimation:**
- Use typical weekday conditions (Google Maps 9am Tuesday or 2pm Wednesday)
- Include parking time (5-10 minutes urban, 2-5 minutes suburban)
- Include walk from parking to entrance (3-5 minutes large facilities)
- **Target: <45 minutes door-to-door for primary market**

**Known Congestion Patterns:**
- I-10 Phoenix (chronic all-day)
- I-95 Northeast corridor (severe)
- I-285 Atlanta (extreme, 60-90 min to cross)
- I-405 California (chronic)
- Document in regional prompts, honor in ZIP mapping

**Physical Barriers:**
- **Water:** Rivers with limited bridges, bays, harbors
  - Multiple bridges reduce friction (Louisville, Cincinnati)
  - Single/limited crossings create friction (Chesapeake Bay Bridge, Tampa Bay)
  - Ferries create hard barriers (Puget Sound, NYC)
- **Mountains:** Passes with seasonal closures, elevation gains
  - Cascades separate Western/Eastern WA
  - Rockies separate Front Range from Western Slope CO
  - Mogollon Rim separates Phoenix from Flagstaff
- **Congestion bottlenecks:** Bridge/tunnel queues, toll plazas, merge points

**State Borders:**
- Create Medicaid program differences
- Network design rarely crosses for routine care
- **Exception:** Documented cross-border markets
  - OH-CINCINNATI covers Northern Kentucky (41xxx ZIPs)
  - KY-LOUISVILLE-METRO covers Southern Indiana (471xx ZIPs)
  - OR-PORTLAND covers Vancouver WA (986xx ZIPs)
  - MO-KANSASCITY covers Kansas side (661xx ZIPs)
  - MO-STLOUIS covers Illinois Metro East (62xxx ZIPs)
  - ND-FARGO covers Moorhead MN (565xx ZIPs)

**Distance alone is insufficient.** Two ZIPs 20 miles apart may have very different market access:
- 20 miles, flat highway, no barriers → Same market
- 20 miles, mountain pass, or water crossing → Different markets

### Rule 5: Transit Asymmetry Recognition

**Transit CAN enable secondary market access when:**
- High-frequency service (≤15 minute headways during medical appointment hours)
- Direct or single-transfer access to hospital district
- Stations within reasonable walk/bus of medical facilities
- Actually used by residents for medical appointments (not just work commutes)

**Examples where transit matters:**
- MBTA Red Line: Cambridge/Somerville ZIPs → Boston Longwood medical area (secondary)
- NYC Subway: Outer borough ZIPs → Manhattan hospital districts (secondary)
- WMATA Metro: Arlington/Bethesda ZIPs → DC medical centers (may enable primary integration)
- MAX Light Rail: Vancouver WA ZIPs → Portland hospitals (enables primary integration)

**Transit does NOT enable integration when:**
- Commuter rail with peak-direction bias (Metro-North, NJ Transit, LIRR)
- Poor reverse-direction service
- Requires multiple transfers
- No stations near hospitals
- Limited weekend/evening service (medical appointments happen off-peak)

**One-direction transit justifies secondary, not primary:**
```csv
# Valid: Commuter can access Manhattan hospitals but not primary market
10804,NY-WESTCHESTER,primary,New Rochelle residents use local Montefiore New Rochelle
10804,NY-NYC-MANHATTAN,secondary,Metro-North enables some access to Manhattan academic centers
```

**Do NOT assume bidirectional equivalence.** Commuter rail designed for suburb→city may not support city→suburb medical access.

### Rule 6: Market Boundary Behavior

**ZIPs near market edges are expected to have less clear assignments:**

**Boundary ZIP Patterns:**

1. **Equidistant from Two Markets:**
   - Assign primary based on slight advantage (closer, less friction)
   - Assign secondary to the other market
   - Document the boundary nature

2. **Split Populations:**
   - Large ZIP where northern residents use Market A, southern residents use Market B
   - Assign primary to majority usage pattern
   - Assign secondary to minority usage pattern
   - Note population split in rationale

3. **Transitional Zones:**
   - ZIP transitioning from suburban to rural
   - May use different markets for different service types
   - Primary = routine care preference
   - Secondary = specialty care pattern

**Example Boundary ZIP:**
```csv
# Border ZIP between Phoenix markets
85310,AZ-PHOENIX-WEST,primary,Majority of Buckeye ZIP uses West Valley hospitals
85310,AZ-PHOENIX-CENTRAL,secondary,Eastern portion closer to downtown via I-10
```

**This is expected and realistic.** Do not force artificial clarity.

---

## Regional Mapping Strategies

### Mountain West (CO, UT, ID, MT, WY, NV, NM, AZ)

**Phoenix Metro ZIP Strategy:**
- **Downtown ZIPs (850xx central)** → AZ-PHOENIX-CENTRAL
- **Scottsdale/Tempe/Mesa ZIPs (852xx, 85281-85299)** → AZ-PHOENIX-EAST
- **Glendale/Peoria ZIPs (853xx)** → AZ-PHOENIX-WEST
- **Anthem/Cave Creek ZIPs (850xx north of Loop 101)** → AZ-PHOENIX-NORTH
- Review Loop 101/202 ring roads as market boundaries
- I-10 congestion creates east-west friction

**Mountain Barriers:**
- ZIPs on opposite sides of passes are separate markets
- Winter closures (Eisenhower Tunnel, Snoqualmie Pass) reinforce separation
- Mogollon Rim (AZ): Phoenix ZIPs vs Flagstaff ZIPs completely separate

**Extreme Distances:**
- Montana/Wyoming frontier ZIPs may be 60+ min to nearest market (accepted)
- Document long distance in rationale
- Las Vegas ZIPs to NV-LASVEGAS (not Reno, 450 miles away)

**Tucson Separate from Phoenix:**
- All Tucson ZIPs (857xx) → AZ-TUCSON (primary)
- AZ-PHOENIX-CENTRAL may be secondary for complex specialty

### Southeast (NC, SC, GA, FL, AL, MS, TN, KY)

**Atlanta Metro ZIP Strategy:**
- I-285 perimeter is critical boundary
- **Inside I-285** → Directional markets based on geography
- **Outside I-285** → Suburban/outer markets
- Gwinnett County ZIPs (300xx eastern) → GA-ATLANTA-EAST
- Cobb County ZIPs (300xx western) → GA-ATLANTA-NORTH or WEST
- Review crossing times carefully (60-90 min across metro)

**Florida Linear Coasts:**
- I-95 corridor ZIPs are sequential, NOT integrated
- Each coastal segment is separate market
- Jacksonville ZIPs (322xx) ≠ Daytona ZIPs (321xx) ≠ Melbourne ZIPs (329xx)
- 60+ miles creates hard separation

**Louisville Cross-Border:**
- **Jefferson County KY ZIPs (402xx)** → KY-LOUISVILLE-METRO
- **Southern Indiana ZIPs (471xx Jeffersonville/New Albany)** → KY-LOUISVILLE-METRO
- Multiple I-64/I-65 bridges integrate
- **Oldham County ZIPs (400xx eastern)** → KY-LOUISVILLE-EAST

**Northern Kentucky CRITICAL:**
- **Covington ZIPs (410xx)** → OH-CINCINNATI (Midwest region, NOT Southeast)
- **Newport ZIPs (410xx)** → OH-CINCINNATI (Midwest region, NOT Southeast)
- **Florence ZIPs (410xx)** → OH-CINCINNATI (Midwest region, NOT Southeast)
- Do NOT assign these to KY-LOUISVILLE or KY-LEXINGTON

**Car-Dependent:**
- Transit (MARTA, Tri-Rail) has minimal impact
- Do NOT assume transit enables integration

### Northeast (PA, NJ, NY, CT, MA, RI, VT, NH, ME)

**NYC Extreme Splits:**
- **Manhattan ZIPs (100xx, 101xx)** → NY-NYC-MANHATTAN
- **Brooklyn ZIPs (112xx)** → NY-NYC-BROOKLYN
- **Queens ZIPs (11xxx)** → NY-NYC-QUEENS
- **Bronx ZIPs (104xx)** → NY-NYC-BRONX
- **Staten Island ZIPs (103xx)** → NY-NYC-STATENISLAND
- East River crossings create 45+ min barriers

**Long Island:**
- Most Long Island ZIPs → NY-LONGISLAND markets (NOT Manhattan)
- LIRR does NOT enable primary integration (requires transfer, peak-direction)
- Manhattan may be secondary for some Long Island ZIPs (specialty)

**Northern NJ:**
- Northern NJ ZIPs (07xxx) → Appropriate NJ markets
- NOT Manhattan despite proximity (bridges/tunnels create friction)
- GW Bridge, Lincoln Tunnel add 30-45 min delay

**Boston Transit:**
- Red Line ZIPs in Cambridge → MA-CAMBRIDGE (primary)
- Red Line enables MA-BOSTON-LONGWOOD as secondary
- BUT: Most Boston area is car-dependent

### Mid-Atlantic (MD, DC, DE, VA, WV)

**WMATA Metro Limited:**
- **DC ZIPs (200xx)** → DC-CORE or appropriate DC market
- **Arlington ZIPs (222xx)** → VA-ARLINGTON (may integrate with DC)
- **Bethesda ZIPs (208xx)** → MD-BETHESDA (may integrate with DC)
- Metro ONLY integrates these core areas

**Baltimore Independent:**
- **Baltimore ZIPs (212xx)** → MD-BALTIMORE markets
- NOT DC markets (45+ min, no transit, independent)
- Completely separate healthcare market

**Potomac River:**
- Creates north-south friction despite bridges
- Virginia ZIPs generally separate from Maryland ZIPs
- Exception: Arlington/Alexandria integrated with DC via Metro

**Chesapeake Bay:**
- Bay Bridge bottleneck to Eastern Shore
- **Eastern Shore MD ZIPs (216xx, 218xx)** → MD-EASTERNSHORE markets
- NOT Baltimore or DC (90+ min via bridge queue)

### Texas & Plains (TX, OK, KS, MO, IA, NE, SD, ND, AR, LA)

**Dallas-Fort Worth:**
- Dallas ZIPs (752xx) vs Fort Worth ZIPs (761xx)
- Separate cores despite "DFW" branding
- Mid-Cities ZIPs may be primary to one, secondary to other

**Houston Directional Splits:**
- **Medical Center ZIPs (770xx near TMC)** → TX-HOUSTON-MED
- **Northern ZIPs (773xx)** → TX-HOUSTON-NORTH
- **Eastern ZIPs (770xx Baytown area)** → TX-HOUSTON-EAST
- Review proximity to systems for each ZIP

**Cross-Border Markets:**
- **Kansas City KS ZIPs (661xx)** → MO-KANSASCITY
- **Metro East IL ZIPs (62xxx Belleville area)** → MO-STLOUIS
- **Moorhead MN ZIPs (565xx)** → ND-FARGO

**Vast Distances:**
- Rural ZIPs may be 100-200 miles from market center
- Accept longer distances for frontier areas
- Document in rationale

### California (CA)

**SF Bay Area Fragmentation:**
- **San Francisco ZIPs (941xx)** → CA-SF-CENTRAL
- **Oakland ZIPs (946xx)** → CA-OAKLAND
- **Peninsula ZIPs (940xx, 943xx)** → CA-PENINSULA markets
- **South Bay ZIPs (95xxx)** → CA-SOUTHBAY markets
- **East Bay ZIPs (945xx)** → CA-EASTBAY markets
- Bay Bridge congestion separates SF from Oakland

**LA Basin Fragmentation:**
- 10-12 markets, careful ZIP-by-ZIP required
- **Downtown ZIPs (900xx)** → CA-LA-CENTRAL
- **Westside ZIPs (90xxx Santa Monica/Venice)** → CA-LA-WEST
- **San Fernando Valley ZIPs (91xxx)** → CA-LA-VALLEY
- **Orange County ZIPs (92xxx)** → CA-ORANGE markets
- I-405/I-5/I-10 chronic congestion creates barriers

**San Diego:**
- **Central San Diego ZIPs (921xx)** → CA-SANDIEGO-CENTRAL
- **North County ZIPs (920xx)** → CA-SANDIEGO-NORTH
- Review I-5/I-15 travel times

### Pacific Northwest (WA, OR)

**Puget Sound Water Barriers:**
- **Seattle ZIPs (981xx)** → WA-SEATTLE-CORE
- **Bellevue/Eastside ZIPs (980xx)** → WA-BELLEVUE or WA-EASTSIDE
- Lake Washington crossing (I-90/SR-520 bridges) creates friction
- Evaluate if bridges enable integration or separate markets

**Cascade Mountain Barrier:**
- Western WA ZIPs completely separate from Eastern WA ZIPs
- **Eastern WA ZIPs (99xxx)** → WA-SPOKANE, WA-TRICITIES, etc.
- 3+ hour drives, winter closures create absolute separation

**Ferry-Dependent:**
- **Bainbridge Island ZIPs (98110)** → WA-BAINBRIDGE (separate)
- **Bremerton ZIPs (983xx)** → WA-BREMERTON (separate)
- 35-60 min ferry creates hard barrier

**Portland-Vancouver:**
- **Vancouver WA ZIPs (986xx)** → OR-PORTLAND
- MAX light rail enables cross-border integration
- I-5/I-205 bridges also connect

### Midwest (IL, IN, OH, MI, WI, MN)

**Chicago Splits:**
- **Loop ZIPs (606xx)** → IL-CHICAGO-CORE
- **North Side ZIPs (606xx)** → IL-CHICAGO-NORTH
- **Suburban ZIPs (60xxx)** → Suburban markets
- Review L train access for some ZIPs

**OH-CINCINNATI Cross-Border:**
- **Cincinnati OH ZIPs (45xxx)** → OH-CINCINNATI
- **Northern KY ZIPs (410xx Covington/Newport)** → OH-CINCINNATI
- **Southern Indiana ZIPs (470xx border)** → OH-CINCINNATI
- I-75/I-71 bridges integrate

**Detroit Sprawl:**
- Wayne County ZIPs vs Oakland/Macomb County ZIPs
- System competition creates market fragmentation
- Review travel times across metro

**Great Lakes:**
- Water creates boundaries
- Limited ferry systems (mostly recreational, not medical)

---

## Heuristics You May Use

**Evidence-Based Heuristics:**

1. **Dominant Hospital Systems:**
   - Which systems have facilities in/near this ZIP?
   - Which systems do residents recognize and use?
   - System market share data if available

2. **Ambulance Service Areas:**
   - Where do EMS units transport from this ZIP?
   - Ambulance catchments align with routine care patterns

3. **Insurance Networks:**
   - Which systems are in-network for major local employers?
   - Network design reflects anticipated utilization

4. **Referral Patterns:**
   - Where do local PCPs refer patients?
   - Which academic centers receive tertiary referrals?

5. **Travel Behavior:**
   - Common-sense local knowledge
   - "Would a resident actually drive this route for routine care?"
   - Consider rush hour, parking, total door-to-door time

**Geographic Heuristics:**

1. **Proximity with Barrier Check:**
   - Nearest market geographically
   - BUT verify no insurmountable barrier
   - Water, mountains, congestion may make "near" market inaccessible

2. **Interstate Corridors:**
   - I-5, I-95, I-10, etc. connect markets but don't integrate them
   - 60+ miles on interstate = separate markets

3. **State Capitals:**
   - Often regional healthcare hubs
   - But verify actual system presence, not just political status

**Avoid:**
- Speculative "if residents were smart they would use..." mapping
- Aspirational transit that doesn't exist or isn't used
- Perfect geometric patterns (reality is messy)

---

## What NOT to Do

❌ **Do NOT redefine, rename, merge, or split markets**
- Only use market_ids from `markets_<region>_COMPLETE.csv`
- If you think a market is missing, flag it but do NOT invent

❌ **Do NOT assign every ZIP to many markets**
- Most ZIPs: 1 primary only
- Some ZIPs: 1 primary + 1 secondary
- Rare ZIPs: 1 primary + 2 secondary
- Avoid: 1 primary + 3+ secondary (over-mapping)

❌ **Do NOT force ZIPs into statistically neat patterns**
- Reality is messy
- Border ZIPs have ambiguity
- Don't round off the edges artificially

❌ **Do NOT use CBSAs or counties as mapping proxies**
- Map ZIPs directly to markets based on behavior
- Don't look up "what CBSA is this ZIP in" first
- CBSAs are too large and heterogeneous

❌ **Do NOT ignore documented barriers**
- Regional prompts document water, mountains, congestion, state borders
- Market CSV notes document specific catchments
- Honor these explicitly

❌ **Do NOT assume transit enables integration without evidence**
- Check if transit actually serves hospitals
- Check if residents actually use it for medical appointments
- Most regions are car-dependent

❌ **Do NOT assume proximity = integration**
- 20 miles with mountain pass ≠ 20 miles on flat highway
- Bay Bridge queue ≠ multiple bridge options
- Check friction, not just distance

---

## Quality Control Checklist

### Per-ZIP Validation

Before finalizing each ZIP mapping, confirm:

1. ✅ **Primary market is realistic for routine care**
   - Would residents actually drive there for PCP visits?
   - Is it <45 minutes door-to-door in typical traffic?
   - Are there hospital systems residents recognize?

2. ✅ **Secondary markets reflect true specialty access**
   - Is there evidence of referral patterns?
   - Is it 45-60 minutes or accessible via transit?
   - Would a local provider agree with this assignment?

3. ✅ **The mapping would make sense to a local patient**
   - Does this match common-sense local behavior?
   - Would someone familiar with the area nod in agreement?

4. ✅ **Market IDs exist in regional CSV**
   - Every market_id is in `markets_<region>_COMPLETE.csv`
   - No typos, no invented markets

5. ✅ **Travel friction is realistic**
   - Typical weekday conditions (not rush hour worst case, not Sunday ideal)
   - Includes parking and walking time
   - Accounts for documented barriers

### Market-Level Validation

After mapping all ZIPs, verify:

1. ✅ **Every market has some ZIPs assigned**
   - All 62/71/42/etc. markets in the region appear in mappings
   - No orphaned markets with zero ZIPs

2. ✅ **ZIP population coverage makes sense**
   - Sum of ZIP populations approximates expected market population
   - No markets with unexpectedly high/low populations

3. ✅ **Border ZIPs align with market notes**
   - Market CSV notes document catchment areas
   - ZIP assignments honor documented boundaries

### Regional Validation

After completing region, verify:

1. ✅ **Cross-border ZIPs properly assigned**
   - OH-CINCINNATI includes Northern Kentucky ZIPs ✅
   - KY-LOUISVILLE-METRO includes Southern Indiana ZIPs ✅
   - OR-PORTLAND includes Vancouver WA ZIPs ✅
   - No duplication across regions ✅

2. ✅ **Regional barriers honored**
   - Water barriers (bays, rivers) reflected in assignments
   - Mountain barriers (passes, ranges) create separations
   - Congestion corridors create intra-metro splits
   - State borders respected except documented cross-border markets

3. ✅ **No systematic errors**
   - Spot-check samples of ZIPs in each market
   - Verify travel time estimates
   - Check for patterns suggesting mis-assignment

---

## Output Format

### CSV Structure

```csv
zip_code,market_id,relationship_type,mapping_rationale
85001,AZ-PHOENIX-CENTRAL,primary,Downtown Phoenix ZIP within 15-min of central medical district
85251,AZ-PHOENIX-EAST,primary,Scottsdale residents use HonorHealth and Mayo Clinic in East Valley
85251,AZ-PHOENIX-CENTRAL,secondary,Some residents access Banner downtown for specialty care
```

### Sorting
1. Primary: `zip_code` (ascending, 5-digit numeric)
2. Secondary: `relationship_type` (primary, secondary, tertiary)
3. Tertiary: `market_id` (alphabetical)

### Header Row
Required, exactly as shown:
```
zip_code,market_id,relationship_type,mapping_rationale
```

---

## Example Mappings

### Example 1: Core ZIP - Single Primary
```csv
zip_code,market_id,relationship_type,mapping_rationale
85001,AZ-PHOENIX-CENTRAL,primary,Downtown Phoenix ZIP uses central medical district within 15-min
```

### Example 2: Suburban ZIP - Primary + Secondary
```csv
zip_code,market_id,relationship_type,mapping_rationale
85251,AZ-PHOENIX-EAST,primary,Scottsdale residents primarily use HonorHealth Scottsdale and Mayo within 20-min
85251,AZ-PHOENIX-CENTRAL,secondary,Some residents access downtown Banner facilities for specialty care via I-10
```

### Example 3: Border ZIP - Equidistant
```csv
zip_code,market_id,relationship_type,mapping_rationale
85050,AZ-PHOENIX-NORTH,primary,Northern Phoenix ZIP slightly closer to Deer Valley hospitals
85050,AZ-PHOENIX-CENTRAL,secondary,Central medical district accessible via I-17 in 30-min
```

### Example 4: Cross-Border ZIP
```csv
zip_code,market_id,relationship_type,mapping_rationale
47130,KY-LOUISVILLE-METRO,primary,Jeffersonville IN residents cross I-65 bridges to Louisville hospitals in 20-min
```

### Example 5: Rural ZIP with Distance
```csv
zip_code,market_id,relationship_type,mapping_rationale
85920,AZ-FLAGSTAFF,primary,Northern Arizona rural ZIP uses Flagstaff Medical Center as closest facility
85920,AZ-PHOENIX-CENTRAL,secondary,Complex specialty cases referred to Phoenix academic centers 140 miles south
```

### Example 6: Transit-Enabled Secondary
```csv
zip_code,market_id,relationship_type,mapping_rationale
02138,MA-CAMBRIDGE,primary,Cambridge residents use local Cambridge Health Alliance for routine care
02138,MA-BOSTON-LONGWOOD,secondary,Red Line enables access to Longwood medical area for specialty care
```

### Example 7: Ferry-Dependent Separate Market
```csv
zip_code,market_id,relationship_type,mapping_rationale
98110,WA-BAINBRIDGE,primary,Bainbridge Island ZIP requires 35-min ferry making it separate market from Seattle
```

---

## Execution Checklist

### Before Starting

- [ ] Load `master_market.md` (national framework)
- [ ] Load `markets_<region>_UPDATED.md` (regional mobility factors)
- [ ] Load `markets_<region>_COMPLETE.csv` (valid market_ids)
- [ ] Obtain ZIP code database for region's states
- [ ] Review regional barrier documentation (water, mountains, congestion)

### During Mapping

- [ ] Start with obvious core ZIPs (anchor cities, downtown areas)
- [ ] Work outward from cores, checking travel times
- [ ] Mark uncertain/border ZIPs for detailed review
- [ ] Handle cross-border ZIPs per documented markets
- [ ] Assign secondary markets only with evidence

### After Mapping

- [ ] Verify every ZIP has exactly one primary
- [ ] Verify every market has some ZIPs
- [ ] Spot-check travel time estimates
- [ ] Verify cross-border assignments
- [ ] Check regional barriers honored
- [ ] Sort output correctly
- [ ] Generate clean CSV file

---

## Final Instruction

Output **only** the completed `zip_to_market_<region>.csv` file.

**Prioritize:**
1. Realistic patient choice over geographic elegance
2. Evidence-based assignments over assumptions
3. Behavioral accuracy over statistical convenience
4. Documented barriers over proximity alone

**Remember:**
- This enables price comparison for actual care alternatives
- Getting this wrong misleads patients about real options
- Border ambiguity is expected and acceptable
- Perfect clarity is less important than behavioral accuracy

The goal is to answer: **"Given this patient's ZIP code, which healthcare markets can they realistically access for routine and specialty care?"**
