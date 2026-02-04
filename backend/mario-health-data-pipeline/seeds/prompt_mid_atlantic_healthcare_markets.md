# Regional Prompt: Mid-Atlantic US Healthcare Shopping Zones

## Instructions

**Read `prompt_master_market.md` first.** This prompt adds regional specificity but does not override national rules.

---

## Geographic Scope

**States:** MD, DC, DE, VA, WV

**Expected Output:** Approximately 25-35 Healthcare Shopping Zones for this region.

---

## Region-Specific Mobility Factors

### Major Congestion Corridors
- **I-95 corridor** (Baltimore to Richmond): Chronic congestion through Baltimore beltway (I-695) and DC beltway (I-495/I-95)
- **I-495/Capital Beltway** (DC): Extreme congestion, 60+ min to cross during typical daytime
- **I-66** (DC to Front Royal VA): HOV restrictions, toll lanes, chronic delays
- **US-50** (Bay Bridge): Major bottleneck to Eastern Shore MD, 30-60 min queues typical on summer weekends
- **I-81 corridor** (VA/WV): Truck-heavy spine through Appalachian valleys
- **I-64** (Richmond to Hampton Roads): Connector between two distinct markets

### Bridge and River Crossing Bottlenecks
These create hard friction boundaries—expect significant delays during typical daytime hours:

**Potomac River Crossings:**
- Woodrow Wilson Bridge (I-495/I-95, MD ↔ VA): Major bottleneck, 20-40 min delays typical
- American Legion Bridge (I-495, MD ↔ VA): Heavy congestion
- Key Bridge, Chain Bridge, Memorial Bridge (DC core crossings): Limited capacity
- Limited crossings upstream create isolation for western MD and WV panhandle

**Chesapeake Bay Crossings:**
- **Bay Bridge (US-50)**: Only crossing to Eastern Shore MD, creates hard split
- **Chesapeake Bay Bridge-Tunnel** (Hampton Roads to Eastern Shore VA): Toll + distance creates market split

**Other Critical Crossings:**
- James River bridges (Richmond area): Multiple bridges reduce friction
- Hampton Roads tunnels (I-64, I-664): Major bottlenecks between Peninsula and Southside

### Strong Transit Systems
These systems can reduce friction **when they directly serve medical districts:**

