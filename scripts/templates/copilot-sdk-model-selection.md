---
title: "Optional: Compare models"
---

> **Time:** 10 minutes
> **Prerequisite:** Complete the seven core steps first.

## What you'll compare

Step 1 introduced `ModelSelector`, which lists the models available to your signed-in account and
stores the selected model ID in `selectedModel`. Every session configuration in the workshop uses
that value through `Model = selectedModel`.

## Try a different model

Run the completed application again:

```bash
dotnet run --project workshop-app
```

Choose a different number when the picker lists available models, then enter the workshop target
URL. The application architecture, local tools, MCP configuration, and permission policy remain
the same; only the model assigned to the session changes.

## What selection changes

Model choice can affect latency, capability, and billing. It does not grant new tools or change
the browser permission boundary. Keep tool allowlists and permission handling identical while you
compare the response.

<details>
<summary>Troubleshooting this extension</summary>

| Symptom | Fix |
|---|---|
| No models are listed | The helper falls back to the account default; verify authentication if this is unexpected. |
| A number is outside the range | The helper safely uses the first model. |
| Tools disappear | Keep `Model = selectedModel` alongside the existing `Tools`, `McpServers`, and `OnPermissionRequest` settings. |

</details>

> **The extension is complete when:** you can name the selected model and explain why the same
> scoped tools and permissions still apply.

## Check your understanding

What does choosing a model change, and what does it leave unchanged?

<details>
<summary>Check your answer</summary>

It selects the model used by a `CopilotSession`, which can affect the response and latency. It does
not change the client connection, application-owned tools, MCP server configuration, or permission
boundary.

</details>

Return to [Step 7: Run and explain the application](../07-run-explain/).
