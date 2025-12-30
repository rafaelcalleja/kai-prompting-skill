# kai-prompting-skill

Meta-prompting system with Handlebars templates, Claude 4.x best practices, and prompt engineering standards.

## Features

- **5 Template Primitives** - Roster, Voice, Structure, Briefing, Gate
- **CLI Tools** - RenderTemplate.ts, ValidateTemplate.ts
- **Prompt Standards** - Claude 4.x best practices documentation
- **2 Agents** - template-renderer, prompt-reviewer

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
cd kai-prompting-skill/skills/prompting/tools
bun install
```

## Verify Installation

Once installed, test with:

- Ask: *"help me render a briefing template"* → activates the prompting skill
- Ask: *"review this prompt for quality"* → activates the prompt-reviewer agent
- Ask: *"generate a roster from YAML data"* → activates the template-renderer agent

## Components

### Skill: prompting

Provides meta-prompting capabilities. Triggers on:
- "render template", "generate from template"
- "validate template", "check syntax"
- "review prompt", "optimize prompt"

### Templates

| Template | Purpose |
|----------|---------|
| `Roster.hbs` | Data-driven agent/entity listings |
| `Voice.hbs` | Personality and voice configuration |
| `Structure.hbs` | Multi-step workflow patterns |
| `Briefing.hbs` | Agent task context handoffs |
| `Gate.hbs` | Quality validation checklists |

### Agents

| Agent | Purpose |
|-------|---------|
| `template-renderer` | Renders templates with YAML data |
| `prompt-reviewer` | Reviews prompts against standards |

## Usage

### Render a Template

```bash
cd skills/prompting/tools
bun run RenderTemplate.ts \
  --template primitives/Briefing.hbs \
  --data ../templates/data/examples/briefing-example.yaml
```

### Validate Templates

```bash
cd skills/prompting/tools
bun run ValidateTemplate.ts --all
```

### Review a Prompt

Ask Claude: "Review this prompt for quality" and paste your prompt.

## Directory Structure

```
kai-prompting-skill/
├── .claude-plugin/
│   └── plugin.json
├── agents/
│   ├── template-renderer.md
│   └── prompt-reviewer.md
├── skills/
│   └── prompting/
│       ├── SKILL.md
│       ├── references/
│       │   └── Standards.md
│       ├── templates/
│       │   ├── primitives/
│       │   │   ├── Roster.hbs
│       │   │   ├── Voice.hbs
│       │   │   ├── Structure.hbs
│       │   │   ├── Briefing.hbs
│       │   │   └── Gate.hbs
│       │   └── data/
│       │       └── examples/
│       └── tools/
│           ├── RenderTemplate.ts
│           ├── ValidateTemplate.ts
│           └── package.json
└── README.md
```

## Credits

Based on the kai-prompting-skill pack from [Personal AI Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure) by Daniel Miessler.
