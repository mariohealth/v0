# Regional Prompt: California Healthcare Shopping Zones

## Instructions

**Read `prompt_master_market.md` first.** This prompt adds regional specificity but does not override national rules.

---

## Geographic Scope

**State:** California (single state, 39M+ people)

**Expected Output:** Approximately 40-55 Healthcare Shopping Zones for this state.

**CRITICAL:** California alone has more population than most multi-state regions. This requires extreme granularity, particularly in LA Basin, Bay Area, and Inland Empire.

---

## Region-Specific Mobility Factors

### Extreme Congestion (Worst in Nation)
California has the worst traffic congestion in the United States:

**Los Angeles:**
- **I-405** (San Diego Freeway): Nation's worst corridor, 60-90+ min to cross metro
- **I-10** (Santa Monica Freeway): Chronic all-day congestion
- **I-5** (Golden State Freeway): Truck-heavy, severe delays
- **I-110** (Harbor Freeway): Port traffic bottleneck
- **US-101** (Hollywood Freeway): Chronic congestion through San Fernando Valley
- **Expect 8-12 distinct markets within LA County/Basin alone**

**San Francisco Bay Area:**
- **Bay Bridge (I-80)**: 30-60 min delays typical, metered entry
- **San Mateo Bridge (SR-92)**: Connects East Bay to Peninsula
- **Dumbarton Bridge (SR-84)**: South Bay to East Bay
- **Golden Gate Bridge (US-101)**: Connects SF to Marin
- **I-680 corridor** (East Bay): Chronic congestion
- **US-101 Peninsula corridor**: Mountain View to SF, severe tech traffic
- **Expect 6-8 distinct markets within Bay Area**

**Inland Empire:**
- **I-10/I-15 interchange**: Extreme truck congestion
- **SR-60** (Pomona Freeway): Chronic delays
- **I-215** through Riverside/San Bernardino: Bottleneck
- **Expect 3-4 distinct markets within Inland Empire**

**Sacramento:**
- **I-80 / US-50 interchange**: Moderate congestion
- **I-5 corridor**: Connects to Bay Area but doesn't integrate

**San Diego:**
- **I-5 corridor** (entire county): Chronic congestion
- **I-15 corridor**: Inland route, severe delays
- **I-805**: Parallel to I-5, also congested
- **Expect 2-3 markets within San Diego County**

**Central Valley:**
- **SR-99**: Spine of valley, connects separate markets
- Low congestion but LONG distances between cities

### Limited Transit Effectiveness

**BART (Bay Area):**
- Serves SF, East Bay, parts of Peninsula
- Does NOT extend to South Bay (San Jose has separate VTA)
- May provide SOME friction reduction within BART-served areas
- Does NOT collapse entire Bay Area

**Caltrain (Peninsula):**
- Commuter rail SF to San Jose
- Primarily work trips, poor medical facility access
- Does NOT collapse SF and San Jose markets

**LA Metro:**
- Limited coverage, does NOT extend to major suburban hospital clusters
- Does NOT collapse LA suburban markets
- Primarily serves downtown and limited corridors

**LOSSAN/Pacific Surfliner:**
- Amtrak corridor San Diego to LA to Santa Barbara
- Does NOT collapse coastal markets (too slow, limited stations)

**All other areas:** Zero meaningful transit for healthcare purposes

### Terrain Barriers (Critical)

**Mountain Ranges:**
- **Sierra Nevada**: Absolute barrier between California and Nevada/east
- **Coast Ranges**: Create barriers along entire coast
- **Transverse Ranges**: Separate LA Basin from Central Valley
- **Peninsular Ranges**: Run through San Diego County
- **Cascade Range**: Northern California isolation

**Specific Mountain Barriers:**
- **Tehachapi Mountains**: Separate Central Valley from LA Basin
- **San Gabriel Mountains**: Separate LA from High Desert
- **Santa Monica Mountains**: Create east-west friction in LA
- **Santa Cruz Mountains**: Separate SF Peninsula from coast
- **Mt. Diablo**: East Bay barrier

