---
title: "Part 8: MCP Servers — Connect Copilot to Live Data & Tools"
---

So far Copilot only sees what you hand it: files you `@`-mention and its own training data. **MCP servers** change that. The [Model Context Protocol](https://modelcontextprotocol.io/) is an open standard that connects Copilot to real, live tools — your GitHub repos, a real browser, up-to-date documentation, and more.

Think of MCP servers like **browser extensions**. Your browser is useful on its own, but a password manager, a grammar checker, and a screenshot tool make it a powerhouse. MCP does the same for Copilot.

This is a perfect fit for Mona Mayhem — an app *about* GitHub data — so let's start with the server you already have.

---

## Section 1: The Built-in GitHub MCP Server

The **GitHub MCP server is built in**. Because you logged in during Part 1, it already works — no configuration needed.

### Task 1: Confirm It's Connected


```text
/mcp
```

`/mcp` (or `/mcp show`) lists your configured servers and whether they're enabled. You should see **github** as enabled. If not, run `/login` to re-authenticate.




### Task 2: Explore Real GitHub Data

Because Mona Mayhem compares GitHub contributions, live repo data is right at home. Try:

```text
List the last 5 commits in this repository.
```

```text
Summarize the open issues in this repository and suggest which one to tackle first.
```

```text
Search this repository for where contribution colors are rendered.
```

> 💡 **The difference MCP makes:** Without it, Copilot would say *"I don't have access to GitHub."* With it, Copilot reads your actual repo, issues, and PRs on demand.

---

## Section 2: Add a Browser with the Playwright MCP Server

The GitHub server is one of many. Let's add the **Playwright MCP server** so Copilot can drive a **real browser** — and end-to-end test the battle page you built.

> **⚠️ Keep your dev server running.** Playwright needs the app live at `http://localhost:4321`. Run `npm run dev` in a separate terminal.

### Task 1: Configure the Server


The easiest path is the built-in registry — run `/mcp` and use the search/add flow, no JSON required. To configure it by hand instead, create `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "tools": ["*"]
    }
  }
}
```

Copilot CLI reads MCP config from `.mcp.json` and `.github/mcp.json` in your project, or `~/.copilot/mcp-config.json` for all projects. Restart Copilot after editing, then run `/mcp` to confirm **playwright** is enabled.




### Task 2: Test the Battle Page in a Real Browser

Now let Copilot *use* the browser to verify your app end-to-end:

```text
Using the Playwright browser, open http://localhost:4321, enter "octocat" as Player 1
and "torvalds" as Player 2, click Battle, and confirm both contribution graphs render.
Report what you see and take a screenshot.
```

Copilot will open a browser, fill the inputs, click the button, and describe the result — a genuine end-to-end test driven by natural language. Try an error case too:

```text
With the Playwright browser, submit the battle with both fields empty and confirm the
validation error appears with the arcade styling.
```

> 💡 This pairs beautifully with the `a11y-auditor` agent from Part 6 — audit the markup *and* verify the live behavior.

---

## Section 3: Add Up-to-Date Docs with Context7 (Optional)

Model training data goes stale. The **Context7 MCP server** fetches current library documentation on demand — handy for Astro APIs.


Add it to your `.mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "tools": ["*"]
    }
  }
}
```




Then ask a version-specific question:

```text
Using Context7, show the current Astro API route syntax and confirm my
src/pages/api/contributions/[username].ts endpoint follows it.
```

---

## Section 4: Multi-Server Workflows

The real power comes from **combining** servers in a single request. With GitHub, Playwright, and Context7 connected, Copilot can chain them:

```text
1. Use GitHub to check whether the battle page changed in the last few commits.
2. Use Context7 to confirm the Astro syntax I'm using is current.
3. Use the Playwright browser to run octocat vs torvalds and confirm it still works.
Then give me a short go/no-go summary.
```


**Managing servers.** Use `/mcp` inside a session, or the `copilot mcp` command from your terminal:

```bash
copilot mcp list       # list configured servers
copilot mcp add        # add a server through a guided flow
```

You can also install servers and their skills in one step with `/plugin install <owner>/<repo>` (for example, `microsoftdocs/mcp` for Microsoft Learn docs).




> ⚠️ **Trust matters:** Local MCP servers run code on your machine. Only add servers from sources you trust, and review their configuration before starting them.

Commit your MCP configuration so your team shares the same connected tools.

---

## Check your understanding

Why should you review and limit an MCP server before connecting it to Copilot CLI?

<details>
<summary>Check your answer</summary>

A local MCP server runs code on your machine and exposes tools that Copilot can call with your account permissions. A malicious or compromised server could read sensitive files or take unintended actions, so treat it like any executable dependency: verify its publisher and source, then enable only the tools needed for the task. Sandboxing adds another boundary when trust is uncertain.

**Go deeper:** [Add MCP servers to Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers).

</details>

## ✅ Part 8 Complete

You've learned how to:

- Use the **built-in GitHub MCP server** to explore live repo, issue, and commit data
- Add the **Playwright MCP server** and run **end-to-end browser tests** in plain language
- Pull **current documentation** on demand with Context7
- **Combine multiple servers** into a single workflow, and manage them via `/mcp` or the gallery

> **Next:** Part 9 collects open-ended **bonus challenges** — put your agents, skills, and MCP servers to work extending Mona Mayhem.
