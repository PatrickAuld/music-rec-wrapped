# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build (also runs on PRs via GitHub Actions)
npm run lint     # Run ESLint
npm start        # Start production server (requires build first)
```

## Architecture

This is a Next.js 16 App Router application displaying "Spotify Wrapped"-style statistics for a music sharing group chat. It uses React 19 and Tailwind CSS 4.

### Data Flow

All user statistics are pre-computed and stored in `src/data.json` (typed via `src/types.ts`). The data structure:
- `top_level`: Aggregate stats (total messages, links, reactions)
- `leaderboards`: Ranked lists for various categories
- `users`: Per-user stats including pre-generated `cards` arrays for their wrapped experience

### Page Structure

- `/` (`src/app/page.tsx`): User selection page with search
- `/wrapped/[slug]` (`src/app/wrapped/[slug]/page.tsx`): Statically generated wrapped experience per user
- `/leaderboards` (`src/app/leaderboards/page.tsx`): All category rankings

### Key Components

- `WrappedViewer`: Full-screen card carousel with auto-advance (30s), keyboard/touch navigation, progress tracking
- `WrappedCard`: Renders different card types (intro, stat, platform, mvp, timeline, leaderboard_highlight, outro) with animated graphs

### Styling Patterns

- Tailwind gradient backgrounds per card type (platform cards use brand colors: Spotify=green, SoundCloud=orange, YouTube=red)
- Custom animations defined in `src/app/globals.css` (fade-in, scale-in, count-up)
- Glass morphism effect via `.glass` class
