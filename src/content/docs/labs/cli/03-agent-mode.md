---
title: "Part 3: Build the Game with Agentic Workflows"
---

# Part 3: Build the Game with Agentic Workflows

---

This part is where Copilot goes from planner to implementer. Instead of writing code line by line, you describe what you want and let Copilot carry out the work across the files it needs to change.

## Task 1: Wire Up the Battle




1. Return Copilot CLI to its standard coding flow. Prefer hands-off execution? Toggle `/autopilot` and Copilot keeps making edits until the task is done or you stop it with `Esc`.
2. Mention the page file for extra context if helpful: `@src/pages/index.astro`
3. Enter this prompt:


   > Add client-side JavaScript to the battle page that:
   > 1. When the Battle button is clicked, gets both usernames from the inputs
   > 2. Validates both are filled (show error if not)
   > 3. Fetches both users' contribution data in parallel from our API
   > 4. Renders contribution graphs as colored grids — each day is a colored square using GitHub's color palette
   > 5. Shows a VS badge between the two users
   > 6. Displays username, total contributions, and date range for each user
   > 7. Handles loading states and errors
   > 8. Also triggers on Enter key in input fields.
   > 9. Keep the existing simple scaffold — do NOT add retro/arcade theming, animations, responsive design, or other visual polish yet. Those come in later parts; focus only on making the battle work.
   >
   > Use TypeScript interfaces for the contribution data structure.




4. Let Copilot CLI work through the implementation across `src/pages/index.astro`.
5. Use `/diff` to inspect the generated changes, then approve them.


## Task 2: Test the Battle

> **⚠️ Not seeing changes?** If the battle page hasn't updated, stop the dev server (`Ctrl+C`) and restart with `npm run dev`, then refresh your browser.

1. Enter `octocat` and `torvalds` as the two usernames, then click **Battle**.
2. You should see both contribution graphs rendered side by side with colored grids.
3. Test error cases:
   - Leave one or both fields empty and click Battle — you should see a validation error.
   - Enter an invalid username — the app should display an error from the API.
4. Test pressing **Enter** in either input field — it should trigger the battle just like clicking the button.

## Task 3: Iterate with Copilot

If anything isn't quite right, give Copilot follow-up feedback directly. For example:

- *"The contribution squares are too large, make them 12x12px"*
- *"Add a hover tooltip showing the date and contribution count"*
- *"The loading state needs a pulse animation"*




Copilot CLI sessions keep their history, so each follow-up prompt builds on the last one. Use `/session` or `/context` if you want to inspect what Copilot is carrying forward, and `/review` after a larger iteration if you want an extra pass for bugs or polish.


## Tips for This Part

- **Be specific about what you want** — clear requirements lead to better results.
- **Stay in scope** — this part is about *behavior*, not looks. If Copilot starts theming the page, adding animations, or making it responsive, rein it back; that's Parts 4–5.
- **Break down large tasks into smaller prompts** if Copilot goes off track.
- **Review changes before accepting** — generated code is faster to inspect than to rewrite later.
- **Test the app immediately after each implementation pass** so issues stay localized.

## ✅ Part 3 Complete

You've learned how to:

- Use Copilot for **multi-file implementation work**
- **Iterate on results** with focused follow-up prompts
- Handle the **full feature loop** — implementation, review, testing, and refinement
