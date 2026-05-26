# WORKLOG — shared agent log (Claude + Codex)

Append-only diary. **Newest entries on top.** Read this before starting a task; write
here whenever you finish something, decide something, or find a bug.

**Entry format:**

```
## [YYYY-MM-DD HH:MM] — <Claude|Codex> — <short title>
- **What:** what was done / found / decided
- **Files:** files touched (if any)
- **Next / open:** next step or open question
```

---

## [2026-05-26] — Claude — Supabase project + schema created
- **What:** Created dedicated Supabase project **cha-panelas-isana** (ref
  `fwhnsizxqthbugviraoo`, sa-east-1, free $0/mo) and applied migration `initial_schema`:
  tables `users`, `cart_items`, `orders`, `order_items`, `reserved_items`,
  `login_codes` — all RLS-enabled (API uses the **service_role** key, which bypasses
  RLS; no anon/public access).
- **Schema notes:** dropped legacy `password_hash` (OTP-only auth now).
  `reserved_items.order_id` is now `on delete cascade` (cancelling/deleting an order
  auto-frees the gift). Gift items stay in code for now (not yet a DB table).
- **Next / open:** Vercel access, Cloudflare token, email service still pending. The
  code migration (Express routes → `/api/*` serverless + Supabase client + JWT cookie
  auth) can start now; split with Codex per the AGENTS.md workstreams.

## [2026-05-26] — Claude — Coordination set up + Supabase MCP confirmed

- **What:** Read Codex's `AGENTS.md`, `MEMORY.md` and `docs/deployment-plan.md` and
  aligned with them. Added the mandatory **logging rule** to `AGENTS.md`, created
  `CLAUDE.md`, and created this `WORKLOG.md` as the shared diary both agents must use.
- **Supabase:** MCP **is** available (Codex couldn't see it before). Existing project
  **"juda"** (`titpyhocbzvnzlieckde`, sa-east-1) belongs to ANOTHER system
  (tenants/sales, 915 rows) → **do NOT use it.** Need a dedicated project for the chá.
- **Decision:** backend target = **Option A** (Vercel serverless API + Supabase
  Postgres). Sessions must become **stateless JWT in an httpOnly cookie**
  (express-session can't run on Vercel serverless).
- **Files:** `AGENTS.md`, `CLAUDE.md`, `MEMORY.md`, `WORKLOG.md`.
- **Next / open (blockers awaiting the couple):**
  1. Confirm creating a **dedicated Supabase project** for the chá.
  2. **Vercel** access (connect the GitHub repo / CLI token).
  3. **Cloudflare** API token for the Isana zone (to create DNS records).
  4. **Email** service decision for the OTP code (ZeptoMail/Resend/SMTP).
  Once unblocked: create schema migration → port API routes to `/api/*` → wire
  Supabase client + JWT auth → deploy to Vercel → point Cloudflare DNS.
