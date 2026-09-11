# Requirements — Life Dashboard

A personal browser dashboard that helps users organise their day.
No server, no framework, no build step — just open `index.html`.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Constraints](#2-technical-constraints)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [Functional Requirements](#4-functional-requirements)
   - 4.1 Greeting & Clock
   - 4.2 Focus Timer
   - 4.3 To-Do List
   - 4.4 Quick Links
   - 4.5 Light / Dark Mode *(added feature)*
   - 4.6 Custom Name *(added feature)*
   - 4.7 Custom Pomodoro Time *(added feature)*
5. [Data Model](#5-data-model)
6. [File Structure](#6-file-structure)
7. [Deployment](#7-deployment)

---

## 1. Project Overview

| Field       | Value                                      |
|-------------|--------------------------------------------|
| Project     | Life Dashboard                             |
| Version     | 1.0.0                                      |
| Type        | Static web page (no backend)               |
| Entry point | `index.html`                               |
| Live demo   | GitHub Pages (`/` root of `main` branch)   |

---

## 2. Technical Constraints

### TC-1 — Technology Stack

| Layer      | Choice                                   |
|------------|------------------------------------------|
| Structure  | HTML5                                    |
| Styling    | CSS3 (custom properties, grid, flexbox)  |
| Behaviour  | Vanilla JavaScript ES2020 — **no frameworks** |
| Backend    | None — fully client-side                 |

### TC-2 — Data Storage

- All persistent data is stored using the **browser `localStorage` API**.
- No cookies, no server, no third-party database.
- Data survives page refreshes and browser restarts on the same device.

### TC-3 — Browser Compatibility

Must work without polyfills in:

| Browser | Minimum version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Edge    | 90+            |
| Safari  | 14+            |

Can be used as a standalone web page or set as a browser new-tab/homepage.

### TC-4 — Folder Rules

```
project/
├── index.html          ← single HTML file
├── css/
│   └── style.css       ← exactly one CSS file
└── js/
    └── app.js          ← exactly one JS file
```

---

## 3. Non-Functional Requirements

### NFR-1 — Simplicity
- Clean, minimal interface with no complex setup.
- No test framework required or configured.
- Works by opening `index.html` directly in a browser.

### NFR-2 — Performance
- No external CSS or JS dependencies loaded at runtime.
- Favicons fetched from Google S2 API (optional, degrades gracefully on failure).
- No noticeable lag on add/edit/delete operations.
- `setInterval` used for clock and timer — no heavy polling.

### NFR-3 — Visual Design
- Clear visual hierarchy using card-based layout.
- Readable typography: system font stack (`Segoe UI`, `system-ui`).
- Monospace font for clock and timer display.
- Responsive grid: collapses to single column on screens ≤ 680 px.
- Smooth 0.2 s transitions for all interactive states.

---

## 4. Functional Requirements

### 4.1 Greeting & Clock

**FR-GC-1** The header must display the current time in `HH:MM:SS` format, updating every second.

**FR-GC-2** The header must display the current full date in `Day, Month DD, YYYY` format.

**FR-GC-3** A greeting heading must be displayed below the header. The greeting word changes based on the hour:

| Hour range | Greeting word   |
|------------|-----------------|
| 00:00–11:59 | Good morning   |
| 12:00–16:59 | Good afternoon |
| 17:00–20:59 | Good evening   |
| 21:00–23:59 | Good night     |

**FR-GC-4** If the user has set a custom name (see §4.6), the greeting includes it:
`Good morning, Dipo!`
Otherwise it reads: `Good morning!`

---

### 4.2 Focus Timer

**FR-FT-1** The timer must default to **25 minutes work / 5 minutes break**.

**FR-FT-2** The timer must have three controls:
- **Start** — begins countdown; label changes to "Running…"
- **Pause** — pauses countdown; label on Start changes to "Resume"
- **Reset** — stops and resets to the full duration of the current mode

**FR-FT-3** A **Work / Break** tab row must allow switching modes manually at any time.

**FR-FT-4** When the countdown reaches 00:00, the timer must automatically switch mode:
- Work → Break (session counter increments)
- Break → Work

**FR-FT-5** A thin progress bar must visualise elapsed time within the current session.
- Work mode: accent colour (indigo)
- Break mode: success colour (green)

**FR-FT-6** A session counter must show how many work sessions have been completed, persisted across page refreshes.

**FR-FT-7** *(Added feature — see §4.7)* Work and break durations must be user-configurable.

**FR-FT-8** When a session ends, the page title must flash a notification message. If the user has granted browser notification permission, a desktop notification is also sent.

---

### 4.3 To-Do List

**FR-TD-1** A text input and "Add" button must allow the user to add a new task (max 120 characters). Pressing **Enter** in the input field also adds the task.

**FR-TD-2** Each task must display:
- A checkbox to mark it done / not done
- The task text (struck through and muted when done)
- An edit button (✏️)
- A delete button (🗑️)

**FR-TD-3** Clicking the edit button replaces the task text with an inline input. Pressing **Enter** or clicking away commits the change. Pressing **Escape** cancels.

**FR-TD-4** Tasks must be filterable via three tabs: **All / Active / Done**.

**FR-TD-5** A "Clear completed" button removes all done tasks in one action.

**FR-TD-6** A badge in the card header shows the count of active (not done) tasks.

**FR-TD-7** All tasks are persisted in `localStorage` under the key `dashboard_tasks` as a JSON array:
```json
[{ "id": "t_...", "text": "Buy groceries", "done": false }]
```

---

### 4.4 Quick Links

**FR-QL-1** A form with a label input and a URL input must allow the user to add a new link. The URL field accepts entries with or without `https://` — the app prefixes it automatically if missing.

**FR-QL-2** Each link must be displayed as a card showing the site **favicon** (fetched from `https://www.google.com/s2/favicons?sz=32&domain=<host>`) and the user-supplied label. If the favicon fails to load it is hidden gracefully.

**FR-QL-3** Clicking a link card must open the URL in a **new tab** (`noopener, noreferrer`).

**FR-QL-4** A delete button (✕) appears on hover and removes the link.

**FR-QL-5** Links are keyboard-accessible (`tabindex="0"`, responds to Enter and Space).

**FR-QL-6** On first load with no saved data, three default links are seeded:
- GitHub — `https://github.com`
- Google — `https://google.com`
- YouTube — `https://youtube.com`

**FR-QL-7** All links are persisted in `localStorage` under the key `dashboard_links`:
```json
[{ "id": "l_...", "name": "GitHub", "url": "https://github.com" }]
```

---

### 4.5 Light / Dark Mode *(added feature)*

**FR-DM-1** A toggle button (🌙 / ☀️) in the header must switch between light and dark themes.

**FR-DM-2** Theming is implemented via CSS custom properties on `[data-theme]` on the `<html>` element — no JavaScript inline styles.

**FR-DM-3** The selected theme is persisted in `localStorage` (`dashboard_theme`) and restored on next visit.

**FR-DM-4** All colours, borders, shadows, and backgrounds must adapt to both themes. No hard-coded hex values appear outside `:root` / `[data-theme="dark"]` blocks.

---

### 4.6 Custom Name *(added feature)*

**FR-CN-1** A settings modal (⚙️ button in the header) must provide a text input for the user to enter their name (max 40 characters).

**FR-CN-2** Saving the name closes the modal and immediately updates the greeting.

**FR-CN-3** The name is persisted in `localStorage` (`dashboard_name`) and used by the Clock module on every tick.

**FR-CN-4** The modal must close on:
- Clicking the ✕ button
- Clicking outside the modal panel
- Pressing **Escape**

---

### 4.7 Custom Pomodoro Time *(added feature)*

**FR-PT-1** An "Edit" button on the Focus Timer card reveals an inline edit panel.

**FR-PT-2** The panel exposes two number inputs:
- **Work (min)** — accepted range: 1–120, default 25
- **Break (min)** — accepted range: 1–60, default 5

**FR-PT-3** Clicking "Save" validates the inputs, persists them to `localStorage` (`timer_work_mins`, `timer_break_mins`), hides the panel, and resets the timer to the new duration.

**FR-PT-4** Invalid values (out of range, NaN) are silently ignored — the previous valid value is kept.

---

## 5. Data Model

All data lives in `localStorage`. No schema migration is needed for v1.

| Key                | Type    | Default   | Description                          |
|--------------------|---------|-----------|--------------------------------------|
| `dashboard_theme`  | string  | `"light"` | Active colour theme                  |
| `dashboard_name`   | string  | `""`      | User's display name                  |
| `dashboard_tasks`  | array   | `[]`      | To-do items `{ id, text, done }`     |
| `dashboard_links`  | array   | *(3 defaults)* | Quick links `{ id, name, url }` |
| `timer_work_mins`  | number  | `25`      | Work session duration in minutes     |
| `timer_break_mins` | number  | `5`       | Break duration in minutes            |
| `timer_sessions`   | number  | `1`       | Cumulative completed work sessions   |

---

## 6. File Structure

```
project-root/
│
├── index.html            ← Full page markup; all sections declared here
│
├── css/
│   └── style.css         ← All styles; light + dark theme; responsive
│
├── js/
│   └── app.js            ← All behaviour; 6 IIFE modules (see below)
│
├── .kiro/
│   └── config.kiro       ← Kiro IDE project configuration
│
├── requirements.md       ← This document
└── README.md             ← Project intro and quick-start guide
```

### JavaScript Modules in `app.js`

| Module       | Responsibility                                              |
|--------------|-------------------------------------------------------------|
| `Storage`    | Safe `localStorage.getItem / setItem` wrapper with JSON    |
| `Theme`      | Light/dark toggle; reads/writes `dashboard_theme`          |
| `Clock`      | `setInterval` tick; updates clock, date, greeting          |
| `Settings`   | Modal open/close/save for custom name                      |
| `Timer`      | Pomodoro countdown, mode tabs, progress bar, notifications |
| `Todo`       | Task CRUD, filter, inline edit, localStorage sync          |
| `QuickLinks` | Link CRUD, favicon fetch, keyboard nav, localStorage sync  |

---



### Local usage

Open `index.html` directly in any modern browser. No server, no `npm install`, no build step required.
