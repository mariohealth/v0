# Regional Mapping Prompt: California

## Instructions

**Read `area_to_market_mapping_master.md` first.** This prompt adds California regional specificity but does not override national rules.

---

## Geographic Scope

**State:** California (single state, 39M+ people)

**Expected Output:** Approximately 180-250 mapping rows across 40-55 markets for this single-state region.

**CRITICAL:** California has more population than most multi-state regions and THE WORST congestion in the United States. This requires extreme market granularity and ZIP-level splits.

---

## Critical Regional Context

California has the **most complex market fragmentation** of any single state due to:

1. **LA Basin polycentric structure** (13M+ people, MUST split into 8-12+ markets)
2. **Worst traffic congestion in nation** (I-405, Bay Bridge, I-10, I-5, I-680)
3. **Major water barriers** (San Francisco Bay with limited bridge crossings)
4. **Mountain range isolation** (Sierra Nevada, Coast Ranges, Transverse Ranges, Tehachapi)
5. **Extreme sprawl** (LA County alone is 4,000 square miles, 10M people)
6. **Bay Area fragmentation** (7.8M people across water and mountain barriers)
7. **Single-state complexity** (39M people = more than Canada, requires 40-55 markets)

**KEY PRINCIPLE:** California requires MORE market splits than any other state. The 45-minute rule is constantly violated by congestion and terrain.

---

## Region-Specific Friction Factors

### ABSOLUTE BARRIERS (Markets NEVER Share Statistical Areas Across These)

#### 1. Extreme Congestion Corridors (Nation's Worst)

**Los Angeles I-405 Corridor (San Diego Freeway):**
- **Nation's worst traffic corridor**
- **Crossing times:** 60-90+ minutes during typical daytime hours
- Creates hard east-west split through LA Basin (Westside vs San Fernando Valley vs Central LA)
- **Test:** Markets on opposite sides of I-405 should NEVER share statistical areas without ZIP-level splits

**Los Angeles Basin Congestion (Multiple Corridors):**
- **I-10 (Santa Monica Freeway):** Chronic all-day congestion, 60+ min to cross metro
- **I-5 (Golden State Freeway):** Truck-heavy, severe delays through downtown
- **I-110 (Harbor Freeway):** Port traffic bottleneck to Long Beach
- **US-101 (Hollywood Freeway):** Chronic congestion through San Fernando Valley
- **SR-60 (Pomona Freeway):** Connects East LA to Inland Empire, chronic delays
- **Market Impact:** LA Basin MUST be split into 8-12 markets minimum

**San Francisco Bay Area Congestion:**
- **Bay Bridge (I-80):** 30-60 min delays typical during daytime, metered entry, creates SF vs Oakland split
- **I-680 corridor (East Bay):** Chronic congestion Walnut Creek to San Jose
- **US-101 Peninsula corridor:** Mountain View to SF, severe tech traffic congestion
- **SR-92 (San Mateo Bridge):** East Bay to Peninsula crossing, moderate delays
- **SR-84 (Dumbarton Bridge):** South Bay to East Bay crossing
- **Market Impact:** Bay Area MUST be split into 6-8 markets minimum

**Inland Empire Congestion:**
- **I-10/I-15 interchange:** Extreme truck congestion, 30-60 min delays
- **I-15 Cajon Pass:** Steep grades, truck crawl, creates High Desert separation
- **SR-60 (Pomona Freeway):** Connects LA Basin to Inland Empire, major bottleneck
- **I-215 through Riverside/San Bernardino:** Chronic congestion
- **Market Impact:** Inland Empire separate from LA, must split into 3-4 markets

**San Diego Congestion:**
- **I-5 corridor:** Entire county length, chronic congestion 60+ miles
- **I-15 corridor:** Inland route, severe delays connecting to Inland Empire
- **I-805:** Parallel to I-5, also congested
- **Market Impact:** San Diego must split into 2-3 markets (coastal vs inland, or north vs central vs east)

**Test:** If two markets are separated by I-405, Bay Bridge, I-10/I-15 interchange → Assume 60+ min travel, split markets

#### 2. Mountain Range Barriers (Absolute Separation)

**Sierra Nevada Mountains (Eastern California):**
- **Absolute barrier** between California and Nevada/eastern regions
- Only crossings: I-80 (Donner Pass), US-50, SR-88 (all subject to winter closure)
- Creates complete isolation of eastern Sierra communities
- **Test:** No market should span Sierra Nevada crest

**Tehachapi Mountains (Central Valley to LA Basin):**
- Separates Central Valley (Bakersfield) from LA Basin completely
- **I-5 Grapevine (Tejon Pass):** 4,144 ft elevation, winter closures, truck crawl creates 30+ min delay
- **SR-14 via Palmdale:** Alternate route through high desert, also mountain crossing
- **Market Impact:** Bakersfield NEVER integrates with LA markets
- **Test:** No market crosses Tehachapi Pass

**San Gabriel Mountains (LA Basin to High Desert):**
- Separates LA Basin from Antelope Valley (Lancaster, Palmdale)
- **I-5 through Santa Clarita:** Limited crossing
- **SR-14 (Antelope Valley Freeway):** Only route to Lancaster/Palmdale, creates isolation
- **Angeles Crest Highway (SR-2):** Not viable for routine healthcare (2-lane mountain road)
- **Market Impact:** Antelope Valley completely separate from LA Basin
- **Test:** Antelope Valley market never shares LA County statistical areas without ZIP splits

