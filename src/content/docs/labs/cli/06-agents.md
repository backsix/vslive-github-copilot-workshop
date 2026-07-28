---
title: "Part 6: Specialized Agents & Custom Instructions"
---

Your app is built, themed, and polished. Until now Copilot has worked as a **generalist** — it does whatever your current prompt asks. In this part you'll give it **specialized personas** and **always-on project rules** so the *same* prompt produces sharper, more consistent results.

You'll learn three layers of customization:

1. **Built-in agents** — the specialists Copilot already ships with
2. **Custom instructions** — project rules Copilot loads automatically
3. **Custom agents** — your own reusable specialists defined in `.agent.md` files

---

## Section 1: Meet the Built-in Agents

You've already been using agents without knowing it. `/plan` and `/review` are **built-in agents** — specialized modes with their own focus and tools.

| Agent | How to invoke | What it does |
|-------|---------------|--------------|
| **Plan** | `/plan` (or Shift+Tab to cycle modes) | Creates a step-by-step plan before coding |
| **Code review** | `/review` | Reviews staged/unstaged changes for bugs and quality |
| **Rubber duck** | `/rubber-duck` | Gives an independent critique of your current approach |
| **Security review** | `/security-review` | Scans changes for security vulnerabilities |
| **Explore** | *automatic* | Investigates the codebase when a prompt needs research |
| **Task** | *automatic* | Runs builds, tests, and installs, then reports back cleanly |


Try a couple you haven't used yet, right on the Mona Mayhem code:

```text
/rubber-duck Is my battle fetch logic in src/pages/index.astro resilient if one user request fails but the other succeeds?
```

```text
/security-review
```

> 💡 The Explore and Task agents run **automatically**. When you ask *"how is contribution data loaded?"* Copilot silently uses Explore; when you ask it to *"run the build"* it uses Task and reports a clean pass/fail summary.




> **Result:** You now know the "hidden" agents behind the commands you've been using — and two new quality gates (`/rubber-duck`, `/security-review`).

---

## Section 2: Path-Specific Custom Instructions

In Part 1 you generated `.github/copilot-instructions.md` with `/init`. That file applies to **every** prompt. But some rules should only apply to *certain files* — Astro component conventions shouldn't clutter a conversation about a TypeScript API route.

**Path-specific instruction files** solve this. They live in `.github/instructions/` and use an `applyTo` glob in their frontmatter.

### Task 1: Add Scoped Instructions

Ask Copilot to create scoped instruction files:

```text
Create two instruction files in `.github/instructions/`:

1. `astro.instructions.md` - Applies to all Astro files (**/*.astro)
   - Should cover Astro component standards, TypeScript in scripts, neon arcade theme
   - Dark background (#0a0a1a), green (#5fed83), purple (#8a2be2) accents, Press Start 2P font
   - Keyboard accessibility requirements

2. `typescript.instructions.md` - Applies to all TypeScript files (**/*.ts)
   - Should cover error handling with try/catch blocks
   - Typed request/response interfaces for API routes
   - RESTful conventions for endpoints in src/pages/api/
```

After Copilot creates the instruction files, use `/diff` to review what was generated.

**How `applyTo` works:**

| `applyTo` value | When it applies |
|---|---|
| `"**/*.astro"` | Any Astro file |
| `"**/*.ts"` | Any TypeScript file |
| `"src/pages/api/**"` | Anything in the API folder |
| *(no frontmatter)* | Every conversation — the default |

> 💡 You can keep a short `AGENTS.md` at the repo root and pull in detail with `@`-imports, e.g. `@.github/instructions/astro.instructions.md`. Copilot expands the reference automatically.


Run `/instructions` to see which instruction files are currently loaded and toggle any on or off. Copilot CLI reads instructions from `AGENTS.md`, `.github/copilot-instructions.md`, and `.github/instructions/**/*.instructions.md` automatically.

You may have to run `/restart` to reload Copilot's context and pick up the new files.



### Task 2: See Them Work

Ask Copilot to add a small feature and watch it follow the scoped rules without being reminded:

```text
Add a small "clear results" button to the battle page that resets both inputs and the results area.
```

The result should already use the neon colors, typed data, and keyboard accessibility — because the instructions applied automatically. Commit your instruction files.

---

## Section 3: Create Custom Agents

Custom instructions shape *every* matching prompt. **Custom agents** go further — they're reusable specialists you switch into on demand. Same prompt, expert output.

An agent is a Markdown file with a `.agent.md` extension: YAML frontmatter (metadata) plus a persona written in Markdown. Both VS Code and Copilot CLI read the **same** files from `.github/agents/`.

### Task 1: Build a Retro UI Reviewer

Ask Copilot to create `.github/agents/retro-ui-reviewer.agent.md`:

```text
Create a custom agent at `.github/agents/retro-ui-reviewer.agent.md` that specializes in reviewing UI for retro arcade themes. It should focus on neon aesthetics (dark #0a0a1a, green #5fed83, purple #8a2be2), animation quality, consistency, and how new elements match the arcade theme.
```

### Task 2: Build an Accessibility Auditor

Ask Copilot to create `.github/agents/a11y-auditor.agent.md`:

```text
Create a custom agent at `.github/agents/a11y-auditor.agent.md` that audits for WCAG 2.1 AA compliance, checking keyboard navigation, color contrast, ARIA labels, screen-reader announcements, and prefers-reduced-motion support.
```

After Copilot creates the agent files, use `/diff` to review what was generated.

### Task 3: Put Your Specialists to Work


List and switch agents with `/agent`, or launch straight into one:

```text
/agent a11y-auditor
```

```text
Audit @src/pages/index.astro for accessibility issues.
```

To switch mid-session, run `/agent` again and pick another specialist (or **no agent** to return to the default experience). Agent selection is **session-scoped** — a new session starts fresh.

```text
/agent retro-ui-reviewer
```

```
Review the battle page styling and flag anything that drifts from the arcade theme.
```




### Task 4: Specialist vs Generic — See the Difference

Run the **same** prompt twice: once in the default experience, once with `retro-ui-reviewer` selected.

```text
Add a small "rematch" button below the results.
```

The default answer works. The specialist version keeps the palette, adds hover/focus states, and matches the animation style — because the expertise is baked into the agent. Commit your agent files once you're happy.

> 💡 **YAML quick reference:** `description` is the important field — it tells Copilot when the agent is useful. `tools` is optional (omit it to allow all tools); use aliases like `read`, `edit`, `search`, `execute`. The `model` property is honored in VS Code and ignored by the CLI, so cross-platform agent files are safe.

---

## Check your understanding

When is a custom agent a better fit than custom instructions?

<details>
<summary>Check your answer</summary>

Custom instructions provide always-on guidance for work in their scope. A custom agent is an optional specialist with its own context, tools, and role, which makes it better for focused delegated work such as a security review or accessibility audit. The two can work together: instructions preserve project conventions while the agent supplies task-specific expertise.

**Go deeper:** [Compare Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features).

</details>

## ✅ Part 6 Complete

You've learned how to:

- Recognize the **built-in agents** (`/plan`, `/review`, `/rubber-duck`, `/security-review`, Explore, Task)
- Add **path-specific instructions** with `applyTo` so rules apply only where they belong
- Build and switch between **custom agents** that carry your project's expertise
- Prove the value of specialists by comparing generic vs. agent-guided output

> **Next:** In Part 7 you'll package repeatable expertise as **Skills** that Copilot loads automatically when your prompt matches.
