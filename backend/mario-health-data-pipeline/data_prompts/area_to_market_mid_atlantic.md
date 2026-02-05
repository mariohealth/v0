# Regional Mapping Prompt: Mid-Atlantic (MD, DC, DE, VA, WV)

## Instructions

**Read `area_to_market_mapping_master.md` first.** This prompt adds Mid-Atlantic regional specificity but does not override national rules.

---

## Geographic Scope

**States:** Maryland (MD), District of Columbia (DC), Delaware (DE), Virginia (VA), West Virginia (WV)

**Expected Output:** Approximately 130-160 mapping rows across 30 markets for this 5-state region.

---

## Critical Regional Context

The Mid-Atlantic region has the **highest market fragmentation complexity** in the US due to:

1. **DC-Baltimore CSA polycentric structure** (10M people, MUST split into 5-7+ markets)
2. **Extreme congestion barriers** (I-495 beltway, I-95 corridor, I-64 corridor)
3. **Major water barriers** (Potomac River, Chesapeake Bay + Bay Bridge, Hampton Roads tunnels)
4. **Appalachian Mountain isolation** (entire WV plus Western VA/MD)
5. **Multi-state complexity** (5 states + DC = 6 Medicaid programs, different licensing, network boundaries)

---

## Region-Specific Friction Factors

### ABSOLUTE BARRIERS (Markets NEVER Share Statistical Areas Across These)

#### 1. Chesapeake Bay + Bay Bridge (Maryland)

**Geography:**
- **Single crossing point:** US-50 Bay Bridge connecting Annapolis to Eastern Shore
- **Bottleneck severity:** 30-60 min queues typical on summer weekends, 15-30 min on weekdays
- **Distance via bridge:** ~200 miles to drive around bay if bridge is avoided

**Market Impact:**
- Eastern Shore MD is geographically closer to Delaware than to Baltimore/DC
- Bay Bridge creates absolute split between mainland MD and Eastern Shore MD
- No ferry alternative, no other bridge crossings

**Counties on Eastern Shore (NEVER in Baltimore/DC markets):**
- Kent County MD (24029)
- Queen Anne's County MD (24035)
- Talbot County MD (24041)
- Caroline County MD (24011)
- Dorchester County MD (24019)
- Wicomico County MD (24045)
- Somerset County MD (24039)
- Worcester County MD (24047)

**Test:** If mapping shows Anne Arundel County MD in Eastern Shore market OR Eastern Shore counties in Baltimore/DC market → **CRITICAL ERROR**

