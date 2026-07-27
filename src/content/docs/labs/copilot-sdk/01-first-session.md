---
title: "Step 1: Create your first Copilot session"
---

# Step 1: Create your first Copilot session

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

Open `workshop-app/Program.cs` and **replace the entire file**:

```csharp
using GitHub.Copilot;

Console.WriteLine("=== First Copilot session ===\n");

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}");

await using var session = await client.CreateSessionAsync(new SessionConfig());
var response = await session.SendAndWaitAsync(
    "In one sentence, explain why an accessible name matters for a form input.");

if (response is null)
{
    throw new InvalidOperationException("Copilot completed without an assistant message.");
}

Console.WriteLine($"\nCopilot: {response.Data.Content}");
```

`PingAsync` checks the runtime connection. `SendAndWaitAsync` sends the prompt and returns after the
session becomes idle, so it works well when you only need the completed answer.

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

Console.WriteLine("=== First Copilot session ===\n");

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}");

await using var session = await client.CreateSessionAsync(new SessionConfig());
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
