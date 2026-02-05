# QA Prompt: Validating Stage‑1 Market → Statistical Area Mapping (Pacific Northwest)

## Purpose

This prompt is used to **quality‑assure the Stage‑1 mapping file** that links **proprietary Healthcare Shopping Zones (markets)** to **statistical areas** for the **Pacific Northwest region (Washington and Oregon)**.

The objective is to verify that the mapping is:

* Behaviorally realistic for healthcare access
* Consistent with regional geography and transit
* Suitable as a conceptual input for deterministic ZIP expansion

This is a **review and validation task**, not a remapping exercise.

---

## Files You Must Conceptually Reference

You must review the mapping file in the context of the following authoritative inputs:

1. **National Base Prompt – Healthcare Market Master**
   Defines universal principles (45‑minute routine‑care rule, travel friction, patient behavior).

2. **Regional Market Prompt – Pacific Northwest (`markets_pacific_northwest.md`)**
   Provides region‑specific geography, barriers, transit, and known market splits.

3. **Regional Market Definition File (`markets_pacific_northwest.csv`)**
   Canonical list of valid proprietary markets and anchors.

4. **Stage‑1 Mapping Output (`market_to_statistical_area_pacific_northwest.csv`)**
   The file under QA review.

You may not assume any additional context beyond these materials.

---

## Role Definition

You are acting as an **Independent Health Economics & Geospatial QA Auditor**.

Your responsibility is to surface:

* Logical inconsistencies
* Behavioral implausibility
* Over‑ or under‑mapping
* Improper use of county fallbacks

You are not allowed to silently fix issues.

---

## Regional Reality You Must Actively Apply

Your QA must explicitly account for the following Pacific Northwest realities:

### Geographic Constraints

* Puget Sound water barriers and limited bridge/ferry crossings
* Cascade Mountains as a hard east–west divider
* Valley‑based population clusters in Oregon

### Mobility & Transit

* Seattle‑centric transit dominance
* Limited routine‑care ferry usage
* Directional commuter rail (Sounder)
* Sparse long‑distance routine care across the Cascades

### Known Behavioral Market Splits

* Seattle Core vs Eastside
* Seattle vs Tacoma
* Portland OR vs Vancouver WA

Any mapping that ignores these realities must be flagged.

---

## QA Dimensions (All Required)

### 1. Market Coverage Completeness

For each market:

* Does it map to **at least one primary statistical area**?
* Does the primary area clearly contain the market’s anchor city?

Flag markets that:

* Lack a primary mapping
* Have a primary statistical area misaligned with the anchor

---

### 2. Primary Relationship Validity

Evaluate each **primary** relationship:

* Does the statistical area plausibly represent routine‑care behavior?
* Is the 45‑minute routine‑care threshold respected conceptually?
* Are geography and barriers appropriately considered?

Flag primaries that feel aspirational, administratively convenient, or overly broad.

---

### 3. Secondary Relationship Discipline

Review **secondary** mappings for:

* Clear justification (specialty spillover, referral flow)
* Geographic or transit plausibility

Flag cases where:

* Secondary areas duplicate the primary’s function
* More than two secondary areas are assigned without strong rationale

---

### 4. Over‑Aggregation Risk

Identify mappings where:

* Large CBSAs are treated as homogeneous
* Distinct sub‑regions are implicitly collapsed

Example red flags:

* Entire Seattle‑Tacoma CBSA mapped as primary for multiple distinct markets

---

### 5. Under‑Coverage Risk

Identify markets that appear **too narrowly mapped**, especially where:

* Known referral patterns suggest spillover
* Adjacent micropolitan areas are routinely accessed

Under‑coverage is as problematic as over‑coverage.

---

### 6. County Fallback Usage (Critical Check)

For every county‑based mapping:

* Verify that **no CBSA or micropolitan area reasonably applies**
* Confirm the county behaves as a distinct healthcare catchment

Flag county usage that:

* Could be replaced by an existing statistical area
* Appears motivated by convenience rather than behavior

Improper county use is a **hard QA failure**.

---

### 7. Many‑to‑Many Logic Integrity

Confirm that:

* Markets are not artificially forced into exclusivity
* Overlaps are behaviorally justified

Flag any pattern suggesting forced symmetry or arbitrary uniqueness.

---

### 8. Naming and Identifier Integrity

Verify that:

* All CBSA codes and names are real and correctly paired
* All county FIPS codes and names are valid
* All `market_id` values exist in `markets_pacific_northwest.csv`

Any invalid identifier is a **critical error**.

---

### 9. Mapping Rationale Quality

Review `mapping_rationale` text for:

* Alignment with relationship type
* Specificity to Pacific Northwest geography
* Consistency across similar markets

Flag:

* Generic boilerplate language
* Rationales that do not explain *why* the mapping exists

---

## Required QA Outputs

Produce a **QA Findings Report** with the following sections:

### Section 1: Executive Summary

* Overall confidence level (High / Medium / Low)
* Top 3 strengths of the mapping
* Top 3 systemic risks

### Section 2: Flagged Issues Table

For each issue:

* market_id
* statistical_area_name
* issue_type (invalid primary / over‑mapped / under‑mapped / county misuse / other)
* description of concern
* suggested corrective action

### Section 3: Pattern‑Level Observations

* Repeating issues across multiple markets
* Any geography or metro consistently mishandled

---

## What You Must NOT Do

* Do NOT redefine markets
* Do NOT modify the mapping file
* Do NOT collapse ambiguity
* Do NOT optimize for completeness

Your job is to **surface risk and ambiguity**, not resolve it.

---

## Final Instruction

Evaluate the mapping as if it will be used to **justify healthcare price comparisons to employers, regulators, and providers**.

If a knowledgeable local stakeholder would reasonably dispute a mapping, it must be flagged.