**Santa Monica Mountains (LA Basin Internal Barrier):**
- Creates east-west separation within LA County
- Separates San Fernando Valley from Westside/Central LA
- Limited crossings: I-405 (Sepulveda Pass), US-101 (Cahuenga Pass), Topanga Canyon
- All crossings experience severe congestion (60+ min to cross)
- **Market Impact:** San Fernando Valley MUST be separate market from Westside LA
- **Test:** Valley ZIPs never in same market as Westside ZIPs without documented separation

**Transverse Ranges (LA Basin to Central Coast):**
- Separates LA Basin from Ventura County and Santa Barbara
- **US-101 through Conejo Grade:** Mountain pass creates friction
- **Market Impact:** Ventura County separate from LA; Santa Barbara completely separate

**Coast Ranges (Statewide Coastal Isolation):**
- **Santa Cruz Mountains:** Separate SF Peninsula from Santa Cruz coast
  - **Highway 17:** Only crossing, 2-lane mountain road, dangerous, limits integration
  - **Market Impact:** Santa Cruz NEVER integrates with SF or San Jose
- **Diablo Range:** Separates East Bay from Central Valley
  - **I-580 Altamont Pass:** Wind turbine corridor, connects Oakland to Central Valley but doesn't integrate markets
  - **Market Impact:** Livermore/Tri-Valley separate from Stockton despite proximity

**Peninsular Ranges (San Diego County):**
- Create coastal vs inland separation within San Diego County
- **I-8 corridor:** Connects coast to El Cajon, Alpine, but mountains create distinct markets
- **Market Impact:** San Diego may split into coastal vs East County markets

**Cascade Range (Northern California):**
- **Mt. Shasta region:** Creates isolation for far northern California
- **Market Impact:** Redding market isolated from Sacramento and Bay Area

**Test:** If route requires mountain pass >3,000 ft elevation → Markets are separate

#### 3. San Francisco Bay Water Barriers

**Geography:**
- **Five major bridge crossings:** Bay Bridge, San Mateo Bridge, Dumbarton Bridge, Golden Gate Bridge, Richmond-San Rafael Bridge
- Each bridge creates friction due to:
  - Tolls ($6-8 each direction)
  - Metered entry during commute hours
  - Limited capacity creating bottlenecks
  - Fog and wind closures

**Bridge-by-Bridge Analysis:**

**Bay Bridge (I-80, SF to Oakland):**
- **Crossing time:** 30-60 min typical during daytime with metering
- Creates SF vs Oakland split
- **Test:** SF proper and Oakland should be separate markets

**San Mateo Bridge (SR-92, East Bay to Peninsula):**
- **Crossing time:** 20-30 min plus approach congestion
- Connects Hayward (East Bay) to San Mateo (Peninsula)
- **Test:** East Bay and Peninsula should be separate markets despite bridge

**Dumbarton Bridge (SR-84, South Bay to East Bay):**
- **Crossing time:** 15-25 min
- Connects Fremont to Palo Alto area
- Moderate friction

**Golden Gate Bridge (US-101, SF to Marin):**
- **Crossing time:** 20-40 min with toll plaza delays
- Connects SF to Marin County
- **Test:** Marin County separate from SF due to bridge friction + limited alternatives

**Richmond-San Rafael Bridge (I-580, East Bay to North Bay):**
- **Crossing time:** 25-35 min
- Connects Richmond to San Rafael (Marin)
- Creates East Bay vs North Bay separation

**Market Impact:**
- **San Francisco proper:** Separate market (SF County/City)
- **East Bay North:** Oakland, Berkeley, Alameda (separate from SF via Bay Bridge)
- **East Bay South:** Fremont, Hayward (may be separate from Oakland)
- **East Bay Inland:** Walnut Creek, Concord (definitely separate, no direct bridge)
- **Peninsula:** Palo Alto, Redwood City, San Mateo (separate from all)
- **South Bay:** San Jose, Sunnyvale, Santa Clara (separate from Peninsula despite proximity)
- **North Bay Marin:** San Rafael, Novato (separate from SF via Golden Gate)
- **North Bay Sonoma:** Santa Rosa, Petaluma (separate from all, no direct bridge)

**CRITICAL TEST:** No market should claim "entire Bay Area" — water barriers require 6-8 market splits minimum

#### 4. Desert Barriers (Southern California)

**Coachella Valley (Palm Springs Area):**
- **Isolated by mountains from Inland Empire**
- **I-10 through San Gorgonio Pass:** Only route, mountain pass creates distinct market
- **Climate:** Desert resort climate completely different from Riverside/San Bernardino
- **Market Impact:** Palm Springs/Rancho Mirage/Indio separate from Riverside
- **Test:** Coachella Valley never integrates with Riverside or San Bernardino markets

**Imperial Valley (El Centro):**
- **Isolated by desert from San Diego**
- **I-8 through Imperial Sand Dunes:** 100+ miles of desert, extreme heat
- **Market Impact:** El Centro completely separate from San Diego (120 miles, 2 hours)
- **Test:** Imperial County never integrates with San Diego County

**High Desert (Victorville, Hesperia, Apple Valley):**
- **Isolated from LA Basin by San Gabriel Mountains**
- **I-15 Cajon Pass:** 4,000+ ft mountain pass with steep grades
- **Market Impact:** May integrate with Antelope Valley OR be separate market
- **Test:** High Desert never integrates with San Bernardino or LA Basin markets

### SEVERE BARRIERS (Create Friction But May Not Always Split Markets)

#### 5. Long-Distance Separation (Central Valley)

