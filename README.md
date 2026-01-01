# kai-prompting-skill

> Prompts that write prompts. Meta-prompting enables dynamic composition where structure is fixed but content is parameterized.

Meta-prompting system with Handlebars templates, Claude 4.x best practices, and prompt engineering standards.

## Features

- **5 Template Primitives** - Roster, Voice, Structure, Briefing, Gate
- **CLI Tools** - RenderTemplate.ts, ValidateTemplate.ts
- **Prompt Standards** - Claude 4.x best practices documentation

**Core Philosophy:** Find the smallest possible set of high-signal tokens that maximize the likelihood of desired outcomes.

## Token Efficiency

The templating system reduces duplication significantly:

| Area | Before | After | Savings |
|------|--------|-------|---------|
| Agent Briefings | 6,400 tokens | 1,900 tokens | 70% |
| SKILL.md Files | 20,750 tokens | 8,300 tokens | 60% |
| Workflow Steps | 7,500 tokens | 3,000 tokens | 60% |
| Voice Notifications | 6,225 tokens | 725 tokens | 88% |
| **TOTAL** | ~53,000 | ~18,000 | **65%** |

## Installation

### Option 1: Marketplace (Recommended)

```bash
# From Claude Code, run:
/plugin marketplace add rafaelcalleja/kai-prompting-skill
/plugin install kai-prompting-skill@rafaelcalleja-kai-prompting-skill
```

### Option 2: Development/Testing

```bash
# Clone and use directly
git clone https://github.com/rafaelcalleja/kai-prompting-skill.git
claude --plugin-dir ./kai-prompting-skill
```

### Option 3: CLI Tools Only

```bash
cd kai-prompting-skill/skills/Prompting/Tools
bun install
```

## Verify Installation

Once installed, test with:

- Ask: *"help me render a briefing template"* → activates the prompting skill
- Ask: *"generate a roster from YAML data"* → uses RenderTemplate tool
- Ask: *"validate my template syntax"* → uses ValidateTemplate tool

## Components

### Skill: Prompting

Provides meta-prompting capabilities. Triggers on:
- "render template", "generate from template"
- "validate template", "check syntax"
- "review prompt", "optimize prompt"

### Five Core Primitives

| Primitive | Purpose | Use Case |
|-----------|---------|----------|
| **ROSTER** | Data-driven definitions | Agent personalities, skill listings |
| **VOICE** | Personality calibration | Voice parameters, trait settings |
| **STRUCTURE** | Workflow patterns | Phased analysis, debate rounds |
| **BRIEFING** | Agent context handoff | Task delegation, research queries |
| **GATE** | Validation checklists | Quality checks, completion criteria |

## Usage

### Render a Template

```bash
cd skills/Prompting/Tools
bun run RenderTemplate.ts \
  --template ../Templates/Primitives/Briefing.hbs \
  --data /path/to/data.yaml \
  --preview
```

### Validate Templates

```bash
cd skills/Prompting/Tools
bun run ValidateTemplate.ts \
  --template ../Templates/Primitives/Roster.hbs
```

## Directory Structure

```
kai-prompting-skill/
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── skills/
│   └── Prompting/
│       ├── SKILL.md
│       ├── Standards.md
│       ├── Templates/
│       │   ├── README.md
│       │   └── Primitives/
│       │       ├── Roster.hbs
│       │       ├── Voice.hbs
│       │       ├── Structure.hbs
│       │       ├── Briefing.hbs
│       │       └── Gate.hbs
│       └── Tools/
│           ├── RenderTemplate.ts
│           ├── ValidateTemplate.ts
│           └── package.json
└── README.md
```

## Credits

- **Origin:** Based on [kai-prompting-skill pack](https://github.com/danielmiessler/Personal_AI_Infrastructure) by Daniel Miessler
- **License:** MIT

### Acknowledgments

- **Anthropic** - Claude 4.x Best Practices, context engineering research
- **IndyDevDan** - Meta-prompting concepts and inspiration
- **Daniel Miessler** - Fabric pattern system (248 reusable prompts)
- **Academic Community** - "The Prompt Report", "The Prompt Canvas"

## Changelog

### v1.1.0 (2026-01-01)

Synced with PAI pack `danielmiessler-kai-prompting-skill-v1.0.0`:

- **BREAKING**: Removed `agents/` directory (prompt-reviewer, template-renderer)
- **BREAKING**: Renamed `skills/prompting` → `skills/Prompting` (proper case)
- Moved `Standards.md` from `references/` to skill root
- Removed `templates/data/examples/` directory
- Added `Templates/README.md` documentation
- Added Tools configuration files (tsconfig.json, CLAUDE.md)
- Updated plugin manifests

### v1.0.0

- Initial release with 5 template primitives
- CLI tools for rendering and validation
- Prompt engineering standards documentation
- Agents: template-renderer, prompt-reviewer
