# Account Signup Readiness (MadeInVT Public Beta)

## Current status

MadeInVT public beta account flows now support real Supabase-backed signup/login when configured, and show explicit disabled messaging when auth is not configured.

## What works

- `/signup`
  - Name, email, password, confirm password, and account type (Maker/Studio/Partner).
  - Server-side validation for required fields, password length (8+), password match, and valid account type.
  - Creates real Supabase auth users (no mock success).
  - Shows confirmation guidance: check email before login when email confirmation is required.
- `/login`
  - Email/password login via Supabase.
  - Magic-link login via Supabase.
  - Redirects to `/partner-portal` after successful auth.
- `/logout`
  - Clears owner auth cookie and attempts Supabase sign-out.
- `/forgot-password`
  - Sends reset email through Supabase when configured.
- `/reset-password`
  - Updates password for authenticated reset sessions.
- `/maker-portal`
  - Redirects to `/partner-portal`.
- `/partner-portal`
  - Public-friendly access messaging.
  - Logged-out users see login/signup prompt.
  - Logged-in users with no approved profile see "No approved maker profiles yet" + CTA.
  - Logged-in users with approved ownership mappings see owner dashboard placeholders.
  - Edit request API enforces ownership checks server-side.

## Required Supabase/auth environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL=https://madeinvt.com`
- `NEXT_PUBLIC_SITE_URL=https://madeinvt.com`

## Required email environment variables (claim and workflow notifications)

- `RESEND_API_KEY`
- `CLAIMS_EMAIL_FROM`
- `PARTNERS_EMAIL_TO` (or fallback `CLAIMS_ADMIN_EMAIL`)
- `BASECAMP_ADMIN_EMAILS` (for Basecamp claim reviewer allowlist)

## Auth flow

1. User signs up on `/signup`.
2. Supabase creates auth user and sends confirmation email.
3. User confirms email (if Supabase confirmation is enabled).
4. User logs in on `/login` (password or magic link).
5. Auth callback sets owner session cookie and redirects to `/partner-portal`.

## Email confirmation behavior

- Signup route uses Supabase `signUp` with `emailRedirectTo` callback.
- If session is not returned immediately, UI directs user to confirm email before login.

## Password reset behavior

1. User requests reset from `/forgot-password`.
2. Supabase sends reset email with callback to `/auth/callback?next=/reset-password`.
3. After callback verification, user sets a new password on `/reset-password`.
4. User logs in with new credentials.

## Portal access rules

- Not logged in: show login/signup prompts.
- Logged in + no approved owner-profile mapping: show no-approved-profile state and support CTA.
- Logged in + approved mapping: show only owned profile data placeholders.
- No cross-owner data exposure is allowed by portal APIs.

## Claim-to-owner readiness

- Claim submission and Basecamp review are live with service-role-backed persistence.
- Approval tries to link auth user by claimant email into `business_listing_owners`.
- If no matching auth user exists at approval time, automatic mapping is not completed and manual support is still required.
- UI and docs should continue to communicate that full self-service claim-to-owner linking is still partially manual during beta.

## Not-configured behavior (intentional)

When Supabase auth is not configured, public auth surfaces do **not** fake success:

- `/signup`, `/login`, `/forgot-password`, and callback-related flows show clear "accounts not enabled yet" messaging.
- Users are directed to `partners@madeinvt.com` for early access support.