**Central Valley SR-99 Corridor:**
- **Linear metro pattern:** Cities strung along SR-99 for 400+ miles
- **Distances between cities:**
  - Bakersfield ↔ Fresno: 110 miles, 1h 45min
  - Fresno ↔ Modesto: 90 miles, 1h 30min
  - Modesto ↔ Stockton: 35 miles, 40min
  - Stockton ↔ Sacramento: 45 miles, 50min
  - Chico ↔ Sacramento: 90 miles, 1h 30min
  - Redding ↔ Chico: 90 miles, 1h 30min

**Market Impact:** Each city is separate market despite SR-99 connecting them
- **Bakersfield** (Kern County) — separate market
- **Fresno** (Fresno County) — separate market
- **Visalia** (Tulare County) — separate market
- **Modesto** (Stanislaus County) — separate market
- **Stockton** (San Joaquin County) — separate market
- **Merced** (Merced County) — may be separate or integrate with Modesto
- **Sacramento** (Sacramento County) — separate market, state capital
- **Chico** (Butte County) — separate market, northern valley
- **Redding** (Shasta County) — separate market, far northern California

**CRITICAL TEST:** Do NOT consolidate Central Valley. Each city >60 miles apart = separate market.

---

## Transit Systems and Market Integration

### BART (Bay Area Rapid Transit) — LIMITED Market Integration

**BART coverage:**
- San Francisco → Oakland/Berkeley → Walnut Creek/Concord
- San Francisco → Daly City/Millbrae → SFO Airport
- Oakland → Fremont/Dublin/Pleasanton

**BART does NOT extend to:**
- ❌ San Jose (no South Bay coverage)
- ❌ Peninsula (only reaches Millbrae, not Palo Alto/Stanford)
- ❌ North Bay (no Marin or Sonoma service)
- ❌ Santa Cruz Mountains coast

**BART Integration Test (4-Step Process):**

1. **Does BART directly connect both anchors?**
   - SF ↔ Oakland: ✅ YES (Transbay Tube, 20 min)
   - SF ↔ Walnut Creek: ⚠️ YES but 40+ min
   - SF ↔ San Jose: ❌ NO (no BART service to San Jose)
   - Oakland ↔ Fremont: ✅ YES (direct, 40 min)

2. **Is frequency ≥15 minutes midday?**
   - ✅ YES (BART runs every 15 min midday, more frequent at peak)

3. **Is trip time <45 min door-to-door?**
   - SF ↔ Oakland: ✅ ~30 min total (close call)
   - SF ↔ Walnut Creek: ❌ 50+ min total
   - Oakland ↔ Fremont: ⚠️ ~45 min (marginal)

4. **Do residents actually use BART for medical appointments?**
   - Plausible for SF ↔ Oakland (UCSF, Highland Hospital, Alta Bates)
   - Less plausible for longer distances

**Decision: BART may justify SOME integration in core SF-Oakland corridor**
- SF and Oakland could potentially be single market IF BART integration is strong
- OR split into SF proper vs East Bay if suburban identity dominates
- Walnut Creek/Concord definitely separate (40+ min)
- Fremont/South Bay definitely separate (45+ min, different anchor systems)

**Recommendation:** Split SF and Oakland into separate markets despite BART. Bay Bridge congestion + distinct anchor systems (UCSF vs Alta Bates/Highland) + behavioral patterns suggest separation.

### Caltrain (Peninsula) — Does NOT Collapse Markets

**Why Caltrain doesn't justify integration:**
- **Peak-direction focused:** Primarily commuter service to SF/Silicon Valley jobs
- **Poor medical facility access:** Stations not near most hospitals
- **Long travel times:** SF to San Jose = 90 min via Caltrain (faster to drive off-peak)
- **Infrequent midday service:** 30-60 min headways off-peak

**CRITICAL RULE:** Caltrain should NOT justify integrating SF with San Jose.

**Test:** If rationale says "Caltrain connects SF to San Jose" → **HIGH SEVERITY ERROR**

SF and San Jose are 50 miles apart with distinct anchor systems (UCSF vs Stanford/Kaiser). Caltrain is commuter-focused, not medical access.

### LA Metro — Does NOT Collapse Markets

**Why LA Metro doesn't justify integration:**
- **Extremely limited coverage:** Only serves downtown LA and a few corridors
- **Does NOT reach major suburban hospital clusters:** No Metro to UCLA, Cedars-Sinai, Torrance, Pasadena, Orange County
- **Primarily serves downtown:** Red/Purple Lines downtown, limited suburban reach

**CRITICAL RULE:** LA Metro should NOT justify integrating any LA suburban markets.

**Test:** LA Metro is irrelevant for market integration purposes. Do not mention in rationales.

### Other Transit Systems — NOT Relevant

**Pacific Surfliner / LOSSAN corridor:**
- Amtrak San Diego → LA → Santa Barbara
- Too slow (4+ hours SD to LA)
- Does NOT collapse coastal markets

**Metrolink (LA commuter rail):**
- Peak-direction commuter service
- Does NOT collapse LA suburban markets

**VTA Light Rail (San Jose):**
- Limited coverage within San Jose
- Does NOT extend to other Bay Area cities

**ACE Train (Altamont Corridor Express):**
- Stockton to San Jose commuter service
- Does NOT integrate Central Valley with Bay Area

---

## Known Market Fragmentation Patterns (CRITICAL)

### The LA Basin Split (MOST CRITICAL DECISION)

**LA County alone has 10M people across 4,000 square miles. The LA Basin (including Orange, Ventura) has 13M+ people.**

This is the **#1 source of errors** in California mappings. The LA Basin is NOT one market.

