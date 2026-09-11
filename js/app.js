/* ============================================================
   app.js — Life Dashboard
   Vanilla JS only. All data persisted in localStorage.
   ============================================================ */

'use strict';

/* ============================================================
   STORAGE HELPERS
   ============================================================ */

const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn('localStorage write failed for key:', key);
    }
  },
};

/* ============================================================
   THEME
   ============================================================ */

const Theme = (() => {
  const html        = document.documentElement;
  const toggleBtn   = document.getElementById('theme-toggle');
  const icon        = document.getElementById('theme-icon');
  const STORAGE_KEY = 'dashboard_theme';

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    Storage.set(STORAGE_KEY, theme);
  }

  function init() {
    const saved = Storage.get(STORAGE_KEY, 'light');
    apply(saved);
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      apply(current === 'dark' ? 'light' : 'dark');
    });
  }

  return { init };
})();

/* ============================================================
   CLOCK & GREETING
   ============================================================ */

const Clock = (() => {
  const clockEl    = document.getElementById('clock');
  const dateEl     = document.getElementById('date');
  const greetingEl = document.getElementById('greeting');
  const STORAGE_KEY = 'dashboard_name';

  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  function getGreetingWord(hour) {
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = now.getMinutes();
    const s    = now.getSeconds();

    clockEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    dateEl.textContent  = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const name     = Storage.get(STORAGE_KEY, '');
    const nameStr  = name ? `, ${name}` : '!';
    const suffix   = name ? '!' : '';
    greetingEl.textContent = `${getGreetingWord(h)}${nameStr}${suffix}`;
  }

  function init() {
    tick();
    setInterval(tick, 1000);
  }

  return { init };
})();

/* ============================================================
   SETTINGS (custom name)
   ============================================================ */

const Settings = (() => {
  const openBtn    = document.getElementById('settings-btn');
  const closeBtn   = document.getElementById('settings-close');
  const modal      = document.getElementById('settings-modal');
  const nameInput  = document.getElementById('custom-name-input');
  const saveBtn    = document.getElementById('save-name-btn');
  const STORAGE_KEY = 'dashboard_name';

  function open() {
    nameInput.value = Storage.get(STORAGE_KEY, '');
    modal.classList.remove('hidden');
    nameInput.focus();
  }

  function close() {
    modal.classList.add('hidden');
  }

  function save() {
    const name = nameInput.value.trim();
    Storage.set(STORAGE_KEY, name);
    close();
    // Trigger greeting refresh immediately
    const h          = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    const word       = name
      ? (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night')
      : null;
    if (word) greetingEl.textContent = `${word}, ${name}!`;
  }

  function init() {
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    saveBtn.addEventListener('click', save);
    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') save(); });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
    });
  }

  return { init };
})();

/* ============================================================
   FOCUS TIMER (Pomodoro)
   ============================================================ */

