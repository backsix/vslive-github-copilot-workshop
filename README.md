# VS Live Redmond · GitHub Copilot Workshop

[Open the live workshop site](https://jamesmontemagno.github.io/vslive-github-copilot-workshop/)

This is the unified hands-on workshop for VS Live Redmond with Kayla Cinnamon and James Montemagno.
It brings four GitHub Copilot experiences into one guided site, so attendees can move from using
Copilot in the terminal to building an agent-powered application.

## Workshop path

The workshop is designed as a progressive, practical day of learning:

1. **Kickoff** — A short look at the state of GitHub Copilot and what is now possible.
2. **GitHub Copilot CLI** — Use Copilot from the terminal to plan, scaffold, refine, and automate
   software work.
3. **GitHub Copilot app** — Practice the software development lifecycle with the Copilot app,
   including planning, agent work, code review, and extensibility.
4. **Visual Studio 2026** — Explore GitHub Copilot features in Visual Studio, from completions and
   chat through MCP, planning, and cloud delegation.
5. **GitHub Copilot SDK** — Build a .NET accessibility-review application that combines a Copilot
   session, local tools, Playwright MCP, and structured reporting.

Each lesson includes prerequisites, hands-on instructions, progress tracking, and selected
knowledge checks. Complete the tracks in order for the intended progression, or use the navigation
to revisit a specific capability.

## What you need

- A GitHub account with Copilot Free or a paid Copilot plan.
- Node.js 22 or 24.
- Git and a modern browser.
- Visual Studio Code for the CLI, Copilot app, and SDK labs.
- Visual Studio 2026 with the web workload for the Visual Studio lab. This lab requires Windows.

The workshop pages contain the current product and installation links for each track.

## Repository layout

| Path | Purpose |
| --- | --- |
| `src/content/docs/` | The published workshop lessons and supporting pages. |
| `labs/01-copilot-cli/` | Runnable GitHub Copilot CLI lab content. |
| `labs/03-visual-studio/` | Visual Studio 2026 lab solution and source. |
| `labs/04-copilot-sdk/` | Copilot SDK starters, checkpoints, samples, and target application. |
| `public/target-app/` | The intentionally flawed accessibility target used by the SDK exercises. |
| `scripts/` | Content validation and reproducible workshop-import tooling. |

The Copilot app lab intentionally uses the separate
[Tailspin Toys template](https://github.com/github-samples/tailspin-toys) rather than vendoring
that application in this repository.

## Workshop sources

The combined content is based on pinned upstream workshop sources listed in
`workshops.sources.json`. The import process normalizes them for this event and preserves
event-specific curriculum additions.

```console
npm run import:workshops
```

Review every imported diff and run the full validation after changing a source pin.

## Live workshop

The published workshop is available at
[jamesmontemagno.github.io/vslive-github-copilot-workshop](https://jamesmontemagno.github.io/vslive-github-copilot-workshop/).

## Run locally

```console
npm install
npm run dev
```

To validate a local build:

```console
npm run check
npm run build
```