**LA Basin MUST decompose into 8-12+ markets minimum:**

#### LA County Markets (6-8 markets within LA County alone):

1. **CA-LA-CENTRAL (Downtown LA / Central LA)**
   - CBSA: May use LA-Long Beach-Anaheim CBSA component OR county-level
   - Counties: Los Angeles County (06037)* — requires ZIP lists
   - Anchors: USC Keck Medicine, LAC+USC Medical Center, California Hospital
   - Geography: Downtown, Boyle Heights, East LA, Central City
   - *Share LA County with multiple other markets — ZIP lists REQUIRED

2. **CA-LA-WESTSIDE (Westside LA / West LA)**
   - Counties: Los Angeles County (06037)* — requires ZIP lists
   - Anchors: UCLA Health, Cedars-Sinai, Providence Saint John's
   - Geography: West LA, Westwood, Santa Monica, Beverly Hills, Culver City
   - Separated from Central LA by I-405 congestion (60+ min)
   - Separated from Valley by Santa Monica Mountains

3. **CA-LA-VALLEY (San Fernando Valley)**
   - Counties: Los Angeles County (06037)* — requires ZIP lists
   - Anchors: Providence Holy Cross, Kaiser Panorama City
   - Geography: Van Nuys, Burbank, Glendale, Northridge, Sherman Oaks
   - Separated from Central/Westside by Santa Monica Mountains
   - US-101 only crossing, severe congestion

4. **CA-LA-SOUTH (South LA / Long Beach / Harbor)**
   - Counties: Los Angeles County (06037)* — requires ZIP lists
   - Anchors: MemorialCare Long Beach, Dignity Health California Hospital
   - Geography: Long Beach, Torrance, Redondo Beach, South LA, Compton
   - Separated from Central LA by I-110 and distance
   - May split further into Long Beach vs South Bay vs Harbor

5. **CA-LA-EAST (East LA / Whittier / Downey)**
   - Counties: Los Angeles County (06037)* — requires ZIP lists
   - Anchors: PIH Health, Kaiser Downey
   - Geography: Whittier, Downey, Norwalk, Montebello
   - Separated from Central LA by I-5 and distance
   - Distinct from San Gabriel Valley despite proximity

6. **CA-LA-PASADENA (Pasadena / San Gabriel Valley)**
   - Counties: Los Angeles County (06037)* — requires ZIP lists
   - Anchors: Huntington Hospital, City of Hope
   - Geography: Pasadena, Arcadia, Monrovia, Duarte
   - Separated from Central LA by I-210 and distance
   - Distinct medical identity despite being in LA County

7. **CA-SANTA-CLARITA (Santa Clarita Valley)**
   - Counties: Los Angeles County (06037)* — requires ZIP lists OR separate if only Santa Clarita ZIPs
   - Anchors: Henry Mayo Newhall Hospital
   - Geography: Santa Clarita, Valencia, Newhall
   - Separated from Valley by I-5 mountain corridor
   - May be separate market or northern extension of Valley

8. **CA-ANTELOPE-VALLEY (Lancaster / Palmdale / High Desert)**
   - Counties: Los Angeles County (06037)* — requires ZIP lists
   - Anchors: Antelope Valley Hospital
   - Geography: Lancaster, Palmdale, Quartz Hill
   - Completely separated from LA Basin by San Gabriel Mountains
   - SR-14 only route, mountain pass creates absolute barrier

**CRITICAL: Los Angeles County (06037) is shared by 6-8 markets → ALL must have ZIP lists**

This is the most complex county in the nation for market mapping.

#### Orange County Markets (2 markets):

9. **CA-OC-NORTH (North Orange County)**
   - Counties: Orange County (06059)* — requires ZIP lists if split from South OC
   - Anchors: UCI Health, St. Joseph Hospital
   - Geography: Anaheim, Santa Ana, Fullerton, Orange
   - Separated from LA County by I-5 congestion and county border
   - Distinct from South OC by distance and anchor systems

10. **CA-OC-SOUTH (South Orange County)**
   - Counties: Orange County (06059)* — requires ZIP lists if split from North OC
   - Anchors: Hoag Hospital, Mission Hospital
   - Geography: Newport Beach, Irvine, Laguna Beach, Mission Viejo
   - Coastal vs inland split within Orange County
   - Wealthier, distinct identity from North OC

**Decision: Orange County may be single market OR split into North/South**
- If split: Both need ZIP lists for Orange County (06059)
- If single: Blank ZIP list acceptable

#### Ventura County Market (1 market, separate from LA):

11. **CA-VENTURA (Ventura County)**
   - Counties: Ventura County (06111)
   - Anchors: Community Memorial Hospital, Los Robles Hospital
   - Geography: Ventura, Oxnard, Thousand Oaks, Simi Valley
   - Separated from LA County by Santa Monica Mountains (Conejo Grade)
   - US-101 crosses mountains but 60+ min to LA

### The San Francisco Bay Area Split (6-8 Markets Required)

**Bay Area has 7.8M people across water and mountain barriers. MUST split into 6-8 markets:**

1. **CA-SF-CORE (San Francisco proper)**
   - Counties: San Francisco County (06075) — single county, no ZIP list needed
   - Anchors: UCSF, Sutter Health, Chinese Hospital
   - Geography: SF proper (peninsula tip)
   - Separated from Oakland by Bay Bridge
   - Separated from Peninsula by city limits