const Timer = (() => {
  /* --- DOM --- */
  const display        = document.getElementById('timer-display');
  const progressFill   = document.getElementById('timer-progress');
  const startBtn       = document.getElementById('timer-start');
  const stopBtn        = document.getElementById('timer-stop');
  const resetBtn       = document.getElementById('timer-reset');
  const sessionCountEl = document.getElementById('session-count');
  const modeTabs       = document.querySelectorAll('.mode-tab');
  const editBtn        = document.getElementById('timer-settings-btn');
  const editPanel      = document.getElementById('timer-edit');
  const pomodoroInput  = document.getElementById('pomodoro-input');
  const breakInput     = document.getElementById('break-input');
  const saveTimerBtn   = document.getElementById('timer-save-btn');

  /* --- Storage keys --- */
  const KEYS = {
    workMins:  'timer_work_mins',
    breakMins: 'timer_break_mins',
    sessions:  'timer_sessions',
  };

  /* --- State --- */
  let workMins   = Storage.get(KEYS.workMins, 25);
  let breakMins  = Storage.get(KEYS.breakMins, 5);
  let mode       = 'work';          // 'work' | 'break'
  let totalSecs  = workMins * 60;
  let remaining  = totalSecs;
  let running    = false;
  let intervalId = null;
  let sessions   = Storage.get(KEYS.sessions, 1);

  /* --- Internal helper to reset timer to current duration --- */
  function resetTimer() {
    running = false;
    clearInterval(intervalId);
    totalSecs = (mode === 'work' ? workMins : breakMins) * 60;
    remaining = totalSecs;
    updateDisplay();
    startBtn.textContent = '▶ Start';
    progressFill.style.width = '0%';
  }

  /* --- Helpers --- */
  function pad(n) { return String(n).padStart(2, '0'); }

  function formatTime(secs) {
    return `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
    const pct = totalSecs > 0 ? ((totalSecs - remaining) / totalSecs) * 100 : 0;
    progressFill.style.width = `${pct}%`;
  }

  function setMode(newMode) {
    mode      = newMode;
    totalSecs = (mode === 'work' ? workMins : breakMins) * 60;
    remaining = totalSecs;
    running   = false;
    clearInterval(intervalId);

    modeTabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    startBtn.textContent = '▶ Start';
    updateDisplay();
    progressFill.style.background = mode === 'work'
      ? 'var(--accent)'
      : 'var(--success)';
  }

  function tick() {
    if (remaining <= 0) {
      clearInterval(intervalId);
      running = false;
      startBtn.textContent = '▶ Start';
      // Auto-switch mode
      if (mode === 'work') {
        sessions += 1;
        sessionCountEl.textContent = sessions;
        Storage.set(KEYS.sessions, sessions);
        notifyUser('Work session done! Take a break. 🎉');
        setMode('break');
      } else {
        notifyUser('Break over! Back to work. 💪');
        setMode('work');
      }
      return;
    }
    remaining -= 1;
    updateDisplay();
  }

  function notifyUser(msg) {
    // Browser notification (if permitted)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Life Dashboard', { body: msg, icon: '' });
    }
    // Also flash the title
    let count = 0;
    const orig = document.title;
    const flashId = setInterval(() => {
      document.title = count % 2 === 0 ? `⏰ ${msg}` : orig;
      if (++count > 6) { clearInterval(flashId); document.title = orig; }
    }, 800);
  }

  /* --- Controls --- */
  startBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    startBtn.textContent = '⏳ Running…';
    intervalId = setInterval(tick, 1000);

    // Request notification permission on first interaction
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  });

  stopBtn.addEventListener('click', () => {
    if (!running) return;
    running = false;
    clearInterval(intervalId);
    startBtn.textContent = '▶ Resume';
  });

  resetBtn.addEventListener('click', resetTimer);

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  /* --- Edit panel --- */
  editBtn.addEventListener('click', () => {
    editPanel.classList.toggle('hidden');
    if (!editPanel.classList.contains('hidden')) {
      pomodoroInput.value = workMins;
      breakInput.value    = breakMins;
    }
  });

  saveTimerBtn.addEventListener('click', () => {
    const w = parseInt(pomodoroInput.value, 10);
    const b = parseInt(breakInput.value, 10);
    if (!isNaN(w) && w >= 1 && w <= 120) {
      workMins = w;
      Storage.set(KEYS.workMins, w);
    }
    if (!isNaN(b) && b >= 1 && b <= 60) {
      breakMins = b;
      Storage.set(KEYS.breakMins, b);
    }
    editPanel.classList.add('hidden');
    setMode(mode); // reset to apply new duration
  });

  /* --- Init --- */
  function init() {
    // Reset session count on page load (starts fresh each time)
    sessions = 1;
    Storage.set(KEYS.sessions, sessions);
    sessionCountEl.textContent = sessions;
    pomodoroInput.value        = workMins;
    breakInput.value           = breakMins;
    setMode('work');
    resetTimer(); // ensure display shows current full duration
  }

  return { init };
})();

/* ============================================================
   TO-DO LIST
   ============================================================ */

const Todo = (() => {
  const listEl       = document.getElementById('task-list');
  const inputEl      = document.getElementById('task-input');
  const addBtn       = document.getElementById('add-task-btn');
  const clearDoneBtn = document.getElementById('clear-done-btn');
  const countBadge   = document.getElementById('task-count');
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const STORAGE_KEY  = 'dashboard_tasks';

  let tasks  = Storage.get(STORAGE_KEY, []);  // [{ id, text, done }]
  let filter = 'all';  // 'all' | 'active' | 'done'

  /* --- Helpers --- */
  function save() { Storage.set(STORAGE_KEY, tasks); }

  function genId() { return `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

  function updateCount() {
    const active = tasks.filter(t => !t.done).length;
    countBadge.textContent = `${active} left`;
  }

  /* --- Render --- */
  function render() {
    const filtered = tasks.filter(t => {
      if (filter === 'active') return !t.done;
      if (filter === 'done')   return t.done;
      return true;
    });

    listEl.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('li');
      empty.style.cssText = 'text-align:center;color:var(--text-muted);font-size:0.88rem;padding:18px 0;';
      empty.textContent = filter === 'done' ? 'No completed tasks.' : 'Nothing here. Add a task!';
      listEl.appendChild(empty);
      updateCount();
      return;
    }

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;

      // Checkbox
      const cb = document.createElement('input');
      cb.type      = 'checkbox';
      cb.className = 'task-checkbox';
      cb.checked   = task.done;
      cb.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'not done' : 'done'}`);
      cb.addEventListener('change', () => toggleDone(task.id));

      // Text span
      const span = document.createElement('span');
      span.className = `task-text${task.done ? ' done' : ''}`;
      span.textContent = task.text;

      // Actions
      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'task-btn';
      editBtn.title      = 'Edit task';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => startEdit(task.id, li, span));

      const delBtn = document.createElement('button');
      delBtn.className = 'task-btn danger';
      delBtn.title      = 'Delete task';
      delBtn.setAttribute('aria-label', 'Delete task');
      delBtn.textContent = '🗑️';
      delBtn.addEventListener('click', () => deleteTask(task.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(actions);
      listEl.appendChild(li);
    });

    updateCount();
  }

  /* --- CRUD --- */
  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    tasks.unshift({ id: genId(), text: trimmed, done: false });
    save();
    render();
  }

  function toggleDone(id) {
    const task = tasks.find(t => t.id === id);
    if (task) { task.done = !task.done; save(); render(); }
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }

  function startEdit(id, li, span) {
    const task   = tasks.find(t => t.id === id);
    if (!task) return;

    // Replace span with input
    const inp = document.createElement('input');
    inp.type      = 'text';
    inp.className = 'task-edit-input';
    inp.value     = task.text;
    inp.maxLength = 120;
    inp.setAttribute('aria-label', 'Edit task text');
    li.replaceChild(inp, span);
    inp.focus();
    inp.select();

    function commitEdit() {
      const newText = inp.value.trim();
      if (newText) { task.text = newText; save(); }
      render();
    }

    inp.addEventListener('blur', commitEdit);
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') inp.blur();
      if (e.key === 'Escape') { render(); } // cancel
    });
  }

  function clearCompleted() {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
  }

  /* --- Events --- */
  addBtn.addEventListener('click', () => {
    addTask(inputEl.value);
    inputEl.value = '';
    inputEl.focus();
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask(inputEl.value);
      inputEl.value = '';
    }
  });

  clearDoneBtn.addEventListener('click', clearCompleted);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      render();
    });
  });

  function init() { render(); }

  return { init };
})();

/* ============================================================
   QUICK LINKS
   ============================================================ */

const QuickLinks = (() => {
  const nameInput   = document.getElementById('link-name-input');
  const urlInput    = document.getElementById('link-url-input');
  const addBtn      = document.getElementById('add-link-btn');
  const grid        = document.getElementById('links-grid');
  const STORAGE_KEY = 'dashboard_links';

  // Default starter links (only used if nothing saved yet)
  const DEFAULTS = [
    { id: 'l_github',  name: 'GitHub',  url: 'https://github.com' },
    { id: 'l_google',  name: 'Google',  url: 'https://google.com' },
    { id: 'l_youtube', name: 'YouTube', url: 'https://youtube.com' },
  ];

  let links = Storage.get(STORAGE_KEY, null);
  if (links === null) {
    links = DEFAULTS;
    Storage.set(STORAGE_KEY, links);
  }

  function save() { Storage.set(STORAGE_KEY, links); }

  function genId() { return `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

  function getFaviconUrl(url) {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`;
    } catch {
      return '';
    }
  }

  function normaliseUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  }

  /* --- Render --- */
  function render() {
    grid.innerHTML = '';

    if (links.length === 0) {
      const empty = document.createElement('p');
      empty.style.cssText = 'color:var(--text-muted);font-size:0.88rem;padding:8px 0;';
      empty.textContent = 'No links yet. Add one above!';
      grid.appendChild(empty);
      return;
    }

    links.forEach(link => {
      const card = document.createElement('div');
      card.className = 'link-card';

      // Favicon
      const favicon = document.createElement('img');
      favicon.className = 'link-favicon';
      favicon.src       = getFaviconUrl(link.url);
      favicon.alt       = '';
      favicon.setAttribute('aria-hidden', 'true');
      favicon.onerror   = () => { favicon.style.display = 'none'; };

      // Label
      const label = document.createElement('span');
      label.textContent = link.name;

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className   = 'link-delete';
      delBtn.textContent = '✕';
      delBtn.title       = `Remove ${link.name}`;
      delBtn.setAttribute('aria-label', `Remove ${link.name}`);
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeLink(link.id);
      });

      // Open link on card click
      card.addEventListener('click', () => window.open(link.url, '_blank', 'noopener,noreferrer'));
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Open ${link.name}`);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(link.url, '_blank', 'noopener,noreferrer');
        }
      });

      card.appendChild(favicon);
      card.appendChild(label);
      card.appendChild(delBtn);
      grid.appendChild(card);
    });
  }

  function addLink() {
    const name = nameInput.value.trim();
    const url  = normaliseUrl(urlInput.value);

    if (!name) { nameInput.focus(); return; }
    if (!url)  { urlInput.focus();  return; }

    // Basic URL validation
    try { new URL(url); } catch {
      urlInput.style.borderColor = 'var(--danger)';
      setTimeout(() => { urlInput.style.borderColor = ''; }, 1500);
      return;
    }

    links.push({ id: genId(), name, url });
    save();
    render();

    nameInput.value = '';
    urlInput.value  = '';
    nameInput.focus();
  }

  function removeLink(id) {
    links = links.filter(l => l.id !== id);
    save();
    render();
  }

  /* --- Events --- */
  addBtn.addEventListener('click', addLink);

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addLink();
  });

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') urlInput.focus();
  });

  function init() { render(); }

  return { init };
})();

/* ============================================================
   BOOTSTRAP — initialise all modules
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Clock.init();
  Settings.init();
  Timer.init();
  Todo.init();
  QuickLinks.init();
});
