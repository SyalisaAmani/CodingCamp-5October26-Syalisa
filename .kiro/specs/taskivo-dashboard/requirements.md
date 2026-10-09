# Requirements Document

## Introduction

TaskiVo Dashboard is a personal productivity web application that combines a to-do list manager, a Pomodoro-style focus timer, and a quick-access bookmarks panel in a single-page interface. Its purpose is to help users organise daily tasks and maintain focus without leaving their browser tab.

The application is built entirely with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, and no backend server. All data is persisted client-side using the browser's `localStorage` API. The entry point is `index.html` at the project root, with `style.css` and `app.js` loaded from the same root directory.

**Tech stack summary:**
- HTML5 (`index.html`)
- CSS3 with custom properties (`style.css`)
- Vanilla JavaScript, strict mode (`app.js`)
- Browser `localStorage` for persistence
- No external libraries or frameworks

---

## Glossary

- **Task**: An item stored in `localStorage` with the fields `id` (timestamp string), `title` (string, max 200 chars), `description` (string, optional, max 500 chars), `completed` (boolean), and `createdAt` (ISO date string).
- **Quick Link**: A bookmark entry stored in `localStorage` with the fields `name` (string, max 40 chars), `icon` (emoji string), and `url` (string). Four default links are seeded on first load.
- **Focus Timer**: A fixed 25-minute countdown timer displayed on the dashboard. The duration is not user-configurable.
- **Filter**: A view selector (`All`, `Active`, `Completed`) that controls which tasks are rendered in the task list without modifying stored data.
- **Sort**: An ordering applied to the in-memory task array before rendering. Available options are `Newest`, `Oldest`, and `A–Z`. Sorting mutates the in-memory array.
- **Theme**: The visual colour scheme of the application, either `light` or `dark`. The active theme is stored in `localStorage` under the key `theme`.
- **LocalStorage**: The browser's `Window.localStorage` API, used as the sole persistence layer. Data survives page reloads but is scoped to the browser origin.

---

## Non-Functional Requirements

### NFR-1: Simplicity

THE Dashboard SHALL be implemented as a single HTML page with no build step, no package manager, and no external runtime dependencies, so that the project can be opened directly in a browser without any setup.

### NFR-2: Performance

WHEN the page loads, THE Dashboard SHALL initialise all UI components (greeting, timer display, task list, quick links) and be fully interactive without requiring a network request after the initial page load.

### NFR-3: Visual Design

