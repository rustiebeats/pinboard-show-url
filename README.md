# Pinboard — Show URL Under Title

A Tampermonkey/Violentmonkey userscript that displays the destination URL as a visible, clickable link beneath each bookmark title on [Pinboard](https://pinboard.in).

## Screenshot

> Before: only the title is shown
> After: the destination URL appears below it in smaller muted text

## Works on

| Page | URL pattern |
|------|-------------|
| Recent | `pinboard.in/recent/` |
| Popular | `pinboard.in/popular/` |
| Tag pages | `pinboard.in/t:*/` |
| User pages | `pinboard.in/u:*/` |

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or [Violentmonkey](https://violentmonkey.github.io/))
2. Open the [raw script](https://raw.githubusercontent.com/rustiebeats/pinboard-show-url/main/pinboard-show-url.user.js) — your browser extension will prompt you to install it
3. Click **Install**
4. Visit any supported Pinboard page

## What it does

- Reads each bookmark's URL from the `bmarks` JS object already embedded on the page
- Falls back to reading `href` from the title anchor directly if `bmarks` isn't accessible
- Inserts a `<div class="pb-url-display">` with the URL as a plain clickable `<a>` after the title
- Clicking the URL opens the destination in a new tab

## License

MIT
