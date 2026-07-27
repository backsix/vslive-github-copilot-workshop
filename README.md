# VS Live Redmond · GitHub Copilot Workshop

One guided site for four hands-on labs with Kayla Cinnamon and James Montemagno:

1. GitHub Copilot CLI
2. GitHub Copilot app
3. Visual Studio 2026
4. GitHub Copilot SDK

## Run the site

```console
npm install
npm run dev
```

## Validate

```console
npm run check
npm run build
```

## Refresh workshop sources

Imports are pinned in `workshops.sources.json`.

```console
npm run import:workshops
```

Review every imported diff and run the complete validation after changing a pin. Runnable snapshots for the CLI, Visual Studio, and SDK labs live in `labs/`; the Copilot app lab uses the separate [Tailspin Toys template](https://github.com/github-samples/tailspin-toys). Normalized website content lives in `src/content/docs/labs/`.
