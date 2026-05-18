# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm start            # Start both frontend (port 3000) + backend (port 3001) concurrently
npm run dev          # Same as npm start
npm run dev:frontend # Frontend only
npm run dev:backend  # Backend only (ts-node-dev with watch)
```

### Build
```bash
npm run build:all    # Build frontend (CRA) + backend (tsc)
npm run build        # Frontend only
```

### Database
```bash
npm run migrate      # Run SQLite migrations (backend/src/database/migrate.ts)
npm run seed         # Seed initial admin user
npm run update-admin # Update admin credentials
npm run check-admin  # Verify admin user exists
```

### Setup & Deploy
```bash
npm run setup        # Install deps + migrate + seed (first-time setup)
npm run deploy:setup # Production deploy setup
npm run test:integration # Integration tests
```

## Architecture

**Full-stack TypeScript app** — React 19 frontend + Express backend, sharing no source code.

### Frontend (`src/`)
- **Create React App** with TypeScript, deployed to GitHub Pages
- **Routing:** React Router v6 — all pages imported eagerly (no lazy loading). `AnimatePresence` in `App.tsx` wraps routes for fade transitions keyed to `location.pathname`
- **State:** Zustand stores with `persist` middleware (localStorage sync): `authStore`, `timelineStore`, `teamStore`
- **Auth:** Firebase client-side auth (`firebaseService.ts`) — login accepts email or username (does Firestore lookup), auto-creates Firestore user doc on first login via `ensureFirestoreUser()`
- **Styling:** Tailwind CSS v3 with custom design tokens — colors `earth`, `sage`, `stone`, `navy`; fonts `Space Grotesk` (body) and `JetBrains Mono` (mono)
- **Animations:** Framer Motion throughout — page transitions, hero sections, team carousel, timeline cards
- **API layer:** `src/services/firebaseService.ts` (real Firebase Firestore/Storage). `src/services/api.ts` is a legacy mock, not used for real data
- **Firebase config:** `src/lib/firebase.ts` (projectId: `onekey-c16be`)
- **Dark base:** `body` background is `#1c1917` (stone-900) set in both `public/index.html` and `src/styles/index.css` to prevent white flash on load

### Styling files (`src/styles/`)
- `index.css` — CSS reset, body background, font
- `tailwind.css` — Tailwind directives
- `enhanced-design.css` — main custom CSS: nav (`.site-nav`), hero (`.hero-section`, `.hero-section--short`), team page (`.team-section`, `.team-grid`, `.tc__*` carousel, `.team-card`), timeline modal inputs (`.tlm-input`, `.tlm-label`), admin photo cropper (`.tpf__*`)
- `admin-dashboard.css` — admin dashboard styles including `.tpf__*` TeamPhotoField classes
- `navigation-fixes.css`, `modal.css`, `home-new.css` — supplementary

### Backend (`backend/src/`)
- **Express + TypeScript**, single server serves API in dev and both API + built frontend in production
- **Database:** SQLite in WAL mode at `backend/data/onekey.db`
  - Tables: `users`, `timeline_events`, `activity_logs`
- **Auth middleware:** `middleware/auth.ts` — `authenticateToken` (JWT verify), `requireRole` (RBAC)
- **Roles:** `super_admin` > `admin` > `user`
- **File uploads:** Multer to `backend/uploads/` with UUID filenames
- **Activity logging:** middleware auto-logs all admin actions

### API Routes (`/api/v1/`)
| Route | Auth |
|---|---|
| `POST /auth/login` | Public |
| `GET /auth/me` | Token |
| `GET/POST /users` | Admin |
| `PUT/DELETE /users/:id` | Admin |
| `GET /timeline/events` | Public |
| `POST /timeline/events` | Admin |
| `PUT/DELETE /timeline/events/:id` | Admin |
| `POST /upload/images` | Admin |