**Expected markets:**
- **MD-SALISBURY** — Lower Eastern Shore (Wicomico, Somerset, Worcester + Accomack VA)
- **MD-EASTON** — Upper Eastern Shore (Kent, Queen Anne's, Talbot, Dorchester, Caroline)
- **MD-ANNAPOLIS** — Western shore (Anne Arundel County)

#### 2. Appalachian Mountains (WV, Western VA, Western MD)

**Geography:**
- Mountains create hard east-west barriers across entire western region
- Limited mountain crossing corridors: I-68 (MD/WV), I-81 (VA), I-77 (WV), I-64 (WV)
- Winter weather compounds isolation 4-5 months annually (snow, ice closures)
- Drive times routinely exceed 90-120 minutes between markets

**Market Impact:**
- **All WV markets are isolated** from each other AND from neighboring states
- Western VA markets (Roanoke, Blacksburg) isolated from Richmond/NoVA by Blue Ridge Mountains
- Western MD markets (Cumberland, Hagerstown) separated from Baltimore/DC by terrain + distance

**Critical isolation patterns:**

**West Virginia internal isolation:**
- Morgantown → Charleston: 150 miles, 2.5 hours (Morgantown is closer to Pittsburgh PA than Charleston WV)
- Charleston → Huntington: 50 miles, 1 hour minimum
- Martinsburg → Morgantown: 150+ miles, separate behavioral markets
- Parkersburg isolated from Charleston by terrain despite being in same state

**WV to neighboring states:**
- Only Martinsburg WV integrates with Hagerstown MD (I-81 corridor, cross-border CBSA 25180)
- All other WV markets are isolated from DC, Baltimore, Richmond, Pittsburgh

**Western Virginia isolation:**
- Roanoke separated from Richmond by Blue Ridge Mountains (200 miles, 3+ hours)
- Blacksburg separated from Roanoke by mountains despite both being in SW VA
- Winchester isolated in Shenandoah Valley (I-81 corridor), closer to Hagerstown MD than DC

**Western Maryland isolation:**
- Cumberland isolated by I-68 corridor through mountains
- Hagerstown separated from Baltimore by mountains + 70 miles
- Frederick separated from Baltimore and DC by I-270 congestion + 60+ miles

**Test:** If mapping shows WV market (except Martinsburg) sharing statistical areas with DC/Baltimore/Richmond/NoVA → **CRITICAL ERROR**

#### 3. Potomac River Crossings (DC/MD ↔ VA)

**Geography:**
- Multiple bridges, but all are bottlenecks during typical daytime hours
- Major crossings (south to north):
  - Woodrow Wilson Bridge (I-495/I-95): 20-40 min delays typical
  - Potomac River crossings in DC: Key Bridge, Chain Bridge, Memorial Bridge (limited capacity)
  - American Legion Bridge (I-495): Heavy congestion
  - Limited crossings upstream create isolation for western MD and WV panhandle

**Market Impact:**
- Potomac River creates north-south friction despite multiple bridges
- **Without WMATA Metro direct connection**, Potomac crossings create market splits
- Southern MD (Charles, Calvert, St. Mary's counties) is isolated from NoVA despite proximity

**WMATA Metro Integration (CRITICAL):**
- **Only WMATA Metro can collapse Potomac crossing friction**
- WMATA directly connects DC ↔ Arlington/Alexandria via Orange/Blue/Silver/Yellow lines
- WMATA directly connects DC ↔ Bethesda/Silver Spring via Red Line
- **Non-WMATA areas remain split** despite bridges

**Test:** If mapping shows non-WMATA NoVA (Loudoun, Prince William) integrated with DC/MD → **Verify WMATA access first**

#### 4. Hampton Roads Tunnels (Virginia)

**Geography:**
- Multiple tunnel crossings between Peninsula (Newport News, Hampton) and Southside (Norfolk, Virginia Beach):
  - I-64 Hampton Roads Bridge-Tunnel (HRBT)
  - I-664 Monitor-Merrimac Memorial Bridge-Tunnel
  - Hampton Roads Tunnel
- **Typical delays:** 30-60 minutes during peak hours

**Market Impact:**
- Creates friction between Peninsula and Southside
- However, Sentara Healthcare and Riverside Health System operate regionally across both
- Decision required: Single integrated market OR split into Peninsula/Southside?

**This mapping assumes: Single integrated VA-HAMPTON-ROADS market**
- Rationale: Sentara/Riverside regional operations enable residents to cross tunnels
- Tunnel friction acknowledged but not sufficient to split market
- If behavioral data shows residents avoid tunnel crossings for routine care → Consider splitting

### SEVERE BARRIERS (Create Friction But May Not Split Markets)

#### 5. I-495 Capital Beltway (DC/MD/VA)

**Geography:**
- Circumferential highway around DC with chronic congestion
- **Crossing times:** Can take 60+ minutes to cross during typical daytime hours
- Major bottlenecks: Wilson Bridge, American Legion Bridge, Mixing Bowl (I-95/I-395/I-495)

**Market Impact:**
- Creates friction even within DC-Baltimore CSA
- Outer suburbs (Frederick MD, Loudoun VA, Prince William VA) typically separate from DC core
- Inner suburbs (Montgomery County MD, Arlington VA) may integrate with DC via WMATA

**Critical decision point: Montgomery County MD (24031)**
- Inner Montgomery (Bethesda, Silver Spring) → May integrate with DC via WMATA Red Line
- Outer Montgomery (Gaithersburg, Germantown, Rockville) → Separate market via I-270 corridor
- **REQUIRES ZIP-LEVEL SPLIT** if both DC-METRO-CORE and MD-SILVER-SPRING claim Montgomery County

**Test:** If outer suburbs (Frederick, Loudoun, Prince William) are integrated with DC core → **Verify <45 min door-to-door**

#### 6. I-95 Corridor (MD/VA/DC)

**Geography:**
- Major north-south artery with chronic congestion
- Baltimore to DC: 40 miles but 45-60 minutes typical
- DC to Richmond: 100 miles, 60-90 minutes typical
- Fredericksburg is major bottleneck (30+ min delays common)

**Market Impact:**
- **Baltimore and DC MUST BE SEPARATE** despite being in same CSA
- No transit connection between Baltimore and DC (MARC is peak-direction commuter rail only)
- Richmond completely separate from DC (60-90 min)

**CRITICAL RULE FROM QA:** 
- If mapping shows Baltimore and DC sharing any statistical area → **CRITICAL ERROR**
- If mapping shows Richmond integrated with DC → **CRITICAL ERROR**

#### 7. I-64 Corridor (Richmond to Hampton Roads)

**Geography:**
- East-west connector between Richmond and Norfolk
- Distance: 75 miles, 60-90 minutes typical

**Market Impact:**
- Richmond and Hampton Roads are completely separate markets
- No overlap in statistical areas

**Test:** If mapping shows Richmond and Hampton Roads sharing areas → **CRITICAL ERROR**

---

## Transit Systems and Market Integration

### WMATA Metro (DC/MD/VA) — The ONLY Transit That Collapses Markets

**WMATA is the most extensive transit system in the region and the ONLY system that can justify market integration.**

**Lines and Medical District Access:**

| Line | Key Stations | Medical Access |
|------|--------------|----------------|
| Red | Medical Center (Bethesda), Silver Spring | ✅ NIH, Suburban Hospital, Holy Cross |
| Orange | Virginia Hospital Center-accessible via bus | ✅ Virginia Hospital Center (Arlington) |
| Blue | Pentagon City, Crystal City | ⚠️ Limited direct hospital access |
| Silver | Extends Orange Line to Dulles corridor | ⚠️ Stops before Leesburg/Loudoun County |
| Yellow | Connects Pentagon, Alexandria | ⚠️ Limited direct hospital access |
| Green | Limited medical district access | ❌ Not relevant for healthcare integration |

**WMATA Integration Test (4-Step Process):**

For any claimed DC-area market integration, verify:

1. **Does Metro directly connect both anchors?** 
   - DC → Bethesda via Red Line: ✅ YES
   - DC → Arlington via Orange Line: ✅ YES  
   - DC → Gaithersburg: ❌ NO (Red Line stops at Shady Grove, 10 miles short)
   - DC → Loudoun County: ❌ NO (Silver Line stops at Ashburn, doesn't reach Leesburg)

2. **Is frequency ≥15 minutes midday?**
   - Red Line: ✅ YES (12 min midday)
   - Orange/Blue/Silver: ✅ YES (12-15 min midday)
   - Green/Yellow: ✅ YES but limited hospital access

3. **Is trip time <45 min door-to-door?**
   - Bethesda → DC hospitals: ~30 min ✅
   - Arlington → DC hospitals: ~25 min ✅
   - Gaithersburg → DC hospitals: ~55 min ❌ (exceeds threshold)
   - Silver Spring → DC hospitals: ~35 min ✅

4. **Do residents actually use Metro for medical appointments?**
   - Bethesda → DC: Plausible (Medical Center station, frequent service, reverse direction adequate)
   - Gaithersburg → DC: Implausible (60 min drive faster than Metro + transfers)

**If ALL FOUR PASS:** WMATA integration may justify combining markets

**If ANY FAIL:** Markets should be separate despite Metro presence

**Valid WMATA integrations in this mapping:**
- ✅ DC → Arlington/Alexandria via Orange/Blue/Silver/Yellow lines
- ✅ DC → Bethesda/inner Silver Spring via Red Line
- ❌ DC → Gaithersburg/Germantown (Red Line exists but trip time >45 min)
- ❌ DC → Loudoun County (Silver Line doesn't reach Leesburg)
- ❌ DC → Prince William County (no Metro service)
- ❌ DC → Frederick (no Metro service)

### MARC Commuter Rail (MD) — Does NOT Collapse Markets

**Why MARC doesn't justify integration:**
- **Peak-direction only:** Trains run toward DC in AM, toward suburbs in PM
- **Poor reverse direction:** Limited midday service for medical appointments
- **No direct hospital access:** Most MARC stations require bus/Metro transfer to hospitals
- **Commuter-focused:** Designed for work trips, not medical access

**CRITICAL RULE:** MARC should NEVER be used to justify integrating Baltimore with DC.

**Test:** If rationale says "MARC connects Baltimore to DC" → **HIGH SEVERITY ERROR**

Baltimore and DC are 45+ min apart with no bidirectional transit. MARC peak-direction commuter service does not enable residents to routinely cross for medical appointments.

### VRE Commuter Rail (VA) — Does NOT Collapse Markets

**Why VRE doesn't justify integration:**
- **Peak-direction only:** Trains run toward DC in AM, toward suburbs in PM
- **Requires Metro transfer:** VRE stations not near hospitals, must transfer to Metro
- **Limited medical access:** Poor reverse direction for appointment scheduling

**CRITICAL RULE:** VRE should NOT justify integrating outer VA (Fredericksburg, Manassas) with DC.

**Test:** If rationale says "VRE connects Manassas to DC" → **MEDIUM SEVERITY ERROR**

### Other Transit Systems (Limited Impact)

**Baltimore Light Rail / Metro Subway:**
- Limited coverage
- Does NOT materially reduce friction for healthcare access
- Does NOT justify market integration

**No significant ferry systems** in Mid-Atlantic (unlike Pacific Northwest or New York)

---

## Known Market Fragmentation Patterns (CRITICAL)

### The DC-Baltimore CSA Split (MOST CRITICAL DECISION)

**CBSA 47900 (Washington-Baltimore-Arlington CSA) contains ~10M people and MUST be split into 5-7+ markets.**

This is the **#1 source of errors** in Mid-Atlantic mappings.

**QA FINDING:** Using CSA 47900 as primary statistical area is a **CRITICAL ERROR**.

**Correct approach:**

**DC-Baltimore CSA (47900) decomposes into:**

1. **DC-METRO-CORE**
   - CBSA: Use Metropolitan Division 47894 (Washington-Arlington-Alexandria)
   - Counties: DC (11001), inner Montgomery MD (24031)*, Arlington VA (51013)*, Alexandria VA (51510)*
   - Integration: WMATA Metro collapses DC + Arlington/Alexandria + Bethesda/Silver Spring
   - *Asterisk = Likely requires ZIP lists if multiple markets claim

2. **MD-BALTIMORE**
   - CBSA: Use 12580 (Baltimore-Columbia-Towson)
   - Counties: Baltimore City (24510), Baltimore County (24005), surrounding counties
   - Separation: 45+ min from DC, no transit, independent anchor
   - **NEVER shares statistical areas with DC-METRO-CORE**

3. **MD-SILVER-SPRING** (if separate from DC-METRO-CORE)
   - Counties: Montgomery County MD (24031)* suburban portions
   - May overlap with DC-METRO-CORE geographically → **REQUIRES ZIP-LEVEL SPLIT**

4. **MD-FREDERICK**
   - CBSA: May use Metropolitan Division 20700, but verify it doesn't include Montgomery County
   - Counties: Frederick County MD (24021)
   - Separation: 60+ min from both DC and Baltimore via I-270 congestion

5. **VA-ARLINGTON** (if separate from DC-METRO-CORE)
   - Counties: Arlington VA (51013)*, Alexandria VA (51510)*, inner Fairfax VA (51059)*
   - May overlap with DC-METRO-CORE geographically → **REQUIRES ZIP-LEVEL SPLIT**

6. **VA-LOUDOUN**
   - Counties: Loudoun County VA (51107)
   - Separation: 60+ min from DC core, Silver Line doesn't reach Leesburg

7. **VA-PRINCE-WILLIAM**
   - Counties: Prince William County VA (51153), Manassas City VA (51683)
   - Separation: 45+ min from DC via I-95 congestion and beltway

**Key decision: How many markets in DC-Baltimore CSA?**

**Option A — 5 markets (more consolidated):**
- DC-METRO-CORE (includes Arlington, Alexandria, Bethesda, Silver Spring via WMATA)
- MD-BALTIMORE
- MD-FREDERICK
- VA-LOUDOUN
- VA-PRINCE-WILLIAM

**Option B — 7 markets (more granular):**
- DC-METRO-CORE (DC proper + WMATA-accessible inner suburbs only)
- VA-ARLINGTON (Northern Virginia with distinct suburban identity)
- MD-SILVER-SPRING (Montgomery County suburbs)
- MD-BALTIMORE
- MD-FREDERICK
- VA-LOUDOUN
- VA-PRINCE-WILLIAM

**This mapping uses Option B** (more granular) based on regional prompt definition of 30 markets.

### Counties Requiring ZIP-Level Splits (HIGH PROBABILITY)

**FROM QA FINDINGS:** These counties are shared by multiple markets and MUST have ZIP lists:

#### Montgomery County MD (24031) — DEFINITE ZIP SPLIT REQUIRED

**Markets claiming Montgomery County:**
- DC-METRO-CORE
- MD-SILVER-SPRING
- Possibly MD-FREDERICK (if Gaithersburg/Germantown included)

**Behavioral boundary:** WMATA Red Line extent + I-270 corridor

**Suggested ZIP split:**

**DC-METRO-CORE gets (inner Montgomery, Red Line accessible):**
```
"20814,20815,20816,20817"
```
- Bethesda (Medical Center Metro station)
- Chevy Chase (near Red Line)
- Areas within 1 mile of Red Line stations

**MD-SILVER-SPRING gets (suburban Montgomery):**
```
"20901,20902,20903,20904,20905,20906,20910,20912,20850,20851,20852,20853,20854,20855"
```
- Silver Spring (downtown and suburbs)
- Rockville
- Areas beyond Red Line but inside beltway

**MD-FREDERICK gets (outer I-270 corridor) — IF CLAIMED:**
```
"20866,20874,20876,20877,20878,20879,20882,20886"
```
- Gaithersburg
- Germantown
- Damascus
- Outer I-270 corridor beyond beltway

**CRITICAL:** Do NOT create overlapping ZIPs. From QA: Previous mapping had ZIPs 20901, 20902, 20904, 20906, 20910 in BOTH DC-METRO-CORE and MD-SILVER-SPRING → **CRITICAL ERROR**

**Coverage requirement:** Montgomery County has ~50+ ZIPs. All must be assigned. Missing 70% of ZIPs = **CRITICAL ERROR** affecting 1M+ residents.

#### Arlington County VA (51013) — DEFINITE ZIP SPLIT REQUIRED

**Markets claiming Arlington County:**
- DC-METRO-CORE
- VA-ARLINGTON

**Behavioral boundary:** WMATA Orange/Blue/Silver Line stations

**Suggested ZIP split:**

**DC-METRO-CORE gets (inner Arlington, Metro-accessible):**
```
"22201,22202,22203,22204,22205,22206,22207,22209"
```
- Rosslyn, Courthouse, Ballston, Clarendon corridor (Metro stations)
- Areas within walking distance of Orange Line

**VA-ARLINGTON gets (all Arlington, suburban identity):**
```
"22201,22202,22203,22204,22205,22206,22207,22209,22210,22211,22212,22213,22214,22215,22216,22217,22218,22219,22225,22226,22227,22230,22240,22241,22242,22243,22244,22245"
```

**PROBLEM DETECTED IN QA:** Previous mapping had ALL DC-METRO-CORE Arlington ZIPs also in VA-ARLINGTON list (complete overlap).

**RESOLUTION REQUIRED:** Choose one of:

**Option 1 — Eliminate VA-ARLINGTON redundancy:**
- Remove VA-ARLINGTON as separate market
- DC-METRO-CORE claims all of Arlington via WMATA integration

**Option 2 — Split Arlington between markets:**
- DC-METRO-CORE: Inner Arlington near Metro (22201-22209)
- VA-ARLINGTON: Outer Arlington beyond Metro (22210+)

**Option 3 — Complete separation:**
- DC-METRO-CORE: Does NOT include Arlington County
- VA-ARLINGTON: Gets all of Arlington County

**Recommendation:** Option 2 aligns with WMATA Metro test and suburban identity concept.

#### Alexandria City VA (51510) — DEFINITE ZIP SPLIT REQUIRED

**Markets claiming Alexandria:**
- DC-METRO-CORE
- VA-ARLINGTON

**Same pattern as Arlington County** — likely complete overlap in previous mapping.

**Suggested ZIP split:**

**DC-METRO-CORE gets (Old Town Alexandria, Metro-accessible):**
```
"22301,22302,22314"
```
- Old Town near King Street Metro station
- Areas directly accessible via Yellow/Blue lines

**VA-ARLINGTON gets (suburban Alexandria):**
```
"22303,22304,22305,22306,22307,22308,22309,22310,22311,22312,22313,22315,22320,22331,22332,22333,22334"
```
- Alexandria west of Old Town
- Areas beyond Metro walkability

**Or consider same three options as Arlington County.**

#### Fairfax County VA (51059) — POSSIBLE ZIP SPLIT

**Markets potentially claiming Fairfax:**
- VA-ARLINGTON (inner Fairfax — Falls Church, Tysons, McLean)
- VA-LOUDOUN (if Fairfax extends west)
- VA-PRINCE-WILLIAM (if Fairfax extends south)

**Decision:** Current mapping shows Fairfax County only as SECONDARY for VA-ARLINGTON (tertiary referrals to Inova Fairfax Level 1 trauma).

**If multiple markets claim Fairfax as PRIMARY → ZIP lists required**

**If only VA-ARLINGTON claims as secondary → ZIP list should be BLANK** (secondary relationships don't get ZIP lists)

---

## Additional Regional Markets (Beyond DC-Baltimore CSA)

### Delaware Markets (3 Markets)

**DE-WILMINGTON:**
- CBSA: 48864 (Wilmington DE-MD-NJ)
- Cross-border integration with Philadelphia I-95 corridor, NOT Baltimore
- Counties: New Castle County DE (10003)
- **Critical:** Rationale must state "Philadelphia-oriented, not Baltimore-oriented"

**DE-DOVER:**
- CBSA: 20100 (Dover DE)
- Counties: Kent County DE (10001)
- Central Delaware hub between Wilmington and beaches

**DE-REHOBOTH:**
- Counties: Sussex County DE (10005)
- Southern Delaware coastal market
- May integrate with MD-SALISBURY (Eastern Shore, CBSA 41540)

### Maryland Markets (13 Markets)

Already covered:
- DC-METRO-CORE (partial Montgomery County)
- MD-BALTIMORE
- MD-SILVER-SPRING (partial Montgomery County)
- MD-FREDERICK
- MD-SALISBURY (lower Eastern Shore)
- MD-EASTON (upper Eastern Shore)

Additional:

**MD-ANNAPOLIS:**
- Counties: Anne Arundel County MD (24003)
- Western shore, Bay Bridge corridor, BWI airport
- Separate from both DC and Baltimore via I-97/I-695 distance

**MD-HAGERSTOWN:**
- CBSA: 25180 (Hagerstown-Martinsburg MD-WV) — cross-border
- Counties: Washington County MD (24043)
- I-81 corridor, western Maryland

**MD-CUMBERLAND:**
- Counties: Allegany County MD (24001), Mineral County WV (54057)
- Western Maryland I-68 corridor, Appalachian isolation

**MD-WALDORF:**
- Counties: Charles County MD (24017), Calvert County MD (24009), St. Mary's County MD (24037)
- Southern Maryland, limited Potomac crossings

### Virginia Markets (11 Markets)

Already covered:
- DC-METRO-CORE (partial Arlington, partial Alexandria)
- VA-ARLINGTON (partial Arlington, partial Alexandria, partial Fairfax)
- VA-LOUDOUN
- VA-PRINCE-WILLIAM
- VA-HAMPTON-ROADS

Additional:

**VA-RICHMOND:**
- CBSA: 40060 (Richmond VA)
- 16 surrounding counties (see markets CSV for full list)
- **Critical:** Must document independence from DC (60+ min via I-95) and Hampton Roads (60+ min via I-64)

**VA-CHARLOTTESVILLE:**
- CBSA: 16820 (Charlottesville VA)
- UVA Health anchor, central Virginia academic medical center

**VA-ROANOKE:**
- CBSA: 40220 (Roanoke VA)
- Southwest Virginia, Blue Ridge isolation from Richmond/NoVA

**VA-BLACKSBURG:**
- Counties: Montgomery County VA (51121), Radford City VA (51750), Giles County VA (51071)
- New River Valley, Virginia Tech area, isolated from Roanoke by mountains

**VA-WINCHESTER:**
- CBSA: 49020 (Winchester VA-WV) — cross-border
- Northern Shenandoah Valley, I-81 corridor

**VA-HARRISONBURG:**
- CBSA: 25500 (Harrisonburg VA)
- Central Shenandoah Valley, I-81 corridor

**VA-LYNCHBURG:**
- CBSA: 31340 (Lynchburg VA)
- Central Virginia hub between Charlottesville and Roanoke

### West Virginia Markets (6 Markets)

**CRITICAL:** All WV markets isolated by Appalachian terrain.

**WV-MORGANTOWN:**
- CBSA: 34060 (Morgantown WV)
- Northern WV, closer to Pittsburgh PA than Charleston WV
- Academic center (WVU Hospitals)

**WV-CHARLESTON:**
- CBSA: 16620 (Charleston WV)
- State capital, largest city, central WV valleys
- Charleston Area Medical Center (CAMC) dominant anchor

**WV-HUNTINGTON:**
- CBSA: 26580 (Huntington-Ashland WV-KY-OH) — cross-border
- Ohio River valley, 50+ min from Charleston
- Tri-state region (WV/KY/OH)

**WV-MARTINSBURG:**
- Part of CBSA: 25180 (Hagerstown-Martinsburg MD-WV) — cross-border
- Eastern panhandle, closer to Hagerstown MD and Winchester VA than WV core
- **Exception:** Only WV market that integrates with non-WV state

**WV-BECKLEY:**
- Counties: Raleigh County WV (54081), Wyoming County WV (54109), Mercer County WV (54055), Summers County WV (54089)
- Southern coalfields, isolated from Charleston by terrain

**WV-PARKERSBURG:**
- CBSA: 38540 (Parkersburg-Vienna WV)
- Mid-Ohio River valley, isolated from Charleston by terrain

---

## Critical Data Quality Checks (Learned from QA)

Before finalizing, verify:

### 1. CSA Usage Check
- [ ] **ZERO** markets use CSA 47900 as primary statistical area
- [ ] DC-METRO-CORE uses Metropolitan Division 47894 OR counties, NOT CSA 47900
- [ ] MD-BALTIMORE uses CBSA 12580, NOT CSA 47900

### 2. ZIP List Overlap Check
- [ ] Montgomery County MD (24031): DC-METRO-CORE and MD-SILVER-SPRING have NO overlapping ZIPs
- [ ] Arlington County VA (51013): DC-METRO-CORE and VA-ARLINGTON have NO overlapping ZIPs
- [ ] Alexandria City VA (51510): DC-METRO-CORE and VA-ARLINGTON have NO overlapping ZIPs
- [ ] Any other shared county: NO overlaps

### 3. ZIP List Coverage Check
- [ ] Montgomery County MD: >95% of county ZIPs assigned across all markets
- [ ] Arlington County VA: >95% of county ZIPs assigned across all markets
- [ ] Alexandria City VA: >95% of city ZIPs assigned across all markets

### 4. Baltimore-DC Separation Check
- [ ] MD-BALTIMORE and DC-METRO-CORE share ZERO statistical areas
- [ ] Baltimore CBSA 12580 only appears in MD-BALTIMORE rows
- [ ] Metropolitan Division 47894 only appears in DC-METRO-CORE rows (if used)

### 5. Richmond Separation Check
- [ ] VA-RICHMOND shares ZERO statistical areas with DC-METRO-CORE
- [ ] VA-RICHMOND shares ZERO statistical areas with VA-HAMPTON-ROADS
- [ ] Richmond CBSA 40060 only appears in VA-RICHMOND rows

### 6. Eastern Shore Isolation Check
- [ ] NO Eastern Shore county (Kent, Queen Anne's, Talbot, Dorchester, Caroline, Wicomico, Somerset, Worcester) appears in MD-BALTIMORE rows
- [ ] NO Eastern Shore county appears in DC-METRO-CORE rows
- [ ] NO Anne Arundel County appears in MD-SALISBURY or MD-EASTON rows

### 7. Appalachian Isolation Check
- [ ] NO WV market (except WV-MARTINSBURG) shares statistical areas with MD-BALTIMORE, DC-METRO-CORE, VA-RICHMOND, or VA-ARLINGTON
- [ ] WV-MARTINSBURG only shares with MD-HAGERSTOWN (cross-border CBSA 25180)
- [ ] WV markets are isolated from each other (each has distinct counties)

### 8. County FIPS Accuracy Check
- [ ] All WV county FIPS codes verified (QA found error: 54063 mislabeled as Raleigh County, actually Wyoming County)
- [ ] State codes match (MD=24, DC=11, DE=10, VA=51, WV=54)
- [ ] County names match FIPS codes

### 9. Transit Integration Check
- [ ] WMATA mentioned only for DC-METRO-CORE, MD-SILVER-SPRING, VA-ARLINGTON (Metro-accessible areas)
- [ ] MARC NOT used to justify Baltimore-DC integration
- [ ] VRE NOT used to justify Fredericksburg/Manassas-DC integration
- [ ] Specific Metro lines mentioned (Red, Orange, Blue, Silver, Yellow)

### 10. Cross-Border CBSA Check
- [ ] Hagerstown-Martinsburg MD-WV (CBSA 25180) acknowledged as cross-border
- [ ] Salisbury MD-DE (CBSA 41540) acknowledged as cross-border
- [ ] Winchester VA-WV (CBSA 49020) acknowledged as cross-border
- [ ] Wilmington DE-MD-NJ (CBSA 48864) acknowledged as cross-border
- [ ] Huntington-Ashland WV-KY-OH (CBSA 26580) acknowledged as cross-border

---

## Special Cases and Edge Cases

### Hampton Roads Market Structure

**Decision required:** Single market vs Peninsula/Southside split

**Current mapping assumes: Single integrated market (VA-HAMPTON-ROADS)**

**Rationale requirements:**
- Document tunnel friction (I-64 tunnel, I-664 tunnel typical delays)
- Explain why Sentara/Riverside regional operations justify single market
- OR document why delays don't exceed 45-minute threshold

**If behavioral data shows residents avoid tunnel crossings:**
- Split into VA-HAMPTON-ROADS-PENINSULA and VA-HAMPTON-ROADS-SOUTHSIDE
- Assign counties appropriately:
  - Peninsula: Newport News (51700), Hampton (51650), Williamsburg (51830), York County (51199), James City County (51095)
  - Southside: Norfolk (51710), Virginia Beach (51810), Chesapeake (51550), Portsmouth (51740), Suffolk (51800)

### Eastern Shore Market Structure

**Two markets: MD-SALISBURY (lower) and MD-EASTON (upper)**

**QA flagged potential redundancy** — verify:
- 50-mile separation between anchors justifies split
- TidalHealth (Salisbury) vs University of Maryland Shore (Easton) are distinct systems
- No county overlap (each county assigned to one market only)

**If redundancy confirmed:** Merge into single MD-EASTERN-SHORE market

### DC-METRO-CORE vs VA-ARLINGTON Redundancy

**QA flagged potential redundancy** due to Arlington/Alexandria overlap.

**Decision required:**

**Option 1 — Merge markets:**
- Eliminate VA-ARLINGTON
- DC-METRO-CORE includes all Arlington/Alexandria via WMATA integration

**Option 2 — Split via ZIP lists:**
- DC-METRO-CORE: Inner Arlington/Alexandria (Metro-accessible)
- VA-ARLINGTON: Outer Arlington/Alexandria (suburban)

**Option 3 — Complete separation:**
- DC-METRO-CORE: DC proper + Montgomery County MD only
- VA-ARLINGTON: All Arlington/Alexandria/Fairfax

**Current mapping uses Option 2** based on markets CSV showing both markets exist.

### Military Base and Federal Enclave ZIPs

**Common in Mid-Atlantic:**
- Fort Belvoir VA
- Aberdeen Proving Ground MD
- Quantico Marine Corps Base VA
- Patuxent Naval Air Station MD
- NSA Fort Meade MD
- Andrews Air Force Base MD
- DC federal enclaves

**Handling:**
- If ZIPs are unpopulated (no civilian residents) → Document in notes, don't worry about coverage gap
- If ZIPs have civilian residents → Assign to nearest market anchor
- Military hospitals (Walter Reed, Fort Belvoir, etc.) do NOT create civilian markets

---

## Output Requirements

Generate CSV file with:

1. **Header row:**
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
```

2. **Data rows (130-160 expected):**
- One row per market-statistical_area combination
- Markets sorted alphabetically by market_id
- ZIP lists populated ONLY when 2+ markets share area
- Rationales document behavioral logic and friction factors

3. **Quality validation:**
- No CSA usage as primary
- No ZIP overlaps
- >95% ZIP coverage for shared counties
- Baltimore-DC separation enforced
- Eastern Shore isolation enforced
- Appalachian isolation enforced

---

## Final Instruction

Apply BOTH the master prompt rules AND these Mid-Atlantic regional specifics.

**Critical priorities for this region:**

1. **Split DC-Baltimore CSA** into 5-7+ markets (do NOT use CSA 47900 as primary)
2. **Resolve ZIP overlaps** in Montgomery County, Arlington County, Alexandria City
3. **Document WMATA integration** with specific Metro lines and stations
4. **Enforce geographic barriers** (Bay Bridge, Appalachian Mountains, Potomac River)
5. **Validate coverage** for shared counties (>95% of ZIPs assigned)

**Test your work:**
- Would a DC-area hospital CFO agree Baltimore is separate from DC?
- Would a Maryland regulator agree Eastern Shore is isolated by Bay Bridge?
- Would a data engineer be able to build unambiguous ZIP-to-market table?

If answers are NO → Mapping is not ready.

---

**End of Mid-Atlantic Regional Mapping Prompt**