# Claude Skills

A curated collection of Claude Code skills and plugins for AI-powered development workflows.

## Available Skills

| Skill | Description |
|-------|-------------|
| [image-gen](plugins/image-gen) | AI image generation and editing across multiple providers |
| [prd](plugins/prd) | AI-optimized PRD generator for feature planning |
| [tasks](plugins/tasks) | PRD decomposer for Ralph-ready task files |

## PRD → Tasks → Ralph Loop Workflow

The `prd` and `tasks` skills work together with the `ralph-loop` plugin to enable autonomous feature development:

```
/prd "feature description"     → Creates AI-optimized PRD
        ↓
/tasks tasks/prd-feature.md    → Decomposes into context-sized tasks
        ↓
/ralph-loop "Execute task..."  → Autonomous execution
```

## Installation

Install skills directly in Claude Code:

```bash
# Add this marketplace
/plugin marketplace add https://github.com/shipdeckai/claude-skills

# Install a skill
/plugin install image-gen@claude-skills
```

## Contributing

Want to add your skill to the marketplace? Open a PR adding your skill to `.claude-plugin/marketplace.json`.

## License

MIT
