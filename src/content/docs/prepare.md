---
title: "Prepare for the workshop"
description: "Install and verify everything needed for the four VS Live GitHub Copilot labs."
---

Complete this checklist before Friday. Labs 1, 2, and 4 work on Windows, macOS, or Linux. **Lab 3 requires Windows and Visual Studio 2026.**

## Accounts and access

- [ ] A personal GitHub account (preferred)
- [ ] GitHub Copilot Free or a paid Copilot plan
- [ ] Permission to create repositories and pull requests in your account
- [ ] Git configured with your GitHub identity

## Required tools

| Tool | Required for | Verify |
|---|---|---|
| [Git](https://git-scm.com/downloads) | All labs | `git --version` |
| [Node.js 22 or 24](https://nodejs.org/) | Labs 1, 2, and 4 | `node --version` |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Labs 1 and 4 | `copilot --version` |
| [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) | Labs 3 and 4 | `dotnet --version` |
| Visual Studio 2026 | Lab 3 | Open Visual Studio |
| Edge or Chrome | Browser-based verification | Open the browser once |

## Visual Studio 2026 setup

On Windows, open the Visual Studio Installer and confirm the **ASP.NET and web development** workload is installed. Sign in to GitHub Copilot inside Visual Studio before the workshop.

## Verify Copilot CLI

```console
copilot --version
copilot login
```

Complete the browser authentication flow. If your organization restricts Copilot, use a personal GitHub account with Copilot access for the workshop.

## Get the workshop repository

Clone or download this repository. Each runnable starter is under `labs/`:

```text
labs/
├── 01-copilot-cli/
├── 03-visual-studio/
└── 04-copilot-sdk/
```

The Copilot app exercises use repository-backed issues, branches, and pull requests. Lesson 0 guides you through creating your own repository from the separate [Tailspin Toys template](https://github.com/github-samples/tailspin-toys).

## Quick preflight

Before arriving, confirm:

1. `git`, `node`, `copilot`, and `dotnet` return versions without errors.
2. You can authenticate with GitHub and Copilot.
3. Visual Studio 2026 opens the solution at `labs/03-visual-studio/src/TinyShop.sln`.
4. You can find the three included `labs/` starter folders and access the Tailspin Toys template repository.

When everything is ready, [begin with the Copilot CLI lab](./labs/cli/).
