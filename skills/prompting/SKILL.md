---
name: prompting
description: This skill provides meta-prompting capabilities for dynamic prompt generation using Handlebars templates, Claude 4.x best practices, and the five core primitives (Roster, Voice, Structure, Briefing, Gate). Use when creating templates, rendering prompts from data, reviewing prompt quality, or applying prompt engineering standards.
---

# Prompting - Meta-Prompting & Template System

Invoke when: meta-prompting, template generation, prompt optimization, programmatic prompt composition, creating dynamic agents, generating structured prompts from data, reviewing prompts against standards.

## Overview

The Prompting skill owns ALL prompt engineering concerns:
- **Standards** - Anthropic best practices, Claude 4.x patterns, empirical research
- **Templates** - Handlebars-based system for programmatic prompt generation
- **Tools** - Template rendering, validation, and composition utilities
- **Patterns** - Reusable prompt primitives and structures

## Core Philosophy

**Context engineering** is the set of strategies for curating and maintaining the optimal set of tokens during LLM inference.

**Primary Goal:** Find the smallest possible set of high-signal tokens that maximize the likelihood of desired outcomes.

## Workflow Routing

| Workflow | Trigger | Action |
|----------|---------|--------|
| **RenderTemplate** | "render template", "generate from template", "use briefing template" | Use RenderTemplate.ts CLI |
| **ValidateTemplate** | "validate template", "check template syntax" | Use ValidateTemplate.ts CLI |
| **ApplyStandards** | "review prompt", "optimize prompt", "check prompt quality" | Reference Standards.md |
| **CreateTemplate** | "create new template", "make a template for" | Use primitives as base |

## The Five Primitives

Templates that cover 90% of prompt composition needs:

| Primitive | Purpose | Use Case |
|-----------|---------|----------|
| **ROSTER** | Data-driven definitions | Agent personalities, skill listings, team rosters |
| **VOICE** | Personality calibration | Voice parameters, trait settings, TTS config |
| **STRUCTURE** | Workflow patterns | Phased analysis, debate rounds, pipelines |
| **BRIEFING** | Agent context handoff | Task delegation, research queries, context packages |
| **GATE** | Validation checklists | Quality checks, completion criteria, gates |

## Using Templates

### Render a Template

```bash
bun run tools/RenderTemplate.ts \
  --template templates/primitives/Briefing.hbs \
  --data path/to/data.yaml \
  --output path/to/output.md
```

### Validate a Template

```bash
bun run tools/ValidateTemplate.ts \
  --template templates/primitives/Briefing.hbs
```

### Data Format (YAML)

Each primitive expects specific YAML structure. See `templates/data/examples/` for working examples.

## Claude 4.x Key Patterns

### DO:
- Use markdown headers (## Section) for structure
- Be explicit with instructions
- Add context and motivation (explain WHY)
- Tell instead of forbid (positive framing)
- Use 1-3 few-shot examples (optimal range)

### AVOID:
- XML tags (`<instructions>`) - use markdown instead
- Aggressive tool language ("MUST", "CRITICAL")
- Word "think" when extended thinking disabled
- Verbose explanations
- Example overload (>3 examples)

## Token Efficiency

The templating system reduces duplication:

| Area | Before | After | Savings |
|------|--------|-------|---------|
| Agent Briefings | 6,400 tokens | 1,900 tokens | 70% |
| Workflow Steps | 7,500 tokens | 3,000 tokens | 60% |
| Voice Notifications | 6,225 tokens | 725 tokens | 88% |

## Best Practices

1. **Separation of Concerns** - Templates for structure, YAML for content
2. **Keep Templates Simple** - Business logic in TypeScript, not templates
3. **DRY Principle** - Extract repeated patterns into partials
4. **Validate Before Rendering** - Check all required variables exist
5. **A/B Testing** - Test structure variations with same content

## References

- `references/Standards.md` - Complete prompt engineering guide
- `templates/primitives/` - Core template files
- `templates/data/examples/` - Example YAML data
- `tools/` - CLI utilities
