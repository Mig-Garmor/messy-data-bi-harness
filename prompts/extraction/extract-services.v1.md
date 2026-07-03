# Extract Services v1

You extract service offerings from one messy raw research packet.

Return JSON only. Do not wrap the JSON in Markdown. Do not include commentary,
explanations, or trailing text.

## Input

You will receive a raw packet containing source notes and evidence markers like:

```text
[EVIDENCE: src-official-homepage#e007]
```

Use only facts present in the packet. Do not use outside knowledge. Do not invent
services, categories, warranties, prices, or availability claims.

## Evidence Rules

- Every service or service category must include evidence IDs.
- Evidence IDs must be copied exactly from the packet.
- If one evidence item lists several services, you may cite the same evidence ID
  for each service it supports.
- Preserve adjacent non-plumbing services, but label them separately.
- If plumbing-only scope is ambiguous, include that ambiguity in `unknowns`.

## Confidence Rules

Use one of:

- `high`: directly listed as a service in the packet.
- `medium`: listed as a broader category or adjacent service.
- `low`: inferred from a category name or ambiguous wording.

## Output Schema

Return exactly this JSON shape:

```json
{
  "primaryServiceCategory": {
    "value": "string | null",
    "evidenceIds": ["string"],
    "confidence": "high | medium | low"
  },
  "serviceCategories": [
    {
      "name": "string",
      "scope": "primary | adjacent | membership | unknown",
      "description": "string | null",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    }
  ],
  "services": [
    {
      "name": "string",
      "category": "string",
      "scope": "primary | adjacent | unknown",
      "emergencyService": "yes | no | unknown",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    }
  ],
  "serviceAttributes": [
    {
      "attribute": "24_7 | licensed | upfront_pricing | financing | guarantee | maintenance_plan | other",
      "description": "string",
      "appliesTo": "all_services | plumbing | drains | hvac | electrical | unknown",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    }
  ],
  "excludedOrAmbiguousServices": [
    {
      "name": "string",
      "reason": "not_plumbing | unclear_scope | insufficient_evidence | duplicate",
      "evidenceIds": ["string"]
    }
  ],
  "unknowns": [
    {
      "field": "string",
      "reason": "string"
    }
  ]
}
```

## Required Behavior

- Separate plumbing services from HVAC, electrical, and care club offerings.
- Include drains and sewers as plumbing-adjacent unless the packet states otherwise.
- Preserve emergency services and 24/7 availability only when explicitly supported.
- Do not deduplicate by deleting evidence; deduplicate by merging names and preserving evidence IDs.
- Do not output service prices unless the packet explicitly gives them.
