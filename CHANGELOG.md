## Changelog v4.2.2
- Front-End improvements:
  - Added a counter to the palette header: “Remaining colors” now shows the total number of remaining pixels.
  - Added a “Refresh canvas” button in the preview. Clicking it reloads the visible area.
  - Added an overlay pixel scale slider (50–100%).
  - When “Stop” is pressed, the template now stops right after the current request to a single tile (fixed).
  - Heatmap: fixed and optimized (You can also now enable and configure this in the template settings).
  - Fixed preserving user checkboxes when opening a template and when changing the user sort order.
  - Added a progress counter to “Check Account Status”.
  
Note: The next update will focus on fixing drawing modes, improving template rendering with premium colors, and addressing other core issues. As this is a fork, occasional instability is expected.

## Changelog v4.2.1
- Fixed an issue with alternating "Painted // Token expired/invalid" during drawing.
- Added custom labeling for accounts (e.g., account email or browser profile) to facilitate easier navigation and management when refreshing cookies. Check "Edit User" section.
- Updated extension (re-upload in your browser)
- Added warnings:
  - Added a warning box before 'Check Account Status' when Account Check Cooldown equals 0.
  - Added a warning box before 'Start Template' when Account Turn Cooldown equals 0.


## Changelog v4.2.0
- Trying to fix token issue
- Heatmap preview added


## Changelog v4.1.9
- Fixed cooldown handling so settings-based delays are respected between all parallel requests (cache warm-up, keep-alive, colors check, purchases) both with and without proxies, and added a proxy concurrency setting to control the number of parallel workers (except drawing).
- Active bar: added per-template Preview button and progress bar.
- Manage Users: total charges now shown as X/Y pixels.
- Regen Speed: fixed.
- Add/Edit Template: sorting by available charges added; shows X/max near drops.
- Token wait notice: after 1 minute without token, show hint to reload extension (Cloudflare Turnstile 300030).


## Changelog v4.1.8
- Added support for multiple proxy formats (parsing and usage):
  - http(s)://user:pass@host:port, socks4://..., socks5://...
  - user:pass@host:port (supports [ipv6])
  - \[ipv6]:port
  - host:port
  - user:pass:host:port
  - Inline comments in data/proxies.txt via `#` or `//` are ignored
- Fixed the issue with stretched images in previews.
- 401/403 errors now take up less space in terminal.


## Changelog v4.1.7 HARD-CODE FIX OF THE DRAWING
- Re-upload the extension to your browser!

## Changelog v4.1.6
Reminder: If drawing stops, inspect console logs in wplace.live for Turnstile errors (or set the pixel manually). If it’s a Turnstile issue, restart your browser or log in via incognito/another browser or profile.

- Added pin/unpin templates at the top of the page.
- Added per-color pixel preview with remaining counts.
- Made cache warm-up parallel when proxies are enabled.
- Improved cookie keep-alive checks with parallel execution when proxies are enabled.
- Made “Check Colors (All), Check Account Status, Attempt to Buy for Selected, Buy Max Charge Upgrades (All)” run faster with proxies.
- Added a color purchase and max charge upgrades counters.
- Frontend now uses proxies (if enabled) to fetch tiles for previews.
- Fixed CSS of the bulk color purchase info window.
- Default sort now ranks users with the template’s required premium colors first, auto-updating on upload, toggle, and edit.
- Added a button to leave the alliance.
- Added a warning when account cooldown is set to 0 with proxies disabled.
- Automated cords parsing on paste.
- Added a 'Changelog' button to the Dashboard that opens the existing changelog.
- Added statistics fields: Total Droplets and Regen Speed.

If you see your problem in the fix list but it still exists, please report it in the main WPlacer Discord server, and make sure to indicate that you are using the fork to avoid misunderstandings.


## Changelog v4.1.5 (FIX DRAWING)
- Re-upload the extension to your browser!
- Also, in the account settings, I added the option to join the alliance by its UUID (taken from the joining link) 
P.S. Various other bugs are known and will be fixed when there is time (auto-purchase of colors and others)
Thanks for fix them @!Protonn @[Sleeping] Chris @rogu3anuerz2 @lulu


## Changelog v4.1.4
- Quick temporary solution for stable core drawing mechanics (Note: re-upload browser extension also).


## Changelog v4.1.3
- Quick improvement of user sorting


## Changelog v4.1.2

- Drawing modes: new "Inside Out" (center → edges) mode
- Manage Users: profile editor (Name / Discord / Show last pixel)
- Colors: section to view owners and manually buy needed premium colors
- Add/Edit Template: color palette and user sorting during assignment
- Auto‑purchases: optional automatic purchase of premium colors
- Settings: "Max pixels per pass" option
- Full‑screen preview: correct handling of transparent pixels and mismatch logic
- UI improvements
- One‑time disclaimer modal; version check with remote changelog

