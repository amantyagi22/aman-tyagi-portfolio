# Aman Tyagi Portfolio

Minimalist personal portfolio for Aman Tyagi, a backend engineer. Built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion. Includes a command-menu navigation, dark/light theming (default dark), and a subtle animated grid/noise backdrop.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion

## Features

- Responsive, premium minimal UI inspired by modern developer portfolios
- Dark theme by default with light mode toggle
- Structured sections: Hero, About, Experience timeline, Skills, Projects, Writing, Contact
- Command-menu style navigation (Cmd/Ctrl + K)
- Subtle motion and page fade-in
- SEO metadata configured in root layout

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

- `app/` - App Router pages, layout, and global styles
- `components/` - Reusable UI and motion components
- `public/` - Static assets

## Notes

- Theme preference is stored in `localStorage`.
- Update social links and metadata in `app/page.tsx` and `app/layout.tsx` as needed.

## Deploy

Deploy with Vercel or any Node.js hosting that supports Next.js.