**Passes and Closures:**
- **Grapevine (I-5)**: Tehachapi Pass, winter closures, truck crawl
- **Cajon Pass (I-15)**: Inland Empire to High Desert, steep grades
- **Donner Pass (I-80)**: Sierra crossing, winter closures
- **Highway 17**: Santa Cruz Mountains, dangerous, limits SF-Santa Cruz integration

### Coastal vs Inland Friction
- **Coastal fog and terrain**: Limits east-west travel
- **Desert heat**: Eastern California (Imperial Valley, High Desert)
- **Elevation changes**: 5,000+ ft passes common

### Earthquake and Wildfire Disruption
- Infrastructure vulnerable, creates access concerns
- Highway closures during emergencies
- Does not change market definitions but affects resilience

---

## Known Polycentric and Split Metros

### Los Angeles Basin — Must Split Into 8-12 Markets

The LA Basin (13M+ people) is the most sprawling metro in the US. Expected splits:

**Required Markets (Minimum 8-12):**
1. **Downtown LA / Central LA** — USC, LAC+USC, California Hospital (central core)
2. **Westside LA** — UCLA Health, Cedars-Sinai, Providence (West LA, Santa Monica, Beverly Hills)
3. **San Fernando Valley** — Providence, Kaiser (separate from central LA by Santa Monica Mountains)
4. **South LA / Long Beach** — MemorialCare, Dignity Health (Harbor area, Long Beach)
5. **East LA / Whittier / Downey** — PIH Health, Kaiser (separate from downtown by distance)
6. **Pasadena / San Gabriel Valley** — Huntington Hospital, City of Hope (separate from downtown by distance)
7. **South Bay** — Torrance Memorial, Providence (Beach Cities, separate from Long Beach)
8. **Orange County North** — UCI Health, St. Joseph (Anaheim, Santa Ana, separate from LA County)
9. **Orange County South** — Hoag, Mission Hospital (Newport Beach, Irvine, Laguna)
10. **Ventura County** — Community Memorial, Los Robles (separate from LA by mountains)
11. **Antelope Valley** — Antelope Valley Hospital (Lancaster/Palmdale, High Desert, separate by mountains)
12. **Santa Clarita Valley** — Henry Mayo Newhall (separate from San Fernando Valley despite proximity)

**Reasoning:**
- I-405 creates 60-90+ min crossing times
- Santa Monica Mountains separate Valley from Westside
- LA County is 4,000+ square miles
- Each subregion has built independent anchors because residents won't drive across metro

### San Francisco Bay Area — Must Split Into 6-8 Markets

The Bay Area (7.8M people) has water and mountain barriers. Expected splits:

**Required Markets (Minimum 6-8):**
1. **San Francisco Core** — UCSF, Sutter Health, Chinese Hospital (SF proper)
2. **East Bay North** — Alta Bates Summit, Highland Hospital (Berkeley, Oakland, Alameda)
3. **East Bay South** — Stanford Health Care ValleyCare (Pleasanton, Livermore, Dublin)
4. **Peninsula / San Mateo County** — Stanford Health, Mills-Peninsula (Palo Alto, Redwood City, San Mateo)
5. **South Bay / Santa Clara County** — Stanford Health, Kaiser, El Camino (San Jose, Sunnyvale, Mountain View)
6. **North Bay / Marin** — MarinHealth, Sutter (separate from SF by Golden Gate)
7. **North Bay / Sonoma** — Providence, Sutter (Santa Rosa area, separate from SF and Marin)
8. **East Bay / Contra Costa inland** — John Muir Health (Walnut Creek, Concord, separate from Oakland)

**Reasoning:**
- Bay bridges create 30-60 min friction
- BART doesn't extend to all areas (no South Bay coverage)
- Santa Cruz Mountains separate Peninsula from coast
- Each county/subregion has distinct anchors

### Inland Empire — Must Split Into 3-4 Markets

The Inland Empire (4.6M people) is separate from LA despite proximity. Expected splits:

