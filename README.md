# My To-Do Dashboard (TaskFlow)

A modern, highly functional, and responsive personal dashboard designed to help users stay organized and productive. Built strictly with core frontend technologies, it offers advanced task management with client-side data persistence.

## 🚀 Features

### Core Features (MVP) & Technical Details
* **Semantic Markup:** Built with standard HTML5 elements and fully accessible ARIA attributes throughout the interface.
* **Robust To-Do List:** Full task management capabilities including adding tasks with titles (required) and optional descriptions.
* **Interactive Task States:** Easily toggle tasks between complete and incomplete statuses (featuring automatic strikethrough styling and muted text for finished items).
* **Granular Deletion:** Delete individual tasks with a single click.
* **Advanced Task Filters:** Quick tabs to filter view by **All**, **Active**, or **Completed** tasks.
* **Live Status Counter:** Real-time counter showing the exact number of remaining tasks left to do.
* **Bulk Action:** Features a "Clear Completed" button to purge finished tasks instantly.
* **Empty State Handling:** Displays a beautiful, clean placeholder message when the task list is completely empty.
* **Local Storage Integration:** Persists all task data under the `Todo Tasks` key, ensuring data remains intact even after page reloads.

### ⚡ Selected Challenges Implemented
* **Prevent Duplicate Tasks:** Form validation layer that prevents users from adding identical task titles to keep the list clean.
* **Custom Name in Greeting:** Personalizes the dashboard UI by saving the user's name across sessions.
* **Sort Tasks:** Allows users to order tasks efficiently for better daily planning.

---

## 🛠️ Technical Constraints & Stack

* **Structure:** HTML5 (Semantic & ARIA compliant)
* **Styling:** Vanilla CSS3 (Card-based layout, modern dark header `#1a1a2c`, CSS Custom Properties)
* **Logic:** Vanilla JavaScript (ES6+, No Frameworks, LocalStorage persistence)
* **Compatibility:** Fully responsive layout working seamlessly across all modern browsers.

---

## 📂 Project Structure

Following the project's folder layout guidelines, the repository is structured as follows:

```text
├── css/
│   └── style.css         # Single CSS file handling layouts and themes
├── js/
│   └── app.js            # Main JavaScript file handling all task logic
├── img/
│   └── logo.png          # Dashboard brand identity logo
├── .kiro/                # Kiro workflow configuration folder
├── index.html            # Main entry point website
└── README.md             # Project documentation
```

---

## 💻 Non-Functional Highlights

* **Simplicity:** Clean, intuitive interface with zero complex configurations or test setups required.
* **Performance:** Rapid load times and fast, zero-lag rendering during data creation and deletion.
* **Visual Design:** User-friendly aesthetics with a strong visual hierarchy, readable typography, and fluid UI updates.

---

## 🧑‍💻 Author
* **Name:** Syalisa Amani
* **Course:** RevoU Software Engineering Coding Camp
* **Repository Name:** CodingCamp-05October26-Syalisa