THE Dashboard SHALL apply a consistent design system using CSS custom properties for colours, spacing, border radii, and shadows, with an indigo/violet accent colour (`#6366f1` in light mode, `#818cf8` in dark mode), card-based layout components, and a system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`).

---

## Technical Constraints

### TC-1: Technology Stack

THE Application SHALL be built using only HTML5, CSS3, and vanilla JavaScript (ES6+, strict mode). No JavaScript frameworks, CSS preprocessors, or bundlers are permitted.

### TC-2: Data Storage

THE Application SHALL use `localStorage` exclusively for persisting tasks and quick links. No server-side storage, cookies, or `sessionStorage` are used. Task data is stored under the key `todo-tasks`; quick link data under `quick-links`; theme preference under `theme`.

### TC-3: Browser Compatibility

THE Application SHALL function in any modern browser that supports `localStorage`, CSS custom properties, and the `Notification` Web API. The responsive layout SHALL adapt to viewport widths at or below 600 px.

---

## Requirements

---

### REQ-1: Greeting and Live Clock

**User Story:** As a user, I want to see a time-based greeting and a live clock on the dashboard, so that the page feels personal and time-aware.

#### Acceptance Criteria

1. WHEN the page loads, THE Greeting Component SHALL display a greeting phrase determined by the current hour: `"Good morning! 👋"` for 05:00–11:59, `"Good afternoon! ☀️"` for 12:00–17:59, `"Good evening! 🌙"` for 18:00–21:59, and `"Good night! 🌙"` for 22:00–04:59.
2. THE Greeting Component SHALL update the greeting phrase and the displayed time every 1 second via `setInterval`.
3. THE Greeting Component SHALL display the current time in `hh:mm:ss AM/PM` format (12-hour, en-US locale).
4. THE Greeting Component SHALL display the current date in `"Weekday, D Month YYYY"` format (en-US locale, e.g. `"Friday, 9 October 2026"`).
5. THE Greeting Component SHALL display the static text `"Ready to get this done?"` below the greeting phrase; this text does not change.

---

### REQ-2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer on the dashboard, so that I can time focused work sessions without switching to another app.

#### Acceptance Criteria

1. WHEN the page loads, THE Focus Timer SHALL display `25:00` and the status text `"Ready to focus?"`.
2. WHEN the user clicks the Start button, THE Focus Timer SHALL begin decrementing the displayed time by one second every second and SHALL update the status text to `"Stay focused... 🎯"`.
3. WHILE the Focus Timer is running, IF the user clicks the Start button again, THE Focus Timer SHALL ignore the click and SHALL NOT create an additional timer interval.
4. WHEN the user clicks the Stop button, THE Focus Timer SHALL pause the countdown and SHALL update the status text to `"Timer paused."`.
5. WHEN the user clicks the Reset button (↻), THE Focus Timer SHALL stop any active interval, reset the displayed time to `25:00`, and set the status text to `"Ready to focus?"`.
6. WHEN the countdown reaches `00:00`, THE Focus Timer SHALL stop automatically, update the status text to `"Focus session complete! 🎉"`, and SHALL fire a browser `Notification` with the title `"Taskivo Focus Timer"` and body `"Your 25-minute focus session is complete! 🎉"` if the browser's notification permission has been granted.
7. THE Focus Timer duration SHALL be fixed at 25 minutes and SHALL NOT be user-configurable.

---

### REQ-3: Add Task

**User Story:** As a user, I want to add tasks with a title and an optional description, so that I can track what needs to be done.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task title (via the Add button or the Enter key in the title field), THE Task Manager SHALL create a new task object with a unique `id` (current timestamp as string), the trimmed `title`, the trimmed `description` (may be empty), `completed: false`, and `createdAt` set to the current ISO date string.
2. WHEN a new task is added, THE Task Manager SHALL append it to the task list, persist the updated list to `localStorage`, and re-render the task list.
3. IF the title field is empty when the user attempts to add a task, THEN THE Task Manager SHALL focus the title input and briefly apply an `input-error` class (removed after 600 ms) without adding a task.
4. WHEN a task is added successfully, THE Task Manager SHALL clear both the title input and the description textarea and SHALL return focus to the title input.
5. THE title input SHALL accept a maximum of 200 characters; the description textarea SHALL accept a maximum of 500 characters.

---

### REQ-4: Edit Task

**User Story:** As a user, I want to edit the title and description of an existing task, so that I can correct mistakes or update details.

#### Acceptance Criteria

1. WHEN the user clicks the ✏️ edit button on a task, THE Edit Modal SHALL open pre-filled with that task's current title and description, and focus SHALL be placed on the title input.
2. WHEN the Edit Modal is open, IF the user clicks the Save Changes button or presses the Enter key in the title field, THE Edit Modal SHALL save the updated title (trimmed) and description (trimmed) to the task, persist the change, re-render the task list, and close the modal.
3. IF the title field is empty when the user attempts to save, THEN THE Edit Modal SHALL focus the title input and apply an `input-error` class (removed after 600 ms) without saving.
4. IF the updated title (case-insensitive) matches the title of a different existing task, THEN THE Edit Modal SHALL alert the user with `"Task already exists."` and NOT save the change.
5. WHEN the user clicks the ✕ button, the Cancel button, or the modal overlay (outside the card), THE Edit Modal SHALL close without saving changes.
6. WHEN the Escape key is pressed while the Edit Modal is open, THE Edit Modal SHALL close without saving changes.

---

### REQ-5: Mark Task as Complete

**User Story:** As a user, I want to mark tasks as complete or incomplete, so that I can track my progress.

#### Acceptance Criteria

1. WHEN the user clicks the circular checkbox button on a task, THE Task Manager SHALL toggle the task's `completed` property, persist the updated list, and re-render the task list.
2. WHILE a task is marked completed, THE Task List SHALL render that task with a strikethrough title, muted text colour, and 0.85 opacity.
3. WHILE a task is marked completed, THE Task List SHALL render the checkbox with a filled indigo background and a white checkmark.
4. THE checkbox button SHALL carry `role="checkbox"` and an `aria-checked` attribute reflecting the current completed state.

---

### REQ-6: Delete Task

**User Story:** As a user, I want to delete individual tasks, so that I can remove items I no longer need.

#### Acceptance Criteria

1. WHEN the user clicks the × delete button on a task, THE Task Manager SHALL remove that task from the list, persist the updated list, and re-render the task list.
2. THE delete button SHALL carry an `aria-label` of `"Delete task: <task title>"`.
3. WHILE the cursor is not hovering over a task item, THE delete button SHALL be rendered at 0.35 opacity; WHEN the cursor hovers over the task item, THE delete button opacity SHALL become 1.

---

### REQ-7: Filter Tasks

**User Story:** As a user, I want to filter the task list by status, so that I can focus on active or completed items.

#### Acceptance Criteria

1. THE Controls Bar SHALL provide three filter buttons: `All`, `Active`, and `Completed`. The default active filter is `All`.
2. WHEN the user clicks `All`, THE Task List SHALL display all tasks regardless of `completed` status.
3. WHEN the user clicks `Active`, THE Task List SHALL display only tasks where `completed` is `false`.
4. WHEN the user clicks `Completed`, THE Task List SHALL display only tasks where `completed` is `true`.
5. THE active filter button SHALL have the CSS class `active` and an `aria-pressed="true"` attribute; all other filter buttons SHALL have `aria-pressed="false"`.
6. WHEN the filtered result set is empty, THE Task List SHALL hide the `<ul>` element and show the empty-state panel instead.
7. THE task counter SHALL display the count of tasks where `completed` is `false`, in the format `"N tasks remaining"` (or `"1 task remaining"` for exactly one), and SHALL update on every render.

---

### REQ-8: Sort Tasks *(Bonus Feature)*

**User Story:** As a user, I want to sort my tasks by date added or alphabetically, so that I can find items more easily.

#### Acceptance Criteria

1. THE Controls Bar SHALL provide a `<select>` element with three options: `Newest`, `Oldest`, and `A–Z`; the default selection is `Newest`.
2. WHEN the user selects `Newest`, THE Task Manager SHALL sort the in-memory task array by `id` descending (most recently added first) and re-render.
3. WHEN the user selects `Oldest`, THE Task Manager SHALL sort the in-memory task array by `id` ascending (oldest added first) and re-render.
4. WHEN the user selects `A–Z`, THE Task Manager SHALL sort the in-memory task array alphabetically by `title` using `localeCompare` and re-render.

---

### REQ-9: Prevent Duplicate Tasks *(Bonus Feature)*

**User Story:** As a user, I want the application to prevent me from adding tasks with duplicate titles, so that my list stays clean and unambiguous.

#### Acceptance Criteria

1. WHEN the user attempts to add a task whose title (trimmed, case-insensitive) matches an existing task's title, THE Task Manager SHALL display a browser alert with the message `"Task already exists!"` and SHALL NOT add the task.
2. WHEN the user attempts to save an edited task whose new title (trimmed, case-insensitive) matches the title of a different existing task, THE Edit Modal SHALL display a browser alert with the message `"Task already exists."` and SHALL NOT save the change.
3. The duplicate check for both add and edit SHALL be case-insensitive (e.g. `"Buy milk"` and `"buy milk"` are considered duplicates).

---

### REQ-10: Clear Completed Tasks

**User Story:** As a user, I want to remove all completed tasks at once, so that I can declutter my list quickly.

#### Acceptance Criteria

1. WHEN the user clicks the Clear Completed button, THE Task Manager SHALL remove all tasks where `completed` is `true` from the task array, persist the updated list, and re-render the task list.
2. WHEN no completed tasks exist, the Clear Completed button SHALL remain visible and clickable; clicking it SHALL result in no change to the task list.

---

### REQ-11: Persist Tasks

**User Story:** As a user, I want my tasks to be saved between sessions, so that I don't lose my list when I close or refresh the page.

#### Acceptance Criteria

1. WHEN any task operation (add, toggle, delete, edit, clear completed) is performed, THE Task Manager SHALL immediately serialise the current task array to JSON and write it to `localStorage` under the key `todo-tasks`.
2. WHEN the page loads, THE Task Manager SHALL read the value stored at `localStorage` key `todo-tasks`, parse it as JSON, and initialise the task array from it. IF the key is absent or the stored value is not valid JSON, THE Task Manager SHALL initialise the task array as an empty array.

---

### REQ-12: Quick Links — View Default Links

**User Story:** As a user, I want to see a set of useful bookmarks pre-loaded in the dashboard, so that I can navigate to common websites quickly.

#### Acceptance Criteria

1. WHEN the page loads for the first time (no `quick-links` key in `localStorage`), THE Quick Links Component SHALL seed `localStorage` with the four default links: Google (`https://www.google.com`), GitHub (`https://github.com/SyalisaAmani/`), YouTube (`https://www.youtube.com`), and LinkedIn (`https://www.linkedin.com/in/syalisa-amani-fatiha/`).
2. THE Quick Links Component SHALL render each link as an `<a>` element with `target="_blank"` and `rel="noopener noreferrer"`, displaying the link's emoji icon and name.

