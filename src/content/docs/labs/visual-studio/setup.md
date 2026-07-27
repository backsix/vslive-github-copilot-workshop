---
title: "Workshop Setup"
---

To complete this workshop you will need [Visual Studio 2026](https://visualstudio.microsoft.com/vs/), the [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0), and a GitHub account with access to GitHub Copilot.

## Prerequisites

Before starting, ensure you have:

- [Visual Studio 2026](https://visualstudio.microsoft.com/vs/) with the GitHub Copilot extension installed
- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0) installed
- **GitHub account** with one of the following:
  - [GitHub Copilot Free](https://github.com/features/copilot) - Free tier with limited usage
  - [GitHub Copilot Pro/Pro+/Max](https://github.com/features/copilot) - Full access
  - GitHub Copilot through your organization

> [!TIP]
> If you don't have GitHub Copilot yet, you can [sign up for Copilot Free](https://github.com/features/copilot) or start a [free trial of Copilot Pro](https://github.com/github-copilot/signup).

## Install .github + MCP Extension

Before we begin, let's install the .github + MCP extension for Visual Studio. This extension provides access to GitHub MCP servers which we will use later in the lab.

1. [ ] Open Visual Studio 2026
1. [ ] Go to **Extensions -> Manage Extensions**
1. [ ] Search for **.github + MCP** in the search box
1. [ ] Click **Install** on the **.github + MCP** extension by Mads Kristensen
1. [ ] Restart Visual Studio if prompted

> [!TIP]
> You can also install this extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.GitHubNode). The .github + MCP extension is important because it provides the Node.js runtime required by some MCP servers, which you'll use in Part 9 of this lab.

## Sign in to GitHub Copilot

1. [ ] Open your browser and go to `https://github.com`.
1. [ ] Sign in with your GitHub account or create a new account if you don't have one.
1. [ ] Open Visual Studio 2026.
1. [ ] Select **Continue without code**. If prompted to sign-in, you can click Close.
1. [ ] Click the Copilot icon on the top bar (left side next to the search input box).
1. [ ] Click **Sign in to use Copilot**.
1. [ ] A browser window will open prompting you to sign in to GitHub and authorize Visual Studio and Copilot. Complete the sign-in and click **Authorize** when prompted.
1. [ ] When the browser shows the confirmation, click **Open** to return to Visual Studio.
1. [ ] After setup you should see the **GitHub Copilot Walkthrough** tab and the Copilot button should be green.

Part 12 delegates work to a cloud agent and requires a fork where you have write access. If you cloned the source repository directly during [Step 0](../../../prepare/#step-0-fork-or-clone-the-workshop), create your fork before starting Part 12.

## Turn on Copilot Settings

1. [ ] Ensure Code Completions and Next Edit Suggestions are enabled:
   - Go to the Code Completions settings in Visual Studio by heading to **Tools -> Options -> Text Editor -> Inline Suggestions -> General** under Suggestion Providers
   - Ensure **Copilot Completions** is checked.
   - Ensure **Copilot Next Edit Suggestions** is checked.

   ![](./images/0-enable-nes.png)

1. [ ] Head to **Tools -> Options -> GitHub -> Copilot -> Copilot Chat** and ensure the following settings are enabled:
   - **Enable Agent mode in chat pane**
   - **Enable MCP server integration in agent mode**
   - **Enable Planning**
   - **Enable Ask Question**
   - **Enable View Plan Execution**
   - **Enable Cloud agent (Preview)**
   - **Enable custom instructions**

1. [ ] Head to **Tools -> Options -> GitHub -> Editor** and ensure the following settings are enabled:
   - **Enable AI generated description for auto-inserted documentation comments in support languages**

## Open the included lab solution

The TinyShop source is already included in the workshop repository you cloned during Step 0.

1. [ ] In Visual Studio, select **File -> Open -> Project/Solution**.
2. [ ] From your cloned workshop folder, open `labs/03-visual-studio/src/TinyShop.sln`.

## Start the App

1. [ ] Open the **Solution Explorer** from the **View -> Solution Explorer** menu.
1. [ ] Set the **TinyShop.AppHost** as the startup project if it isn't already by right-clicking on **TinyShop.AppHost** and selecting **Set as Startup Project**. Start the project with F5 or **Debug -> Start Debugging** from the menu.

    The [Aspire](https://aspire.dev) AppHost will start two applications and the  Aspire Dashboard:

    - The backend .NET app on **https://localhost:7130/api/Product**
    - The frontend Blazor app on **https://localhost:7085** - You can see the app by opening that URL from the dashboard

1. [ ] Stop debugging and close the application.

## Summary and Next Steps

You've now set up your environment and cloned the repository you'll use for the rest of the workshop. Let's start exploring GitHub Copilot!

---

[Next: Part 00 - Exploring the Codebase](../part00-exploring-codebase/)
