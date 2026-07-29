---
title: "Part 7: Skills — Packaged, Reusable Expertise"
---

In Part 6 you built **agents** — personas you deliberately switch into. **Skills** are the next layer: packaged expertise that Copilot loads **automatically** the moment your prompt matches, no switching required.

Think of skills as power tools on a shelf. You don't announce *"I will now use the drill."* You reach for the right tool when the job calls for it. Copilot does the same — it reads your prompt, matches it against each skill's description, and pulls in the relevant one.

| Customization | What it is | When it activates |
|---|---|---|
| **Custom instructions** | Always-on project rules | Every prompt (or by file glob) |
| **Custom agents** | A persona you switch into | When *you* select it |
| **Skills** | A packaged capability | **Automatically**, when your prompt matches its description |

---

## Section 1: How Skills Work

A skill is a folder containing a `SKILL.md` file (plus optional scripts or examples). Skills are an [open standard](https://agentskills.io) that works across GitHub Copilot in VS Code, the CLI, and cloud agents — the same folder works everywhere.

**Where skills live:**

| Location | Scope |
|----------|-------|
| `.github/skills/` | Project — shared with your team via git |
| `~/.copilot/skills/` | Personal — available in every project |

**Structure** — each skill gets its own folder, named to match its `name`:

```
.github/skills/
└── commit-message/
    └── SKILL.md        # Required: definition + instructions
```

**`SKILL.md` format** — YAML frontmatter plus Markdown instructions:

```markdown
---
name: skill-name
description: What the skill does and when Copilot should use it
---

# Skill Instructions

Your guidelines, steps, and examples go here.
```

> 💡 The `description` is the most important line — it's how Copilot decides when to auto-load the skill. Be specific about *what* it does and *when* to use it.

---

## Section 2: Create a Commit-Message Skill

Mona Mayhem uses **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Instead of remembering the format every time, package it as a skill.

### Task 1: Generate the Skill

Ask Copilot to create the commit message skill:

```text
Create a skill at .github/skills/commit-message/SKILL.md that teaches Copilot to generate Conventional Commit messages for the Mona Mayhem project.

The skill should:
- Have description: "Generate a Conventional Commit message from staged git changes for the Mona Mayhem project"
- Explain the format: <type>(<optional scope>): <short summary>
- List the types: feat (new feature), fix (bug fix), docs (documentation), refactor (code change), test (tests), chore (tooling/deps)
- Rules: imperative mood, lowercase, no trailing period, ≤72 chars, scope matches area touched (e.g., battle, api, theme)
```

Copilot will create the folder and `SKILL.md` with the correct format.

### Task 2: Watch It Auto-Trigger

Make a small change and stage it, then ask for a commit message in plain language — **don't** name the skill.

Use `!` to enter shell mode.

```bash
git add -A
```

You may have to run `/skills reload` to reload skills from disk.

```text
Write a commit message for my staged changes.
```

Copilot matches your prompt to the `commit-message` skill's description and applies your Conventional Commit format automatically. If you just added a skill file, run `/skills reload` first so Copilot picks it up.




> 💡 **How do I know a skill was used?** Copilot will typically mention the skill it loaded, and the output follows your packaged rules instead of a generic guess.

---

## Section 3: Create a Component-Checklist Skill

Now package a quality bar for new UI so every component meets the same standard.

Ask Copilot to create the component checklist skill:

```text
Create a skill at .github/skills/component-checklist/SKILL.md for reviewing Astro/TypeScript UI in the Mona Mayhem battle app.

The skill should:
- Have name: component-checklist
- Have description: "Quality checklist for reviewing Astro/TypeScript UI in the Mona Mayhem battle app"
- Have argument-hint: "file path or component to check"
- Check accessibility: keyboard navigation, focus states, Enter triggers battle, ARIA labels, prefers-reduced-motion
- Check theme: palette (#0a0a1a, #5fed83, #8a2be2), Press Start 2P font, hover/focus states
- Check code quality: typed interfaces (no any), async wrapped in try/catch, no dead code or console logs
- Output: numbered list of issues tagged [CRITICAL] / [HIGH] / [MEDIUM] / [LOW] with fixes
```

You may have to run `/skills reload` to reload skills from disk.

You can also **invoke a skill directly** by name when you want to force it:


```text
/component-checklist src/pages/index.astro
```

The `argument-hint` you set appears as a placeholder, prompting you for the file to check.




---

## Section 4: Manage & Share Skills


Manage skills from inside a session with `/skills`:

```bash
# See all installed skills
/skills list

# Add a skill from a local path, directory, or URL
/skills add ./.github/skills/commit-message

# Remove a skill by name
/skills remove commit-message
```

Inside a session, `/skills` opens the manager and `/skills reload` re-reads your skill files after you edit them.

**Find community skills.** Plugins bundle skills you can install in one step:

```text
/plugin
```

Browse the marketplace, or pull ready-made skills from [github/awesome-copilot](https://github.com/github/awesome-copilot) into `.github/skills/` (project) or `~/.copilot/skills/` (personal).




Commit your skill files so the whole team gets the same automatic expertise.

---

## Check your understanding

Why is the `description` in a skill especially important?

<details>
<summary>Check your answer</summary>

Copilot uses the description to decide whether a skill is relevant to the current request and should be loaded. A vague description makes activation unreliable, while a precise description names the task and conditions that should trigger the skill. This on-demand loading keeps specialized guidance out of unrelated conversations.

**Go deeper:** [Add agent skills to Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills).

</details>

## ✅ Part 7 Complete

You've learned how to:

- Understand how skills **auto-load** based on their `description`
- Author `SKILL.md` files and place them for **project** or **personal** scope
- Trigger skills **automatically** or invoke them **directly** by name
- **Manage and share** skills with `/skills`, the `copilot skill` command, plugins, and awesome-copilot

> **Next:** In Part 8 you'll connect Copilot to live data and a real browser with **MCP servers**.