2. **CA-EASTBAY-NORTH (Oakland / Berkeley / Alameda)**
   - Counties: Alameda County (06001)* — requires ZIP lists if multiple markets
   - Anchors: Alta Bates Summit, Highland Hospital, Kaiser Oakland
   - Geography: Oakland, Berkeley, Alameda, Emeryville
   - Separated from SF by Bay Bridge (30-60 min)
   - May include all of Alameda County OR split from South East Bay

3. **CA-EASTBAY-SOUTH (Fremont / Hayward / South Alameda County)**
   - Counties: Alameda County (06001)* — requires ZIP lists if split from North
   - Anchors: Washington Hospital, Kaiser Fremont, St. Rose
   - Geography: Fremont, Hayward, Newark, Union City
   - May be separate from Oakland OR integrated
   - Decision depends on behavioral patterns

4. **CA-EASTBAY-INLAND (Walnut Creek / Concord / Contra Costa)**
   - Counties: Contra Costa County (06013)
   - Anchors: John Muir Health
   - Geography: Walnut Creek, Concord, Pleasant Hill, Martinez
   - Separated from Oakland by I-680 congestion and distance
   - Separated from SF by Bay Bridge + BART 40+ min
   - Definitely separate market

5. **CA-PENINSULA (San Mateo County / Palo Alto / Stanford)**
   - Counties: San Mateo County (06081)
   - Anchors: Stanford Health Care, Mills-Peninsula
   - Geography: Palo Alto, Redwood City, San Mateo, Burlingame
   - Separated from SF by county line and distance
   - Separated from Oakland by San Mateo Bridge
   - Separated from San Jose by Santa Clara County line

6. **CA-SOUTHBAY (San Jose / Santa Clara County)**
   - Counties: Santa Clara County (06085)
   - Anchors: Stanford Health, Kaiser Santa Clara, El Camino, Regional Medical Center
   - Geography: San Jose, Sunnyvale, Mountain View, Cupertino, Milpitas
   - Separated from Peninsula by distance despite Caltrain
   - Separated from Oakland by Dumbarton Bridge + distance
   - Large enough (2M people) to be distinct market

7. **CA-NORTHBAY-MARIN (Marin County)**
   - Counties: Marin County (06041)
   - Anchors: MarinHealth, Kaiser San Rafael
   - Geography: San Rafael, Novato, Mill Valley
   - Separated from SF by Golden Gate Bridge (20-40 min + toll)
   - Separated from East Bay by Richmond-San Rafael Bridge

8. **CA-NORTHBAY-SONOMA (Sonoma County / Santa Rosa)**
   - Counties: Sonoma County (06097)
   - Anchors: Providence Santa Rosa, Sutter Santa Rosa
   - Geography: Santa Rosa, Petaluma, Rohnert Park
   - Separated from all Bay Area by distance and no direct bridge
   - Wine Country, distinct identity

**CRITICAL: Alameda County (06001) may be shared by 2 markets → ZIP lists required if split**

### The Inland Empire Split (3-4 Markets Required)

**Inland Empire has 4.6M people and is completely separate from LA Basin. MUST split into 3-4 markets:**

1. **CA-SANBERNARDINO (San Bernardino County)**
   - Counties: San Bernardino County (06071)* — very large, may share with other markets
   - Anchors: Loma Linda University Health, Arrowhead Regional, St. Bernardine
   - Geography: San Bernardino, Loma Linda, Rialto, Fontana
   - Separated from LA by 60 miles and Cajon Pass
   - May include High Desert OR separate

2. **CA-RIVERSIDE (Riverside County West)**
   - Counties: Riverside County (06065)* — very large, shares with Coachella/Temecula
   - Anchors: Riverside Community Hospital, Kaiser Riverside
   - Geography: Riverside, Corona, Moreno Valley
   - Separated from LA by distance and SR-60 congestion
   - Separated from Coachella Valley by mountains

3. **CA-COACHELLA (Coachella Valley / Palm Springs)**
   - Counties: Riverside County (06065)* — requires ZIP lists
   - Anchors: Eisenhower Health, Desert Regional
   - Geography: Palm Springs, Rancho Mirage, Palm Desert, Indio
   - Completely isolated by mountains from Riverside
   - I-10 San Gorgonio Pass only route
   - Desert resort climate, distinct identity

4. **CA-TEMECULA (Southwest Riverside / Temecula Valley)**
   - Counties: Riverside County (06065)* — requires ZIP lists
   - Anchors: Temecula Valley Hospital
   - Geography: Temecula, Murrieta, Menifee
   - Separated from both Riverside and San Diego
   - I-15 corridor, may be independent or integrate with one

**CRITICAL: Riverside County (06065) is shared by 2-3 markets → ZIP lists REQUIRED**

### The San Diego County Split (2-3 Markets)

**San Diego County has 3.3M people. Should split into 2-3 markets:**

1. **CA-SD-CORE (San Diego Core / Coastal)**
   - Counties: San Diego County (06073)* — requires ZIP lists if split
   - Anchors: UC San Diego Health, Scripps, Sharp
   - Geography: Downtown SD, La Jolla, Coronado, coastal communities
   - Primary urban core

2. **CA-SD-NORTH (North County Coastal)**
   - Counties: San Diego County (06073)* — requires ZIP lists if split
   - Anchors: Scripps Encinitas, Tri-City Medical Center
   - Geography: Carlsbad, Oceanside, Encinitas, Vista
   - I-5 corridor north, 30-40 miles from downtown SD
   - May be separate OR integrate with core

3. **CA-SD-EAST (East County / Inland)**
   - Counties: San Diego County (06073)* — requires ZIP lists if split
   - Anchors: Sharp Grossmont, Alvarado Hospital
   - Geography: El Cajon, La Mesa, Santee, Alpine
   - I-8 corridor inland
   - Separated from coast by distance and terrain

