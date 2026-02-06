# Regional Mapping Prompt: Northeast (ME, NH, VT, MA, RI, CT, NY, NJ, PA)

## Instructions

**Read `area_to_market_mapping_master.md` first.** This prompt adds Northeast regional specificity but does not override national rules.

---

## Geographic Scope

**States:** Maine (ME), New Hampshire (NH), Vermont (VT), Massachusetts (MA), Rhode Island (RI), Connecticut (CT), New York (NY), New Jersey (NJ), Pennsylvania (PA)

**Expected Output:** Approximately 240-280 mapping rows across 63 markets for this 9-state region.

---

## Critical Regional Context

The Northeast region has **exceptional market fragmentation complexity** due to:

1. **NYC CSA polycentric structure** (23M people, MUST split into 6-9+ markets)
2. **Extreme I-95 corridor congestion** (Boston to NYC to Philadelphia)
3. **Major water barriers** (East River, Hudson River, Delaware River, numerous harbors)
4. **Bridge and tunnel bottlenecks** (GW Bridge, Lincoln Tunnel, Tappan Zee, Tobin Bridge)
5. **Multi-state complexity** (9 states = 9 Medicaid programs, different licensing, network boundaries)
6. **Dense transit networks** (NYC Subway, MBTA, but LIMITED medical travel integration)
7. **Mountain barriers** (Adirondacks, White Mountains, Green Mountains, Appalachians)

**KEY PRINCIPLE:** The Northeast is the most densely populated region but also has the most congestion. The 45-minute rule is constantly violated despite short distances.

**ACTUAL MARKETS DEFINED:** 63 markets (higher than initial projection of 40-50, reflecting true market fragmentation in this dense region)

---

## Region-Specific Friction Factors

### ABSOLUTE BARRIERS (Markets NEVER Share Statistical Areas Across These)

#### 1. NYC East River Crossings (Manhattan ↔ Outer Boroughs)

**Geography:**
- **Limited crossing capacity:** ~20 bridges/tunnels connecting Manhattan to Brooklyn, Queens, Bronx
- **Bottleneck severity:** 30-60 min delays typical during daytime hours
- **No ferry alternative** for most hospital trips (Staten Island Ferry is exception)

**Market Impact:**
- Manhattan should be separate market from each outer borough
- Each borough has built independent anchor systems because residents won't cross to Manhattan for routine care
- Bridges create friction even within boroughs (Brooklyn ↔ Queens via Kosciuszko Bridge)

**Critical crossing analysis:**

**Manhattan ↔ Brooklyn:**
- Brooklyn Bridge, Manhattan Bridge, Williamsburg Bridge: All congested 30-60 min
- Creates Manhattan vs Brooklyn market split

**Manhattan ↔ Queens:**
- Queensboro (59th Street) Bridge, Queens-Midtown Tunnel: 30-45 min typical
- Creates Manhattan vs Queens market split

**Manhattan ↔ Bronx:**
- Multiple Harlem River bridges but congestion creates friction
- Montefiore dominance in Bronx creates natural market split

**Brooklyn ↔ Queens:**
- Kosciuszko Bridge, Brooklyn-Queens Expressway: Congestion creates east-west friction

**Test:** If mapping shows Manhattan sharing statistical areas with Brooklyn or Queens without ZIP-level splits → **CRITICAL ERROR**

**Expected markets:**
- **NY-NYC-MANHATTAN** — NYU Langone, Mount Sinai, NewYork-Presbyterian
- **NY-NYC-BROOKLYN** — Maimonides, NYU Brooklyn, SUNY Downstate
- **NY-NYC-QUEENS** — NYC H+H/Queens, Northwell Queens presence
- **NY-NYC-BRONX** — Montefiore dominance
- **NY-NYC-STATEN** — Staten Island University Hospital (ferry connects to Manhattan but island identity)

#### 2. Hudson River Crossings (NY ↔ NJ, Manhattan ↔ Westchester)

**Geography:**
- **George Washington Bridge (I-95):** Nation's busiest bridge, 30-60 min delays typical
- **Lincoln Tunnel:** Manhattan ↔ NJ, chronic congestion
- **Holland Tunnel:** Lower Manhattan ↔ NJ, congestion
- **Tappan Zee / Mario Cuomo Bridge (I-87/I-287):** Westchester ↔ Rockland County, tolls + congestion

**Market Impact:**
- Northern New Jersey MUST be separate from Manhattan despite proximity
- Westchester County may be separate from Manhattan OR integrate via Metro-North (decision point)
- Hudson County NJ (Jersey City, Hoboken) closest to Manhattan but still separate due to tunnel congestion

**Test:** If mapping shows North Jersey integrated with Manhattan → **Verify <45 min door-to-door**

**Expected markets:**
- **NJ-NORTHJERSEY** (or split into NJ-HUDSON, NJ-BERGEN, NJ-ESSEX) — Hackensack Meridian, RWJBarnabas
- **NY-WESTCHESTER** — White Plains, New Rochelle (may be separate OR integrated with NYC)
- **NY-ROCKLAND** — Nyack (Tappan Zee crossing creates separation)

#### 3. Delaware River Crossings (PA ↔ NJ)

**Geography:**
- Multiple bridge crossings between Philadelphia and South Jersey
- **Ben Franklin Bridge, Walt Whitman Bridge, Betsy Ross Bridge:** All create friction despite short distance
- Tolls + congestion typical

**Market Impact:**
- South Jersey (Camden, Cherry Hill) separate from Philadelphia despite proximity
- Delaware River creates psychological and practical barrier
- Different states, different Medicaid programs reinforce split

**Test:** If mapping shows Camden County NJ integrated with Philadelphia → **HIGH SEVERITY WARNING** (verify behavioral patterns)

**Expected markets:**
- **PA-PHILLY-CORE** — Penn Medicine, Jefferson, Temple
- **NJ-SOUTHJERSEY** (or NJ-CAMDEN) — Cooper University, Virtua Health

