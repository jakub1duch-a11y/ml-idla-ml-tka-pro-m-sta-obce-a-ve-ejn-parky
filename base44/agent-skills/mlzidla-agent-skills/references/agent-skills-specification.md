# Agent Skills specification — implementation reference

Official source: https://agentskills.io/specification

This file is a concise implementation reference, not a verbatim copy of the upstream specification. Check the official source for updates.

## Directory structure

Each skill is a directory containing `SKILL.md`. Optional directories include `scripts/` for executable helpers, `references/` for supporting documentation, and `assets/` for templates and static resources.

## Required `SKILL.md` frontmatter

A skill file starts with YAML frontmatter followed by Markdown instructions.

- `name` — required; 1–64 characters; lowercase letters (`a-z`), digits (`0-9`) and hyphens only; cannot start or end with a hyphen or contain consecutive hyphens; must match the parent directory name.
- `description` — required; non-empty and no longer than 1024 characters; describes what the skill does and when an agent should use it.
- `license`, `compatibility`, `metadata`, and `allowed-tools` are optional. `compatibility` is limited to 500 characters. `allowed-tools` is experimental and support varies by agent implementation.

## Instruction body and progressive disclosure

The Markdown body can provide steps, examples, and edge cases. Keep the main `SKILL.md` under 500 lines and preferably under 5000 tokens. Put detailed material in separate files and link to those files using paths relative to the skill root. Keep reference chains shallow; one level deep is recommended.

Agents may load metadata first, the full instructions when a skill activates, and referenced resources only as needed. This is a host-agent behavior, not something guaranteed merely by placing files in a website repository.

## Validation

The upstream reference implementation documents this command:

```bash
skills-ref validate ./my-skill
```

Use it when the validator is installed. Otherwise run an available YAML/frontmatter check and clearly report the limitation.

## Base44 integration note

Adding skill files to the Base44 project stores the instructions in source control. It does not by itself prove that Base44's runtime discovers or executes them, nor does it publish the current workspace to the production domain. Verify host support, build status, and deployment independently.