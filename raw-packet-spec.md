# Raw Research Packet Specification

Raw packets are manually collected, source-linked research bundles for one business.
They are intentionally allowed to be messy, incomplete, duplicated, and contradictory.
Extraction prompts must recover structured facts from these packets without inventing
missing details.

## Folder Layout

Each business packet lives under:

```text
data/businesses/<business-id>/
  business-manifest.json
  raw/
    packet.md
    sources.json
```

## Business ID

Use a stable, lowercase, hyphenated ID:

```text
<city>-<category>-<sequence>
```

Example:

```text
austin-plumber-01
```

Do not rename a business ID after extraction fixtures reference it.

## Manifest

`business-manifest.json` describes the business and points to raw packet files.
It must conform to `schemas/business-manifest.schema.json`.

The manifest is not an extraction result. It is harness metadata used to find the
packet and identify the research target.

## Source Index

`raw/sources.json` lists every source used in `packet.md`.

Each source must have:

- `sourceId`: stable ID used by evidence references.
- `sourceType`: broad source category.
- `url`: public URL when available.
- `collectedAt`: ISO date or datetime.
- `notes`: short context about why the source was collected.

Source IDs should be stable and human-readable:

```text
src-official-homepage
src-official-reviews
src-google-business-profile
```

## Evidence IDs

Every extractable packet note must include an evidence ID in this format:

```text
[EVIDENCE: source-id#e001]
```

Rules:

- Evidence IDs must be unique within a packet.
- Evidence IDs must start with a valid `sourceId`.
- Evidence IDs should be granular enough to support field-level citation.
- Do not reuse one evidence ID for unrelated claims.
- If a note is ambiguous, keep it as ambiguous and still cite the evidence.

## Packet Style

`raw/packet.md` should preserve research messiness:

- copied snippets may be partial
- notes may be informal
- duplicates are allowed
- contradictions are allowed
- uncertainty should be written down
- inferred facts must be labeled as inference

Do not clean the packet into final structured JSON. That is the extraction task.

## Minimum Sections

Use these headings when possible:

```markdown
# Raw Research Packet: <business name>

## Collection Metadata
## Source Notes
## Business Identity
## Services
## Contact And Funnel
## Reviews And Reputation
## Positioning And Offers
## Local Market / Competitors
## Technical / Website Signals
## Open Questions
```

Sections may be sparse on early packets. Missing information is acceptable.

## Extraction Constraints

Future prompts must treat the packet as the only evidence source. They must:

- output JSON only
- cite evidence IDs for every factual claim
- include confidence
- preserve unknowns
- avoid invented facts
- mark contradictions instead of resolving them without evidence
