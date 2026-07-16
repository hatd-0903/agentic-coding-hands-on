# Screens — login (SAA 2025 Login Screen)

## Screen List

| Screen Name | SCR### | What User Sees | What User Can Do |
|-------------|--------|-----------------|-------------------|
| Login Screen | SCR-login (TBD (draft) — allocated at promote) | Dark hero background with colorful decorative wave art, "ROOT FURTHER" title, welcome subtitle/tagline, and a yellow "LOGIN With Google" button; fixed header with Sun* Annual Awards 2025 logo + VN/EN language selector; fixed footer with copyright text | Switch language (VN/EN); click "LOGIN With Google" to sign in |

## User Journey

1. User arrives at the Login Screen and sees the hero visual, "ROOT FURTHER" title, and the
   "LOGIN With Google" button; the language selector defaults to VN.
2. User optionally clicks the language selector, picks EN or VN from the dropdown, and sees all
   copy on the Login Screen switch language immediately.
3. User clicks "LOGIN With Google" — the button becomes disabled and shows a loading indicator
   while Google authentication runs.
4. On success, the user leaves the Login Screen and lands on the app's home (Todo Screen).
5. On failure or cancellation, the user stays on the Login Screen, sees "Đăng nhập không thành
   công. Vui lòng thử lại.", and the button returns to its normal clickable state.
6. A user who is already signed in and opens the Login Screen's URL is sent straight to the Todo
   Screen instead — the Login Screen never renders for them.
