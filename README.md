# Khmer Stone Sculpture Archive

## 1. What this is

A living archive of traditional Khmer stone sculpture — the techniques, tools, materials, and motifs of carving — built from museum catalog records. Anyone can browse and search the published collection; a logged-in contributor can add an entry with a photo, which waits for review; a reviewer can publish or return it; the owner can edit or delete their own. The sentence I'd say to a stranger: it's a small, community-facing archive where the collection is public, but nothing goes on the public shelf until a human says it's ready.

## 2. Who it's for

Khmer-speaking visitors and contributors, and the people who hold the knowledge (museum staff, artisans). Decisions made for them:

- **Khmer first** — the site runs in English or ភាសាខ្មែរ (a header toggle, remembered in a cookie; `<html lang>` follows it), Khmer titles render on every card and in the review queue, and Noto Khmer fonts are loaded so Khmer never falls back to whatever the device happens to have.
- **Phones first** — every page is checked at ~320px wide; the header wraps, the home hero stacks, and touch targets are at least 44px tall.
- **Slow connections** — home images stream through `next/image` optimization; the entry page shows the photo at its true proportions.
- **Source before opinion** — every entry carries its museum `source`, shown alongside period, material, and location.

## 3. How it works

Next.js 15 (App Router) on Vercel. Supabase provides email/password accounts, Postgres, and the `photos` storage bucket. (The source of truth for the SQL is the Supabase dashboard — there are **no `.sql` files in this repo**.)

- **Tables:** `entries` (id, created_at, title, title_km, description, location, source, material, period, photo_url, owner → auth.users, status, contributor_name) and `reviewers` (user_id → auth.users).
- **Statuses:** `pending` → `published` | `returned`.
- **Database functions:** `is_reviewer()` and `review_entry(entry_id, decision)`.
- **Row Level Security:**
  - read: anyone reads `published`; an owner sees their own rows; reviewers see everything;
  - insert: only the owner, and only with `status = 'pending'` — a self-published row is refused by the database;
  - update: only the owner, and it must stay `pending` unless the editor is a reviewer;
  - delete: only the owner.
  - `reviewers` has RLS on and no policies — only the SQL editor writes to it.
  - `photos`: public read; uploads go only into the uploader's own folder (`<user id>/<uuid>.<extension>`).

## 4. Security decisions

- **The gate is the database.** `review_entry` is SECURITY DEFINER: it refuses anyone not in `reviewers`, accepts only `published`/`returned`, and only touches rows that are `pending`. A hidden Publish button protects nothing, so the queue never updates a table directly — it calls the RPC and counts success only when `data === true` (a refusal returns `false` without an error).
- **Decisions the brief left to me:** a returned entry reads *"Returned for changes"* in plain words on `/my-entries`, and re-editing sends it back to `pending`. A reviewer may keep a published entry published when they edit it. There is **no takedown function** — a published entry stays published unless its owner edits it (back to review) or deletes it; I chose not to add a reviewer "unpublish" path. A contributor sees their own pending/returned entries on `/my-entries`; the public home shows only `published`.

## 5. AI use

Built with Cline (VS Code coding agent). The table lists the model, the task, what I kept, and what I rewrote.

| Model | Task | What I kept / rewrote | Verdict |
| --- | --- | --- | --- |
| DeepSeek V4 Flash | Gate SQL and RLS policies | Kept as written, after I re-ran the five console attacks from a stranger account | Keep — all five refused |
| DeepSeek V4 Flash | `/review` review-queue page and the contribute/auth flows | Kept, after reading the diff against the brief's own checks | Keep |
| DeepSeek V4 Flash | Visual rework (design tokens, Noto Khmer fonts, bilingual strings, loading/empty/error states) | Rewrote the Khmer wording and status labels; moved the accent/error colors into tokens | Keep, corrected |
| DeepSeek V4 Flash | Contributor "credit" | Rewrote: the AI shipped it as an email address; I removed it after review day | Removed |
| DeepSeek V4 Flash | Attack probes and the drafting of this README and my write-ups | Ran the probes; read every draft against my own code | Keep with review |

How I checked: read every diff against the brief's own checks, ran the app, ran the two-account console attacks, and had a partner review the live gate. The things that passed reading but failed running: a silent cookie-write fallback, upload order around validation, and the email-based credit.

## 6. Sources and credits

Entries are sourced from catalog records of the **National Museum of Cambodia** and the **Kompong Thom Provincial Museum**, named per entry and shown in each `source` field. Archive curator: Buntha Soth.

## 7. Running it locally

```
git clone <repo-url>
npm install
# create .env.local with the two variables below
npm run dev
```

Environment variables, by name only: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Both are public by design (`NEXT_PUBLIC_` values ship to the browser). Never put the service-role key in any file. Build note: fonts load from Google Fonts via `next/font`, so `npm run build` needs network; if a build fails with a `next/font` "Cannot read properties of null" error, that is the font fetch failing, not the code.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, (URL)
- A stranger cannot publish their own entry through the page or the console: yes, tested (date)
- Logged out, the API returns nothing pending or returned: yes, tested (date)
- Contributors can edit and delete only their own entries: yes
- No secrets anywhere in the repo history: yes, checked with a `git log --all -p` scan
- At least eight real entries, each with a credited source: yes, (count)
- Khmer renders on every screen a user meets, including the queue: yes
- Works at phone width: yes, tested on (device or width)
- No test entries, lorem ipsum or TODO comments in shipped pages: UNSURE — verify
- No console errors on the main pages: UNSURE — verify
- jesseorndorff is a collaborator on this repo: UNSURE — confirm on GitHub
- Supabase project restored and awake on (date)
- Demo video link opens in a private window: yes, (link)
- Reflection pasted in the Canvas submission: yes
- Posted in the Show Your Archive discussion: yes
- Q&A slot booked for (date and time)