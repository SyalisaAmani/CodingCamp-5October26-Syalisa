
# TaskFlow — Personal Productivity Dashboard

A modern, responsive, and user-friendly productivity dashboard designed to help users organize daily tasks, manage their time, and stay focused. Built using core frontend technologies, TaskFlow combines task management, focus sessions, customizable quick links, and persistent browser storage in one convenient interface.

## 🚀 Features

### 1. Task Management
- **Add Tasks:** Create tasks with a required title and an optional description.
- **Edit Tasks:** Update existing task titles and descriptions.
- **Complete Tasks:** Mark tasks as completed or return them to an active state.
- **Delete Tasks:** Remove individual tasks from the list.
- **Duplicate Prevention:** Prevent duplicate task titles using case-insensitive validation.
- **Clear Completed:** Remove completed tasks in one action.
- **Empty State:** Display a helpful placeholder when no tasks are available.

### 2. Task Filtering & Sorting
- **Filter Tasks:** View all tasks, active tasks, or completed tasks.
- **Sort Tasks:** Organize tasks by newest, oldest, or alphabetical order.
- **Remaining Task Counter:** Display the number of unfinished tasks in real time.

### 3. Focus Timer
- **25-Minute Focus Session:** Start with a default timer designed for focused work.
- **Start, Stop, and Reset:** Control the timer according to your workflow.
- **Real-Time Countdown:** Track the remaining time during a focus session.

### 4. Quick Links
- **Default Shortcuts:** Access frequently used websites, including Google, GitHub, YouTube, and LinkedIn.
- **Add Custom Links:** Add favorite websites using a website name and URL.
- **URL Validation:** Accept valid HTTP and HTTPS website addresses.
- **Duplicate URL Prevention:** Prevent the same website from being added more than once.
- **Persistent Links:** Save custom links in Local Storage so they remain available after reloading the page.

### 5. Personalization & Themes
- **Personalized Greeting:** Display a greeting based on the time of day and support a custom user name where configured.
- **Live Date and Time:** Display current date and time information.
- **Light and Dark Modes:** Switch between light and dark themes.
- **Theme Persistence:** Save the selected theme in Local Storage so it remains active across sessions.
- **Responsive Interface:** Adapt the dashboard layout to desktop, tablet, and mobile screen sizes.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure and accessible interface elements |
| CSS3 | Layout, responsive design, visual styling, and theme management |
| Vanilla JavaScript (ES6+) | Application logic, DOM manipulation, event handling, and validation |
| Local Storage | Client-side persistence for tasks, themes, and quick links |
| Git & GitHub | Version control and source code hosting |
| Kiro | Project requirements and development workflow documentation |

**Technical constraints:**
- No frontend frameworks are required.
- No backend or database server is required for the current implementation.
- Application data is stored locally in the user's browser.
- The interface is designed for modern web browsers.

---

## 📂 Project Structure

```text
CodingCamp-05October26-Syalisa/
├── .kiro/
│   └── ...                 # Kiro configuration and project specifications
├── css/
│   └── style.css           # Application styles, layouts, and themes
├── js/
│   └── app.js              # Task logic, timer, quick links, and interactions
├── img/
│   └── logo.png            # Application logo or brand assets
├── index.html              # Main HTML entry point
└── README.md               # Project documentation
```

> **Note:** The folder descriptions above represent the intended organization. Update the structure if your actual repository contains additional files or nested folders.

---

## 💾 Data Persistence

TaskFlow uses the browser's Local Storage API to retain application data between page reloads.

Depending on the implemented features, stored data includes:

- Task titles, descriptions, and completion statuses.
- Custom Quick Links and their URLs.
- The user's selected theme.
- Other personalization settings supported by the application.

All stored data remains in the current browser profile on the user's device. It is not automatically synchronized across browsers or devices.

---

## 💻 Non-Functional Highlights

- **Usability:** A clean dashboard layout helps users access essential features quickly.
- **Performance:** Vanilla JavaScript keeps the application lightweight without requiring a frontend framework.
- **Maintainability:** Task operations, interface rendering, and event handling are organized in the main JavaScript file.
- **Responsive Design:** Layouts adapt to different screen sizes.
- **Accessibility:** Semantic HTML and appropriate ARIA attributes support accessible interactions where implemented.
- **Data Persistence:** Local Storage allows supported settings and data to survive page reloads.

---

## ⚙️ Getting Started

### Prerequisites
- A modern web browser.
- A code editor, such as Visual Studio Code, if you want to modify the source code.
- Git, if you want to clone the repository.

---

## 🔮 Future Improvements

Potential enhancements for future versions include:

- Task priority levels and due dates.
- Search functionality for tasks.
- Task categories or tags.
- Editable and removable Quick Links.
- Customizable focus durations and break sessions.
- Export and import of task data.
- Cloud synchronization across devices.

---

## 🧑‍💻 Author

- **Name:** Syalisa Amani
- **Course:** RevoU Software Engineering Coding Camp
- **Repository:** `CodingCamp-05October26-Syalisa`

---

## 📄 License

This project was created for learning and development purposes as part of the RevoU Software Engineering Coding Camp.

Unless a separate license file is provided, no open-source reuse license is explicitly granted.