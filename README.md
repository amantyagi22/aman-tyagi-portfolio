# Aman Tyagi Portfolio

Personal portfolio for Aman Tyagi, a backend engineer.
A single centered bordered column: name, role, contact, and the work, as plain scannable text.
No 3D, no scroll-driven animation, no client-side state - every route prerenders as static HTML.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- lucide-react (icons)

## Features

- Bordered-column layout with hairline dividers between sections
- Dark theme by default with a light mode toggle, no flash of unstyled theme on load
- Sections: header, overview, experience, postmortems, stack, changelog, contact
- Printable resume at `/resume`
- SEO metadata configured in the root layout

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

- `app/` - App Router pages, layout, and global styles
- `components/` - UI components
- `lib/data.ts` - all site content (experience, incidents, stack, releases)
- `public/` - static assets

## Notes

- Theme preference is stored in `localStorage` and applied by a blocking inline script before first paint.
- Content lives in `lib/data.ts`, not in the components.

## Credits

The layout - bordered column, hairline dividers, striped section seams, corner
squares, and the handwritten marginalia - is adapted from
[chanhdai.com](https://github.com/ncdai/chanhdai.com) by Nguyen Chanh Dai, used
under the MIT license.
The GitHub and LinkedIn brand marks in `components/SocialLinks.tsx` come from
that project's icon set.
No part of that project's own name, wordmark, or likeness is used here.

## Deploy

Deploy with Vercel or any Node.js hosting that supports Next.js.