**Decision: San Diego may be single market OR split 2-3 ways**
- If split: All portions need ZIP lists for San Diego County (06073)
- If single: Blank ZIP list acceptable

### Sacramento Region (1-2 Markets)

1. **CA-SACRAMENTO (Sacramento Core)**
   - Counties: Sacramento County (06067), possibly others
   - Anchors: UC Davis Health, Sutter, Dignity Health
   - Geography: Sacramento city, immediate suburbs

2. **CA-PLACER (Placer County / Roseville) — POSSIBLE separate market**
   - Counties: Placer County (06061)
   - Geography: Roseville, Rocklin, Lincoln
   - May be separate OR integrate with Sacramento
   - If separate: distinct market; if integrated: blank ZIP list

### Central Valley Markets (8-10 Separate Markets)

**CRITICAL: Do NOT consolidate these. Each city >60 miles apart = separate market:**

1. **CA-REDDING** (Shasta County) — Far Northern California
2. **CA-CHICO** (Butte County) — Northern Valley
3. **CA-YUBA-CITY** (Sutter/Yuba Counties) — May be separate or integrate with Sacramento
4. **CA-STOCKTON** (San Joaquin County)
5. **CA-MODESTO** (Stanislaus County)
6. **CA-MERCED** (Merced County)
7. **CA-FRESNO** (Fresno County)
8. **CA-VISALIA** (Tulare County)
9. **CA-BAKERSFIELD** (Kern County)

**Test:** If two Central Valley cities are >60 miles apart → Separate markets

### Central Coast Markets (5-6 Markets)

1. **CA-SANTACRUZ** (Santa Cruz County) — Separate from Bay Area (Highway 17 barrier)
2. **CA-MONTEREY** (Monterey County) — Monterey/Salinas
3. **CA-SANLUIS** (San Luis Obispo County)
4. **CA-SANTAMARIA** (Santa Barbara County north)
5. **CA-SANTABARBARA** (Santa Barbara County south)

### Additional Markets (5-7 Markets)

1. **CA-EUREKA** (Humboldt County) — Far North Coast, isolated
2. **CA-VICTORVILLE** (High Desert) — May be separate or integrate with Antelope Valley
3. **CA-ELCENTRO** (Imperial County) — Imperial Valley, isolated by desert
4. **CA-LAKETAHOE** (Placer/El Dorado) — Sierra resort, may be small market
5. **CA-MAMMOTH** (Mono County) — Eastern Sierra, if serves civilian population

---

## Counties Requiring ZIP-Level Splits (HIGH PROBABILITY)

Based on market definitions, these counties will be shared by multiple markets and MUST have ZIP lists:

### Los Angeles County (06037) — DEFINITE SPLIT (6-8 markets share)

**Markets sharing LA County:**
1. CA-LA-CENTRAL (Downtown/Central LA)
2. CA-LA-WESTSIDE (West LA/Santa Monica/Beverly Hills)
3. CA-LA-VALLEY (San Fernando Valley)
4. CA-LA-SOUTH (Long Beach/Harbor/South Bay)
5. CA-LA-EAST (East LA/Whittier/Downey)
6. CA-LA-PASADENA (Pasadena/San Gabriel Valley)
7. CA-SANTA-CLARITA (Santa Clarita Valley) — possible
8. CA-ANTELOPE-VALLEY (Lancaster/Palmdale)

**Behavioral boundaries for ZIP assignment:**
- **I-405:** Divides Westside from Valley and Central
- **Santa Monica Mountains:** Divides Valley from Westside/Central
- **I-110:** Divides South LA/Harbor from Central
- **I-5 / I-710:** Divides East LA from Central
- **I-210:** Northern boundary for Pasadena/San Gabriel Valley
- **San Gabriel Mountains:** Absolute barrier for Antelope Valley

**Required Action:**
Each of the 6-8 markets must have explicit ZIP lists covering their portion of LA County. This is the MOST COMPLEX county in the nation for market mapping.

**Estimated ZIP count:** LA County has 200+ ZIPs. Each market gets 20-40 ZIPs depending on geography.

### Orange County (06059) — POSSIBLE SPLIT (2 markets may share)

**IF Orange County is split:**
- CA-OC-NORTH (Anaheim, Santa Ana, Fullerton)
- CA-OC-SOUTH (Irvine, Newport Beach, Laguna)

**Behavioral boundary:**
- **I-5 / SR-55:** North-South divider
- **Geography:** North County urban vs South County coastal/affluent

**IF Orange County is single market:**
- Blank ZIP list acceptable

### Riverside County (06065) — DEFINITE SPLIT (2-3 markets share)

**Markets sharing Riverside County:**
1. CA-RIVERSIDE (Western Riverside, Corona)
2. CA-COACHELLA (Palm Springs, Rancho Mirage, Indio)
3. CA-TEMECULA (Temecula, Murrieta) — possible

**Behavioral boundaries:**
- **San Jacinto Mountains:** Absolute barrier between Riverside and Coachella Valley
- **I-15 corridor:** Temecula area, separate from Riverside by distance

**Required Action:**
Each market must have explicit ZIP lists. Coachella Valley ZIPs completely separate from Riverside ZIPs due to mountain barrier.

### San Bernardino County (06071) — POSSIBLE SPLIT (2 markets may share)

**Markets potentially sharing:**
1. CA-SANBERNARDINO (San Bernardino, Loma Linda, Fontana)
2. CA-VICTORVILLE (High Desert) — if separate market