### Key Pages & Routes
| Path | Component | Notes |
|---|---|---|
| `/` | `Home.tsx` | Hero slideshow, photo gallery |
| `/about` | `About.tsx` | Work in progress placeholder |
| `/timeline` | `Timeline.tsx` | Dark theme, year-grouped chronicle, Framer Motion cards, admin CRUD inline. Has `hero-section--short` (52vh hero) + bouncing scroll hint |
| `/team` | `MeetOurTeam.tsx` | Carousel (`TeamCarousel`) for Leadership/Comms/Coordinators; flat centered flex grid for Alumni |
| `/vanstring` | `VanstringHome.tsx` | Placeholder — Vanstring is a student orchestra subgroup of OneKey, pages TBD |
| `/admin` | `AdminDashboard.tsx` | User mgmt, event mgmt, team photo upload/crop, activity logs |

### Key Components
- `src/components/TeamCarousel.tsx` — horizontal scroll carousel with prev/next arrows, scroll-snap, 360px fixed-width cards, equal-height rows
- `src/components/Admin/TeamPhotoField.tsx` — canvas-based image crop + Firebase Storage upload for team member photos
- `src/components/Slideshow.tsx` — crossfade image slideshow used in heroes
- `src/components/Layout/Navbar.tsx` — responsive nav; "Vanstring" link added; no "Get Involved" button

### Navbar links (current)
About · Timeline · Team · Vanstring

### Team page structure
Sections in order: Leadership (split) · Communications (split) · Homework Help Coordinators · Financial Managers · Concertmasters · Tech & Design · Alumni

- **Leadership, Communications** — `SplitSection`: left = OneKey, right = Vanstring, each side is a `TeamCarousel` (360px cards)
- **Coordinators, Finance, Concertmasters, Tech & Design** — `TeamSection` with `TeamCarousel`; Concertmasters uses `grid` prop instead
- **Alumni** — flat `team-grid` (flex-wrap centered, compact cards)
- All carousel cards are 360px fixed width; single cards center via `justify-content: center` on `.tc__track`

### TeamMember cross-section fields
Every `TeamMember` in Firestore (`teamMembers` collection) can appear in multiple sections:
- `section` — primary section (determines default `group`)
- `group?: 'onekey' | 'vanstring'` — which side of a split section (Leadership/Communications)
- `extraSections?: section[]` — additional sections this member appears in
- `extraSectionsGroups?: Partial<Record<section, 'onekey'|'vanstring'>>` — group override per cross-listed split section
- `concertmasterType?: 'concertmaster' | 'associate' | 'principal_second'` — rank within Concertmasters; drives card title and sort order (Concertmaster → Associate → Principal Second Violin)
- `extraSectionsConcertmasterTypes?: Partial<Record<section, concertmasterType>>` — concertmaster type for when a member is cross-listed **into** Concertmasters from another section
- `isActive: boolean` — false hides the member site-wide

`TeamMemberCard` derives the displayed role from `concertmasterType` / `extraSectionsConcertmasterTypes` / `extraSections` context, then falls back to `member.role`.

Admin panel shows contextual sub-selectors inline:
- OneKey/Vanstring dropdown appears when primary section or cross-listed section is Leadership or Communications
- Concertmaster Type dropdown appears when primary section or cross-listed section is Concertmasters

## Environment Variables (backend `.env`)
```
PORT=3001
NODE_ENV=development
JWT_SECRET=<secret>
CORS_ORIGIN=http://localhost:3000
DB_PATH=./data/onekey.db
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_EMAIL=on3keymusic@gmail.com
DEFAULT_ADMIN_PASSWORD=admin123
```

## Data Flow
1. User authenticates via Firebase (`signInWithEmailAndPassword`) — input can be email or username (username triggers Firestore lookup)
2. `ensureFirestoreUser()` creates Firestore doc if missing; grants `super_admin` if email is `on3keymusic@gmail.com`
3. Frontend stores auth state in Zustand `authStore` (persisted to localStorage)
4. Timeline/team data lives in Firestore; admin mutations go through `firebaseService.ts`
5. Image uploads go to Firebase Storage; returned URL stored as `filePath` on the record

## Commit style
Short, lowercase, conventional-commits style: `feat(scope): description` or `fix(scope): description`. No AI/Claude co-authorship hints.

## Animations
Always include at least some form of Framer Motion or GSAP animation in any UI work — even if small and subtle (a fade-in, hover scale, stagger on mount, etc.). Never ship a static UI change with zero motion.
