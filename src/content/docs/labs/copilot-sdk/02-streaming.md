---
title: "Step 2: Stream a response"
---

# Step 2: Stream a response

> **Time:** 10 minutes

## What you'll see

Response text will arrive while the session is still working, and the application will know when
the turn has finished.

## How streaming changes the experience

**Streaming** does not change the answer. It changes when your application receives it. Instead of
waiting for one completed message, the session emits events throughout the turn:

- `AssistantMessageDeltaEvent` contains each new piece of response text.
- `AssistantMessageEvent` contains the completed message.
- `SessionIdleEvent` means the turn and any tool work have finished.
- `SessionErrorEvent` reports a failed turn.

## Why progressive output feels better

Seeing text arrive makes the application feel more responsive. Later, the same event stream will
show activity from local and MCP tools.

The session flow is now `response deltas -> final message -> idle`.

## Let the response roll in

### 1. Add the streaming helper

Create `workshop-app/Helpers/ResponseStreamer.cs`:

```csharp
using GitHub.Copilot;

namespace HelloCopilotSDK.Helpers;

public static class ResponseStreamer
{
    public static async Task SendAndPrintAsync(CopilotSession session, string prompt)
    {
        var completed = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var receivedDelta = false;

        using var subscription = session.On<SessionEvent>(sessionEvent =>
        {
            switch (sessionEvent)
            {
                case AssistantMessageDeltaEvent delta when !string.IsNullOrEmpty(delta.Data.DeltaContent):
                    receivedDelta = true;
                    Console.Write(delta.Data.DeltaContent);
                    break;
                case AssistantMessageEvent message when !receivedDelta:
                    Console.Write(message.Data.Content);
                    break;
                case SessionIdleEvent:
                    Console.WriteLine();
                    completed.TrySetResult();
                    break;
                case SessionErrorEvent error:
                    completed.TrySetException(new InvalidOperationException(error.Data.Message));
                    break;
            }
        });

        await session.SendAsync(new MessageOptions { Prompt = prompt });
        await completed.Task;
    }
}
```

The final-message case handles a runtime that completes without sending deltas. An error completes
the task with an exception instead of looking like a successful turn.

### 2. Use the helper

In `Program.cs`, add `using HelloCopilotSDK.Helpers;`, then replace the session and response code
with:

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Streaming = true
});

Console.WriteLine("\nCopilot:");
await ResponseStreamer.SendAndPrintAsync(
    session,
    "Explain accessible names in three short bullet points.");
```

## Run it

```bash
dotnet run --project workshop-app
```

The bullets should start appearing before the process exits:

```text
Connected to the Copilot runtime: ...

Copilot:
- Gives a control a programmatic identity.
- Helps screen-reader users understand its purpose.
- Connects visible labels to form controls.
```

<details>
<summary>Troubleshooting this run</summary>

| Symptom | Fix |
|---|---|
| Text appears only at the end | Confirm `Streaming = true` is in this session's `SessionConfig`. |
| The application exits before text appears | Confirm the helper awaits `completed.Task` after `SendAsync`. |
| Text is printed twice | Keep the `when !receivedDelta` guard on `AssistantMessageEvent`. |

</details>

> **You're ready to add tools when:** response text appears before the full answer is complete.

## Check your understanding

When would `SendAndWaitAsync` be a better choice than event streaming?

<details>
<summary>Check your answer</summary>

Use `SendAndWaitAsync` for background work or simple request/response code that does not need
progressive output or intermediate events.

</details>

<details>
<summary>Complete Step 2 checkpoint</summary>

The completed Step 2 project is in
[`checkpoints/02-streaming`](https://github.com/jamesmontemagno/copilot-sdk-workshop/tree/main/checkpoints/02-streaming).

```csharp
using GitHub.Copilot;
using HelloCopilotSDK.Helpers;

Console.WriteLine("=== Streaming from Copilot ===\n");

await using var client = new CopilotClient();
await client.StartAsync();

var ping = await client.PingAsync("workshop");
Console.WriteLine($"Connected to the Copilot runtime: {ping.Message}\n");

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    Streaming = true
});

Console.WriteLine("Copilot:");
await ResponseStreamer.SendAndPrintAsync(
    session,
    "Explain accessible names in three short bullet points.");
```

</details>

Continue to [Step 3: Add application-owned knowledge](../03-local-tool/).
