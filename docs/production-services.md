# MadeInVT Production Services Setup

This runbook covers production setup for Supabase Auth, claim-owner linking, and Resend email delivery.

## Supabase setup

1. Create a Supabase project named `compass-production`.
2. Copy the project URL.
3. Copy the anon key.
4. Copy the service role key.
5. Add redirect URLs:
   - `https://madeinvt.com/auth/callback`
   - `https://www.madeinvt.com/auth/callback`
   - `http://localhost:3000/auth/callback`
6. Enable email confirmation.
7. Apply migrations.

## Vercel environment variables

Set these in Vercel for Preview and Production:

```bash
NEXT_PUBLIC_APP_URL=https://madeinvt.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
CONTACT_EMAIL_FROM="MadeInVT <hello@madeinvt.com>"
CLAIMS_EMAIL_FROM="MadeInVT <partners@madeinvt.com>"
GENERAL_EMAIL_TO=hello@madeinvt.com
PARTNERS_EMAIL_TO=partners@madeinvt.com
PRESS_EMAIL_TO=press@madeinvt.com
```

## Resend setup

- Verify `madeinvt.com` as the sending domain in Resend.
- Confirm sender addresses are valid:
  - `MadeInVT <hello@madeinvt.com>`
  - `MadeInVT <partners@madeinvt.com>`
- Send a test contact form submission.
- Send a test claim notification.

## Operational notes

- Signup/login/magic-link/reset emails are sent by Supabase Auth.
- Resend is used for contact and claim notification workflows.
- If Resend is missing, contact/claim APIs return `503` and must not fake success.
- Deferred claim-owner linking runs on claim approval and again on signup/login for matching approved claimant emails.
