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
| [Visual Studio Code](https://code.visualstudio.com/) | Labs 1 and 4 | `code --version` |
| [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) | Labs 3 and 4 | `dotnet --version` |
| [Visual Studio 2026](https://visualstudio.microsoft.com/vs/) | Lab 3 | Open Visual Studio |
| Edge or Chrome | Browser-based verification | Open the browser once |

## Visual Studio 2026 setup

On Windows, open the Visual Studio Installer and confirm the **ASP.NET and web development** workload is installed. Sign in to GitHub Copilot inside Visual Studio before the workshop.

## Verify Copilot CLI

```console
copilot --version
copilot login
```

Complete the browser authentication flow. If your organization restricts Copilot, use a personal GitHub account with Copilot access for the workshop.

## Step 0: Fork or clone the workshop

Do this once before starting the labs. **Forking is recommended** because it gives you a repository where you can push changes, create pull requests, and use cloud agents.

1. Open the [workshop repository](https://github.com/jamesmontemagno/vslive-github-copilot-workshop).
2. Select **Fork**, then create the fork in your personal GitHub account.
3. Clone your fork and enter the workshop folder:

   ```bash
   git clone https://github.com/YOUR-GITHUB-HANDLE/vslive-github-copilot-workshop.git
   cd vslive-github-copilot-workshop
   ```

If you only want to work locally, clone the source repository directly instead:

```bash
git clone https://github.com/jamesmontemagno/vslive-github-copilot-workshop.git
cd vslive-github-copilot-workshop
```

The included starters are under `labs/`:

```text
labs/
├── 01-copilot-cli/
├── 03-visual-studio/
└── 04-copilot-sdk/
```

## Open the project for each lab

Start each lab from the cloned workshop folder. Use [Visual Studio Code](https://code.visualstudio.com/) for the CLI and SDK labs, and [Visual Studio](https://visualstudio.microsoft.com/vs/) for the Visual Studio lab:

| Lab | Open this project |
|---|---|
| Copilot CLI | Open a terminal in `labs/01-copilot-cli` and run `copilot` |
| Copilot app | Create a separate repository from the [Tailspin Toys template](https://github.com/github-samples/tailspin-toys), then open it in the Copilot app |
| Visual Studio 2026 | Open `labs/03-visual-studio/src/TinyShop.sln` in [Visual Studio](https://visualstudio.microsoft.com/vs/) |
| Copilot SDK | Open `labs/04-copilot-sdk` in your editor and terminal |

Tailspin Toys is intentionally separate because the Copilot app exercises use its repository-backed issues, branches, and pull requests. Its Lesson 0 walks you through creating that repository.

## Quick preflight

Before arriving, confirm:

1. `git`, `node`, `copilot`, and `dotnet` return versions without errors.
2. You can authenticate with GitHub and Copilot.
3. Visual Studio 2026 opens the solution at `labs/03-visual-studio/src/TinyShop.sln`.
4. You cloned the workshop repository and can find its three included starter folders.
5. You can access the separate Tailspin Toys template repository.

When everything is ready, [begin with the Copilot CLI lab](/labs/cli/).
