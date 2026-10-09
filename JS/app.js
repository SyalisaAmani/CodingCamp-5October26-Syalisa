/**
 * To-Do Dashboard — app.js
 * Vanilla JS, no frameworks. Data persisted in localStorage.
 */

'use strict';

// ── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'todo-tasks';

const QUICK_LINKS_KEY = 'quick-links';
const defaultQuickLinks = [
    { name: 'Google',   icon: '🔍', url: 'https://www.google.com'    },
    { name: 'GitHub',   icon: '🐙', url: 'https://github.com/SyalisaAmani/'        },
    { name: 'YouTube',  icon: '▶️',  url: 'https://www.youtube.com'   },
    { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/syalisa-amani-fatiha/'  },
];

// ── State ────────────────────────────────────────────────────────────────────
/** @type {{ id: string, title: string, description: string, completed: boolean, createdAt: string }[]} */
let tasks = [];

/** @type {'all' | 'active' | 'completed'} */
let currentFilter = 'all';

// ── DOM References ───────────────────────────────────────────────────────────
const taskList         = document.getElementById('task-list');
const emptyState       = document.getElementById('empty-state');
const taskCounter      = document.getElementById('task-counter');
const quickLinksList   = document.getElementById('quick-links-list');
const quickLinkForm    = document.getElementById('quick-link-form');
const quickLinkNameInput = document.getElementById('quick-link-name');
const quickLinkUrlInput = document.getElementById('quick-link-url');
const quickLinkMessage = document.getElementById('quick-link-message');
const titleInput       = document.getElementById('task-title');
const descInput        = document.getElementById('task-desc');
const addBtn           = document.getElementById('add-btn');
const clearBtn         = document.getElementById('clear-completed-btn');
const filterBtns       = document.querySelectorAll('.btn-filter');
const themeToggleBtn   = document.getElementById('theme-toggle');
const sortSelect       = document.getElementById('sort-tasks');

// Edit Modal
const editModal        = document.getElementById('edit-modal');
const editTitleInput   = document.getElementById('edit-title');
const editDescInput    = document.getElementById('edit-desc');
const modalClose       = document.getElementById('modal-close');
const modalCancel      = document.getElementById('modal-cancel');
const modalSave        = document.getElementById('modal-save');

// Focus Timer
const timerDisplay     = document.getElementById('timer');
const timerStatus      = document.getElementById('timer-status');
const startTimerBtn    = document.getElementById('start-timer');
const stopTimerBtn     = document.getElementById('stop-timer');
const resetTimerBtn    = document.getElementById('reset-timer');

// ── LocalStorage helpers ─────────────────────────────────────────────────────

// Dark Mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  if (currentTheme === 'dark') {
    // Light mode change
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeToggleBtn.textContent = '🌙'; 
  } else {
    // Dark Mode change
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggleBtn.textContent = '☀️'; 
  }
});

// Greeting with time and date
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning! 👋";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Good afternoon! ☀️";
    } else if (hour >= 18 && hour < 22) {
        greeting = "Good evening! 🌙";
    } else {
        greeting = "Good night! 🌙";
    }

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    document.getElementById("greetingText").textContent = greeting;
    document.getElementById("dateTime").textContent =
        `${time} · ${date}`;
}

updateGreeting();

setInterval(updateGreeting, 1000);

/**
 * Load tasks from localStorage.
 * Falls back to an empty array if nothing is stored or JSON is invalid.
 * @returns {Array}
 */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Quick Link
function loadQuickLinks() {
    try {
        const savedLinks = localStorage.getItem(QUICK_LINKS_KEY);

        if (savedLinks) {
            return JSON.parse(savedLinks);
        }

        localStorage.setItem(
            QUICK_LINKS_KEY,
            JSON.stringify(defaultQuickLinks)
        );

        return defaultQuickLinks;

    } catch {
        return defaultQuickLinks;
    }
}

function renderQuickLinks() {
    const links = loadQuickLinks();

    quickLinksList.innerHTML = '';

    links.forEach(link => {
        const a = document.createElement('a');
        a.className = 'quick-link';
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'quick-link-icon';
        iconSpan.textContent = link.icon || '🔗';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'quick-link-name';
        nameSpan.textContent = link.name;

        a.appendChild(iconSpan);
        a.appendChild(nameSpan);
        quickLinksList.appendChild(a);
    });
}