---

### REQ-13: Quick Links — Add Custom Link

**User Story:** As a user, I want to add my own bookmarks to the quick links panel, so that I can access my frequently used websites from the dashboard.

#### Acceptance Criteria

1. WHEN the user submits the quick-link form with a non-empty name and a valid URL, THE Quick Links Component SHALL add the new link to `localStorage` and re-render the quick links list.
2. IF the submitted URL is not a valid absolute URL (i.e. `new URL()` throws), THEN THE Quick Links Component SHALL display the message `"Please enter a valid website URL."` in the status area and SHALL NOT add the link.
3. IF the submitted URL uses a protocol other than `http:` or `https:`, THEN THE Quick Links Component SHALL display the message `"Only HTTP and HTTPS links are allowed."` and SHALL NOT add the link.
4. IF the submitted URL (trailing slashes stripped, case-insensitive) matches an existing link's URL, THEN THE Quick Links Component SHALL display the message `"This website is already added."` and SHALL NOT add the link.
5. WHEN a link is added successfully, THE Quick Links Component SHALL display `"Link added successfully!"`, reset the form, and return focus to the name input.
6. THE name input SHALL accept a maximum of 40 characters. Newly added links SHALL be stored with the icon value `"🔗"` (the generic link emoji).

---

### REQ-14: Persist Quick Links

