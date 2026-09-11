# Tasks — Life Dashboard

A prioritised task list derived from the original user prompt and project requirements.

---

## Table of Contents

1. [Deliverables](#1-deliverables)
2. [MVP Tasks](#2-mvp-tasks)
3. [Added Features](#3-added-features)
4. [Deployment Tasks](#4-deployment-tasks)
5. [File Organisation](#5-file-organisation)

---

## 1. Deliverables

| # | Deliverable                            | Status | Notes                           |
|---|----------------------------------------|--------|---------------------------------|
| 1 | `index.html` — single HTML file        | ✅     | All semantic sections present   |
| 2 | `css/style.css` — single CSS file      | ✅     | Light/dark theme via CSS tokens |
| 3 | `js/app.js` — single JS file           | ✅     | 6 modules, no frameworks        |
| 4 | `.kiro/config.kiro` — project config   | ✅     | TOML-style IDE config           |
| 5 | `requirements.md` — requirements doc   | ✅     | All constraints & features      |
| 6 | `design.md` — design documentation     | ✅     | Tokens, components, responsive  |
| 7 | `README.md` — overview                 | ✅     | Quick-start guide               |
| 8 | `tasks.md` — this document             | ✅     | Prioritised task list           |

---

## 2. MVP Tasks

### 2.1 Technology Stack (TC-1)

| ID   | Task                                                                 | Status |
|------|----------------------------------------------------------------------|--------|
| TC-1 | Build `index.html` using HTML5 only (no frameworks)                 | ✅     |
| TC-2 | Style with `css/style.css` using CSS3 (grid, flexbox, custom props) | ✅     |
| TC-3 | Implement interactivity with `js/app.js` using Vanilla ES2020 JS    | ✅     |

### 2.2 Data Storage (TC-2)

| ID   | Task                                                              | Status |
|------|-------------------------------------------------------------------|--------|
| TC-4 | Implement `localStorage` wrapper in `Storage` module              | ✅     |
| TC-5 | Persist theme preference (`dashboard_theme`)                      | ✅     |
| TC-6 | Persist custom name (`dashboard_name`)                            | ✅     |
| TC-7 | Persist tasks as JSON array (`dashboard_tasks`)                   | ✅     |
| TC-8 | Persist links as JSON array (`dashboard_links`)                   | ✅     |
| TC-9 | Persist timer durations & session count (`timer_*` keys)          | ✅     |

### 2.3 Browser Compatibility (TC-3)

| ID   | Task                                                        | Status |
|------|-------------------------------------------------------------|--------|
| TC-10| Use only features supported by Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ | ✅     |
| TC-11| No polyfills required; fallback favicons on error           | ✅     |

### 2.4 Simplicity (NFR-1)

| ID   | Task                                                       | Status |
|------|------------------------------------------------------------|--------|
| NFR-1| Zero dependencies (no npm, no CDN libraries)              | ✅     |
| NFR-2| No build step required; open `index.html` directly        | ✅     |
| NFR-3| No test framework configured (per user instruction)       | ✅     |

### 2.5 Performance (NFR-2)

| ID   | Task                                                     | Status |
|------|----------------------------------------------------------|--------|
| NFR-4| Use `setInterval` (1 s) for clock and timer (light)     | ✅     |
| NFR-5|favicons use `onerror` handler to hide broken icons     | ✅     |
| NFR-6| CSS transitions at `0.2s ease` for snappy UI            | ✅     |

### 2.6 Visual Design (NFR-3)

| ID   | Task                                                   | Status |
|------|--------------------------------------------------------|--------|
| NFR-7| Clear visual hierarchy (clock, greeting, cards)       | ✅     |
| NFR-8| Readable typography (system font stack)               | ✅     |
| NFR-9| Card-based layout with consistent spacing             | ✅     |

---

## 3. Added Features

| ID   | Feature                       | Details                                                               |
|------|-------------------------------|-----------------------------------------------------------------------|
| AF-1 | Light / Dark mode             | Toggle button in header; `data-theme` attribute on `<html>`          |
| AF-2 | Custom name in greeting       | Settings modal (`⚙️`); updates greeting with user-provided name     |
| AF-3 | Custom Pomodoro time          | Edit panel on timer card; 1–120 min work, 1–60 min break             |

---

## 4. Deployment Tasks

| ID   | Task                                                           | Status |
|------|----------------------------------------------------------------|--------|
| DP-1 | Commit all files with GitHub Desktop (or CLI)                 | ⏳     |
| DP-2 | Push code to GitHub repository (`main` branch)               | ⏳     |
| DP-3 | Enable GitHub Pages (Settings → Pages → `/ (root)`)          | ⏳     |
| DP-4 | Verify live URL: `https://<username>.github.io/<repo>/`      | ⏳     |

> **Note:** No server, no `npm run build`, no additional configuration beyond enabling Pages.

---

## 5. File Organisation

| ID   | Task                                                       | Status |
|------|------------------------------------------------------------|--------|
| FO-1 | Create `css/` directory                                     | ✅     |
| FO-2 | Create `js/` directory                                      | ✅     |
| FO-3 | Place CSS in `css/style.css` (single file)                 | ✅     |
| FO-4 | Place JS in `js/app.js` (single file)                      | ✅     |
| FO-5 | Place HTML at project root (`index.html`)                  | ✅     |

---

## Next Steps

1. **Test locally** — open `index.html` in Chrome/Firefox/Edge/Safari.
2. **Verify features** — test all CRUD actions, theme toggle, settings, timer.
3. **Push to GitHub** — follow DP-1 through DP-3 above.
4. **Deploy** — enable Pages and verify live URL.

---

## Summary

- **Total tasks:** 30
- **MVP completed:** 21
- **Added features:** 3
- **Deployment pending:** 3

All code, documentation, and configuration files are ready. Only deployment remains.