function addQuickLink(name, url) {
  const links = loadQuickLinks();

  // Prevent duplicate URLs
  const duplicate = links.some(link =>
    link.url.replace(/\/+$/, '').toLowerCase() ===
    url.replace(/\/+$/, '').toLowerCase()
  );

  if (duplicate) {
    quickLinkMessage.textContent = 'This website is already added.';
    return;
  }

  const newLink = {
    name: name,
    icon: '🔗',
    url: url
  };

  links.push(newLink);

  try {
    localStorage.setItem(QUICK_LINKS_KEY, JSON.stringify(links));
  } catch {
    quickLinkMessage.textContent =
      'Could not save the link. Please check your browser storage.';
    return;
  }

  quickLinkMessage.textContent = 'Link added successfully!';
  renderQuickLinks();
  quickLinkForm.reset();
  quickLinkNameInput.focus();
}

// ── Focus Timer ──────────────────────────────────────────────────────────────

let timeLeft = 25 * 60;
let timerInterval = null;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    // Prevent multiple intervals
    if (timerInterval !== null) return;

    timerStatus.textContent = 'Stay focused... 🎯';

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;

            timerStatus.textContent = 'Focus session complete! 🎉';

            // Optional: notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Taskivo Focus Timer', {
                    body: 'Your 25-minute focus session is complete! 🎉'
                });
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    timerStatus.textContent = 'Timer paused.';
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    timeLeft = 25 * 60;

    updateTimerDisplay();

    timerStatus.textContent = 'Ready to focus?';
}

startTimerBtn.addEventListener('click', startTimer);
stopTimerBtn.addEventListener('click', stopTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Initial display
updateTimerDisplay();

// ── Edit Modal ───────────────────────────────────────────────────────────────

/** Tracks which task id is currently being edited. */
let editingTaskId = null;

/**
 * Open the edit modal pre-filled with the task's current values.
 * @param {string} id
 */
function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editingTaskId = id;
  editTitleInput.value = task.title;
  editDescInput.value  = task.description;

  editModal.hidden = false;
  editTitleInput.focus();
}

/** Close the edit modal and reset state. */
function closeEditModal() {
  editModal.hidden  = true;
  editingTaskId     = null;
  editTitleInput.value = '';
  editDescInput.value  = '';
}

/**
 * Save edits from the modal back to the task and re-render.
 */
function saveEdit() {
  if (!editingTaskId) return;

  const newTitle = editTitleInput.value.trim();

  if (!newTitle) {
    editTitleInput.focus();
    editTitleInput.classList.add('input-error');
    setTimeout(() => editTitleInput.classList.remove('input-error'), 600);
    return;
  }

  // Prevent duplicate task titles
  const duplicate = tasks.some(task =>
    task.id !== editingTaskId &&
    task.title.trim().toLowerCase() === newTitle.toLowerCase()
  );

  if (duplicate) {
    alert('Task already exists.');
    editTitleInput.focus();
    return;
  }

  const task = tasks.find(t => t.id === editingTaskId);

  if (task) {
    task.title = newTitle;
    task.description = editDescInput.value.trim();

    saveTasks();
    render();
  }

  closeEditModal();
}

// Modal button listeners
modalClose.addEventListener('click', closeEditModal);
modalCancel.addEventListener('click', closeEditModal);
modalSave.addEventListener('click', saveEdit);

// Close on overlay click (clicking outside the card)
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) closeEditModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !editModal.hidden) closeEditModal();
});

// Save on Enter key inside the modal title input
editTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveEdit();
});


/**
 * Persist the current tasks array to localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


// ── Task operations ──────────────────────────────────────────────────────────

/**
 * Add a new task.
 * @param {string} title
 * @param {string} description
 */
function addTask(title, description) {
  
  const cleanTitle = title.trim().toLowerCase();

  const duplicate = tasks.some(task =>
    task.title.trim().toLowerCase() === cleanTitle
  );

  if (duplicate) {
    alert('Task already exists!');
    return;
  }

  const task = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks();
  render();
}