**User Story:** As a user, I want my custom bookmarks to be saved between sessions, so that I don't have to re-enter them every time I open the dashboard.

#### Acceptance Criteria

1. WHEN a new quick link is added, THE Quick Links Component SHALL serialise the updated links array to JSON and write it to `localStorage` under the key `quick-links`.
2. WHEN the page loads, THE Quick Links Component SHALL read the value stored at `localStorage` key `quick-links`. IF the key is present and valid JSON, THE Quick Links Component SHALL use those links. IF the key is absent or invalid, THE Quick Links Component SHALL fall back to the four default links without writing to `localStorage` immediately.

---

### REQ-15: Light/Dark Theme Toggle *(Bonus Feature)*

**User Story:** As a user, I want to switch between light and dark colour schemes, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Application SHALL default to dark mode; `<html>` SHALL have `data-theme="dark"` on initial page load as defined in `index.html`.
2. WHEN the page loads and a `theme` value exists in `localStorage`, THE Theme Manager SHALL apply that theme by setting the `data-theme` attribute on `<html>` and displaying `"☀️"` on the toggle button if the theme is `dark`, or `"🌙"` if the theme is `light`.
3. WHEN the user clicks the theme toggle button while in dark mode, THE Theme Manager SHALL set `data-theme="light"` on `<html>`, update the toggle button icon to `"🌙"`, and persist `"light"` to `localStorage` under the key `theme`.
4. WHEN the user clicks the theme toggle button while in light mode, THE Theme Manager SHALL set `data-theme="dark"` on `<html>`, update the toggle button icon to `"☀️"`, and persist `"dark"` to `localStorage` under the key `theme`.
5. ALL colour values used by the UI (backgrounds, text, borders, accents, shadows) SHALL be defined as CSS custom properties and SHALL update automatically when the `data-theme` attribute changes, without requiring a page reload.
