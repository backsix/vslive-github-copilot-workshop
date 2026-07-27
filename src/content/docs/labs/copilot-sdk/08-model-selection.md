---
title: "Optional: Select a model"
---

# Optional: Select a model

> **Time:** 10 minutes  
> **Prerequisite:** Complete the seven core steps first.

## What you'll customize

You'll list the models available to the signed-in user and use the selected model for the report
session.

## How model selection works

The Copilot runtime may expose more than one model. `ListModelsAsync` returns the models available
for the current account. `SessionConfig.Model` selects one when you create a session.

## Swap models without changing the architecture

Changing the model can affect latency, capability, and billing. It does not change the local tools,
MCP configuration, or permission policy, which is why this topic comes after the core architecture.

Model selection configures `CopilotSession`. It does not replace the client or either tool boundary.

## Add a model picker

Create `workshop-app/Helpers/ModelSelector.cs`:

```csharp
using GitHub.Copilot;

namespace HelloCopilotSDK.Helpers;

public static class ModelSelector
{
    public static async Task<string?> SelectAsync(CopilotClient client)
    {
        var models = (await client.ListModelsAsync())?.ToList();
        if (models is null || models.Count is 0)
        {
            Console.WriteLine("No model list was returned; using the account default.");
            return null;
        }

        Console.WriteLine("Available models:");
        for (var index = 0; index < models.Count; index++)
        {
            Console.WriteLine($"{index + 1}. {models[index].Name}");
        }

        Console.Write($"Choose 1-{models.Count} [1]: ");
        var valid = int.TryParse(Console.ReadLine(), out var choice) &&
                    choice >= 1 &&
                    choice <= models.Count;
        var selected = models[(valid ? choice : 1) - 1];

        Console.WriteLine($"Using {selected.Name}\n");
        return selected.Id;
    }
}
```

After `PingAsync` in `Program.cs`, insert:

```csharp
var selectedModel = await ModelSelector.SelectAsync(client);
```

Then add `Model = selectedModel` to `SessionConfig`:

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Model = selectedModel,
    Streaming = true,
    // Keep the existing permission, local-tool, and MCP configuration.
});
```

Do not remove the rest of the Step 6 session configuration.

## Run it

```bash
dotnet run --project workshop-app
```

Choose a model, enter the workshop target URL, and confirm the same scoped tools still run.

<details>
<summary>Troubleshooting this extension</summary>

| Symptom | Fix |
|---|---|
| No models are listed | The helper falls back to the account default; verify authentication if this is unexpected. |
| A number is outside the range | The helper safely uses the first model. |
| Tools disappear | Add only `Model = selectedModel`; retain `Tools`, `McpServers`, and `OnPermissionRequest`. |

</details>

> **The extension is complete when:** the selected model is named and the report still uses both
> scoped tool types.

## Check your understanding

Why was model selection moved out of Step 1?

<details>
<summary>Check your answer</summary>

Model selection is configuration rather than a core agent concept. Leaving it until the end gets
you to a useful Copilot response sooner and keeps the first lesson focused on clients and sessions.

</details>

Return to [Step 7: Run and explain the application](../07-run-explain/).
