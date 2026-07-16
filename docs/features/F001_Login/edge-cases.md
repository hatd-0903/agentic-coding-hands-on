# Edge Cases — login (SAA 2025 Login Screen)

| Scenario | What Happens | User-Facing Message |
|----------|--------------|-----------------------|
| Authenticated user opens `/login` directly | Client guard redirects to `/todo` before the Login screen renders | "None — silent redirect" |
| Unauthenticated user opens `/todo` directly | Client guard redirects to `/login` | "None — silent redirect" |
| User logs out then revisits a previously authenticated page | Redirected back to the Login Screen | "None — silent redirect" |
| Logo in header is clicked or hovered | No action — logo is static, non-interactive at any window size | "None — silent handling" |
| Language selector is clicked | Dropdown opens showing VN/EN options; selector shows hover highlight and pointer cursor before click | "None — visual affordance only" |
| No `NEXT_LOCALE` cookie present (first visit) | UI defaults to Vietnamese; selector shows VN flag + "VN" + chevron | "None — default applied silently" |
| Footer is scrolled past, hovered, or clicked | Footer stays fixed at the bottom and is non-interactive regardless of scroll position or clicks | "None — silent handling" |
| "LOGIN With Google" button is hovered | Button shows a shadow/elevated visual effect; no state change | "None — visual affordance only" |
| "LOGIN With Google" button is clicked | Google OAuth flow starts; button becomes disabled and shows a loading indicator until the flow resolves | "None — loading indicator shown on button" |
| "LOGIN With Google" is double-clicked while already submitting | Second click is a no-op; button remains disabled during the in-flight OAuth request | "None — button disabled" |
| Google OAuth succeeds with a valid Google account | User info is returned, session is established, user is redirected to the Todo Screen | "None — redirect to app home" |
| Google OAuth fails or the user cancels the Google consent screen | Button returns to its normal clickable state; no session is created | "Đăng nhập không thành công. Vui lòng thử lại." |
