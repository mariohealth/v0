# Execution Prompt: Stage‑1 Mapping — Proprietary Markets → Statistical Areas

## Purpose

This prompt executes **Stage‑1 of the healthcare market mapping workflow**.

Your task is to map **proprietary Healthcare Shopping Zones (markets)** to **named statistical areas** in a way that is behaviorally realistic, LLM‑tractable, and suitable for later deterministic expansion to ZIP codes.

This prompt **does not enumerate ZIPs** and must not attempt ZIP‑level reasoning.

---

## Conceptual Frame (You Must Accept This)

* Proprietary markets are the **truth layer** and must not be redefined.
* Statistical areas are an **intermediate abstraction** used to:

  * Capture geographic and behavioral intent
  * Enable scalable ZIP expansion outside the LLM
* Precision at this stage is conceptual, not enumerative.

Your goal is to answer:

> “Which named statistical areas are realistically served by this market?”

—not to fully describe patient choice.

---

## Required References

You must conceptually reference:

1. **National Base Prompt – Healthcare Market Master**
   (Defines universal principles such as the 45‑minute rule, travel friction, and patient behavior.)

2. **Regional Market Prompt (`markets_<region>.md`)**
   (Defines region‑specific geography, transit, and known market splits.)

3. **Regional Market File (`markets_<region>.csv`)**
   (Authoritative list of valid `market_id` values.)

You may not create, rename, merge, or split markets.

---

## Role Definition

You are acting as a **Health Economics and Geospatial Data Analyst** performing **conceptual market coverage modeling**.

You must prioritize behavioral realism over Census formalism.

---

## Scope of a Single Run

Each run applies to **one region only** (e.g., Pacific Northwest).

Cross‑region statistical areas may be included **only if behaviorally justified**.

---

## Mapping Target Definition (Critical)

### Primary Mapping Unit: Statistical Areas

Use **named Core‑Based Statistical Areas (CBSAs)**, including:

* Metropolitan Statistical Areas
* Micropolitan Statistical Areas

Each statistical area must be identified by:

* Official CBSA code (5‑digit)
* Official CBSA name

These entities are preferred because they:

* Are anchor‑city based
* Are named (LLM‑friendly)
* Align with hospital referral behavior

---

### County Fallback Rule (Strict and Limited)

You may map a market to **individual counties** *only* when **no CBSA or micropolitan area adequately represents the population served**.

County fallback is allowed **only if all of the following are true**:

1. The geography is not part of any CBSA or micropolitan area, **or**
2. The existing CBSA is behaviorally meaningless (e.g., extremely large rural aggregation), **and**
3. The county functions as a distinct healthcare catchment

When using a county fallback:

* Use county FIPS code + county name
* Do not group counties together unless the region prompt explicitly supports it

County use must be the **exception**, not the default.

---

## Output File Specification

### File Name

```text
market_to_statistical_area_<region>.csv
```

### Required Schema

| Column                | Definition                                                |
| --------------------- | --------------------------------------------------------- |
| market_id             | Proprietary market identifier from `markets_<region>.csv` |
| statistical_area_type | `CBSA` or `County`                                        |
| statistical_area_id   | CBSA code (5‑digit) or County FIPS                        |
| statistical_area_name | Official name                                             |
| relationship_type     | `primary` / `secondary`                                   |
| mapping_rationale     | ≤1 sentence behavioral justification                      |

---

## Core Mapping Rules

### 1. Relationship Semantics

* **Primary**: Statistical areas that represent the core routine‑care catchment for the market
* **Secondary**: Areas with regular specialty spillover or referral flow

Avoid assigning more than **2 secondary areas** per market unless explicitly justified.

---

### 2. Many‑to‑Many Is Expected

* One market may map to multiple statistical areas
* One statistical area may map to multiple markets

Do not force exclusivity.

---

### 3. Behavioral Heuristics (Mandatory)

Use:

* Approximate 45‑minute routine‑care travel logic
* Known transit corridors and barriers
* Geography (water, mountains, valleys)
* Dominant hospital systems and referral patterns

Avoid purely administrative reasoning.

---

### 4. Naming Discipline

* Use official statistical area names
* Do not invent sub‑CBSAs or informal labels
* Do not alias statistical areas to market names

---

## What You Must NOT Do

* Do NOT enumerate ZIPs or ZCTAs
* Do NOT approximate ZIP behavior indirectly
* Do NOT redefine markets
* Do NOT treat CBSAs as internally homogeneous

---

## Quality Check (Per Market)

Before finalizing each market’s mappings, confirm:

1. Primary areas truly reflect routine‑care behavior
2. Secondary areas represent realistic spillover
3. County fallbacks are clearly justified
4. All IDs and names are valid and real

---

## Final Instruction

Output **only** the completed `market_to_statistical_area_<region>.csv`.

This file will be used as the **sole conceptual input** to deterministic ZIP expansion. Prioritize clarity, restraint, and behavioral realism.
