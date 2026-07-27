---
title: "Part 1: Setup & Context Engineering"
---

In this part you'll set up your development environment **and** teach Copilot about the codebase — so every future prompt starts with the right context.

## Section 1: Initial Setup

### Step 1: Open the CLI Lab

From the workshop repository root, open a terminal in the included starter:

```bash
cd labs/01-copilot-cli
```

Keep your work in this folder. If you forked the workshop repository during [Step 0](../../../prepare/#step-0-fork-or-clone-the-workshop), your changes can be committed and pushed back to that fork.




### Step 2: Install GitHub Copilot CLI

Use the installation path that matches your machine:

- **npm (cross-platform, requires Node.js 22+)**

  ```bash
  npm install -g @github/copilot
  ```

- **Homebrew (macOS/Linux)**

  ```bash
  brew install copilot-cli
  ```

- **WinGet (Windows)**

  ```bash
  winget install GitHub.Copilot
  ```

### Step 3: Start the App and Authenticate the CLI

1. In the terminal already open at `labs/01-copilot-cli`, install dependencies and start the app:

   ```bash
   npm install
   npm run dev
   ```

2. Open a **second terminal** in the same folder and start Copilot CLI:

   ```bash
   copilot
   ```

3. In the interactive session, enter:

   ```
   /login
   ```

4. Follow the device flow prompts, then confirm that you trust the repository when the CLI asks for approval.

> ✅ **You now have the app preview in one terminal and Copilot CLI ready in another.**


## Section 2: Context Engineering

Context engineering is how you teach AI about your codebase. The better the context, the better every future response will be.




### Task 1: Generate Repository Instructions with /init

Let's use `/init` to generate a workspace instructions file for Copilot:

1. In Copilot CLI, type:

   ```
   /init simple instructions with a project overview, build/dev commands, and Astro best practices, (ignore the workshop).
   ```

2. Review the generated file — Copilot will analyze your project and create a `.github/copilot-instructions.md`.
3. Commit the instructions file.

> **Result:** Future CLI sessions automatically inherit repository-specific instructions from `.github/copilot-instructions.md`.

### Task 2: Tune Your CLI Environment

Practice the CLI controls that make later steps smoother:

1. Run `/help` to scan the available slash commands.
2. Use `/model` to inspect the models available to you.
3. If Copilot has learned too many approvals during experimentation, reset them with:

   ```
   /reset-allowed-tools
   ```

4. If your repository lives inside a larger parent directory, use `/add-dir PATH` to explicitly widen the allowed workspace.
5. Turn on cross-session memory with `/memory` so Copilot remembers useful facts about how you work, and use `/instructions` to see which instruction files are loaded.

> 💡 The CLI docs recommend concise custom instructions plus explicit tool permissions so Copilot stays fast and predictable.

### Task 3: Explore the Project from the Terminal

Try these prompts inside Copilot CLI:

- `Give me an overview of this project.`
- `@src/pages/api/contributions/[username].ts What is this file for and what needs to be built here?`
- `@src/pages/index.astro What exists here and what would I need to add to build the battle page?`

If you want a quick one-shot answer outside the interactive session, try:

```bash
copilot -p "Summarize the architecture of this repo in 5 bullet points"
```

> **Result:** You now have instructions, command awareness, and a feel for how to feed files into Copilot CLI context.


## Check your understanding

When should you use a path-specific instruction file instead of `.github/copilot-instructions.md`?

<details>
<summary>Check your answer</summary>

Use `.github/copilot-instructions.md` for project-wide rules that should shape every request, such as build commands and repository conventions. Use a file under `.github/instructions/` with an `applyTo` glob when guidance only matters for certain paths or file types. Keeping specialized rules scoped avoids loading irrelevant context into every conversation.

**Go deeper:** [Add custom instructions for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions).

</details>

## ✅ Part 1 Complete

You've learned how to:

- **Set up** the repo and local development environment
- **Generate instructions** with `/init` so Copilot understands your project and design direction
- **Establish a review habit** before applying generated changes
- **Explore the codebase** with context-rich prompts
