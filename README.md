# Intuch's Codex

Intuch's Codex is a personal learning blog and development journal. It is built with React as a practical project for learning modern web development while keeping the codebase simple, readable, and approachable.

## Features

- Browse articles by category
- Search articles by keyword
- Load additional articles as needed
- Read Markdown-based article content
- Create an account, sign in, manage a profile, and update a password
- Like articles and post comments
- View and manage notifications
- Admin tools for managing articles, categories, drafts, published content, and images
- Responsive layout for desktop and mobile devices

## Technology Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- shadcn/ui and Radix UI
- Supabase Authentication
- Axios for Blog API requests
- React Markdown

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Getting Started

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```env
   VITE_API_BASE_URL=https://blogpost-server-flax.vercel.app
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   `VITE_API_BASE_URL` is optional and defaults to the public Blog API URL shown above. The Supabase values are required for authentication and member features.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the URL displayed in the terminal. The default address is `http://localhost:5173`.

## Available Scripts

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run preview   # Preview the production build locally
```

## Project Structure

```text
src/
├── api/                  # Functions for communicating with the Blog API
├── assets/               # Local assets such as the hero image
├── components/           # Reusable React components
│   ├── blog/             # Article list, detail, and interaction components
│   ├── layout/           # Shared navigation and footer
│   ├── member/           # Member page layouts and navigation
│   └── ui/               # shadcn/ui components
├── constants/            # Shared application constants
├── context/              # React Context providers for auth and admin state
├── lib/                  # Shared utilities and the Supabase client
├── pages/                # Route-level page components
│   └── admin/            # Admin article, category, and notification pages
├── App.jsx               # Application routes
└── main.jsx              # Application entry point
```