**Required Markets (3-4):**
1. **San Bernardino County** — Loma Linda University Health, Arrowhead Regional (San Bernardino, Loma Linda)
2. **Riverside County West** — Riverside Community Hospital, Kaiser (Riverside, Corona)
3. **Coachella Valley** — Eisenhower Health, Desert Regional (Palm Springs, Rancho Mirage, desert resort area)
4. **Temecula / Southwest Riverside** — Temecula Valley Hospital (separate from both Riverside and San Diego)

**Reasoning:**
- 60+ miles from LA with mountain barriers
- I-10/I-15 interchange creates massive friction
- Desert climate and geography separate from LA Basin
- Coachella Valley isolated by mountains from rest of Inland Empire

### San Diego County — Split Into 2-3 Markets

**Required Markets (2-3):**
1. **San Diego Core** — UC San Diego Health, Scripps, Sharp (downtown, La Jolla, coastal)
2. **North County Coastal** — Scripps, Tri-City (Carlsbad, Oceanside, Encinitas)
3. **East County / Inland** — Sharp Grossmont, Alvarado (El Cajon, La Mesa, separate from coast)

**Reasoning:**
- I-5 and I-15 corridors create distinct north-south markets
- Coastal vs inland divide

### Sacramento Metro — Likely 1-2 Markets

**Expected Markets (1-2):**
- **Sacramento Core** — UC Davis Health, Sutter, Dignity Health (city and immediate suburbs)
- **Possible split:** Placer County (Roseville, Rocklin) separate from core

### Central Valley — Multiple Independent Markets

**Separate markets (each 60-100+ miles apart):**
- **Bakersfield** (Kern County)
- **Fresno** (Fresno County)
- **Visalia** (Tulare County)
- **Modesto** (Stanislaus County)
- **Stockton** (San Joaquin County)
- **Merced**
- **Chico** (Northern Valley)
- **Redding** (Far Northern California)

**Do NOT consolidate** — SR-99 connects them but they're 60-100+ miles apart.

---

## Major Anchor Systems to Consider

### Academic Medical Centers
- **UCLA Health** (Los Angeles, Westside)
- **USC Keck Medicine** (Los Angeles, Downtown)
- **UC San Diego Health** (San Diego, La Jolla)
- **UC Irvine Health** (Orange County)
- **UCSF Health** (San Francisco)
- **Stanford Health Care** (Peninsula, Palo Alto)
- **UC Davis Health** (Sacramento)
- **Loma Linda University Health** (Inland Empire)

### Major Health Systems
- **Kaiser Permanente** — Statewide, particularly strong in Northern California and LA
- **Sutter Health** — Northern California dominance
- **Providence** — Statewide presence
- **Dignity Health** — Statewide, particularly Central Valley
- **Cedars-Sinai** — LA Westside anchor
- **MemorialCare** — Long Beach, South Bay
- **Scripps Health** — San Diego dominance
- **Sharp HealthCare** — San Diego
- **Hoag Memorial** — Orange County coastal
- **City of Hope** — San Gabriel Valley (cancer center)

---

## Rural and Frontier Markets

### Northern California
- **Redding** — Shasta region, gateway to Oregon
- **Chico** — Northern Sacramento Valley
- **Eureka** — Far North Coast, isolated by terrain

### Central Coast
- **Santa Cruz** — Separate from Bay Area by Highway 17 mountains
- **Monterey / Salinas** — Monterey Bay area
- **San Luis Obispo** — Central Coast hub
- **Santa Barbara** — South Coast, separate from LA and SLO
- **Santa Maria** — Between SLO and Santa Barbara

### Eastern California
- **South Lake Tahoe** — Sierra resort area
- **Mammoth Lakes** — Eastern Sierra (if serves civilian population)

### High Desert
- **Victorville / Hesperia** — High Desert north of San Bernardino
- May integrate with Antelope Valley or be separate

### Imperial Valley
- **El Centro** — Far southeast, Arizona border, isolated by desert

