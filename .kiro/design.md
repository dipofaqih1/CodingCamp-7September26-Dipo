# Design — Life Dashboard

This document covers the visual design, layout architecture, component anatomy,
colour system, typography, interaction patterns, and accessibility decisions for
the Life Dashboard project.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Layout Architecture](#2-layout-architecture)
3. [Colour System](#3-colour-system)
4. [Typography](#4-typography)
5. [Spacing & Shape](#5-spacing--shape)
6. [Component Design](#6-component-design)
   - 6.1 Header
   - 6.2 Greeting Section
   - 6.3 Card Shell
   - 6.4 Focus Timer Card
   - 6.5 To-Do List Card
   - 6.6 Quick Links Card
   - 6.7 Settings Modal
7. [Interaction & Motion](#7-interaction--motion)
8. [Responsive Design](#8-responsive-design)
9. [Light / Dark Mode](#9-light--dark-mode)
10. [Accessibility](#10-accessibility)
11. [CSS Architecture](#11-css-architecture)

---

## 1. Design Philosophy

The dashboard follows three guiding principles:

**Minimal surface, maximum clarity.**
Every element earns its place. No decorative borders, no gradients, no icon libraries.
Visual weight is controlled purely through colour, size, and spacing.

**Content-first hierarchy.**
The clock and greeting are the first things the eye lands on — large, bold, centred.
The three feature cards sit below at equal visual weight so the user scans, not searches.

**Calm productivity.**
The accent palette (indigo/violet) is chosen to feel focused and modern without
being aggressive. The dark mode shifts to a deep navy background — easier on the eyes
during late-night sessions.

---

## 2. Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│  HEADER  (sticky, full-width)                           │
│  Clock + Date                        Theme toggle ⚙️    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│           GREETING  (centred, full-width)               │
│           "Good morning, Dipo!"                         │
│                                                         │
├──────────────┬──────────────┬──────────────────────────┤
│              │              │                          │
│  FOCUS TIMER │  TO-DO LIST  │  QUICK LINKS            │
│   (card)     │   (card)     │   (card)                │
│              │              │                          │
└──────────────┴──────────────┴──────────────────────────┘
```

### Grid

The three cards sit inside a CSS Grid container:

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1200px;
}
```

- `auto-fit` + `minmax(320px, 1fr)` means cards stretch to fill available space
  and wrap automatically — no media-query breakpoints needed for column count.
- Max-width of 1200 px keeps the layout from becoming uncomfortably wide on
  ultra-wide monitors.
- The grid is centred with `margin: 0 auto`.

### Header

- `position: sticky; top: 0; z-index: 100` — stays visible while scrolling.
- Flexbox row: left side (clock + date), right side (icon buttons).

### Greeting

- Full-width centred block between the header and the card grid.
- Padding `40px 24px 24px` gives it breathing room above the cards.

---

## 3. Colour System

All colours are defined as CSS custom properties on `:root` (light) and
`[data-theme="dark"]` (dark). No hard-coded hex values appear anywhere else
in the stylesheet.

### Light Theme

| Token              | Value                    | Usage                              |
|--------------------|--------------------------|-------------------------------------|
| `--bg-body`        | `#f0f4f8`                | Page background (cool off-white)   |
| `--bg-card`        | `#ffffff`                | Card and header surfaces           |
| `--bg-card-hover`  | `#f8fafc`                | Task item hover state              |
| `--bg-input`       | `#ffffff`                | Text inputs                        |
| `--bg-badge`       | `#e0e7ff`                | Task count badge background        |
| `--bg-modal`       | `rgba(0,0,0,0.40)`       | Modal backdrop overlay             |
| `--text-primary`   | `#1a202c`                | Body text, headings                |
| `--text-secondary` | `#4a5568`                | Labels, secondary copy             |
| `--text-muted`     | `#718096`                | Placeholders, helper text          |
| `--text-badge`     | `#4338ca`                | Badge label colour                 |
| `--accent`         | `#6366f1`  (indigo-500)  | Primary buttons, active states     |
| `--accent-hover`   | `#4f46e5`  (indigo-600)  | Button hover                       |
| `--accent-light`   | `#e0e7ff`  (indigo-100)  | Active tab fill, link card hover   |
| `--success`        | `#10b981`  (emerald-500) | Break timer bar, checkbox accent   |
| `--success-light`  | `#d1fae5`  (emerald-100) | Success-tinted surfaces            |
| `--danger`         | `#ef4444`  (red-500)     | Delete button hover text           |
| `--danger-light`   | `#fee2e2`  (red-100)     | Delete button hover background     |
| `--border`         | `#e2e8f0`                | Card borders, dividers             |
| `--border-focus`   | `#6366f1`                | Input focus ring                   |

### Dark Theme

| Token              | Value                    | Notes vs light                         |
|--------------------|--------------------------|----------------------------------------|
| `--bg-body`        | `#0f172a`  (slate-900)   | Deep navy page background              |
| `--bg-card`        | `#1e293b`  (slate-800)   | Slightly lighter card surface          |
| `--bg-card-hover`  | `#263347`                | Subtle lift on hover                   |
| `--bg-input`       | `#334155`  (slate-700)   | Visible input fields on dark bg        |
| `--bg-badge`       | `#312e81`  (indigo-900)  | Deep badge background                  |
| `--bg-modal`       | `rgba(0,0,0,0.65)`       | Darker overlay for contrast            |
| `--text-primary`   | `#f1f5f9`  (slate-100)   | Near-white for readability             |
| `--text-secondary` | `#cbd5e1`  (slate-300)   |                                        |
| `--text-muted`     | `#94a3b8`  (slate-400)   |                                        |
| `--text-badge`     | `#a5b4fc`  (indigo-300)  | Lighter badge text on dark bg          |
| `--accent`         | `#818cf8`  (indigo-400)  | Lighter indigo — stands out on dark bg |
| `--success`        | `#34d399`  (emerald-400) | Lighter green for dark surfaces        |
| `--danger`         | `#f87171`  (red-400)     | Lighter red                            |
| `--border`         | `#334155`  (slate-700)   | Subtle border on dark bg               |

### Colour Roles Summary

```
Indigo  →  primary actions, focus states, active elements
Emerald →  break mode, completion checkboxes, success states
Red     →  destructive actions (delete, remove)
Slate   →  all neutral backgrounds and text
```

---

## 4. Typography

### Font Stack

```css
--font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
--font-mono: 'Cascadia Code', 'Fira Code', 'Courier New', monospace;
```

No external font CDN is loaded. The stack resolves to the best available
system font, keeping load time at zero.

- `--font-sans` is used for all UI text — labels, buttons, inputs, task text.
- `--font-mono` is used exclusively for the **clock** and **timer display**
  so digits are fixed-width and don't jitter as numbers change.

### Type Scale

| Element               | Size      | Weight | Notes                         |
|-----------------------|-----------|--------|-------------------------------|
| Greeting heading      | `2rem`    | 700    | `<h1>`, largest element       |
| Clock                 | `2rem`    | 700    | Monospace, accent colour      |
| Card title            | `1.1rem`  | 700    | `<h2>` inside each card       |
| Timer countdown       | `4rem`    | 700    | Monospace, centred            |
| Body / task text      | `0.92rem` | 400    |                               |
| Button text           | `0.9rem`  | 600    |                               |
| Filter / badge labels | `0.78–0.88rem` | 600–700 |                          |
| Date / muted labels   | `0.85rem` | 400    | `--text-muted`               |
| Helper / meta text    | `0.82rem` | 400    | Session count, footer links  |

### Sizing principle

Base font size is `16px` on `<html>`. All sizes use `rem` so the entire scale
respects the user's browser font-size preference.

---

## 5. Spacing & Shape

### Spacing

A consistent 8 px base unit is used throughout (4 px for tight gaps, 8/12/16/20/24/32 px
for progressively larger spaces). This keeps vertical rhythm predictable without
a formal spacing system.

| Context                       | Value  |
|-------------------------------|--------|
| Card internal padding         | 24 px  |
| Card gap in grid              | 24 px  |
| Card header bottom margin     | 20 px  |
| Button padding (default)      | 9 px × 18 px |
| Input padding                 | 9 px × 13 px |
| Task item padding             | 10 px × 12 px |
| Link card padding             | 14 px × 8 px |
| Modal body padding            | 22 px  |
| Header padding                | 20 px × 32 px |

### Border Radius

| Token          | Value    | Applied to                          |
|----------------|----------|-------------------------------------|
| `--radius-sm`  | `6px`    | Buttons, inputs, small elements     |
| `--radius-md`  | `12px`   | Task items, link cards, edit panels |
| `--radius-lg`  | `18px`   | Cards, modals                       |
| `--radius-full`| `9999px` | Badges, filter pills, progress bar  |

### Shadows

Three elevation levels controlled by `--shadow-sm/md/lg`:

| Level | Value                              | Used on                   |
|-------|------------------------------------|---------------------------|
| sm    | `0 1px 3px rgba(0,0,0,0.08)`       | Header, task items        |
| md    | `0 4px 16px rgba(0,0,0,0.10)`      | Cards (resting state)     |
| lg    | `0 8px 32px rgba(0,0,0,0.14)`      | Cards (hover), modals     |

Cards elevate from `shadow-md` → `shadow-lg` on `:hover` to reinforce
interactivity cues.

---

## 6. Component Design

### 6.1 Header

```
┌───────────────────────────────────────────────────┐
│  14:32:07                              🌙   ⚙️    │
│  Thursday, September 10, 2026                      │
└───────────────────────────────────────────────────┘
```

- Full-width, sticky, `z-index: 100`, `1px` bottom border.
- Left: clock (monospace, accent colour, 2 rem) stacked above date (muted, 0.85 rem).
- Right: icon buttons (theme toggle + settings), 1.2 rem emoji icons, hover shows
  a subtle `--border` background fill.

---

### 6.2 Greeting Section

```
        Good morning, Dipo!
        Here's your dashboard for today.
```

- `text-align: center`, top padding 40 px.
- `<h1>` at 2 rem / 700 weight.
- Sub-line in `--text-muted` at 0.95 rem.
- No card wrapper — floats freely between header and grid.

---

### 6.3 Card Shell

All three feature sections share an identical card shell:

```
┌──────────────────────────────────────┐  ← radius-lg border
│  Card Title               [action]   │  ← card-header flex row
│  ─────────────────────────────────── │
│                                      │
│  [card body]                         │
│                                      │
└──────────────────────────────────────┘
```

- Background `--bg-card`, border `1px solid --border`, radius `--radius-lg`.
- Box shadow `--shadow-md` at rest, lifts to `--shadow-lg` on hover.
- Padding 24 px on all sides.
- Card header is a flex row: title left, action (badge / button) right.

---

### 6.4 Focus Timer Card

```
┌──────────────────────────────────────┐
│  ⏱ Focus Timer               [Edit] │
│  ┌────────┐                          │  ← Edit panel (hidden by default)
│  │ Work (min) [25] Break (min) [5]  │
│  └────────┘  [Save]                 │
│                                      │
│  [ Work ]  [ Break ]                 │  ← mode tabs
│                                      │
│            25:00                     │  ← 4rem monospace
│  ████████████████░░░░░░░░░░░░░░░░░  │  ← progress bar (6px)
│                                      │
│   [▶ Start]  [⏸ Pause]  [↺ Reset]  │
│                                      │
│              Session 1               │
└──────────────────────────────────────┘
```

**Mode tabs** — pill-shaped buttons, `flex: 1` each. Active tab fills with
`--accent-light` background and `--accent` border + text. Inactive tab has a
plain border.

**Countdown display** — `4rem` monospace, centred. The digits are fixed-width
so the layout does not shift as numbers change.

**Progress bar** — 6 px tall, `--radius-full`. Fill tracks `(elapsed / total) × 100%`
width, animated with `transition: width 1s linear` to move smoothly each second.
Colour: `--accent` (work) or `--success` (break).

**Edit panel** — toggled by the "Edit" button. Inline flex row containing two
`input[type=number]` fields (width 70 px each) and a Save button. Background
uses `--bg-body` to visually indent it inside the card.

---

### 6.5 To-Do List Card

```
┌──────────────────────────────────────┐
│  ✅ To-Do List            [3 left]   │
│                                      │
│  [Add a new task…          ] [Add]   │
│                                      │
│  (All)  Active  Done                 │  ← filter pills
│                                      │
│  ☐  Buy groceries          ✏️  🗑️  │
│  ☑  Read chapter 4         ✏️  🗑️  │  ← struck-through + muted
│  ☐  Morning run            ✏️  🗑️  │
│                                      │
│                   [Clear completed]  │
└──────────────────────────────────────┘
```

**Task items** — flex row: checkbox | text span | action buttons.
- Checkbox: 18 × 18 px, `accent-color: --success`.
- Text span: `flex: 1`, `word-break: break-word` for long task names.
- Done tasks: `text-decoration: line-through`, colour `--text-muted`.
- Action buttons: transparent by default, show background tint on hover.
  Delete button hover uses `--danger-light` bg + `--danger` text.

**Inline edit** — clicking ✏️ replaces the text span with a full-width `<input>`
styled with `.task-edit-input` (focus border in `--border-focus`). Commit on blur
or Enter; cancel on Escape.

**Filter pills** — `border-radius: --radius-full`. Active pill is solid `--accent`
with white text. Inactive pills have a border and muted text; hover shows accent
border + accent text.

**Task list scroll** — `max-height: 320px`, `overflow-y: auto` with a 4 px custom
scrollbar track in `--border`.

**Badge** — pill-shaped count label using `--bg-badge` / `--text-badge` tokens.
Updates in real-time on every add, complete, or delete action.

---

### 6.6 Quick Links Card

```
┌──────────────────────────────────────┐
│  🔗 Quick Links                      │
│                                      │
│  [Label (e.g. GitHub)              ] │
│  [https://example.com              ] │
│                              [Add]   │
│                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  🌐  │ │  🌐  │ │  🌐  │        │  ← favicon (28×28)
│  │GitHub│ │Google│ │YouTube         │
│  └──────┘ └──────┘ └──────┘        │
└──────────────────────────────────────┘
```

**Link cards** — CSS Grid `auto-fill, minmax(120px, 1fr)`. Each card is a flex
column (icon → label), centred, `cursor: pointer`, opens URL in a new tab.

**Hover state** — background shifts to `--accent-light`, border to `--accent`,
text to `--accent`. The ✕ delete button (positioned absolute, top-right) fades in
(`opacity: 0` → `1`) only on hover, keeping the grid clean at rest.

**Favicon** — 28 × 28 px `<img>` fetched from
`https://www.google.com/s2/favicons?sz=32&domain=<host>`.
`onerror` hides the image so a missing favicon never shows a broken icon.

**Keyboard access** — each card has `role="button"`, `tabindex="0"`, and responds
to Enter / Space, meeting basic keyboard navigation requirements.

---

### 6.7 Settings Modal

```
┌──────────────────────────────────────────┐
│  Settings                            [✕] │
│  ──────────────────────────────────────  │
│                                          │
│  Your Name (used in greeting)            │
│  [Enter your name…                     ] │
│  [Save Name]                             │
│                                          │
└──────────────────────────────────────────┘
```

- Fixed overlay: `position: fixed; inset: 0` with semi-transparent backdrop
  (`--bg-modal`). Clicking outside the white panel closes the modal.
- Panel: max-width 400 px, `--radius-lg`, `--shadow-lg`.
- Header row: title left, ✕ button right; separated from body by a `1px border-bottom`.
- Body: flex column with `gap: 12px` for label → input → button.
- Escape key also closes the modal.

---

## 7. Interaction & Motion

All transitions use the global `--transition: 0.2s ease` variable so the entire
UI can be re-tuned from one place.

| Interaction                    | Effect                                              |
|--------------------------------|-----------------------------------------------------|
| Theme toggle                   | `background-color` and `color` on `body`/cards fade |
| Button hover                   | Background or colour shift, 0.2 s                  |
| Button active (primary)        | `transform: scale(0.97)` — tactile press feel       |
| Card hover                     | Shadow lifts from `shadow-md` to `shadow-lg`        |
| Task item enter                | `fadeIn` keyframe: opacity 0→1, translateY −6→0 px  |
| Link card enter                | Same `fadeIn` keyframe                              |
| Timer progress bar             | `transition: width 1s linear` — advances each second |
| Modal open                     | `fadeIn` overlay + `slideUp` panel (translateY 20→0)|
| Focus ring                     | Border colour shifts to `--border-focus` (indigo)  |
| Delete hover (task / link)     | Background tints red, text turns red               |

### Keyframes defined

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 8. Responsive Design

Two breakpoints handle mobile layout. No JavaScript is involved — pure CSS.

### ≤ 680 px (tablets and large phones)

```css
@media (max-width: 680px) { … }
```

| Element          | Change                                   |
|------------------|------------------------------------------|
| Header           | Padding reduced to `14px 16px`           |
| Clock            | Font size `2rem` → `1.5rem`              |
| Greeting         | Font size `2rem` → `1.5rem`              |
| Greeting section | Top padding `40px` → `28px`             |
| Dashboard grid   | Side padding `24px` → `12px`, gap `16px` |
| Cards            | Padding `24px` → `18px 16px`            |
| Timer countdown  | `4rem` → `3rem`                          |
| Timer controls   | Allows wrapping (`flex-wrap: wrap`)      |

At this breakpoint the grid naturally drops to a single column because
`minmax(320px, 1fr)` fills the viewport width.

### ≤ 420 px (small phones)

```css
@media (max-width: 420px) { … }
```

| Element              | Change                                    |
|----------------------|-------------------------------------------|
| To-do input row      | Stacks vertically (`flex-direction: column`) |
| Quick Links add form | "Add" button stretches full width         |

---

## 9. Light / Dark Mode

Theme switching is handled entirely via a CSS `[data-theme]` attribute on `<html>`.
JavaScript only toggles the attribute value and saves the preference — all visual
changes are pure CSS.

### Switching mechanism

```
User clicks 🌙/☀️ button
  → JS reads html[data-theme]
  → Toggles value between "light" and "dark"
  → CSS custom properties cascade instantly
  → localStorage.setItem("dashboard_theme", newValue)
```

### Key design decisions for dark mode

- **Background layers:** Three distinct dark levels (`#0f172a` body → `#1e293b` card
  → `#334155` input) maintain depth without harsh contrast.
- **Accent shifts lighter:** `--accent` moves from indigo-500 to indigo-400 so it
  remains legible against dark backgrounds without appearing washed out.
- **Shadows deepen:** Opacity raised from 0.08–0.14 to 0.3–0.5 since shadows are
  less visible on dark surfaces and need more opacity to register.
- **No flash on load:** The `data-theme` attribute is set on `<html>` before the
  stylesheet renders via the `DOMContentLoaded` listener, which prevents a
  light-mode flash on dark-mode users.

---

## 10. Accessibility

| Concern              | Implementation                                                     |
|----------------------|--------------------------------------------------------------------|
| Semantic HTML        | `<header>`, `<main>`, `<section>`, `<ul>`, `<h1>`/`<h2>` used correctly |
| ARIA labels          | `aria-label` on all icon buttons, inputs, and interactive cards    |
| ARIA live region     | `aria-live="polite"` on timer display for screen-reader countdown  |
| Modal role           | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on modal   |
| Focus management     | Modal auto-focuses the name input on open                          |
| Keyboard navigation  | All interactive elements reachable by Tab; Enter/Space on link cards |
| Colour contrast      | Primary text (`#1a202c`) on white card (`#ffffff`) is ≥ 12:1      |
| Focus ring           | `border-color` shifts to `--border-focus` (indigo) on `:focus`    |
| Checkbox accent      | `accent-color: var(--success)` — native checkbox styled in brand colour |
| Reduced motion       | No `prefers-reduced-motion` override present; animations are subtle |

> **Note:** Full WCAG 2.1 AA compliance requires manual testing with assistive
> technologies. The decisions above represent a best-effort implementation.

---

## 11. CSS Architecture

### File: `css/style.css` (single file, ~540 lines)

Organised into clearly labelled sections separated by banner comments:

```
1.  CSS Custom Properties  (:root light + [data-theme="dark"])
2.  Reset & Base           (box-sizing, html, body)
3.  Utility                (.hidden)
4.  Header
5.  Greeting
6.  Dashboard Grid
7.  Card Shell             (.card, .card-header, .card-title)
8.  Buttons                (.btn-primary, .btn-secondary, .btn-ghost, .btn-icon, .btn-text, .btn-sm)
9.  Inputs                 (.input-text, .input-sm)
10. Badge
11. Focus Timer            (.timer-*, .mode-tab)
12. To-Do List             (.todo-*, .task-*, .filter-btn)
13. Quick Links            (.add-link-form, .links-grid, .link-card, .link-*)
14. Settings Modal         (.modal-overlay, .modal, .modal-header, .modal-body)
15. Responsive             (@media ≤680px, @media ≤420px)
```

### Design token strategy

- All design decisions (colour, size, spacing, motion) are expressed as tokens
  in `:root` / `[data-theme="dark"]`.
- Component rules reference only `var(--token)` — never raw hex values.
- This means the entire visual theme can be changed by editing ~60 lines at the
  top of the file.

### No external dependencies

- No CSS reset library (box-sizing + margin/padding zero is sufficient).
- No icon font (emoji used directly — zero extra requests).
- No utility framework (Tailwind, Bootstrap, etc.).