#### 4. Mountain Barriers (VT, NH, NY, PA)

**White Mountains (NH):**
- Creates hard east-west barrier across New Hampshire
- **I-93 corridor:** Only north-south route through notches
- **Route 112 (Kancamagus Highway):** Scenic but NOT viable for routine medical travel (2-lane, winter closures)
- **Market Impact:** White Mountains region isolated, Dartmouth-Hitchcock serves Upper Valley

**Green Mountains (VT):**
- North-south spine creates east-west isolation
- **I-91 corridor (east):** Connecticut River Valley route
- **Route 7 corridor (west):** Lake Champlain route
- Limited east-west crossings
- **Market Impact:** Burlington dominates western VT, Upper Valley (Dartmouth) serves eastern VT

**Adirondack Mountains (NY):**
- Creates hard barrier between Albany and North Country
- **I-87 (Northway):** Only route north but creates isolation
- **Market Impact:** Plattsburgh completely separate from Albany (150+ miles, 2.5+ hours)

**Appalachian Mountains (PA):**
- Create east-west barriers across Pennsylvania
- **I-80, I-76 (Pennsylvania Turnpike), I-81:** Limited crossing corridors
- **Market Impact:** Pittsburgh isolated from Philadelphia (300+ miles, 5+ hours), Scranton/Wilkes-Barre separate from both

**Test:** If route requires mountain pass >2,000 ft elevation with winter closure risk → Markets are separate

#### 5. Long Island (NY) Water Isolation

**Geography:**
- **Limited Manhattan access:** LIRR requires transfer to reach most hospitals, 60+ min door-to-door
- **Limited bridge capacity:** Throgs Neck, Whitestone (to Bronx/Queens), limited direct Manhattan access
- **Sound crossing:** No bridge to Connecticut (ferry only)

**Market Impact:**
- Long Island MUST be separate market from Manhattan
- Northwell Health built Long Island dominance because residents can't easily reach Manhattan
- LIRR is commuter-focused, poor medical access (requires transfer)

**Test:** If mapping shows Long Island (Nassau, Suffolk counties) integrated with Manhattan → **CRITICAL ERROR**

**Expected markets:**
- **NY-LONGISLAND** (may split into Nassau vs Suffolk) — Northwell Health dominance

### SEVERE BARRIERS (Create Friction But May Not Always Split Markets)

#### 6. I-95 Corridor Congestion (Boston → NYC → Philadelphia)