**WMATA Metro (DC/MD/VA):**
- Red Line: Serves DC medical district (GWU, Children's National) and suburban MD/VA
- Orange/Blue/Silver Lines: Connect Arlington, Alexandria to DC core hospitals
- Green/Yellow Lines: Limited direct hospital access
- **Medical District stops:** Medical Center (Bethesda), Pentagon City, L'Enfant Plaza
- **Critical limitation:** Metro does NOT extend to Baltimore, Richmond, or outer suburbs beyond Fairfax/Gaithersburg
- **Reality check:** Metro collapses markets ONLY within Metro-accessible zone (DC, inner Montgomery County MD, Arlington/Alexandria VA)

**MARC/VRE Commuter Rail:**
- Primarily peak-direction commuter service to DC
- Does NOT collapse healthcare markets (limited reverse direction, poor medical access)
- VRE to DC requires subway transfer to reach most hospitals

**Baltimore Light Rail / Metro:**
- Limited coverage, does NOT materially reduce friction for healthcare access

### Ferry Systems
No material ferry systems in this region.

### Terrain and Weather
- **Appalachian Mountains:** Create hard east-west barriers through WV, western MD, western VA
- **Blue Ridge Mountains:** Separate Shenandoah Valley from Northern VA/DC
- **Eastern Shore:** Bay Bridge creates hard split from mainland MD
- **Winter weather:** WV, western MD, western VA have significant snow/ice barriers 4-5 months annually
- **I-68 corridor** (MD/WV): Limited east-west route through mountains

---

## Known Polycentric and Split Metros

### DC-Baltimore-NoVA CSA — Must Split Into Multiple Markets

The Washington-Baltimore CSA (10M people) is too large to be a single healthcare market. Expected splits:

**Required Markets (Minimum 5-7):**
1. **DC Core** — GWU Hospital, MedStar Georgetown, Howard University Hospital, Children's National
2. **Inner Maryland (Montgomery/PG Counties)** — Suburban Hospital, Holy Cross, University of Maryland Medical Center (may integrate with DC via Metro or be separate)
3. **Baltimore Core** — Johns Hopkins, University of Maryland Medical Center, MedStar Harbor Hospital
4. **Northern Virginia Core** — Inova Fairfax, Virginia Hospital Center (Arlington)
5. **Outer Maryland** — Frederick, Hagerstown (separate from both DC and Baltimore)
6. **Outer Virginia** — Loudoun, Prince William counties (separate from DC core despite growth)
7. **Southern Maryland** — Charles County, Calvert County (limited Potomac crossings)

**Reasoning:**
- WMATA Metro does collapse DC, Arlington/Alexandria, inner Montgomery County MD (Bethesda)
- However, Baltimore is 45+ min from DC with NO transit connection
- I-495 beltway crossing can be 60+ min, creating friction even within metro
- Potomac River crossings create north-south friction despite WMATA bridges
- Outer suburbs (Loudoun VA, Frederick MD) are 60+ min from core hospitals

**Critical Decision: DC Integration**
- **IF** Claude judges WMATA materially reduces friction: Combine DC + Arlington/Alexandria + Bethesda into single "DC Metro Core" market
- **IF** Potomac crossing friction dominates: Split into "DC Core" (DC proper) vs "Arlington/Alexandria" vs "Montgomery County MD"
- Err toward MORE splits given beltway congestion

### Richmond — Independent Market

- **Not part of DC market** (60+ min via I-95 congestion, no transit)
- Anchor: VCU Health System, Bon Secours
- Separate from Hampton Roads (60+ min via I-64)

### Hampton Roads / Tidewater — Complex Polycentric Market

**Geography:** Norfolk, Virginia Beach, Chesapeake, Newport News, Hampton
**Challenge:** Multiple cities separated by water with tunnel bottlenecks

**Expected Markets (2-3):**
1. **Southside** — Norfolk, Virginia Beach, Chesapeake (Sentara dominance)
2. **Peninsula** — Newport News, Hampton (Riverside Health, Sentara)
3. **Possible split:** Eastern Shore VA if Bay Bridge-Tunnel friction dominates

**Reasoning:**
- Hampton Roads tunnels (I-64, I-664) create 30-60 min delays
- However, region is smaller (1.8M people) and systems operate regionally
- May justify single market if tunnels don't exceed 45-minute rule for routine care

### Baltimore Region — Semi-Independent Hub

- **Not part of DC market** despite CSA classification
- Anchor: Johns Hopkins, University of Maryland Medical Center
- Separate from DC (45+ min, no transit, independent referral patterns)
- **Possible split:** Baltimore City vs Baltimore County suburbs (Towson, etc.)

---

## Major Anchor Systems to Consider

### DC/Maryland Region
- Johns Hopkins Medicine (Baltimore)
- University of Maryland Medical System (Baltimore, suburban MD)
- MedStar Health (DC, Baltimore, MD suburbs)
- Inova Health System (Northern VA)
- Adventist HealthCare (Montgomery County MD)
- Virginia Hospital Center (Arlington VA)
- George Washington University Hospital (DC)
- Children's National Hospital (DC)

### Virginia
- VCU Health System (Richmond)
- Bon Secours (Richmond)
- Sentara Healthcare (Hampton Roads, Norfolk)
- Riverside Health System (Newport News)
- Carilion Clinic (Roanoke, southwestern VA)
- UVA Health (Charlottesville)

### West Virginia
- West Virginia University Hospitals (Morgantown)
- Charleston Area Medical Center (Charleston)
- Cabell Huntington Hospital (Huntington)

### Delaware
- ChristianaCare (Wilmington, Newark)
- Bayhealth (Dover, central DE)
- Beebe Healthcare (Rehoboth Beach, southern DE)

---

## Rural and Frontier Markets

### West Virginia
- **Morgantown** — WVU Medicine dominance, serves northern WV
- **Charleston** — CAMC dominance, serves capital region
- **Huntington** — Ohio River valley, may integrate with Ohio/Kentucky border
- **Beckley** — Southern WV regional hub
- **Martinsburg** — Eastern Panhandle, closer to Hagerstown MD and Winchester VA than WV core
- **Parkersburg** — Ohio River valley, isolated from Charleston

### Western Virginia
- **Roanoke** — Carilion Clinic dominance, serves southwestern VA and southern WV
- **Charlottesville** — UVA Health, serves central VA
- **Lynchburg** — Between Roanoke and Charlottesville
- **Winchester** — Northern Shenandoah Valley, closer to Hagerstown MD than DC

### Western Maryland
- **Hagerstown** — Western MD hub, separate from both Baltimore and DC
- **Cumberland** — I-68 corridor, serves western MD and WV panhandle
- **Frederick** — Between Baltimore and Hagerstown, may be separate or integrate with DC

### Eastern Shore Maryland
- **Salisbury** — University of Maryland Shore Regional Health, serves Delmarva Peninsula
- **Easton** — Upper Eastern Shore, Bay Bridge friction from Baltimore/DC

### Southern Maryland
- **Waldorf** — Charles County, limited Potomac crossings to NoVA
- May integrate with DC or be separate depending on bridge friction

### Eastern Shore Virginia
- **Pocomoke / Accomack** — Isolated by Bay Bridge-Tunnel, may integrate with Salisbury MD

---

## State Border Effects

**Maryland ↔ Virginia:**
- Potomac River creates hard split despite multiple bridges
- Medicaid differences reinforce split
- WMATA does cross border but only in core DC area (Metro-accessible zone)

**Maryland ↔ Delaware:**
- I-95 corridor integrates Northern DE (Wilmington) with Philadelphia, NOT Baltimore
- Eastern Shore DE may integrate with Salisbury MD

**Virginia ↔ West Virginia:**
- Appalachian terrain creates hard split
- Limited crossings except I-81 corridor

**Virginia ↔ North Carolina:**
- Hampton Roads may have some integration with NC Outer Banks
- Otherwise, border is a hard split

**West Virginia ↔ All Neighbors:**
- Terrain barriers dominate
- WV markets are isolated from surrounding states except border towns

---

## Output Requirements

Produce **only the CSV content** for this region, following national format:

```
market_id,market_name,anchor_city,anchor_systems,primary_states,market_type,notes
[rows in alphabetical order by market_id]
```

**Sort alphabetically by market_id before output.**

**Expected row count: 25-35 markets** for this 5-state region.

---

## Self-Validation for This Region

Before finalizing, confirm:

1. ✅ DC-Baltimore CSA has been split into at least 5 distinct markets
2. ✅ Baltimore is independent from DC (not integrated despite CSA classification)
3. ✅ Richmond is independent from both DC and Hampton Roads
4. ✅ Hampton Roads tunnel friction has been considered
5. ✅ WMATA Metro integration is limited to Metro-accessible core (not entire DC metro)
6. ✅ WV markets are properly isolated by Appalachian terrain
7. ✅ Eastern Shore MD is separate from Baltimore/DC due to Bay Bridge bottleneck
8. ✅ State borders are respected unless WMATA or other strong integration exists
9. ✅ market_id follows national naming convention (STATE-CITY-QUALIFIER)

---

## Critical Notes for This Region

### WMATA Integration Reality Check
WMATA Metro is the most extensive transit system in the region, but:
- It does NOT extend to Baltimore (45+ min, no transit)
- It does NOT extend to Richmond (60+ min, no transit)
- It does NOT extend to outer suburbs (Loudoun VA, Frederick MD, Charles County MD)
- It DOES meaningfully connect: DC ↔ Arlington/Alexandria ↔ Bethesda/Silver Spring

**Recommendation:** Create a "DC Metro Core" market that includes Metro-accessible areas ONLY if confident residents use Metro for medical appointments. Otherwise, split further.

### Baltimore Independence
Baltimore is in the same CSA as DC but operates as a completely independent healthcare market:
- 45+ min from DC with I-95 congestion
- No transit connection
- Johns Hopkins and University of Maryland are regional anchors, not DC satellites
- Different Medicaid programs (MD vs DC)

### Hampton Roads Complexity
This is a polycentric metro with water barriers. Key decision:
- **Tunnel friction test:** Can a Norfolk resident reach Peninsula hospitals in <45 min door-to-door during typical traffic?
- If YES → Single Hampton Roads market
- If NO → Split into Southside vs Peninsula

### West Virginia Isolation
Appalachian terrain creates profound isolation:
- Morgantown is closer to Pittsburgh than Charleston
- Martinsburg is closer to Hagerstown MD than Morgantown
- Charleston to Huntington is 50+ min despite being in same state
- Do NOT assume WV markets integrate with each other

---

## Final Instruction

Apply the 45-minute rule rigorously. The Mid-Atlantic has extreme congestion (DC beltway, I-95) and terrain barriers (Appalachia, Chesapeake Bay). Err on the side of splitting markets.