**Behavioral boundary:**
- **I-15 Cajon Pass:** Divides San Bernardino from High Desert (Victorville, Hesperia, Apple Valley)

**IF High Desert is separate market:**
- Both need ZIP lists
**IF High Desert integrates with San Bernardino OR Antelope Valley:**
- Blank ZIP list acceptable for San Bernardino market

### San Diego County (06073) — POSSIBLE SPLIT (2-3 markets may share)

**IF San Diego splits:**
1. CA-SD-CORE (Downtown, La Jolla, coastal)
2. CA-SD-NORTH (Carlsbad, Oceanside, Encinitas)
3. CA-SD-EAST (El Cajon, La Mesa, Santee)

**Behavioral boundaries:**
- **I-5 corridor:** North-South coastal
- **I-8 corridor:** East County inland
- **Distance:** Downtown to North County = 30+ miles

**IF San Diego is single market:**
- Blank ZIP list acceptable

### Alameda County (06001) — POSSIBLE SPLIT (2 markets may share)

**Markets potentially sharing:**
1. CA-EASTBAY-NORTH (Oakland, Berkeley)
2. CA-EASTBAY-SOUTH (Fremont, Hayward)

**Behavioral boundary:**
- **Distance:** Oakland to Fremont = 30 miles
- **I-880 corridor:** North vs South Alameda County

**Decision depends on behavioral patterns:**
- IF split: Both need ZIP lists
- IF integrated: Blank ZIP list

---

## Critical Data Quality Checks (Based on Mid-Atlantic QA)

Before finalizing, verify:

### 1. CSA Usage Check
- [ ] **ZERO** markets use CSA as primary statistical area
- [ ] LA-Long Beach-Anaheim CSA NOT used as single primary
- [ ] San Jose-San Francisco-Oakland CSA NOT used as single primary
- [ ] Each market uses appropriate CBSA component OR counties

### 2. ZIP List Requirements
- [ ] Los Angeles County (06037): 6-8 markets each have zip_list populated
- [ ] Riverside County (06065): 2-3 markets each have zip_list populated
- [ ] Orange County (06059): IF split, both have zip_list; IF single, blank
- [ ] San Diego County (06073): IF split, all have zip_list; IF single, blank
- [ ] San Bernardino County (06071): IF split, both have zip_list; IF single, blank
- [ ] Alameda County (06001): IF split, both have zip_list; IF single, blank

### 3. ZIP List Overlap Check
- [ ] Los Angeles County: NO overlapping ZIPs across markets
- [ ] Riverside County: NO overlapping ZIPs across markets
- [ ] All other shared counties: NO overlaps

### 4. LA Basin Separation Check
- [ ] LA Basin split into 8-12 distinct markets
- [ ] Orange County separate from LA County (distinct markets)
- [ ] San Fernando Valley separate from Westside LA (Santa Monica Mountains barrier)
- [ ] Inland Empire separate from LA Basin (Cajon Pass / distance barrier)
- [ ] Antelope Valley separate from LA Basin (San Gabriel Mountains barrier)
- [ ] Ventura County separate from LA County (Conejo Grade barrier)

### 5. Bay Area Separation Check
- [ ] Bay Area split into 6-8 distinct markets
- [ ] San Francisco separate from San Jose (distance / distinct anchors)
- [ ] East Bay separate from Peninsula (bay bridges / distinct anchors)
- [ ] Oakland separate OR integrated with SF (Bay Bridge test)
- [ ] North Bay (Marin, Sonoma) separate from SF core
- [ ] Walnut Creek separate from Oakland (distance / I-680)

### 6. Central Valley Separation Check
- [ ] Bakersfield separate from Fresno (110 miles)
- [ ] Fresno separate from Modesto (90 miles)
- [ ] Modesto separate from Stockton (35 miles, but may integrate)
- [ ] Stockton separate from Sacramento (45 miles)
- [ ] Chico separate from Sacramento (90 miles)
- [ ] Redding separate from Chico (90 miles)
- [ ] Each Central Valley city has distinct market

### 7. Mountain Barrier Check
- [ ] Antelope Valley isolated from LA Basin (San Gabriel Mountains)
- [ ] Coachella Valley isolated from Riverside (San Jacinto Mountains)
- [ ] Bakersfield isolated from LA Basin (Tehachapi Mountains / Grapevine)
- [ ] Santa Cruz isolated from Bay Area (Santa Cruz Mountains / Highway 17)
- [ ] High Desert isolated from San Bernardino (Cajon Pass)

### 8. Transit Integration Check
- [ ] BART NOT used to integrate entire Bay Area
- [ ] Caltrain NOT used to integrate SF with San Jose
- [ ] LA Metro NOT used to integrate any LA markets
- [ ] Only BART SF-Oakland corridor considered for possible integration

### 9. Congestion Barrier Check
- [ ] I-405 documented as barrier in LA rationales
- [ ] Bay Bridge documented as barrier in Bay Area rationales
- [ ] I-10/I-15 documented as barrier for Inland Empire rationales
- [ ] Congestion creates market splits, not just noted

### 10. County FIPS Accuracy Check
- [ ] All California county FIPS codes verified (06001-06115)
- [ ] County names match FIPS codes
- [ ] No duplicate county assignments without ZIP lists

---

## Special Cases and Edge Cases

### LA County ZIP List Construction

**This is the most complex ZIP list construction in the nation.**

**Step-by-step approach:**

