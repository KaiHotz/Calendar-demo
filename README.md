# Calendar Demo

A modern, responsive calendar application built with React 19 and TypeScript. Features an intuitive interface for managing events with drag-and-drop functionality, multiple view modes, and a clean, professional design.

![React](https://img.shields.io/badge/React-19.2.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF)

## 🚀 Live Demo

👉 [**Try the Live Demo**](https://kaihotz.github.io/Calendar-demo/)

## ✨ Features

### Multiple View Modes

- **Day View** - Focus on a single day with hourly time slots
- **Week View** - Overview of the entire week (default on desktop)
- **Month View** - Bird's eye view of the month with event previews

### Event Management

- **Create Events** - Click on any time slot to add a new event
- **Delete Events** - Hover over an event and click the trash icon
- **Drag & Drop** - Move events to different time slots or days (desktop only)
- **Resize Events** - Adjust event duration by dragging the bottom edge (desktop only)
- **Multi-day Events** - Support for events spanning multiple days
- **Overlapping Events** - Smart layout algorithm for overlapping events

### User Experience

- **Responsive Design** - Optimized for both desktop and mobile devices
- **Today Indicator** - Quick visual identification of the current day
- **Navigation** - Easy navigation between days, weeks, and months
- **"Today" Button** - One-click return to the current date
- **Color-coded Events** - Visual distinction between different events

## 🛠️ Tech Stack

- **React 19.2** - Latest React with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **date-fns** - Modern JavaScript date utility library
- **Lucide React** - Beautiful, customizable icons
- **Vitest** - Fast unit testing framework
- **ESLint & Prettier** - Code quality and formatting

## 📁 Project Structure

```
src/
├── components/
│   └── Calendar/
│       ├── Calendar.tsx        # Main calendar component
│       ├── CalendarHeader.tsx  # Navigation and view controls
│       ├── CalendarEvent.tsx   # Individual event rendering
│       ├── MonthView.tsx       # Month view layout
│       ├── TimeLine.tsx        # Time indicator line
│       ├── types.ts            # TypeScript interfaces
│       └── utils.ts            # Helper functions
├── utils/
│   └── cn.ts                   # Class name utility (clsx + tailwind-merge)
├── App.tsx                     # Root application component
└── main.tsx                    # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

#### Option 1: Clone with Git

```bash
git clone git@github.com:KaiHotz/Calendar-demo.git
cd Calendar-demo
npm install
npm run dev
```

#### Option 2: Download ZIP

1. [Download the ZIP file](https://github.com/KaiHotz/Calendar-demo/archive/refs/heads/master.zip)
2. Extract the contents
3. Open terminal and navigate to the folder:

```bash
cd Calendar-demo-master
npm install
npm run dev
```

Then open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`).

## 📜 Available Scripts

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm run dev`         | Start development server         |
| `npm run build`       | Build for production             |
| `npm run preview`     | Preview production build         |
| `npm run test`        | Run unit tests with Vitest       |
| `npm run eslint`      | Lint the codebase                |
| `npm run eslint:fix`  | Fix linting issues               |
| `npm run check-types` | TypeScript type checking         |
| `npm run deploy`      | Build and deploy to GitHub Pages |

## 📖 Usage Guide

### Adding Events

Click on any empty time slot in Day or Week view to create a new event.

### Deleting Events

Hover over any event to reveal the delete button (trash icon) in the top-right corner.

### Dragging Events (Desktop Only)

Click and hold on an event, then drag it to a new time slot or day.

### Resizing Events (Desktop Only)

Hover over an event to reveal the resize handle at the bottom. Drag to adjust the duration.

### Navigating

- Use the **←** and **→** arrows to move between time periods
- Click **Today** to jump to the current date
- Switch between **Day**, **Week**, and **Month** views using the buttons

> **Note:** Drag and resize functionality is disabled on mobile devices for better UX.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Kai Hotz**

- GitHub: [@KaiHotz](https://github.com/KaiHotz)
