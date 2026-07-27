---
title: "Part 2: Plan & Scaffold"
---


# Part 2: Plan & Scaffold

---

Before writing any code, let's use Copilot's planning workflows to think through the architecture. Planning first helps you design better systems and gives Copilot the context it needs to generate higher-quality code.

## Task 1: Plan the API Architecture




1. Enter **plan mode** in Copilot CLI by pressing **Shift+Tab** until the mode changes, or by using `/plan`.

   > 💡 Need to gather facts first? Run `/research` to have Copilot investigate the GitHub contributions API and Astro patterns using GitHub search and the web before you plan.


2. Enter this prompt:

   ```
   I need to build a server-side API proxy that fetches GitHub contribution data
   for any username. The endpoint is https://github.com/{username}.contribs which
   returns JSON. We need to bypass CORS restrictions. Plan the implementation
   including the route structure, error handling, and caching strategy.
   ```

3. **Review the plan** — this is where planning shines. Don't just accept the first response:
   - Ask for clarifications on anything unclear
   - Suggest changes if something doesn't feel right
   - Iterate until you're satisfied with the approach




4. Once you're happy with the plan, tell Copilot CLI to proceed with implementation.
5. Review the resulting file edits with `/diff` before approving them.


6. **Result:** You should now have an API route created at:

   ```
   src/pages/api/contributions/[username].ts
   ```

## Task 2: Test the API

> **⚠️ Not seeing changes?** If the dev server doesn't pick up the new route, stop it (`Ctrl+C`) and restart with `npm run dev`.

1. Make sure your dev server is running, then test the endpoint:

   ```bash
   curl http://localhost:4321/api/contributions/octocat
   ```

2. You should see JSON with contribution data returned.
3. Test the error case too — try an invalid username and confirm it returns an appropriate error response.

## Task 3: Plan the Battle Page




1. Stay in plan mode (or run `/plan`) and enter this prompt:


   ```
   Now I need the main page. Plan the static scaffold for a battle page titled
   "Mona Mayhem - GitHub Contribution Battle Arena" with: two username inputs
   (Player 1 and Player 2), a Battle button, and an empty results container.

   Scope for this step — scaffold only. Plan the HTML structure and minimal,
   functional styling. Do NOT plan or add any JavaScript, data fetching,
   validation, or graph rendering yet, and leave the Battle button as a
   placeholder with no click behavior — we wire that up in Part 3.
   ```

2. **Review and iterate** on the plan — ask questions, suggest changes, refine the approach.




3. When you're satisfied, have Copilot CLI implement the approved plan — the static scaffold only.
4. Use `/diff` again to inspect the HTML and CSS scaffolding before approving.


## Task 4: Verify the Scaffold

> **⚠️ Not seeing changes?** If the page doesn't look right or hasn't updated, stop the dev server (`Ctrl+C`) and restart with `npm run dev`, then refresh your browser.

1. Open http://localhost:4321 in your browser.
2. You should see:
   - The game title
   - Two username input fields (Player 1 and Player 2)
   - A battle button
3. The button won't work yet — that's expected! We haven't wired up the interaction logic; that comes in Part 3. If Copilot already added the fetch/render logic or heavy theming, it jumped ahead — undo those extras (or revert the file) so Parts 3 and 4 land as designed.

---

## ✅ Part 2 Complete!

You've learned how to:

- **Plan before coding** instead of jumping straight into implementation
- **Iterate on plans** until the architecture feels right
- **Move from plan to implementation** with a clearer, safer workflow