/**
 * Toggle the completed state of a task.
 * @param {string} id
 */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

/**
 * Delete a task by id.
 * @param {string} id
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

/**
 * Remove all completed tasks.
 */
function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

// Sort tasks.
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    console.log("Dropdown dipilih:", e.target.value); 
    
    const sortValue = e.target.value;

    if (sortValue === 'newest') {
      tasks.sort((a, b) => b.id - a.id);
    } else if (sortValue === 'oldest') {
      tasks.sort((a, b) => a.id - b.id);
    } else if (sortValue === 'az') {
      tasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    render();
  });
}

// ── Rendering ────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string into a human-readable date.
 * @param {string} iso
 * @returns {string}
 */
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Build and insert a single task <li> element.
 * @param {{ id: string, title: string, description: string, completed: boolean, createdAt: string }} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('button');
  checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
  checkbox.setAttribute('role', 'checkbox');
  checkbox.setAttribute('aria-checked', String(task.completed));
  checkbox.setAttribute('aria-label', task.completed ? 'Mark as incomplete' : 'Mark as complete');
  checkbox.addEventListener('click', () => toggleTask(task.id));

  // Body
  const body = document.createElement('div');
  body.className = 'task-body';

  const titleEl = document.createElement('p');
  titleEl.className = 'task-title';
  titleEl.textContent = task.title;

  body.appendChild(titleEl);

  if (task.description) {
    const descEl = document.createElement('p');
    descEl.className = 'task-desc';
    descEl.textContent = task.description;
    body.appendChild(descEl);
  }

  const metaEl = document.createElement('p');
  metaEl.className = 'task-meta';
  metaEl.textContent = 'Added ' + formatDate(task.createdAt);
  body.appendChild(metaEl);

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'task-edit';
  editBtn.setAttribute('aria-label', 'Edit task: ' + task.title);
  editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  editBtn.addEventListener('click', () => openEditModal(task.id));


  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-delete';
  deleteBtn.setAttribute('aria-label', 'Delete task: ' + task.title);
  deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

/**
 * Update the task counter text.
 */
function updateCounter() {
  const activeCount = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = activeCount === 1
    ? '1 task remaining'
    : activeCount + ' tasks remaining';
}

/**
 * Sync the aria-pressed attribute and active class on filter buttons.
 */
function updateFilterButtons() {
  filterBtns.forEach(btn => {
    const isActive = btn.dataset.filter === currentFilter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

/**
 * Full render: filter tasks, rebuild task list DOM, update counter.
 */
function render() {
  // Determine which tasks to show
  const visible = tasks.filter(task => {
    if (currentFilter === 'active')    return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  // Rebuild task list
  taskList.innerHTML = '';

  if (visible.length === 0) {
    emptyState.hidden = false;
    taskList.hidden   = true;
  } else {
    emptyState.hidden = true;
    taskList.hidden   = false;
    visible.forEach(task => taskList.appendChild(createTaskElement(task)));
  }

  updateCounter();
  updateFilterButtons();
}

// ── Event Listeners ──────────────────────────────────────────────────────────

/** Handle Add Task button click and Enter key in title input. */
function handleAddTask() {
  const title = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    titleInput.classList.add('input-error');
    setTimeout(() => titleInput.classList.remove('input-error'), 600);
    return;
  }
  const description = descInput.value;
  addTask(title, description);
  titleInput.value = '';
  descInput.value  = '';
  titleInput.focus();
}

addBtn.addEventListener('click', handleAddTask);

titleInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAddTask();
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Clear completed
clearBtn.addEventListener('click', clearCompleted);

// Quick links
quickLinkForm.addEventListener('submit', event => {
  event.preventDefault();

  const name = quickLinkNameInput.value.trim();
  const rawUrl = quickLinkUrlInput.value.trim();

  if (!name || !rawUrl) return;

  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    quickLinkMessage.textContent = 'Please enter a valid website URL.';
    return;
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    quickLinkMessage.textContent = 'Only HTTP and HTTPS links are allowed.';
    return;
  }

  addQuickLink(name, parsedUrl.href);
});

// ── Initialise ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    tasks = loadTasks();

    render();
    renderQuickLinks();
});
