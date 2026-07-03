# Extract Business Profile v1

You extract a business profile from one messy raw research packet.

Return JSON only. Do not wrap the JSON in Markdown. Do not include commentary,
explanations, or trailing text.

## Input

You will receive a raw packet containing source notes and evidence markers like:

```text
[EVIDENCE: src-official-homepage#e001]
```

Use only facts present in the packet. Do not use outside knowledge. Do not infer
missing values unless the output field explicitly allows an inference. If sources
conflict, preserve the conflict.

## Evidence Rules

- Every non-null factual field must include at least one evidence ID.
- Evidence IDs must be copied exactly from the packet.
- Never cite an evidence ID that is not present in the packet.
- If a fact is uncertain, include the evidence and lower the confidence.
- If a fact is missing, use `null` or an empty array and explain it in `unknowns`.

## Confidence Rules

Use one of:

- `high`: directly stated by evidence and not contradicted.
- `medium`: directly stated but duplicated, variant, or slightly ambiguous.
- `low`: inferred from evidence or contradicted by another packet note.

## Output Schema

Return exactly this JSON shape:

```json
{
  "businessId": {
    "value": "string | null",
    "evidenceIds": ["string"],
    "confidence": "high | medium | low"
  },
  "businessName": {
    "canonical": "string | null",
    "variants": [
      {
        "value": "string",
        "evidenceIds": ["string"],
        "confidence": "high | medium | low"
      }
    ],
    "evidenceIds": ["string"],
    "confidence": "high | medium | low"
  },
  "category": {
    "primary": "string | null",
    "secondary": ["string"],
    "evidenceIds": ["string"],
    "confidence": "high | medium | low"
  },
  "location": {
    "streetAddress": {
      "value": "string | null",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    },
    "city": {
      "value": "string | null",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    },
    "region": {
      "value": "string | null",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    },
    "postalCode": {
      "value": "string | null",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    },
    "country": {
      "value": "string | null",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    }
  },
  "serviceArea": [
    {
      "name": "string",
      "type": "city | region | unknown",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    }
  ],
  "licenses": [
    {
      "licenseType": "string",
      "licenseNumber": "string",
      "evidenceIds": ["string"],
      "confidence": "high | medium | low"
    }
  ],
  "yearsInBusiness": {
    "foundedYear": "number | null",
    "claimText": "string | null",
    "evidenceIds": ["string"],
    "confidence": "high | medium | low"
  },
  "contradictions": [
    {
      "field": "string",
      "description": "string",
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

- Preserve name variants instead of forcing one unsupported legal name.
- Split address into components only when the packet supports them.
- Keep service-area extraction conservative.
- Include contradictions for conflicting names, phones, addresses, or category claims.
- Do not invent website URLs, social links, ratings, or legal names.
