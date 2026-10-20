# Dark Shield

**Dark Shield** is a lightweight, privacy-first Chrome/Brave extension that forces a true dark mode on every website, while letting you disable it per-site.

It was built to fix the common problems of other dark mode extensions: washed-out images, invisible text, broken Gmail / Amazon / StackOverflow layouts, and no reliable exception list.

## Features

 - **True Dark Everywhere**: Injects dark.css that intelligently inverts and darkens backgrounds without breaking images, videos, canvas, or icons.
- **Smart Contrast Fix**: content.js v9 scans low-contrast elements (light text on light background, dark text on dark background) and corrects them live via MutationObserver
- **Site-Specific Fixes**: Detects Amazon, Stack Overflow, StackExchange, SuperUser and applies scoped rules (data-extension-dark="amazon/stack") to avoid breaking their native UI.
- **Exception Manager** (options.html):
  - Two modes: Blacklist (Dark everywhere EXCEPT listed) and Whitelist (Dark only on listed)
  - Live counters: Blacklist 2, Whitelist 0 — counts non-empty lines in real-time
  - Aligned layout with CSS Grid + min-height on descriptions so textareas stay level
  - Import / Export JSON, Save to chrome.storage.local
- Popup Toggle: popup.html dark themed #121212 / #cccccc with "Toggle Dark for this site" button. It reads the current hostname and adds/removes it from blacklist/whitelist, then reloads the tab.

- **Privacy: 100% local. No network requests, no tracking, no data collection. Everything lives in chrome.storage.local**

## How It Works

 1. background.js initializes storage on install and answers SHOULD_RUN messages.
 2. content.js on every page load:
    - Checks if window === window.top (skip iframes)
    - Sends chrome.runtime.sendMessage({type: 'SHOULD_RUN', host})
    - If host is in Blacklist (or not in Whitelist), it returns early — no dark mode is injected.
    - Otherwise it injects dark.css
    - Tags <html> and <body> with data-extension-dark for site-specific rules
    - Runs fixContrast() after 600ms and on DOM mutations
 3. popup.js gets activeTab, shows location.hostname in #current-site, determines isEnabled from storage, and toggles the domain in the correct list.
 4. options.js loads mode + lists, updates counters with split('\n').filter(Boolean).length on input events, and saves.

## File Structure


    dark-shield/
    ├── manifest.json
    ├── background.js - storage init + SHOULD_RUN logic
    ├── content.js - injection + contrast fix + exception check
    ├── dark.css - global dark rules + site-specific overrides
    ├── popup.html - dark themed popup
    ├── popup.js - toggle + current site + open options
    ├── options.html - exception manager UI (grid-aligned, dark)
    ├── options.js - counter logic + save/export/import
    └── icons

## Installation (Brave / Chrome)

 1. brave://extensions -> Enable Developer Mode
 2. Load Unpacked -> Select dark-shield folder
 3. Pin the extension
 4. Open Exception Manager and add domains like web.whatsapp.com one per line
 5. Click Save

## Usage

 - Click extension icon -> Toggle Dark for current site
 - Go to Exception Manager to manage bulk lists
 - Blacklist sites that already look good without Dark Shield

## Privacy Note

**This extension does not collect, transmit, track, or sell any data. All lists are stored locally in chrome.storage.local on your device only. No external network requests are made.**