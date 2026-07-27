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
```

`PingAsync` performs a lightweight health check, giving you an immediate confirmation that the app can reach Copilot. Print the returned message so connection failures are obvious before you create a session.

### 4. Create a conversation and send a prompt

Add the session and request:

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig());
var response = await session.SendAndWaitAsync(
    "In one sentence, explain why an accessible name matters for a form input.");
```

A `CopilotSession` owns one conversation and its context. With an empty `SessionConfig`, the runtime uses your account's default model. `SendAndWaitAsync` sends the prompt and waits until the session is idle.

### 5. Check and print the response

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

## Choose a model and run it again

Your first run used the account default, so you could confirm the runtime connection without making
another choice. Now add an explicit model selection for the next run.

### 1. Add the model picker

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

The helper asks the runtime which models your signed-in account can use, displays their names, and
returns the selected model ID. If the runtime returns no list, it returns `null` so the account
default remains in effect. Invalid input uses the first listed model.

### 2. Create the next session with that model

In `Program.cs`, add the helper namespace and select a model after the connection check:

```csharp
using HelloCopilotSDK.Helpers;

var selectedModel = await ModelSelector.SelectAsync(client);
```

Then replace the empty session configuration:

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Model = selectedModel
});
```

A model is selected when a session is created, so keep the existing first session code as your
working starting point, update its configuration, and rerun the application.

## Run it again

```bash
dotnet run --project workshop-app
```

Choose a model when prompted, then confirm the terminal prints a Copilot response again. Keep
`selectedModel` and `Model = selectedModel` as you continue through the later lessons.

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
