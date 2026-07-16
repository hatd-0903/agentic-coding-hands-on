# Business Context — login (SAA 2025 Login Screen)

## Why It Matters

The Sun* Annual Awards 2025 "ROOT FURTHER" app needs a single, welcoming entry point that lets
anyone with a Google account sign in without friction — no separate account creation, no password
to manage.

## Who Uses It

- **SAA 2025 participant / visitor** — arrives at the login screen, signs in with their existing
  Google account, and moves on into the app.
- **Returning signed-in user** — should never see the login screen again on repeat visits; they
  are carried straight through to the app's home.

## What They Do

1. Visitor opens the Login screen and sees the "ROOT FURTHER" branding, a short welcome message,
   and a single "LOGIN With Google" button.
2. Visitor optionally switches the interface language between Vietnamese (default) and English
   using the selector in the top-right corner — their choice is remembered for next time.
3. Visitor clicks "LOGIN With Google" — the button shows a loading state while Google confirms
   their identity.
4. On success, the visitor is taken into the app's home area.
5. If sign-in fails or the visitor backs out of the Google prompt, they see a plain message asking
   them to try again, and can retry immediately.
6. A visitor who is already signed in and tries to revisit the login screen is sent straight to
   the app's home instead — they never see the login screen twice.

## Unresolved Questions

- **Account eligibility**: Any Google account can sign in — is this intentional for the long run,
  or should access later be limited to Sun* company accounts once the event scope is clearer?
