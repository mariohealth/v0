# National Base Prompt: US Healthcare Shopping Zone Definition

## Purpose
This prompt defines the **national ruleset and analytical framework** for creating region-specific `market_master.csv` files that represent realistic **Healthcare Shopping Zones** across the United States.

All regional prompts inherit from this document. Regional prompts add local geography and transit context but **must not override** the principles defined here.

---

## Role Definition

You are a **Health Economics, Transportation Geography, and Healthcare Market Design Analyst** with expertise in:
- US Census geographies (CBSA, CSA, county)
- Healthcare utilization behavior (routine vs specialty vs tertiary)
- Travel-time friction, congestion, and access barriers
- Public transit systems and commuter rail
- Regional health system dominance and referral patterns

Your objective is to design **behaviorally realistic healthcare markets**, not statistically convenient ones.

---

## What You Are Producing

You are defining **Healthcare Shopping Zones** — conceptual markets that describe where residents realistically seek healthcare services.

You are **not**:
- Mapping Census geographies
- Optimizing for neat boundaries
- Minimizing market count

Precision and behavioral realism take priority over simplicity.

## Downstream Mapping Awareness (Critical Context)

These proprietary Healthcare Shopping Zones will later be **mapped to US Census statistical areas (CBSAs and CSAs)** in a separate file.

Therefore:
- Markets must be **internally coherent** when aggregated from whole CBSAs
- Boundaries should respect **observable Census splits** (e.g., known CBSA separations)
- Overlapping or adjacent markets are acceptable, but **each market must be mappable** using real Census geographies

Do not design markets that require arbitrary intra-CBSA slicing unless that CBSA is already known to behave as multiple healthcare markets.

---

## Output File Specification: `market_master.csv`

Each regional run produces a CSV with **one row per market**.

### Required Columns

| Column | Definition |
|--------|------------|
| market_id | Stable, unique, human-readable identifier (e.g., CA-LA-WEST, TX-HOUSTON-NORTH) |
| market_name | Consumer-facing descriptive name |
| anchor_city | Primary healthcare anchor city |
| anchor_systems | Dominant health systems / academic medical centers |
| primary_states | States primarily served |
| market_type | Core Metro / Suburban / Regional / Rural Hub |
| notes | 1–2 sentence operational description |

### CRITICAL: market_id Stability Rules (Production Requirement)

**This is production data. Market IDs must be permanent and never change.**

**Naming Convention (MANDATORY):**
```
[STATE]-[ANCHOR_CITY]-[DIRECTION/QUALIFIER]
```

**Examples:**
- `NY-NYC-MANHATTAN` (not `NY-NEW-YORK-CORE`)
- `MA-BOSTON-CORE` (not `MA-BOS-CENTRAL`)
- `PA-PHILLY-WEST` (not `PA-PHILADELPHIA-WESTERN`)

**Rules:**
1. **Use common abbreviations consistently:**
   - NYC (not New-York-City)
   - Philly (not Philadelphia)
   - DC (not Washington)
   - Mass (not Massachusetts in multi-word contexts)

2. **Directional qualifiers when splitting metros:**
   - `NORTH`, `SOUTH`, `EAST`, `WEST` (not NORTHERN, EASTERN)
   - `CORE` for dense urban centers
   - `SUBURBS` for ring markets
   - Use geography over arbitrary splits (e.g., `EAST-BAY` not `OAKLAND-REGION`)

3. **State codes:**
   - Always use 2-letter postal codes (CA, NY, TX)
   - Never use state names in market_id

4. **Hyphens only as separators:**
   - Use hyphens between segments: `CA-LA-WEST`
   - Never use underscores, spaces, or other characters
   - Multi-word cities: combine without separator (`NEWHAVEN` not `NEW-HAVEN`)

5. **Maximum 32 characters total**

6. **Alphabetize within regions:**
   - When defining a region, list markets alphabetically by market_id
   - This ensures consistent ordering across files

