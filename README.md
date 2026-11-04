# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## This copy

This repo is the 2026-10-04 export plus one page and what it takes to render it.

- The new page is `src/routes/kb/incidents/4471/problems/+page.svx`. It splits #4471 into the three problems filed as issues #1, #2 and #3.
- Its logic is in `src/lib/kb/problems.ts` and `src/lib/kb/ProblemTable.svelte`. The issue links are in `src/lib/data/tickets-4471.json`.
- The page as the desk sees it is `rendered/kb/incidents/4471/problems.html`, a single HTML file with the CSS inlined, plus a screenshot next to it.
- `package.json`, `vite.config.js`, `src/app.html` and `src/routes/+layout.js` are the build. The export shipped without them.

To build it yourself, run `npm install`, then `npm run build`. The site goes to `build/`.