1. **Obtain LA County ZIP code map** (200+ ZIPs)
2. **Identify geographic boundaries:**
   - I-405: Westside vs Valley/Central
   - Santa Monica Mountains: Valley vs Westside/Central
   - I-110: South LA vs Central
   - I-5/I-710: East LA vs Central
   - I-210: Pasadena/San Gabriel boundary
   - San Gabriel Mountains: Antelope Valley absolute barrier

3. **Assign ZIPs by proximity to anchor hospitals:**
   - Downtown LA ZIPs → CA-LA-CENTRAL
   - West LA, Santa Monica, Beverly Hills ZIPs → CA-LA-WESTSIDE
   - Valley ZIPs (91xxx, 818 area code) → CA-LA-VALLEY
   - Long Beach, Harbor ZIPs → CA-LA-SOUTH
   - Whittier, Downey ZIPs → CA-LA-EAST
   - Pasadena, Arcadia ZIPs → CA-LA-PASADENA
   - Lancaster, Palmdale ZIPs → CA-ANTELOPE-VALLEY

4. **Verify complete coverage** (all 200+ ZIPs assigned)
5. **Verify no overlaps** (each ZIP in exactly one market)

**Format example:**
```csv
CA-LA-CENTRAL,County,06037,"90001,90002,90003,90004,90005,90006,90007...",Los Angeles County CA,primary
CA-LA-WESTSIDE,County,06037,"90024,90025,90049,90066,90067,90210,90211...",Los Angeles County CA,primary
```

### Bay Area Market Structure Decision

**Two approaches:**

**Option A — 6 markets (more consolidated):**
1. CA-SF-CORE (SF + Oakland integrated via BART)
2. CA-EASTBAY-INLAND (Walnut Creek, Concord)
3. CA-PENINSULA (San Mateo County, Stanford)
4. CA-SOUTHBAY (San Jose, Santa Clara County)
5. CA-NORTHBAY-MARIN (Marin County)
6. CA-NORTHBAY-SONOMA (Sonoma County)

**Option B — 8 markets (more granular):**
1. CA-SF-CORE (SF proper only)
2. CA-EASTBAY-NORTH (Oakland, Berkeley)
3. CA-EASTBAY-SOUTH (Fremont, Hayward)
4. CA-EASTBAY-INLAND (Walnut Creek, Concord)
5. CA-PENINSULA (San Mateo County, Stanford)
6. CA-SOUTHBAY (San Jose, Santa Clara County)
7. CA-NORTHBAY-MARIN (Marin County)
8. CA-NORTHBAY-SONOMA (Sonoma County)

**Recommendation:** Option B (8 markets) aligns with Bay Bridge friction, distinct anchor systems, and behavioral patterns.

### Orange County Market Decision

**Option A — Single market:**
- CA-OC (all of Orange County)
- Rationale: County identity, UCI Health serves entire county

**Option B — Split into 2:**
- CA-OC-NORTH (Anaheim, Santa Ana, Fullerton)
- CA-OC-SOUTH (Irvine, Newport Beach, Laguna)
- Rationale: North vs South OC have distinct demographics, anchors, identity

**Recommendation:** Either acceptable. If population and behavioral data show distinct patterns → Split. If UCI Health serves entire county routinely → Single market.

### San Diego County Market Decision

**Option A — Single market:**
- CA-SD (all of San Diego County)
- Rationale: Scripps/Sharp/UCSD serve entire county

**Option B — Split into 2-3:**
- CA-SD-CORE (Downtown, La Jolla)
- CA-SD-NORTH (Carlsbad, Oceanside)
- CA-SD-EAST (El Cajon, La Mesa)
- Rationale: Distance, I-5 vs I-8 corridors, coastal vs inland

**Recommendation:** Single market OR 2-way split (Core + North). 3-way split only if behavioral data strongly supports.

---

## Output Requirements

Generate CSV file with:

1. **Header row:**
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
```

2. **Data rows (180-250 expected):**
- One row per market-statistical_area combination
- Markets sorted alphabetically by market_id
- ZIP lists populated ONLY when 2+ markets share area
- Rationales document behavioral logic and friction factors

3. **Quality validation:**
- No CSA usage as primary
- No ZIP overlaps in shared counties
- LA Basin split into 8-12 markets
- Bay Area split into 6-8 markets
- Central Valley cities NOT consolidated
- All mountain barriers enforced

---

## Final Instruction

Apply BOTH the master prompt rules AND these California regional specifics.

**Critical priorities for California:**

1. **Split LA Basin aggressively** — 8-12 markets minimum (do NOT consolidate)
2. **Split Bay Area appropriately** — 6-8 markets minimum (water barriers)
3. **Build LA County ZIP lists** — Most complex county, 6-8 markets sharing, requires complete ZIP assignment
4. **Do NOT consolidate Central Valley** — Each city >60 miles apart = separate market
5. **Respect mountain barriers** — Tehachapi, San Gabriel, San Jacinto, Santa Cruz Mountains all absolute
6. **Ignore transit for integration** — BART limited, Caltrain doesn't collapse markets, LA Metro irrelevant
7. **Document congestion** — I-405, Bay Bridge, I-10/I-15 all create market splits

**Test your work:**
- Would an LA resident agree Westside and Valley are separate markets? (YES — Santa Monica Mountains + I-405)
- Would a Bay Area resident agree SF and San Jose are separate? (YES — 50 miles, distinct anchors)
- Would anyone believe Bakersfield integrates with LA? (NO — Tehachapi Mountains + 110 miles)
- Can a data engineer build unambiguous ZIP-to-market table? (ONLY if LA County has complete ZIP lists)

If answers are NO → Mapping is not ready.

---

**End of California Regional Mapping Prompt**
