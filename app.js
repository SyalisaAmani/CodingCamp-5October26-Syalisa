/**
 * To-Do Dashboard — app.js
 * Vanilla JS, no frameworks. Data persisted in localStorage.
 */

'use strict';

// ── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'todo-tasks';

// ── State ────────────────────────────────────────────────────────────────────
/** @type {{ id: string, title: string, description: string, completed: boolean, createdAt: string }[]} */
let tasks = [];

/** @type {'all' | 'active' | 'completed'} */
let currentFilter = 'all';

// ── DOM References ───────────────────────────────────────────────────────────
const taskList         = document.getElementById('task-list');
const emptyState       = document.getElementById('empty-state');
const taskCounter      = document.getElementById('task-counter');
const titleInput       = document.getElementById('task-title');
const descInput        = document.getElementById('task-desc');
const addBtn           = document.getElementById('add-btn');
const clearBtn         = document.getElementById('clear-completed-btn');
const filterBtns       = document.querySelectorAll('.btn-filter');

// ── LocalStorage helpers ─────────────────────────────────────────────────────

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

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-delete';
  deleteBtn.setAttribute('aria-label', 'Delete task: ' + task.title);
  deleteBtn.innerHTML = '&times;';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(body);
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

// ── Initialise ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  tasks = loadTasks();
  render();
});
