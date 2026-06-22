# Intuch's Codex

A personal blog where I share development notes, competitive Warhammer 40,000 strategy, and lessons learned along the way. This project also serves as a portfolio piece for my resume — built to showcase front-end skills with a clean, modern UI.

> _"Seek Knowledge, Question Everything."_

## About

**Intuch's Codex** is a personal blog and writing space built by **Intuch Bunluesup** — an aspiring developer and competitive Warhammer 40k player. The goal is to document my journey: building projects, learning continuously, and writing articles about what I discover.

## Features

- Responsive landing page (hero, article section, footer)
- Article browsing with category filters (Highlight, Development, Inspiration, Warhammer40k)
- Search bar for finding articles
- Light/dark theme support via CSS variables
- Accessible UI components built on Radix UI / shadcn

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons:** [lucide-react](https://lucide.dev/)
- **Fonts:** Inter & Geist (Fontsource)
- **Linting:** ESLint

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/intuchs-codex.git
cd intuchs-codex

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the development server with HMR    |
| `npm run build`   | Build the app for production             |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint                               |

## Project Structure

```
intuchs-codex/
├── public/
├── src/
│   ├── assets/             # Images (hero, etc.)
│   ├── components/
│   │   ├── ui/             # Reusable UI components (button, input, select)
│   │   ├── navbar.jsx
│   │   ├── heroSection.jsx
│   │   ├── articleSection.jsx
│   │   └── footer.jsx
│   ├── App.jsx             # Root component
│   ├── index.css           # Theme variables & global styles
│   └── main.jsx            # App entry point
├── index.html
├── package.json
└── vite.config.js
```

## Contact

Get in touch:

- LinkedIn
- GitHub
- Email

---

Built with React + Vite by Intuch Bunluesup.
