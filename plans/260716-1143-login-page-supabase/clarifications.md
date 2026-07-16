# Clarifications — Login Page (SAA 2025)

MoMorph refs:
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- fileKey: 9ypp4enmFmdK3YAFJLIu6C | screenId: GzbNeVGJHz | figma_node_id: 662:14387

## Session 2026-07-16
- Q: Google OAuth credentials on local Supabase (no [auth.external.google] configured) → A: Wire from env (GOOGLE_CLIENT_ID/SECRET), update .env.example; user supplies real creds to complete live round-trip
- Q: i18n scope for VN/EN language selector (NEXT_LOCALE cookie, default VN) → A: Full VN/EN i18n infra (next-intl) with login message files and working selector
- Q: Routing/protection for /todo redirect and authed-user redirect → A: Placeholder /todo page + Supabase middleware (authed on /login → /todo; unauthed on /todo → /login)
- Q: Brand asset sourcing (hero wave, Sun* logo, flag, Google icon) → A: Download exact hero + logo from MoMorph; Google icon + VN flag as inline SVG
- Q: SDD mode (project-wide) → A: On
- Q: Spec/doc language → A: English
