---
title: "Step 1: Create your first Copilot session"
---

> **Time:** 10 minutes

## What you'll build

You'll connect the console application to the Copilot runtime, create a conversation, send a
prompt, and print the response.

## Meet the GitHub Copilot SDK and runtime

The **GitHub Copilot SDK** is the .NET API your application uses to run Copilot as an agent. The
**Copilot runtime** receives prompts, calls models, and manages tools. `CopilotClient` connects your
C# code to that runtime.

A `CopilotSession` represents one continuing conversation. It holds the messages and tool results
that make up the conversation's context. Keep one client alive for the application, then create a
session for each independent conversation.

## Why clients and sessions stay separate

Keeping those responsibilities separate lets the runtime connection outlive any one conversation.
It also gives you a small working example before streaming and tools enter the picture.

At this point, the console app is simply `CopilotClient -> CopilotSession -> model response`.

## Fire up your first Copilot session

Open `workshop-app/Program.cs`. Build the program in the following small additions so you can see where each responsibility belongs.

### 1. Import the SDK and add a heading

Replace the starter file contents with:

```csharp
using GitHub.Copilot;

Console.WriteLine("=== First Copilot session ===\n");
```

`using GitHub.Copilot;` makes the SDK types available. The heading separates the workshop output from the commands you run in the terminal.

### 2. Connect to the Copilot runtime

Add this below the heading:

```csharp
await using var client = new CopilotClient();
await client.StartAsync();
```

`CopilotClient` manages the application-wide connection to the local Copilot CLI runtime. `StartAsync` launches or connects to that runtime before any requests are sent.

### 3. Confirm the connection

Add this next:

```csharp
var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}");

var selectedModel = await ModelSelector.SelectAsync(client);
```

`PingAsync` performs a lightweight health check, giving you an immediate confirmation that the app can reach Copilot. Print the returned message so connection failures are obvious before you create a session.

### 4. Choose a model for the session

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

The helper asks the runtime which models your signed-in account can use, shows each model's display name, and returns the selected model ID. If no list is available, it returns `null`, which keeps the account default. Invalid input falls back to the first listed model so this learning example always has a predictable choice.

Back in `Program.cs`, add the helper namespace and select the model after the connection check:

```csharp
using HelloCopilotSDK.Helpers;

// Add this after the PingAsync output.
var selectedModel = await ModelSelector.SelectAsync(client);
```

The selected ID is configuration for every session you create. Keep this variable in later steps and pass it into each new `SessionConfig`.

### 5. Create a conversation and send a prompt

Add the session and request:

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Model = selectedModel,
    Model = selectedModel
});
var response = await session.SendAndWaitAsync(
    "In one sentence, explain why an accessible name matters for a form input.");
```

A `CopilotSession` owns one conversation and its context. `Model` selects the model for that session, while `SendAndWaitAsync` sends the prompt and waits until the session is idle.

### 6. Check and print the response

Finish the program with:

```csharp
if (response is null)
{
    throw new InvalidOperationException("Copilot completed without an assistant message.");
}

Console.WriteLine($"\nCopilot: {response.Data.Content}");
```

The guard fails clearly if Copilot finishes without an assistant message. Otherwise, print the message content so you can inspect the response in the terminal.

## Run it

```bash
dotnet run --project workshop-app
```

Your exact response will vary, but the output should have this shape:

```text
=== First Copilot session ===

Connected to the Copilot runtime: ...

Copilot: An accessible name lets assistive technology identify the input's purpose.
```

<details>
<summary>Troubleshooting this run</summary>

| Symptom | Fix |
|---|---|
| Authentication or authorization error | Run `copilot login` again, then rerun the project. |
| Runtime executable not found | Set `COPILOT_CLI_BINARY_PATH` using the preflight instructions. |
| The request times out | Check network access to GitHub Copilot and retry; this example does not hide the failure. |

</details>

> **You're ready for streaming when:** the terminal prints one complete Copilot response.

## Check your understanding

Which object should usually live for the application lifetime, and which object owns one
conversation's context?

<details>
<summary>Check your answer</summary>

Keep `CopilotClient` for the lifetime of the runtime connection. A `CopilotSession` owns the
messages and tool context for one conversation.

</details>

<details>
<summary>Complete Step 1 checkpoint</summary>

To compare your work with a complete project, open the
[`checkpoints/01-first-session`](https://github.com/jamesmontemagno/copilot-sdk-workshop/tree/main/checkpoints/01-first-session)
checkpoint.

```csharp
using GitHub.Copilot;
using HelloCopilotSDK.Helpers;

Console.WriteLine("=== First Copilot session ===\n");

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}");

var selectedModel = await ModelSelector.SelectAsync(client);

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Model = selectedModel
});
var response = await session.SendAndWaitAsync(
    "In one sentence, explain why an accessible name matters for a form input.");

if (response is null)
{
    throw new InvalidOperationException("Copilot completed without an assistant message.");
}

Console.WriteLine($"\nCopilot: {response.Data.Content}");
```

</details>

Continue to [Step 2: Stream a response](../02-streaming/).
