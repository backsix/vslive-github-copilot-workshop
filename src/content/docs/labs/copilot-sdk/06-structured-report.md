---
title: "Step 6: Produce a structured report"
---

> **Time:** 10 minutes

## What you'll produce

You'll produce a concise report that separates page evidence, criterion mapping, remediation, and
the limits of the review.

## Separate evidence from interpretation

An agent response contains **evidence** and **interpretation**. Evidence is what Playwright
observed, such as an input with no accessible name. Interpretation is the criterion mapping and
remediation based on that evidence and the catalog result.

A clear output contract tells the agent what to include, what to leave out, and how to handle
uncertainty. It makes reports more consistent without claiming that the review is exhaustive.

## Be useful without overstating the result

One automated snapshot cannot establish accessibility conformance. The report should stick to
high-confidence findings without invented statistics, decorative severity labels, or a broad claim
that the page passes or fails WCAG.

The agent now turns `browser evidence + catalog result` into a bounded, repeatable report.

## Give the report a contract

### 1. Add the report contract

Create `workshop-app/Helpers/Prompts.cs`:

```csharp
namespace HelloCopilotSDK.Helpers;

public static class Prompts
{
    public static string CreateReportPrompt(Uri targetUri) => $"""
        Prepare an evidence-based accessibility review of {targetUri.AbsoluteUri}.

        1. Use browser_navigate to open that exact URL.
        2. Call read_latest_accessibility_snapshot to inspect its accessibility tree.
        3. Identify three to five high-confidence issues supported by the snapshot.
        4. Call accessibility_rule_lookup for each issue before recommending a fix.

        Return only this structure:

        # Accessibility review
        ## Finding 1: <short name>
        - Evidence: <specific element or page structure observed in the browser>
        - WCAG criterion: <criterion and title returned by the catalog>
        - Recommended remediation: <specific implementation change>

        Repeat the finding section as needed.

        ## Review limits
        State that this is a focused review of browser-observable evidence, not a full WCAG conformance audit.

        Do not invent evidence, report unsupported statistics, or claim the page is WCAG compliant.
        """;
}
```

### 2. Use the contract

Replace the final send call in `Program.cs`:

```csharp
Console.WriteLine($"\nAnalyzing: {targetUri.AbsoluteUri}\n");
await ResponseStreamer.SendAndPrintAsync(session, Prompts.CreateReportPrompt(targetUri));
```

## Run it

```bash
dotnet run --project workshop-app
```

When the app asks for a URL, paste:

```text
https://jamesmontemagno.github.io/copilot-sdk-workshop/target-app/
```

The report should follow this shape:

```text
# Accessibility review
## Finding 1: Input has no accessible name
- Evidence: The snapshot contains a textbox with no accessible name.
- WCAG criterion: 4.1.2 Name, Role, Value
- Recommended remediation: Associate a visible label using matching for and id values.

## Review limits
This focused review uses browser-observable evidence and is not a full WCAG conformance audit.
```

<details>
<summary>Troubleshooting this run</summary>

| Symptom | Fix |
|---|---|
| The output contains unsupported counts | Confirm the prompt says not to report unsupported statistics. |
| A finding has no concrete element or structure | Treat it as ungrounded; keep the evidence requirement in the report contract. |
| The response claims WCAG compliance | Keep the required **Review limits** section and explicit prohibition. |

</details>

> **You're ready for the final run when:** each finding contains specific browser evidence, a
> catalog criterion, and a remediation, and the report ends with its limits.

## Check your understanding

In the report, which content is direct evidence and which content is model interpretation?

<details>
<summary>Check your answer</summary>

The element or page structure returned by Playwright is evidence. Choosing the criterion and
writing the remediation are interpretations based on that evidence and the catalog result.

</details>

<details>
<summary>Complete Step 6 checkpoint</summary>

For comparison, use the
[`checkpoints/06-structured-report`](https://github.com/jamesmontemagno/copilot-sdk-workshop/tree/main/checkpoints/06-structured-report)
project. The completed application is also in
[`samples/accessibility-report`](https://github.com/jamesmontemagno/copilot-sdk-workshop/tree/main/samples/accessibility-report).

```csharp
using GitHub.Copilot;
using HelloCopilotSDK.Helpers;

Console.WriteLine("=== Accessibility Report Generator ===\n");

Console.Write("Enter URL to analyze: ");
var urlInput = Console.ReadLine()?.Trim();

if (string.IsNullOrWhiteSpace(urlInput))
{
    Console.Error.WriteLine("Enter a URL to analyze.");
    return;
}

if (!urlInput.Contains("://", StringComparison.Ordinal))
{
    urlInput = $"https://{urlInput}";
}

if (!Uri.TryCreate(urlInput, UriKind.Absolute, out var targetUri) ||
    targetUri.Scheme is not ("http" or "https"))
{
    Console.Error.WriteLine("Enter an absolute HTTP or HTTPS URL.");
    return;
}

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"\nConnected to the Copilot runtime: {ping.Message}\n");

var workingDirectory = Directory.GetCurrentDirectory();

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Streaming = true,
    OnPermissionRequest = WorkshopPermissionHandler.CreateForTarget(targetUri),
    Tools =
    [
        AccessibilityRuleCatalog.CreateLookupTool(),
        PlaywrightSnapshotReader.CreateTool(workingDirectory)
    ],
    AvailableTools =
    [
        "accessibility_rule_lookup",
        "read_latest_accessibility_snapshot",
        "playwright-browser_navigate"
    ],
    McpServers = new Dictionary<string, McpServerConfig>
    {
        ["playwright"] = new McpStdioServerConfig
        {
            Command = "npx",
            Args = ["-y", "@playwright/mcp@0.0.78", "--browser=msedge"],
            WorkingDirectory = workingDirectory,
            Tools = ["browser_navigate"]
        }
    }
});

Console.WriteLine($"Analyzing: {targetUri.AbsoluteUri}\n");
await ResponseStreamer.SendAndPrintAsync(session, Prompts.CreateReportPrompt(targetUri));
```

</details>

Continue to [Step 7: Run and explain the application](../07-run-explain/).
