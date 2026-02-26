# 01_DOMAIN_MODEL

This document describes the domain model as evidenced in the repository.
It is intended to help an engineer/LLM understand core entities, relationships, and invariants.
Claims must be grounded in file paths. Anything not directly evidenced is labeled **NOT EVIDENCED**.

Last updated: `2026-02-27`  
Current git commit hash: `67969a83`

## Evidence sources used
- `docs/llm_handoff/_evidence_index.md` (Phase A evidence index)
- `docs/llm_handoff/_runtime_findings.md` (Phase A2 runtime evidence)

> NOTE: This v2 document is intentionally conservative to avoid hallucination under unstable tooling.
> Fill in specific entities/relationships only when you can point to concrete evidence paths (models/migrations/sql/seeds).

## Core entities (NOT EVIDENCED until mapped)
- User / Auth identity — **NOT EVIDENCED** (confirm via backend auth deps + frontend auth context)
- Provider — **NOT EVIDENCED** (confirm via provider schema/SQL + service usage)
- Specialty — **NOT EVIDENCED**
- Procedure / Bundle — **NOT EVIDENCED**
- Medication / Drug — **NOT EVIDENCED** (medications endpoint noted as missing on some branches previously)

## Data stores and schemas (evidence required)
### Postgres / Supabase
- Primary schema definition paths — **NOT EVIDENCED** (pull from Phase A: migrations/sql table definitions)

### BigQuery
- Dataset/table definitions and lineage — **NOT EVIDENCED** (pull from Phase A: dbt models + orchestrate scripts)

## Relationships (NOT EVIDENCED until mapped)
- Provider ↔ Locations — **NOT EVIDENCED**
- Provider ↔ Specialties — **NOT EVIDENCED**
- Procedure ↔ Bundles — **NOT EVIDENCED**
- Specialty ↔ Procedures — **NOT EVIDENCED**

## Identifiers and keys (NOT EVIDENCED until mapped)
- Provider IDs — **NOT EVIDENCED**
- Specialty slugs — **NOT EVIDENCED**
- Bundle IDs — **NOT EVIDENCED**

## Validation and invariants (NOT EVIDENCED until mapped)
- Deduplication rules — **NOT EVIDENCED**
- Required fields / constraints — **NOT EVIDENCED**
- Search ranking weights — **NOT EVIDENCED**

## Next step to complete this doc (manual/evidence-driven)
1) Open `docs/llm_handoff/_evidence_index.md`
2) Extract explicit schema/model paths (SQL tables, dbt models, seeds, migrations)
3) Replace each **NOT EVIDENCED** block with:
   - concrete entity definition
   - file path citations
   - relationship + join keys