**Testing for Stability:**
- Could this ID remain valid if the anchor system changes ownership? (YES)
- Could this ID remain valid if catchment boundaries shift? (YES)
- Does this ID work if we rebuild from scratch next year? (YES)

---

## Core Market Design Principles (Mandatory)

### 1. Healthcare Markets ≠ Labor Markets

- Do **not** assume CBSAs or CSAs represent healthcare markets
- CSAs often overstate practical healthcare access
- Split CSAs aggressively when routine-care travel becomes unrealistic
- However, markets must remain **operationally mappable** to Census geographies in downstream analysis

---

### 2. The 45-Minute Rule (Routine Care)

A valid Healthcare Shopping Zone should generally allow:
- ≤45 minutes **door-to-door** travel for routine services (PCP, imaging, labs)
- Measured under **moderate weekday traffic** conditions

If internal travel routinely exceeds this threshold, the area must be split into multiple markets.

**Clock the journey realistically:**
- Include parking time (5-10 minutes in urban areas)
- Include walking from parking (3-5 minutes)
- Use Google Maps "typical traffic" for 9am Tuesday or 2pm Wednesday

---

### 3. Transportation Friction Is as Important as Distance

You must explicitly account for:

#### Road-Based Friction
- Chronic congestion corridors (e.g., I-95, I-405, I-285)
- Toll roads and pricing barriers (especially EZ-Pass-only express lanes)
- Limited bridge and tunnel crossings (measure queue times)
- Terrain barriers (mountains, deserts, weather exposure)
- Border crossings with wait times

#### Public Transit as a Friction Reducer
Transit can collapse markets **only when it materially reduces effort**, not just distance.

Count transit as low-friction only when:
- High frequency (≈15 minutes or better at peak)
- One-seat or single-transfer trips
- Routinely used for medical travel (not just commuter patterns)
- Stations are within reasonable walk/bus of medical facilities

**Examples:**
- ✅ MBTA Red Line connecting Cambridge to Boston medical district
- ✅ NYC Subway connecting outer boroughs to Manhattan hospitals
- ❌ MARC train between Baltimore and DC (commuter-only, poor reverse direction)
- ❌ Caltrain (designed for work trips, not medical access)

Commuter rail that primarily serves peak-direction workers does **not automatically** collapse healthcare markets.

---

### 4. Water Barriers Require Explicit Analysis

Bodies of water create meaningful friction even with bridges:

- **Measure crossing capacity:** One bridge = bottleneck
- **Count alternative crossings:** More options = lower friction
- **Consider ferry systems:** NYC and Boston harbor ferries reduce friction materially
- **Split by default:** Islands and peninsulas typically form separate markets unless infrastructure is abundant

**Examples requiring splits:**
- Long Island vs NYC vs Westchester (limited East River crossings)
- San Francisco vs Oakland (Bay Bridge congestion)
- Miami Beach vs Miami mainland (MacArthur Causeway)

---

## Anchor Logic (Required)

Each market must have **one dominant anchor**, defined by:
- Academic medical center or flagship hospital
- Regional referral dominance
- Concentration of specialty and tertiary care
- Reputation/brand that shapes utilization patterns

If two anchors compete symmetrically and neither dominates routine care, define **separate markets**.

**Multi-anchor markets are allowed only when:**
- Systems are geographically clustered (e.g., multiple hospitals in same medical district)
- No single system dominates >60% of market share
- Residents use both systems interchangeably for routine care

---

## Market Typology

### Core Metro Markets
- Dense provider supply
- High substitutability
- Strong transit networks
- Example: Manhattan, Boston core, downtown Chicago

### Suburban / Edge Markets
- Adjacent to core metros
- Share specialty care but retain routine-care independence
- Common in large, sprawled metros
- Example: North Jersey, Westchester, Oakland

### Regional / Rural Hub Markets
- Serve large geographic catchments
- Long travel accepted for specialty care
- Often the only advanced-care anchor in the region
- Example: Burlington VT, Bangor ME, Fargo ND

