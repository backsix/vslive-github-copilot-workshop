# Workshop checkpoints

Each directory captures the complete, compiling state of `workshop-app` after the matching core
step. The first three projects link unchanged starter helpers, which keeps the focus on code added
so far. Later checkpoints contain every source file directly.

From the repository root, build every checkpoint with:

```bash
for project in checkpoints/*/*.csproj; do dotnet build "$project"; done
```

You can also find the finished application in
[`samples/accessibility-report`](../samples/accessibility-report).