---

## State Border Effects

**California ↔ Nevada:**
- Hard split except possibly Lake Tahoe area (resort integration)
- Reno serves northern Sierra, not California

**California ↔ Arizona:**
- Hard split
- Imperial Valley (El Centro CA) separate from Yuma AZ despite proximity

**California ↔ Oregon:**
- Hard split
- Redding CA separate from Medford OR

**California ↔ Mexico:**
- San Diego border, but healthcare flows are primarily US-side
- Do NOT design markets based on cross-border medical tourism

---

## Output Requirements

Produce **only the CSV content** for this region, following national format:

```
market_id,market_name,anchor_city,anchor_systems,primary_states,market_type,notes
[rows in alphabetical order by market_id]
```

**Sort alphabetically by market_id before output.**

**Expected row count: 40-55 markets** for California.

---

## Self-Validation for This Region

Before finalizing, confirm:

1. ✅ LA Basin has been split into at least 8 distinct markets
2. ✅ Orange County is separate from LA County (not integrated despite proximity)
3. ✅ San Fernando Valley is separate from Westside LA (Santa Monica Mountains barrier)
4. ✅ Bay Area has been split into at least 6 markets
5. ✅ San Francisco is separate from San Jose (not integrated despite Caltrain)
6. ✅ East Bay is separate from Peninsula (bay bridge friction)
7. ✅ Inland Empire is separate from LA Basin (60+ miles, mountain barriers)
8. ✅ San Diego has at least 2 markets (coastal vs inland or north vs south)
9. ✅ Central Valley cities are NOT consolidated (each is separate market)
10. ✅ Transit does NOT collapse markets (BART provides some friction reduction but doesn't integrate entire Bay Area)
11. ✅ market_id follows national naming convention (CA-CITY-QUALIFIER)

---

## Critical Notes for This Region

### LA Basin Is Not One Market
The LA Basin is often treated as "Los Angeles metro" but contains:
- 5+ counties (LA, Orange, Ventura, parts of San Bernardino, Riverside)
- 13M+ people across 4,000+ square miles
- I-405 creates 60-90+ min crossing times
- Santa Monica Mountains create hard barrier
- **Expect 10-12 markets minimum**

### Orange County Is NOT LA
Despite being in the LA CSA:
- Orange County has distinct healthcare identity
- Separate dominant systems (UCI Health, Hoag, St. Joseph)
- I-5 and I-405 congestion creates 60+ min travel to LA County
- **Treat as 2 separate markets** (North OC vs South OC)

### Bay Area Geography Matters
- BART serves SF ↔ East Bay but NOT South Bay
- Bay bridges create 30-60 min friction
- Santa Cruz Mountains separate Peninsula from coast
- Each subregion has built independent anchors
- **Expect 6-8 markets**

### Inland Empire Is Separate from LA
- 60+ miles from LA with Cajon Pass and mountain barriers
- Different climate (desert heat vs coastal)
- Completely distinct healthcare systems
- **Do NOT integrate with LA markets**

### Central Valley Cities Are Independent
SR-99 runs the length of valley connecting:
- Redding → Chico → Sacramento → Stockton → Modesto → Fresno → Visalia → Bakersfield

But these are 60-100+ miles apart and operate as completely independent markets.

### Kaiser Permanence Does Not Equal Integration
Kaiser operates throughout California but:
- Kaiser presence does NOT integrate markets
- Residents still follow 45-minute rule for routine care
- Each Kaiser medical center serves its local market

### BART and Caltrain Do Not Collapse Markets
- BART may provide SOME friction reduction within its coverage area
- But it doesn't extend to South Bay, North Bay, Peninsula fully
- Caltrain is commuter-focused, not medical travel
- Do NOT automatically integrate Bay Area based on transit

---

## Final Instruction

Apply the 45-minute rule rigorously. California has the worst congestion in the nation AND terrain barriers. Err heavily on the side of splitting large metros (LA, Bay Area, Inland Empire). This is the most populous state and requires the highest granularity.
