# WPlace AutoLogin — Chrome Extension

> Important: this extension is not intended for using multiple accounts within a single browser profile. One profile = one account. For multiple accounts, create separate browser profiles (e.g., separate Chrome profiles), and install this extension in each profile.

Auto-checks the `j` cookie on `wplace.live` and refreshes it via Google sign-in when needed.

## Requirements

- Google Chrome (recommended). Other Chromium-based browsers may work but are not guaranteed.
- A Google account you stay signed in to.

## Installation

1. Create or open a dedicated Chrome profile you will use for WPlace.
2. Sign in to your Google account in that profile.
3. Download or clone this folder to your machine.
4. Open Chrome and go to `chrome://extensions/`.
5. Enable "Developer mode" (top-right).
6. Click "Load unpacked" and select this extension folder.

## WPlace account setup

1. Open `https://wplace.live` and create a WPlace account (or sign in) using Google.
2. In your browser settings, set the startup page to always open `https://wplace.live` with that profile:
   - Chrome: Settings → On startup → Open a specific page → Add `https://wplace.live`.

## How it works

- When you open the Chrome profile, the extension checks the `j` cookie for `wplace.live`.
- If the cookie is missing or expired, it automatically triggers Google login and updates the token.
- If you remain signed in to your Google account, cookies will refresh automatically just by opening the profile.

## Tips

- If Google signs you out, sign in again in the same Chrome profile and reopen `https://wplace.live`.
- Keep this extension enabled in that profile for auto-refresh to work.
- Important: Keep `wplacer` tool run and this extension enabled in that profile to automatically receive and refresh tokens.

## Permissions

This extension requests:

- `cookies`, `tabs`, `storage`, `alarms`, `scripting`
- Host permissions for `wplace.live`, `backend.wplace.live`, `accounts.google.com`, and `challenges.cloudflare.com`

## Troubleshooting

- If auto-login doesn’t trigger, try reloading the extension on `chrome://extensions/`.
- Make sure the profile is signed in to Google and can access `accounts.google.com`.
- Check the service worker logs: `chrome://extensions/` → this extension → "Service worker" → "Inspect views".
