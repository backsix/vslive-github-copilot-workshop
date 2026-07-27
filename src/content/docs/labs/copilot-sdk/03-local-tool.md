---
title: "Step 3: Add application-owned knowledge"
---

> **Time:** 15 minutes

## What you'll add

You'll give Copilot a typed C# function that retrieves an exact criterion and remediation from the
application-owned Web Content Accessibility Guidelines (WCAG) catalog.

## Give Copilot a tool your app owns

**Tool calling** lets the model request a capability while it works on an answer. A **local tool**
is a C# function that runs inside your application process. The model decides when to request it,
but your code still owns the data, validation, execution, and result.

The starter already has the domain data in `AccessibilityRuleCatalog.Rules`. You'll add a lookup
over that array, then expose it with `CopilotTool.DefineTool`.

## Bring your own source of truth

The model's general knowledge is not a substitute for data your application owns. A local tool
returns a small, exact result from deterministic C# code you can test, rather than putting the full
catalog in every prompt.

The session can now call `accessibility_rule_lookup` inside the console application's process.

## Wire up the WCAG lookup

### 1. Add the catalog lookup tool

At the top of `workshop-app/Helpers/AccessibilityRuleCatalog.cs`, insert:

```csharp
using System.ComponentModel;
using GitHub.Copilot;
using Microsoft.Extensions.AI;
```

Inside `AccessibilityRuleCatalog`, after the existing `Rules` array, insert:

```csharp
public static AIFunction CreateLookupTool() => CopilotTool.DefineTool(
    ([Description("The accessibility issue or WCAG criterion to look up.")] string query) =>
        Task.FromResult(Lookup(query)),
    toolOptions: new CopilotToolOptions { SkipPermission = true },
    factoryOptions: new AIFunctionFactoryOptions
    {
        Name = "accessibility_rule_lookup",
        Description = "Looks up read-only WCAG guidance maintained by this application."
    });

public static AccessibilityRule Lookup(string query)
{
    var normalizedQuery = query.Trim();
    return Rules.FirstOrDefault(rule =>
               normalizedQuery.Contains(rule.Criterion, StringComparison.OrdinalIgnoreCase) ||
               normalizedQuery.Contains(rule.Title, StringComparison.OrdinalIgnoreCase) ||
               rule.Keywords.Any(keyword =>
                   normalizedQuery.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
           ?? new AccessibilityRule(
               "No exact match",
               "Criterion not found",
               "The issue is not represented in the workshop catalog.",
               "Verify the evidence and consult the complete WCAG reference.",
               []);
}
```

`SkipPermission = true` is deliberate because the tool only reads data owned by the application.
The external MCP process in the next step will use a permission boundary instead.

### 2. Show tool activity

In `ResponseStreamer.cs`, insert these cases before `SessionIdleEvent`:

```csharp
case ToolExecutionStartEvent tool:
    Console.WriteLine($"\n[tool:start] {tool.Data.ToolName}");
    break;
case ToolExecutionCompleteEvent tool:
    Console.WriteLine($"[tool:done] success={tool.Data.Success}");
    break;
```

### 3. Register and request the tool

Replace the session configuration and send call in `Program.cs`:

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Streaming = true,
    Tools = [AccessibilityRuleCatalog.CreateLookupTool()],
    AvailableTools = ["accessibility_rule_lookup"]
});

Console.WriteLine("\nCopilot:");
await ResponseStreamer.SendAndPrintAsync(
    session,
    "Use accessibility_rule_lookup to explain how to fix an input with no accessible name.");
```

## Run it

```bash
dotnet run --project workshop-app
```

Look for the tool name and its mapping to 4.1.2:

```text
[tool:start] accessibility_rule_lookup
[tool:done] success=True

WCAG 4.1.2 Name, Role, Value ...
```

The prose can vary; the criterion and catalog recommendation should not.

<details>
<summary>Troubleshooting this run</summary>

| Symptom | Fix |
|---|---|
| No tool event appears | Keep the explicit `Use accessibility_rule_lookup` instruction in this learning checkpoint. |
| The compiler cannot find `AIFunction` | Add `using Microsoft.Extensions.AI;` to the catalog file. |
| The result says no exact match | Confirm the prompt contains `accessible name`, a keyword in the starter data. |

</details>

> **You're ready for Playwright when:** the terminal names `accessibility_rule_lookup` and the
> answer uses criterion 4.1.2 from the catalog.

## Check your understanding

Should calculating an order total from application-owned line items be a local tool or an MCP
server?

<details>
<summary>Check your answer</summary>

Usually a local tool. The application owns the line items and the deterministic calculation, so an
in-process function is easier to test and does not cross a process boundary.

</details>

<details>
<summary>Complete Step 3 checkpoint</summary>

You can compare your version with the
[`checkpoints/03-local-tool`](https://github.com/jamesmontemagno/copilot-sdk-workshop/tree/main/checkpoints/03-local-tool)
project.

```csharp
using GitHub.Copilot;
using HelloCopilotSDK.Helpers;

Console.WriteLine("=== Application-owned WCAG guidance ===\n");

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}\n");

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Streaming = true,
    Tools = [AccessibilityRuleCatalog.CreateLookupTool()],
    AvailableTools = ["accessibility_rule_lookup"]
});

Console.WriteLine("Copilot:");
await ResponseStreamer.SendAndPrintAsync(
    session,
    "Use accessibility_rule_lookup to explain how to fix an input with no accessible name.");
```

</details>

Continue to [Step 4: Connect an external tool safely](../04-mcp-safety/).