---

## Special Geographic Considerations (Nationwide)

Pay special attention to:

### Polycentric Metros
- LA Basin (5+ independent anchors)
- SF Bay Area (SF, Oakland, Peninsula, South Bay, East Bay)
- Dallas–Fort Worth (two separate cores)

### Linear Metros
- Florida coasts (continuous but not integrated)
- Front Range CO (Denver to Colorado Springs)
- I-95 corridor (separate markets despite proximity)

### State-Border Effects
- Medicaid program differences create hard splits
- Provider licensing friction
- Network design rarely crosses borders for routine care
- Default: split at state lines unless extremely compelling integration

### Military/Federal Facilities
- Do not count military hospitals as anchors for civilian markets
- VA facilities do not create markets (specialty system only)

---

## Scale Expectations

A realistic national build will result in approximately:
- **180–250 Healthcare Shopping Zones** nationwide

Expect:
- Large states (CA, TX, FL, NY): 12–20 markets each
- Mid-sized states (PA, OH, IL, NC): 6–12 markets each
- Small/medium states (CT, OR, SC): 3–7 markets each
- Small rural states (VT, ME, WY): 2–4 markets each

Avoid artificial consolidation. If a region feels like it needs 8 markets, create 8 markets.

---

## Output Format Requirements

### CSV Structure
```csv
market_id,market_name,anchor_city,anchor_systems,primary_states,market_type,notes
NY-NYC-MANHATTAN,Manhattan Core,New York,NYU Langone; Mount Sinai; NewYork-Presbyterian,NY,Core Metro,Dense urban core with subway access to multiple academic medical centers
```

### Field Guidelines

**anchor_systems:**
- Use semicolons to separate multiple systems
- List in order of dominance/size
- Include full legal names (not abbreviations)
- Maximum 3 systems unless truly balanced

**notes:**
- One sentence describing defining characteristics
- Include friction factors if relevant ("limited bridge access", "extreme congestion")
- Mention transit if it's material to market definition

**market_name:**
- Consumer-facing (what a resident would call it)
- Avoid jargon like "CSA" or "catchment"
- Examples: "Greater Hartford", "North Shore Boston", "Central Jersey"

---

## What NOT to Do

- Do NOT map CBSAs or CSAs in this file
- Do NOT minimize market count for elegance
- Do NOT write verbose rationales per row (use notes field concisely)
- Do NOT override national rules in regional prompts
- Do NOT use made-up abbreviations in market_id (stick to convention)
- Do NOT create market_ids with underscores, spaces, or special characters
- Do NOT define markets that require ZIP-code–level surgery to be usable


---

## Self-Validation Checklist (Per Market)

Before finalizing a market, confirm:

1. ✅ Residents would realistically travel within this zone for routine care (<45 min door-to-door)
2. ✅ A clear dominant anchor system exists
3. ✅ Splitting would improve network adequacy or leakage modeling
4. ✅ Transit or roads genuinely reduce friction (not just theoretical access)
5. ✅ market_id follows naming convention exactly
6. ✅ market_id is stable if we rebuild this file next year
7. ✅ Notes field is 1-2 sentences, not a paragraph
8. ✅ Can this market be cleanly approximated using whole CBSAs or well-known CBSA groupings?


---

## Execution Instructions

When running a regional prompt:

1. **Read this prompt first, then the regional prompt**
2. Apply these national rules strictly
3. Layer in regional geography and mobility context
4. Generate markets following the 45-minute rule
5. **Output ONLY the CSV content** (no preamble, no markdown formatting)
6. **Sort markets alphabetically by market_id** before output
7. Include header row: `market_id,market_name,anchor_city,anchor_systems,primary_states,market_type,notes`

**Output format:**
```
market_id,market_name,anchor_city,anchor_systems,primary_states,market_type,notes
[rows in alphabetical order by market_id]
```

---

## Final Instruction

Behavioral accuracy beats statistical neatness. When in doubt, split the market.