**Boston to Providence:**
- **Distance:** 50 miles
- **Travel time:** 60-90 min typical via I-95 congestion
- **No transit connection** (MBTA doesn't extend to Providence)
- **Market Impact:** Providence MUST be separate from Boston

**Providence to New Haven:**
- **Distance:** 100 miles
- **Travel time:** 90-120 min via I-95
- **Market Impact:** Separate markets

**New Haven to Stamford:**
- **Distance:** 45 miles
- **Travel time:** 60+ min via I-95 (Merritt Parkway alternate)
- **Market Impact:** May be single CT corridor OR split into New Haven vs Southwestern CT

**Stamford to NYC:**
- **Distance:** 35 miles
- **Travel time:** 60+ min via I-95/I-287
- **Metro-North:** Exists but commuter-focused, requires transfer to hospitals
- **Market Impact:** Southwestern CT separate from NYC despite Metro-North

**NYC to Philadelphia:**
- **Distance:** 95 miles
- **Travel time:** 2+ hours via I-95 through New Jersey Turnpike
- **No transit connection**
- **Market Impact:** Completely separate markets

**Test:** No market should span >60 miles along I-95 corridor without documented transit integration

#### 7. I-287 Beltway (NY/NJ)

**Geography:**
- Circumferential highway around NYC through NJ, Westchester, Rockland
- Chronic congestion despite being "beltway"
- **Tappan Zee crossing:** Major bottleneck

**Market Impact:**
- Creates friction even within suburban ring
- Northern NJ (Bergen, Passaic) may be separate from Central NJ (Middlesex, Somerset)
- Westchester may be separate from Rockland

#### 8. Boston Region Water Barriers

**Harbor crossings:**
- **Tobin Bridge:** Boston ↔ North Shore, creates friction despite short distance
- **Callahan/Sumner Tunnels:** East Boston ↔ downtown, Logan Airport traffic creates congestion
- **No bridge to South Shore:** Route 3 distance creates South Shore separation

**Market Impact:**
- North Shore (Beverly, Salem) separate from Boston via Tobin Bridge + Route 1 congestion
- South Shore (Plymouth, Brockton) separate from Boston via distance + limited transit
- Cambridge MAY integrate with Boston via MBTA Red Line (decision point)

---

## Transit Systems and Market Integration

### NYC Subway — DOES Collapse Some Markets (UNIQUE IN NATION)

**NYC Subway is the ONLY transit system in the US that truly collapses healthcare markets.**

**Why NYC Subway is different:**
- 24/7 operation (medical emergencies any time)
- Extremely high frequency (trains every 2-10 minutes)
- Direct hospital access (many hospitals have subway entrances)
- Routinely used for medical appointments (not just commuting)
- Covers all 5 boroughs densely

**However, even NYC Subway has limits:**

**Subway Integration Test (4-Step Process):**

1. **Does subway directly connect both anchors?**
   - Manhattan ↔ parts of Brooklyn via 4/5 trains to Brooklyn Hospital: ✅ YES
   - Manhattan ↔ Queens via 7/E/F trains: ⚠️ YES but 45+ min from hospitals
   - Manhattan ↔ Bronx via 4/D trains to Montefiore: ✅ YES
   - Manhattan ↔ Staten Island: ❌ NO (ferry + subway = 90+ min)

2. **Is frequency ≥15 minutes 24/7?**
   - ✅ YES for most lines (2-10 min frequency typical)

3. **Is trip time <45 min door-to-door?**
   - Depends on specific origin/destination
   - Manhattan hospitals ↔ inner Brooklyn: ~30 min ✅
   - Manhattan hospitals ↔ outer Queens: ~60 min ❌
   - Manhattan hospitals ↔ South Bronx: ~40 min ⚠️

4. **Do residents actually use subway for medical appointments?**
   - ✅ YES — documented high usage for hospital access

**Decision: NYC boroughs MAY partially integrate via subway**

**Three possible approaches:**

**Option A — Conservative (Recommended):**
- Split each borough into separate market
- Rationale: Each borough has built independent anchors, distinct identity
- Manhattan, Brooklyn, Queens, Bronx, Staten Island = 5 markets

**Option B — Moderate:**
- Combine Manhattan + inner Brooklyn + South Bronx (subway-accessible)
- Outer Brooklyn, Queens, Staten Island separate
- 3-4 markets total

**Option C — Aggressive:**
- Single NYC market (NOT recommended — too large, 8M people)

**This mapping recommends Option A** due to:
- Distinct anchor systems per borough
- Behavioral patterns show residents prefer local care
- Subway friction still exists (30-60 min typical)
- Easier to map programmatically with separate markets

### MBTA (Boston) — LIMITED Integration

**MBTA Red Line (THE Critical Test for Boston Integration):**

**Medical district access:**
- **Longwood Medical Area:** Accessible via Green Line (E), Orange Line, Red Line (transfers)
- **Mass General:** Accessible via Red Line (Charles/MGH station) ✅
- **Boston Medical Center:** Accessible via Orange Line ✅
- **Cambridge hospitals:** Accessible via Red Line ✅

**Red Line Integration Test:**

1. **Does Red Line directly connect both anchors?**
   - Boston (MGH) ↔ Cambridge (Mount Auburn): ✅ YES via Red Line (15 min)
   - Boston ↔ Quincy: ⚠️ YES but 35+ min
   - Boston ↔ Braintree: ❌ 45+ min (exceeds threshold)

2. **Is frequency ≥15 minutes midday?**
   - ✅ YES (Red Line runs every 10-15 min midday)

3. **Is trip time <45 min door-to-door?**
   - Boston ↔ Cambridge: ✅ ~25 min
   - Boston ↔ Somerville: ✅ ~20 min
   - Boston ↔ Quincy: ⚠️ ~40 min (marginal)

4. **Do residents actually use Red Line for medical appointments?**
   - Plausible for Boston ↔ Cambridge (Longwood area, MGH)
   - Less plausible for longer distances

**Decision: Boston MAY integrate Cambridge/Somerville via Red Line**

**Two possible approaches:**

**Option A — Integrated Boston:**
- Single market: Boston + Cambridge + Somerville
- Rationale: Red Line creates <30 min access to Longwood/MGH
- Distinct from: North Shore, South Shore, Worcester

**Option B — Separate Cambridge:**
- MA-BOSTON-CORE (Boston proper)
- MA-CAMBRIDGE (Cambridge/Somerville)
- Rationale: Cambridge has distinct identity despite Red Line

**This mapping recommends Option A** (integrated) due to:
- Red Line frequent service
- Longwood Medical Area serves both Boston and Cambridge residents
- MGH accessible from Cambridge in 15 min

**MBTA Commuter Rail — Does NOT Collapse Markets**

**Why commuter rail doesn't justify integration:**
- Peak-direction only (toward Boston AM, outward PM)
- Poor midday frequency (30-60 min headways)
- Requires subway transfer to reach most hospitals
- Designed for work trips, not medical access

**CRITICAL RULE:** MBTA Commuter Rail should NOT justify integrating:
- Worcester with Boston (45+ min, no direct hospital access)
- Providence with Boston (60+ min, requires transfer)
- North Shore with Boston (requires subway transfer)

### Metro-North (NYC) — Does NOT Collapse Markets

**Why Metro-North doesn't justify integration:**
- Grand Central ↔ suburban CT/Westchester
- Requires subway transfer to reach most NYC hospitals
- Peak-direction commuter service
- Poor reverse direction for medical appointments

**CRITICAL RULE:** Metro-North should NOT justify integrating:
- Stamford/New Haven with Manhattan (commuter rail, requires transfer)
- Westchester with Manhattan (requires transfer, 60+ min door-to-door)

**Test:** If rationale says "Metro-North connects to NYC" → **HIGH SEVERITY ERROR**

### NJ Transit — Does NOT Collapse Markets

**Why NJ Transit doesn't justify integration:**
- Penn Station requires subway/walk to most hospitals
- Peak-direction commuter service
- PATH train (Hoboken/Jersey City to Manhattan) marginally better but still requires transfer

**CRITICAL RULE:** NJ Transit should NOT justify integrating North Jersey with Manhattan.

### SEPTA (Philadelphia) — LIMITED Integration

**Why SEPTA has minimal impact:**
- Regional Rail requires transfer to reach most hospitals
- Market-Frankford Line serves Temple but limited
- Limited medical district access

**Decision:** SEPTA does NOT materially collapse Philadelphia suburban markets.

### Ferry Systems (NYC/Boston)

**Staten Island Ferry (NYC):**
- Free, 24/7, high frequency (every 15-30 min)
- Connects Staten Island to Manhattan
- **However:** Still requires subway/walk after ferry (90+ min total)
- **Decision:** Ferry reduces friction but Staten Island still separate market

**Boston Harbor Ferries:**
- Limited routes, limited hours
- Not material for healthcare integration

---

## Known Market Fragmentation Patterns (CRITICAL)

### The NYC CSA Split (MOST CRITICAL DECISION)

**NYC CSA (23M people) is the largest metro area in the US and MUST be split into 6-9+ markets.**

This is the **#1 source of errors** in Northeast mappings. NYC is NOT one market.

**NYC CSA MUST decompose into multiple markets:**

#### New York City Markets (4 boroughs = 4 markets defined):

**CRITICAL: Actual markets show 4 NYC boroughs, NOT 5. Brooklyn is missing from market list.**

1. **NY-NYC-MANHATTAN**
   - Counties: New York County (36061) — single county, no ZIP list needed
   - Anchors: NYU Langone, Mount Sinai, NewYork-Presbyterian (Columbia, Weill Cornell)
   - Geography: Manhattan proper, dense urban core
   - Separated from all outer boroughs by East River (30-60 min bridge/tunnel delays)

2. **NY-NYC-BROOKLYN**
   - Counties: Kings County (36047) — single county, no ZIP list needed
   - Anchors: NYC Health + Hospitals, Maimonides, NYU Langone Brooklyn
   - Geography: Brooklyn borough entire
   - Separated from Manhattan by Brooklyn/Manhattan/Williamsburg Bridges (30-60 min)

3. **NY-NYC-QUEENS**
   - Counties: Queens County (36081) — single county, no ZIP list needed
   - Anchors: NYC Health + Hospitals, Northwell Health
   - Geography: Queens borough entire
   - Separated from Manhattan by Queensboro Bridge/Queens-Midtown Tunnel (30-45 min)

4. **NY-NYC-BRONX**
   - Counties: Bronx County (36005) — single county, no ZIP list needed
   - Anchors: Montefiore Health System dominance
   - Geography: Bronx borough entire
   - Separated from Manhattan by Harlem River bridges (30-45 min to most hospitals)

5. **NY-NYC-STATEN**
   - Counties: Richmond County (36085) — single county, no ZIP list needed
   - Anchors: Staten Island University Hospital, Richmond University Medical Center
   - Geography: Staten Island borough entire
   - Separated from Manhattan by Verrazano Bridge OR Staten Island Ferry + subway (60-90 min)

**Alternative Option (if behavioral data supports):**
- Combine Manhattan + inner Brooklyn + South Bronx via subway integration
- Requires strong evidence that residents cross for routine care

#### Surrounding NYC Markets (9 additional markets defined):

6. **NY-LONGISLAND** (Nassau + Suffolk Counties)
   - Counties: Nassau County (36059), Suffolk County (36103)
   - Anchors: Northwell Health dominance
   - Geography: Long Island entire
   - Separated from Manhattan by LIRR 60+ min + transfer, limited bridge access

7. **NY-WESTCHESTER** (Westchester County)
   - Counties: Westchester County (36119)
   - Anchors: Montefiore Health, NewYork-Presbyterian
   - Geography: Westchester County entire
   - Separated from Manhattan by Harlem River bridges + congestion 45-60 min
   - Metro-North exists but requires transfer

8. **NY-HUDSON-VALLEY** (Poughkeepsie)
   - Counties: Dutchess County (36027), potentially others
   - Anchors: Vassar Brothers, Health Quest
   - Geography: Mid-Hudson region
   - 60+ min from both Westchester and Albany

9. **NY-KINGSTON** (Ulster County)
   - Counties: Ulster County (36111)
   - Anchors: HealthAlliance Hospital
   - Geography: Mid-Hudson, separate from Poughkeepsie

10. **NJ-JERSEY-CITY** (Hudson County)
    - Counties: Hudson County (34017)
    - Anchors: RWJBarnabas Health, CarePoint Health
    - Geography: Hudson River waterfront (Jersey City, Hoboken)
    - Separated from Manhattan by tunnel/ferry but independent routine care

11. **NJ-HACKENSACK** (Northern New Jersey)
    - Counties: Bergen County (34003), possibly Passaic County (34031)
    - Anchors: Hackensack Meridian, Valley Health System
    - Geography: Bergen County anchor
    - Separated from Manhattan by George Washington Bridge congestion

12. **NJ-NEWARK** (Greater Newark)
    - Counties: Essex County (34013)
    - Anchors: RWJBarnabas, University Hospital
    - Geography: Essex County anchor
    - NJ Transit access but independent from NYC healthcare

13. **NJ-MORRISTOWN** (North Central New Jersey)
    - Counties: Morris County (34027)
    - Anchors: Atlantic Health System
    - Geography: Morris County hub
    - I-287 congestion separates from NYC and Hackensack

14. **CT-NORWALK** (Southwestern Connecticut)
    - Counties: Fairfield County (09001)* — likely shares with other CT markets
    - Anchors: Norwalk Hospital, Stamford Hospital
    - Geography: Coastal Fairfield County I-95 corridor
    - Separated from NYC by I-95 congestion despite Metro-North

**IMPORTANT: Fairfield County (09001) is shared by multiple CT markets:**
- CT-NORWALK (coastal: Norwalk, Stamford)
- CT-BRIDGEPORT (coastal: Bridgeport)
- CT-DANBURY (inland: Danbury)
- **REQUIRES ZIP-LEVEL SPLITS for all three markets**

**CRITICAL TEST:** NYC CSA must split into minimum 6 markets, ideally 8-10 for accurate representation.

### The Boston Region Split (4 Markets Defined)

**Boston metro has 4.9M people and is split into 4 markets:**

1. **MA-BOSTON-CORE** (Boston + Cambridge integrated)
   - Counties: Suffolk County (25025), Middlesex County (25017)* partial
   - Anchors: Mass General Brigham, Tufts Medical, Boston Medical Center
   - Geography: Boston proper + Cambridge/Somerville via Red Line
   - Integrated via MBTA Red Line <30 min to Longwood/MGH
   - **REQUIRES: Middlesex County ZIP list** (shares with other MA markets)

2. **MA-BOSTON-NORTH** (North Shore)
   - Counties: Essex County (25009)* partial
   - Anchors: Mass General Brigham, Beth Israel Lahey Health
   - Geography: Salem, Beverly, Lynn, Peabody area
   - Separated from Boston by Tobin Bridge + Route 1 congestion (45+ min)
   - **POSSIBLE: Essex County ZIP list if shares with other markets**

3. **MA-BOSTON-SOUTH** (South Shore)
   - Counties: Plymouth County (25023), Norfolk County (25021)* possible, Bristol County (25005)* possible
   - Anchors: Beth Israel Lahey Health, Steward Health Care
   - Geography: Brockton, Plymouth, Quincy area
   - Separated from Boston by distance, limited MBTA access
   - **POSSIBLE: Norfolk/Bristol County ZIP lists if shared**

4. **MA-WORCESTER** (DEFINITE separate market)
   - Counties: Worcester County (25027)
   - Anchors: UMass Memorial Health, Saint Vincent Hospital
   - Geography: Worcester city and suburbs
   - Completely separate from Boston (45+ miles, 60+ min, no transit)

**Additional Massachusetts Markets (Not Boston Region):**

5. **MA-SPRINGFIELD** (Western Massachusetts)
   - Counties: Hampden County (25013), Hampshire County (25015)* possible
   - Anchors: Baystate Health
   - Geography: Pioneer Valley, Springfield metro
   - Isolated from Boston by 90+ min distance

### The Philadelphia Region Split (8 Markets Defined)

**Philadelphia metro has 6.2M people and is split into 8 markets:**

1. **PA-PHILLY-CORE** (Philadelphia City)
   - Counties: Philadelphia County (42101)
   - Anchors: Penn Medicine, Jefferson Health, Temple Health
   - Geography: Philadelphia city proper, Center City, University City

2. **PA-PHILLY-SUBURBS** (Montgomery/Delaware County suburbs)
   - Counties: Montgomery County (42091), Delaware County (42045)* may share, Chester County (42029)* possible
   - Anchors: Main Line Health, Jefferson Health
   - Geography: King of Prussia, Main Line suburbs
   - Independent routine care despite tertiary referrals to city

3. **NJ-CAMDEN** (South Jersey)
   - Counties: Camden County (34007), Gloucester County (34015), Burlington County (34005)* partial
   - Anchors: Cooper University, Virtua Health
   - Geography: South Jersey across Delaware River
   - Separated from Philadelphia by Delaware River bridges + tolls

4. **NJ-NEWBRUNSWICK** (Central New Jersey)
   - Counties: Middlesex County (34023), Mercer County (34021)* possible
   - Anchors: RWJBarnabas, Robert Wood Johnson University Hospital
   - Geography: Central corridor between NYC and Philadelphia

5. **NJ-TRENTON** (Capital Region)
   - Counties: Mercer County (34021)
   - Anchors: Capital Health System
   - Geography: Capital region, Delaware River friction

6. **PA-READING** (Greater Reading)
   - Counties: Berks County (42011)
   - Anchors: Tower Health
   - Geography: Reading city and suburbs
   - Separated from Philadelphia by 60+ miles, 60-90 min

7. **PA-ALLENTOWN** (Lehigh Valley)
   - Counties: Lehigh County (42077), Northampton County (42095)
   - Anchors: Lehigh Valley Health Network
   - Geography: Allentown, Bethlehem, Easton
   - Separated from Philadelphia by 60+ miles via I-78

8. **PA-LANCASTER** (Lancaster County)
   - Counties: Lancaster County (42071)
   - Anchors: Penn Medicine Lancaster General, WellSpan Health
   - Geography: Lancaster city and county
   - 60+ min from both Harrisburg and Philadelphia

**Additional Pennsylvania Markets:**

9. **PA-HARRISBURG** (Capital Region)
   - Counties: Dauphin County (42043), Cumberland County (42041)* possible
   - Anchors: Penn State Health, UPMC, WellSpan Health
   - Geography: Capital region, central Pennsylvania

10. **PA-YORK** (York County)
    - Counties: York County (42133)
    - Anchors: WellSpan Health
    - Geography: Between Harrisburg and Baltimore, Maryland border

11. **PA-SCRANTON** (Northeastern PA)
    - Counties: Lackawanna County (42069), Luzerne County (42079)
    - Anchors: Geisinger, Commonwealth Health
    - Geography: Wyoming Valley, PA/NY border

12. **PA-WILLIAMSPORT** (North Central PA)
    - Counties: Lycoming County (42081)
    - Anchors: UPMC Susquehanna
    - Geography: Rural hub, northern tier

**IMPORTANT: Potential shared counties requiring ZIP lists:**
- **Delaware County PA (42045):** May be shared by Philly-Core and Philly-Suburbs
- **Burlington County NJ (34005):** May be shared by Camden and NewBrunswick/Toms River
- **Mercer County NJ (34021):** May be shared by Trenton and NewBrunswick

### Upstate New York Markets (4 Separate Markets)

**CRITICAL: Do NOT consolidate these. Each is 60-100 miles apart:**

1. **NY-ALBANY** (Albany-Schenectady-Troy)
   - Counties: Albany County (36001), Schenectady County (36093), Rensselaer County (36083), Saratoga County (36091)
   - Anchors: Albany Medical Center, Ellis Hospital
   - Geography: Capital Region

2. **NY-SYRACUSE**
   - Counties: Onondaga County (36067)
   - Anchors: Upstate University Hospital
   - Geography: Syracuse metro
   - Completely separate from Albany (150 miles, 2.5 hours)

3. **NY-ROCHESTER**
   - Counties: Monroe County (36055)
   - Anchors: Strong Memorial, Rochester Regional
   - Geography: Rochester metro
   - Completely separate from Syracuse (90 miles, 1.5 hours)

4. **NY-BUFFALO**
   - Counties: Erie County (36029), Niagara County (36063)
   - Anchors: Kaleida Health, Catholic Health
   - Geography: Buffalo-Niagara metro
   - Completely separate from Rochester (75 miles, 1.5 hours)

**Test:** If any Upstate NY markets integrated → **CRITICAL ERROR** (distances exceed threshold)

### Connecticut Markets (6 Markets Defined)

**Connecticut has 6 markets along I-95 and I-84 corridors:**

1. **CT-NORWALK** (Coastal Fairfield County)
   - Counties: Fairfield County (09001)* — REQUIRES ZIP list (shared with Bridgeport and Danbury)
   - Anchors: Norwalk Hospital, Stamford Hospital
   - Geography: Southwest Connecticut I-95 corridor (Norwalk, Stamford)
   - Separated from NYC by I-95 congestion despite Metro-North

2. **CT-BRIDGEPORT** (Greater Bridgeport)
   - Counties: Fairfield County (09001)* — REQUIRES ZIP list (shared with Norwalk and Danbury)
   - Anchors: St. Vincent's Medical Center, Bridgeport Hospital
   - Geography: Fairfield County coastal (Bridgeport, Fairfield, Stratford)
   - Independent anchors separate from NYC and New Haven

3. **CT-DANBURY** (Western Connecticut)
   - Counties: Fairfield County (09001)* — REQUIRES ZIP list (shared with Norwalk and Bridgeport)
   - Anchors: Danbury Hospital, Nuvance Health
   - Geography: Western Connecticut I-84 corridor (Danbury, Ridgefield)
   - Congestion barriers to Hartford and NYC

4. **CT-NEWHAVEN** (Greater New Haven)
   - Counties: New Haven County (09009)* — may share with Waterbury
   - Anchors: Yale New Haven Health System
   - Geography: New Haven, Milford, West Haven
   - Academic medical center dominance
   - Metro-North exists but doesn't collapse NYC market (commuter-focused)

5. **CT-WATERBURY** (Greater Waterbury)
   - Counties: New Haven County (09009)* — REQUIRES ZIP list if shares with New Haven
   - Anchors: Waterbury Hospital, Saint Mary's Hospital
   - Geography: Central Connecticut valley (Waterbury)
   - Separate from Hartford and New Haven

6. **CT-HARTFORD** (Greater Hartford)
   - Counties: Hartford County (09003), Tolland County (09013)* possible
   - Anchors: Hartford HealthCare, Trinity Health
   - Geography: Central Connecticut anchor, state capital
   - Independent from Boston and NYC with I-84/I-91 congestion

**CRITICAL: Fairfield County (09001) shared by THREE markets → All three MUST have ZIP lists:**
- CT-NORWALK (coastal southwest: Norwalk, Stamford area)
- CT-BRIDGEPORT (coastal central: Bridgeport, Fairfield, Stratford area)
- CT-DANBURY (inland west: Danbury, Ridgefield area)

**Behavioral boundaries for Fairfield County ZIP assignment:**
- **I-95 corridor (coastal):** Divide between Norwalk (southwest) and Bridgeport (central) zones
- **Inland Route 7 corridor:** Danbury zone
- **Merritt Parkway:** May serve as east-west boundary

---

## Counties Requiring ZIP-Level Splits (HIGH PROBABILITY)

Based on actual market definitions from markets_northeast.csv, these counties WILL be shared by multiple markets and MUST have ZIP lists:

### Fairfield County CT (09001) — DEFINITE SPLIT (3 markets share)

**Markets sharing Fairfield County:**
- CT-NORWALK (southwest coastal: Norwalk, Stamford)
- CT-BRIDGEPORT (central coastal: Bridgeport, Fairfield, Stratford)
- CT-DANBURY (inland western: Danbury, Ridgefield)

**Behavioral boundaries:**
- **I-95 corridor:** Coastal cities (Norwalk zone vs Bridgeport zone)
- **Merritt Parkway:** May divide coastal from inland
- **Route 7 corridor:** Inland Danbury zone
- **City limits:** Norwalk, Stamford, Bridgeport, Fairfield as anchor points

**Required Action:**
All three markets MUST have explicit ZIP lists. This is the most complex county in Connecticut for market mapping.

**Estimated ZIP count:** Fairfield County has ~40 ZIPs. Distribution:
- CT-NORWALK: ~10-15 ZIPs (Norwalk, Stamford, Darien, New Canaan area)
- CT-BRIDGEPORT: ~15-20 ZIPs (Bridgeport, Fairfield, Stratford, Trumbull area)
- CT-DANBURY: ~10-15 ZIPs (Danbury, Ridgefield, Bethel, Brookfield area)

### Middlesex County MA (25017) — DEFINITE SPLIT (Boston-Core shares with others)

**Markets sharing Middlesex County:**
- MA-BOSTON-CORE (Cambridge, Somerville, inner suburbs via Red Line)
- Potentially other markets in outer Middlesex (Lowell area, if market exists)

**Behavioral boundary:**
- **MBTA Red Line extent:** Cambridge/Somerville within Red Line access → Boston-Core
- **Distance from Boston:** Outer Middlesex beyond Red Line → Separate or North Shore integration

**Required Action:**
MA-BOSTON-CORE must have ZIP list for inner Middlesex County (Cambridge 02138-02142, Somerville 02143-02145, Medford, Malden areas)

### New Haven County CT (09009) — POSSIBLE SPLIT

**Markets potentially sharing:**
- CT-NEWHAVEN (New Haven, Milford, West Haven)
- CT-WATERBURY (Waterbury, northern county)

**Behavioral boundary:**
- **I-91 corridor:** New Haven zone along I-91 south
- **I-84 corridor:** Waterbury zone along I-84 west
- **Geographic split:** Roughly divides along Route 8 corridor

**IF both markets claim New Haven County → ZIP lists required**

### Essex County MA (25009) — POSSIBLE SPLIT

**Markets potentially sharing:**
- MA-BOSTON-NORTH (Salem, Beverly, Lynn, Peabody)
- MA-BOSTON-CORE (if extends to inner Essex)

**Less likely to need split based on market definitions, but verify if MA-BOSTON-CORE claims any Essex County ZIPs**

### Burlington County NJ (34005) — POSSIBLE SPLIT

**Markets potentially sharing:**
- NJ-CAMDEN (southern Burlington, closer to Philadelphia)
- NJ-NEWBRUNSWICK or NJ-TOMS-RIVER (northern Burlington)

**Behavioral boundary:**
- **North-south divide:** Burlington Township as potential boundary
- **I-295 corridor:** May serve as dividing line

### Delaware County PA (42045) — POSSIBLE SPLIT

**Markets potentially sharing:**
- PA-PHILLY-CORE (inner Delaware County, closer to Philadelphia)
- PA-PHILLY-SUBURBS (western Delaware County, Main Line)

**Behavioral boundary:**
- **City of Philadelphia limits:** Inner vs suburban divide
- **Main Line identity:** Western Delaware County distinct from urban core

### Mercer County NJ (34021) — POSSIBLE SPLIT

**Markets potentially sharing:**
- NJ-TRENTON (Trenton anchor)
- NJ-NEWBRUNSWICK (northern Mercer)

**Behavioral boundary:**
- **Trenton city limits:** Capital city core vs northern suburbs

### Additional Counties That May Require ZIP Lists (Verify):

- **Norfolk County MA (25021):** May be shared by Boston-Core and Boston-South
- **Bristol County MA (25005):** May be shared by Boston-South and Providence
- **Hampden County MA (25013):** Springfield anchor, verify if shares with others
- **Cumberland County PA (42041):** Harrisburg area, verify if shares
- **Dutchess County NY (36027):** Hudson Valley, verify if shares with Kingston
- **Tolland County CT (09013):** Hartford area, verify if shares

---

## Critical Data Quality Checks (Based on Mid-Atlantic/California QA)

Before finalizing, verify:

### 1. CSA Usage Check
- [ ] **ZERO** markets use CSA as primary statistical area
- [ ] NYC CSA NOT used as single primary
- [ ] Boston CSA NOT used as single primary
- [ ] Philadelphia CSA NOT used as single primary

### 2. NYC Borough Separation
- [ ] Manhattan (NY-NYC-MANHATTAN) separate from Brooklyn (NY-NYC-BROOKLYN)
- [ ] Manhattan separate from Queens (NY-NYC-QUEENS)
- [ ] Manhattan separate from Bronx (NY-NYC-BRONX)
- [ ] Staten Island (NY-NYC-STATEN) separate from all
- [ ] Long Island (NY-LONGISLAND) separate from Manhattan
- [ ] NOTE: Actual markets use inconsistent naming (NY-NYC-BROOKLYN, NY-NYC-BRONX vs NY-NYC-MANHATTAN, NY-NYC-QUEENS, NY-NYC-STATEN)

### 3. Major Metro Separation
- [ ] Boston separate from Worcester (60+ miles, no transit)
- [ ] Boston separate from Providence (60+ miles, I-95 congestion, no transit)
- [ ] Philadelphia separate from NYC (95+ miles, 2+ hours, no transit)
- [ ] Upstate NY metros NOT consolidated (Albany, Syracuse, Rochester, Buffalo all separate)

### 4. ZIP List Requirements
- [ ] Any county shared by 2+ markets has zip_list for each market
- [ ] Single-market counties have blank zip_list
- [ ] Format correct: "12345,12346,12347"

### 5. ZIP List Overlap Check
- [ ] NO overlapping ZIPs across markets for any shared county
- [ ] Each ZIP appears in exactly ONE market per county

### 6. Transit Integration Check
- [ ] NYC Subway mentioned only for possible Manhattan-borough integration (if any)
- [ ] MBTA Red Line mentioned only for Boston-Cambridge integration (if any)
- [ ] Metro-North NOT used to integrate Stamford/Westchester with Manhattan
- [ ] NJ Transit NOT used to integrate North Jersey with Manhattan
- [ ] MBTA Commuter Rail NOT used to integrate Worcester/Providence with Boston
- [ ] Specific transit lines mentioned (not generic "transit connects")

### 7. Bridge/Tunnel Barrier Check
- [ ] George Washington Bridge documented as NY-NJ barrier
- [ ] East River crossings documented as Manhattan-borough barriers
- [ ] Tappan Zee documented as Westchester-Rockland barrier
- [ ] Tobin Bridge documented as Boston-North Shore barrier
- [ ] Delaware River documented as PA-NJ barrier

### 8. Mountain Barrier Check
- [ ] Adirondacks isolate North Country from Albany
- [ ] White Mountains create NH east-west barrier
- [ ] Green Mountains create VT isolation
- [ ] Appalachians create PA east-west barrier

### 9. I-95 Congestion Check
- [ ] Boston-Providence separation documented (60+ min)
- [ ] NYC-Philadelphia separation documented (2+ hours)
- [ ] Connecticut I-95 corridor congestion documented
- [ ] Congestion creates market splits, not just noted

### 10. County FIPS Accuracy Check
- [ ] All Northeast county FIPS codes verified
- [ ] County names match FIPS codes
- [ ] State codes correct (ME=23, NH=33, VT=50, MA=25, RI=44, CT=09, NY=36, NJ=34, PA=42)

---

## Special Cases and Edge Cases

### NYC Borough Market Structure Decision

**Critical decision: How to handle NYC boroughs?**

**Option A — 5 Separate Markets (RECOMMENDED):**
- NY-NYC-MANHATTAN (36061)
- NY-NYC-BROOKLYN (36047)
- NY-NYC-QUEENS (36081)
- NY-NYC-BRONX (36005)
- NY-NYC-STATEN (36085)

**Rationale:**
- Each borough is single county (clean mapping)
- Each has built independent anchor systems
- East River crossings create 30-60 min friction
- Behavioral patterns show residents prefer local routine care
- Easier programmatic mapping

**Option B — 3-4 Integrated Markets:**
- NY-NYC-CORE (Manhattan + inner Brooklyn + South Bronx via subway)
- NY-NYC-QUEENS (Queens borough)
- NY-NYC-OUTER (Outer Brooklyn, Staten Island)
- Long Island separate

**Rationale:**
- Subway integration collapses some barriers
- Residents DO cross for specialty care
- More consolidated approach

**Option C — County-Level with ZIP Splits:**
- Use New York County (Manhattan) as base
- Add ZIP lists for Brooklyn, Queens, Bronx portions that integrate via subway
- **Complex:** Requires extensive ZIP mapping

**This mapping uses Option A** (5 separate markets) as recommended approach due to:
- Clean county-level mapping (no ZIP lists needed for NYC proper)
- Behavioral accuracy (distinct anchor systems)
- Programmatic simplicity

### Boston-Cambridge Integration Decision

**Critical decision: One market or two?**

**Option A — Integrated (RECOMMENDED):**
- Single MA-BOSTON-CORE market
- Includes Suffolk County (25025) + inner Middlesex County (25017)* with ZIP lists
- Rationale: Red Line <30 min to Longwood/MGH, behavioral integration

**Option B — Separate:**
- MA-BOSTON-CORE (Suffolk County only)
- MA-CAMBRIDGE (Cambridge, Somerville in Middlesex County)
- Rationale: Distinct identity despite Red Line

**This mapping uses Option A** (integrated) due to:
- MBTA Red Line frequent service
- Longwood Medical Area serves both populations
- <30 min travel time

**Requires: Middlesex County ZIP list for Boston-Core (Cambridge/Somerville ZIPs only)**

### North Jersey Market Structure Decision

**Critical decision: How to split North Jersey?**

**Option A — Single Market:**
- NJ-NORTHJERSEY covering Hudson, Bergen, Essex, Passaic counties
- Rationale: Region functions as integrated suburban NYC market despite separate from Manhattan

**Option B — Split into 2-3 Markets:**
- NJ-HUDSON (Hudson County — Jersey City, Hoboken, closest to Manhattan)
- NJ-BERGEN-PASSAIC (Bergen, Passaic counties)
- NJ-ESSEX (Essex County — Newark, separate anchor)

**This mapping uses Option A** (single market) unless population strongly warrants splits.

### Rhode Island Market Structure

**Rhode Island is small but distinct:**

**RI-PROVIDENCE** should be single market covering entire state:
- Providence County (44007), Kent County (44003), Washington County (44009), Newport County (44005), Bristol County (44001)
- Rationale: Small state, Providence dominance, all <45 min from Providence

**Newport may be separate** if island geography creates friction:
- Aquidneck Island (Newport, Middletown, Portsmouth)
- Mount Hope Bridge crossing
- **Decision:** Usually integrated with Providence unless behavioral data shows separation

### Vermont Market Structure

**Vermont is linear along I-91 and Route 7 corridors:**

**VT-BURLINGTON** — Dominates western/northern Vermont
- Chittenden County (50007), surrounding counties
- UVM Medical Center dominance

**VT-UPPERVALLEY** — May be separate market
- Windsor County (50027), Orange County (50017)
- Dartmouth-Hitchcock serves from NH side
- **Decision:** May integrate with NH-DARTMOUTH

**VT-RUTLAND** — May be separate
- Rutland County (50021)
- Central Vermont, 60+ miles from Burlington

### Pennsylvania Markets Beyond Philadelphia

**PA-PITTSBURGH** — Western PA anchor
- Allegheny County (42003), surrounding counties
- UPMC, Allegheny Health dominance
- Completely separate from Philadelphia (300+ miles, 5+ hours)

**PA-SCRANTON** — Northeastern PA
- Lackawanna County (42069), Luzerne County (42079)
- Geisinger Health, Commonwealth Health
- Separate from both Philadelphia and Pittsburgh by mountains

**PA-ERIE** — Northwestern PA
- Erie County (42049)
- UPMC Hamot, Saint Vincent
- Isolated from Pittsburgh (2+ hours) and Buffalo (2+ hours)

---

## Output Requirements

Generate CSV file with:

1. **Header row:**
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
```

2. **Data rows (240-280 expected):**
- One row per market-statistical_area combination
- Markets sorted alphabetically by market_id
- ZIP lists populated ONLY when 2+ markets share area
- Rationales document behavioral logic and friction factors

3. **Quality validation:**
- No CSA usage as primary
- No ZIP overlaps in shared counties
- NYC split into 5-9 markets
- Boston, Worcester, Providence separate
- Upstate NY cities NOT consolidated
- All bridge/tunnel barriers documented

---

## Final Instruction

Apply BOTH the master prompt rules AND these Northeast regional specifics.

**Critical priorities for Northeast:**

1. **Split NYC CSA appropriately** — 13+ markets total (4 NYC boroughs + 9 surrounding areas defined)
2. **Respect water barriers** — East River, Hudson River, Delaware River all create splits
3. **Document bridge/tunnel friction** — GW Bridge, East River crossings, Tobin Bridge
4. **Do NOT over-rely on transit** — Only NYC Subway and MBTA Red Line materially integrate
5. **Keep Upstate NY separate** — Albany, Syracuse, Rochester, Buffalo all independent (60-100 miles apart)
6. **Respect I-95 congestion** — Boston-Providence, NYC-Philadelphia separated despite short distances
7. **Handle multi-state borders** — 9 states = 9 Medicaid programs, respect borders
8. **Build Fairfield County CT ZIP lists** — Most complex CT county, 3 markets sharing (Norwalk, Bridgeport, Danbury)

**Test your work:**
- Would a NYC resident agree Manhattan and Brooklyn are separate routine-care markets? (YES — despite subway, each has independent anchors)
- Would anyone believe Worcester integrates with Boston? (NO — 45+ miles, 60+ min, no transit)
- Would anyone believe Syracuse integrates with Albany? (NO — 150 miles, 2.5+ hours)
- Can a data engineer build unambiguous ZIP-to-market table? (ONLY if shared counties have complete ZIP lists)

If answers are NO → Mapping is not ready.

---

**End of Northeast Regional Mapping Prompt**
