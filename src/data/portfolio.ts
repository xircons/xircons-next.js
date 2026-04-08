import { projectGalleryFrames, projectImage } from '@/lib/project-assets'
import type { NonEmptyArray, PortfolioContent } from '@/types/portfolio'

export const PORTFOLIO_VERSION = '1.0.0'

const NL = 'ninjalingo'
const ICAS = 'icas-cmu-hub'
const FARM = 'react-farm-life-cycle'
const STORE = 'store-atelien'
const TTT = 'tic-tac-toe-with-ai'
const HOSTEL = 'good-night-hostel'
const ZERO_MOCK = 'zero-mock'

/** Frames 01–24 and 26–29 (no 25.png on disk). */
const GOOD_NIGHT_HOSTEL_FRAMES = [
  ...Array.from({ length: 24 }, (_, i) => i + 1),
  26, 27, 28, 29,
] as unknown as [number, ...number[]]

export const portfolioData: PortfolioContent = {
  about: {
    title: "HELLO! I'M XIRCONS",
    description:
      'Sawaddeekub, I am Wuttikan, a web developer and DII student at Chiang Mai University in Chiang Mai, Thailand. Explore my work here and on my repositories.',
  },
  works: [
    {
      id: 7,
      slug: ZERO_MOCK,
      title: 'Zero-mock',
      subtitle: 'Solo project — end-to-end ownership',
      category: 'production',
      role: 'Full-stack developer',
      completedAt: '2026',
      githubUrl: 'https://github.com/xircons/zero-mock',
      npmjsUrl: 'https://www.npmjs.com/package/@xirconsss/zero-mock',
      heroImage: projectImage(ZERO_MOCK, 'hero.png'),
      body: [
        "I built **zero-mock** as a solo maintainer in a full-stack / tooling role. It is a zero-config Node.js CLI that turns a single JSON file into a local REST API: each top-level key becomes a collection, each value is an array of records, and the tool serves full CRUD with CORS and JSON bodies. The problem it solves is familiar to frontend teams: you need a believable backend for prototypes, demos, and integration tests without provisioning a database, writing routes by hand, or maintaining a bespoke mock server.",
        "The main flow for developers is deliberately minimal: install or `npx` the package, point `-f` at a JSON file, optionally set `-p`, `-d` (simulated latency), or `-w` (reload on file change), then call standard REST endpoints from the browser or curl. Listing supports query filters and `_page` / `_limit` pagination so you can mimic list APIs without extra config. The experience is optimized for clarity—one file is the source of truth, the terminal logs each request as `[METHOD] path - status`, and writes persist atomically so rapid local iteration feels safe.",
        "The stack is intentionally small: **TypeScript** (strict, CommonJS output), **Express** for HTTP, **cors** and **express.json()**, and **commander** for CLI flags—no extra runtime dependencies beyond those and Node built-ins. File I/O uses `fs/promises`; persistence uses a temp-file plus rename pattern with a serialized save queue so concurrent writes do not corrupt the JSON. **GitHub Actions** publishes to npm on push to `main`, with a guard to skip republishing an existing semver so CI stays reliable.",
        "One tricky part was balancing **zero-config** with real-world needs: simulated delay, request logging, list filtering, pagination, and watch mode had to plug into a thin **CLI → singleton store → server** pipeline without introducing config files or new packages. Watch mode in particular needed to reload in-memory state on disk changes while swallowing invalid JSON during saves and keeping the last good snapshot—users should never lose the server mid-edit. Shipping to **npm** under a scoped package also surfaced real release friction (duplicate-version publishes); tightening the workflow so **push to main** drives releases and skipping already-published versions removed repeated E403 failures and made the maintainer story match the product story: simple for users, predictable in production."
      ],
      gallery: [
        projectImage(ZERO_MOCK, '1.png'),
        projectImage(ZERO_MOCK, '2.png'),
        projectImage(ZERO_MOCK, '3.png'),
        projectImage(ZERO_MOCK, '4.png'),
      ] as NonEmptyArray<string>,
      description: 'A zero-config Node.js CLI that instantly turns a single JSON file into a full CRUD REST API with CORS, pagination, and simulated latency for rapid frontend development.',
      stack: ['TypeScript', 'Node.js', 'Express', 'npm', 'CLI'],
    },
    {
      id: 2,
      slug: 'ninjalingo',
      title: 'NinjaLingo',
      subtitle: 'Team project — collaboration & scale',
      category: 'production',
      role: 'Full-stack developer',
      completedAt: '2026',
      githubUrl: '',
      githubPrivate: true,
      heroImage: projectImage(NL, 'hero.png'),
      body: [
        "I worked on NinjaLingo as part of a team, in a full-stack role. It is a language-learning flashcard web app aimed at helping users study vocabulary in a structured way. The product solves the problem of finding trustworthy card sets, staying motivated, and reviewing on a schedule instead of cramming. Public card set catalog and card content live in the database and are loaded through the app's API, so learners always pull curated, consistent content while their own progress can be tracked over time.",
        'The main flow takes users from choosing a card set to a dashboard, into an interactive review session, and then to a completion screen with session feedback. Review uses spaced repetition (SM-2-style scheduling) so cards come back at sensible intervals. There is a profile area for account-related needs, shareable paths for specific sets (e.g. opening a set from a URL), and an admin area for managing content behind stricter access. On the UI side we focused on a clear, friendly experience: Tailwind CSS for layout and theming (including light/dark), and Framer Motion for motion so interactions feel smooth without getting in the way of studying.',
        'On the frontend I helped build an Astro site that hydrates/islands React 19 for the interactive app, with React Router handling in-app routes (dashboard, review, card sets, admin entry, etc.). Styling uses Tailwind; we use TypeScript and Vitest for type safety and tests. Authentication is Firebase Auth; the data layer calls Astro API routes and sends the Firebase ID token on protected requests. The database is Neon (Postgres) for public sets, cards, progress, stats, and admin-related data. Astro middleware enforces separation between learner routes and admin routes using a session cookie and role checks. We also maintain Node scripts for seeding, CSV to JSON conversion for content pipelines, and deployment (e.g. build + hosting).',
        "One tricky part was keeping the experience simple for guests while still supporting signed-in users and not exposing admin tools to the wrong people. We addressed that with a clear split in routing and server-side checks: middleware decides whether a path is public, learner-only, or admin-only, validates the Firebase token where needed, and redirects so admins and regular users do not land in each other's areas by mistake. On the data side, centralizing API access (authenticated fetch with the Bearer token to Astro endpoints backed by Neon) kept one consistent pattern for progress and catalog data instead of scattering logic across the client. That made it easier for the team to reason about security, roles, and data flow as the app grew.",
      ],
      gallery: projectGalleryFrames(
        NL,
        Array.from({ length: 17 }, (_, i) => i + 1),
      ) as NonEmptyArray<string>,
      description:
        'A flashcard web app I built so people can study and track their progress. I also wrote a custom script to convert vocabulary CSV files into JSON to easily import data. Users sign in to review cards, and admins manage the sets.',
      stack: ['Astro', 'React', 'TypeScript', 'Node.js', 'Firebase', 'PostgreSQL'],
    },
    {
      id: 1,
      slug: 'icas-cmu-hub',
      title: 'iCAS-CMU HUB',
      subtitle: 'Team project — collaboration & scale',
      category: 'competition',
      role: 'Full-stack developer',
      completedAt: '2025',
      githubUrl: 'https://github.com/xircons/iCAS-CMU',
      heroImage: projectImage(ICAS, 'hero.png'),
      body: [
        'I built iCAS-CMU HUB (Integrated Club Administration System) together with my team as a full-stack developer. The app is a web platform for managing university clubs at CMU: it centralizes memberships, events, assignments, budgets, reports, and admin workflows so leaders and staff are not juggling spreadsheets and informal channels. My goal was to help deliver a single place where members can join clubs and take part in activities, while admins and club leaders can run day-to-day operations with clear roles and permissions.',
        'The product is organized around role-based experiences—members see dashboards, QR check-in, club discovery, and feedback; leaders get check-in and leadership tools; admins manage club creation, owners, report inboxes, user oversight, and Smart Document flows. Users sign in through a login hub, then land on routes guarded by role, with a sidebar layout (and a separate club workspace with home, assignments, calendar, chat, and members) so the UI stays focused for each persona. We emphasized clear navigation, loading states, and toast feedback so common tasks feel straightforward on desktop and mobile-friendly layouts where it matters.',
        'Technically, the frontend is React 19 and TypeScript with Vite, React Router, Axios, Tailwind-style utility classes, Radix UI primitives, charts (Recharts), rich text (TipTap), and Socket.IO for live updates. The backend is Node.js with Express and TypeScript, structured by feature modules (auth, clubs, assignments, events, check-in, reports, smart documents, LINE webhooks), plus JWT/cookie-based auth, MySQL via mysql2, file uploads (Multer), rate limiting, and email/OTP-related services. Docker Compose runs MySQL, the API, and an nginx-served production build of the client, with documented port mappings so local tools and containers can coexist.',
        'One challenge we hit was keeping behavior consistent across environments (local XAMPP/MySQL vs Docker) and supporting real-time, club-scoped features without breaking security or UX. I helped align API configuration, environment variables, and the same schema bootstrap (icas_cmu_hub.sql) so everyone could spin up a reliable stack; on the app side, wiring WebSocket context to authenticated users and splitting admin vs club navigation reduced accidental cross-role access and made testing easier. Where the codebase also targets Thai copy and UTF-8 data, we treated charset and encoding carefully so names and messages stored and displayed correctly end to end.',
      ],
      gallery: projectGalleryFrames(
        ICAS,
        Array.from({ length: 18 }, (_, i) => i + 1),
      ) as NonEmptyArray<string>,
      description:
        'A web app I built for our university clubs so admins, leaders, and members can work in one place. You can join clubs, see events on a calendar, hand in assignments, chat in real time, and leaders can also manage documents and budgets.',
      stack: [
        'React',
        'TypeScript',
        'Tailwind',
        'Node.js',
        'Express',
        'MySQL',
        'Socket.io',
        'Docker',
      ],
    },
    {
      id: 5,
      slug: 'react-farm-life-cycle',
      title: 'React Farm Life Cycle',
      subtitle: 'Team project — collaboration & scale',
      category: 'academic',
      role: 'Frontend developer',
      completedAt: '2025',
      githubUrl: 'https://github.com/StellarBearX/reactGame',
      heroImage: projectImage(FARM, 'hero.png'),
      body: [
        'We built React Farm Life Cycle, a browser-based cozy farming simulation where players grow crops on a grid, sell produce, and progress through money, XP, and levels. The goal was to deliver a calm, Stardew-style loop—plant, wait for growth, harvest, and reinvest—while still feeling like a small economy game with shops, a shifting market, delivery contracts, and crafting. It solves the problem of practicing a full interactive product in the browser without needing a heavy server: the world runs in the client, but the rules (prices, quests, recipes) stay structured and testable.',
        'The main flow starts on a welcome/tutorial screen, then moves into a farm view with a grid of plots, a tabbed sidebar for market and contracts, and an inventory for seeds and goods. From there we routed separate views for the shop, a full inventory page, and a statistics dashboard so players can track level, money, and lifetime planted/harvested/earned totals. We focused the UI on simple layouts, readable status (money, day/time in the status bar), Thai-language copy where it fit the project, and small feedback touches like sound effects and optional background music, with responsive padding so the fixed header does not crush the layout on smaller screens.',
        'On the technical side we used Create React App with React and React Router for multi-page navigation. We centralized almost all game logic in a single Redux Toolkit slice (farmSlice) so planting, harvesting, economy, market state, contracts, crafting, skills, and tutorial flags live in one predictable place. We persist the farm slice to localStorage through a custom subscribe/save layer and normalize older saves when fields like inventories are missing. For backend-style behavior without a real API, we wrote an axios-based service that follows REST shapes (GET/POST/PUT/DELETE) but stores contracts and market snapshots in localStorage, using a mock adapter so the app does not spam failed network calls; a custom hook loads market data and falls back to local price calculation when no server data exists.',
        'A concrete challenge was designing market and contract flows so they feel like networked features even though everything runs offline. We resolved this by treating api.js as a clear boundary: async calls, simulated latency, and storage keys that could later map to real endpoints, while useMarketAPI always degrades gracefully to pure client logic from data/market.js. That let us keep Redux as the source of truth for gameplay while still practicing the kind of service-layer and error-handling patterns we use on real backends, without blocking the player when there is no server.',
      ],
      gallery: projectGalleryFrames(FARM, [1, 2, 3, 4, 6, 7]) as NonEmptyArray<string>,
      description:
        'A relaxing farm game I made in the browser. You grow crops, sell at a changing market, do small contracts, craft items, and save your farm in the browser.',
      stack: ['React', 'Redux', 'Tailwind', 'Axios'],
    },
    {
      id: 3,
      slug: 'store-atelien',
      title: 'store.atelien',
      subtitle: 'Solo project — end-to-end ownership',
      category: 'academic',
      role: 'Full-stack developer',
      completedAt: '2025',
      githubUrl: 'https://github.com/xircons/store.atelien',
      heroImage: projectImage(STORE, 'hero.png'),
      body: [
        'I built store.atelien, a full-stack e-commerce demo for my studies. It is a fictional design-focused store (inspired by a minimalist retail look) that lets people browse products, sign up and log in, manage a cart, apply discount codes, and complete checkout with shipping and totals. The goal was to show I can ship a realistic online shop end to end—not just static pages—while keeping the project clearly educational and non-commercial.',
        'On the customer side, the flow goes from browsing the catalog to cart, optional login, checkout with shipping details, and an order confirmation backed by the database. I focused on a clear path through purchase steps and a separate admin dashboard where orders can be reviewed, statuses updated, and data exported when needed. The public UI is built with plain HTML, CSS, and JavaScript so the experience stays lightweight and easy to reason about without a heavy front-end framework.',
        'I used Node.js and Express for the API, MySQL with mysql2 connection pooling for data, and vanilla JS in the public folder served as static assets. Authentication uses bcryptjs for passwords and jsonwebtoken with cookie-parser so protected actions (like checkout and discount validation) can rely on a secure, cookie-based session pattern. Routes are split by concern—products, auth, cart, checkout, discounts, admin, and logging—which keeps the server organized and mirrors how a larger app might be structured.',
        'One tricky part was orders: line items and shipping are structured data, but I still wanted everything in one relational model. I solved that by persisting cart lines and shipping as JSON in MySQL and using SQL JSON functions where the admin views need names or summaries, instead of many extra tables for a student-scope project. I also wired environment-based configuration (for example database settings and secrets via dotenv) so local setup stays repeatable and credentials stay out of the code—important when I was the only developer touching every layer.',
      ],
      gallery: projectGalleryFrames(
        STORE,
        Array.from({ length: 15 }, (_, i) => i + 1),
      ) as NonEmptyArray<string>,
      description:
        'An e-commerce website I made for a school project. People can sign up, browse products, use a cart and checkout, and there is an admin area to manage orders, products, and coupons.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'MySQL', 'JWT'],
    },
    {
      id: 4,
      slug: 'tic-tac-toe-with-ai',
      title: 'Tic-Tac-Toe with AI',
      subtitle: 'Solo project — end-to-end ownership',
      category: 'personal',
      role: 'Full-stack developer',
      completedAt: '2025',
      githubUrl: 'https://github.com/xircons/tictactoe-ai',
      heroImage: projectImage(TTT, 'hero.png'),
      body: [
        'I built a tic-tac-toe project that combines a playable web app with a reinforcement-learning side: the src/ area holds a self-play training pipeline and Q-learning-style agents for research and experimentation, while the shipped experience lets people play against AI opponents and see how game state is sent to a server for smarter moves. The goal was to turn a simple 3×3 game into something that shows both classic game AI and modern full-stack delivery, so visitors get a real product—not only a notebook or script.',
        'The app uses a multi-page flow with React Router: home with name entry and mode choice (human vs AI or two humans), a dedicated game screen with scores and reset, plus settings, match history, and an about page. I focused on a cohesive retro phone shell layout, optional background music and sound effects, slide notifications for turns and errors, a win modal, and achievements tied to play patterns. Difficulty maps to different AI behaviors (easy random play, medium heuristics, hard minimax-style play), and history plus achievements persist in the browser so the experience feels continuous across sessions.',
        'On the front end I used React with Vite, Redux Toolkit for game, settings, history, and achievements, and localStorage to persist everything except the in-progress board. The backend is a Flask REST API with CORS tuned for GitHub Pages, local Vite ports, and deployment hosts; it exposes health, move, and validate endpoints and reuses a shared Python tic-tac-toe engine. CI workflows build the SPA and deploy static assets to GitHub Pages while the API can run separately (for example on Render), with the front end pointing at a configurable base URL through environment variables—no traditional database, since state lives on the client.',
        'A practical challenge was hosting the UI and API on different origins: browsers enforce CORS, and the static site can outlive or lose contact with the API. I addressed this by explicitly allowing the right origins on the Flask side and by handling failed fetch calls in the game logic: if the API is unreachable, the client shows a clear message and falls back to a simple random move so the game still runs. That kept the demo reliable for portfolio viewers even when the backend sleeps or errors, without blocking the whole interface.',
      ],
      gallery: projectGalleryFrames(
        TTT,
        Array.from({ length: 9 }, (_, i) => i + 1),
      ) as NonEmptyArray<string>,
      description:
        'A tic-tac-toe game I built where you can play against the computer or with a friend. The computer has different levels, and on the hardest level it plays very strong so it is almost impossible to beat.',
      stack: ['React', 'Vite', 'Redux', 'Python', 'Flask'],
    },
    {
      id: 6,
      slug: 'good-night-hostel',
      title: 'Good Night Hostel',
      subtitle: 'Solo project ownership',
      category: 'personal',
      role: 'Full-stack developer',
      completedAt: '2025',
      githubUrl: 'https://github.com/xircons/good-night-hostel',
      heroImage: projectImage(HOSTEL, 'hero.png'),
      body: [
        'I built Good Night Hostel, a web project for a fictional hostel in Chiang Mai. It brings together a public site where visitors can learn about the property and complete a room search and booking flow, a simple guest account area (bookings, profile, notifications, loyalty), and a separate admin dashboard that behaves like a small property-management console. The main goal was to show how a real hostel might present itself online and how staff could track bookings, rooms, housekeeping, maintenance, and finances in one place—without relying on a production backend for this version.',
        "On the guest side, I focused on a clear path from home and room pages through booking (dates, guests, room choice, contact and details) to a confirmation screen that reflects what the guest submitted. I used CSS variables and shared typography (including Thai-friendly fonts) so the look stays consistent and easier to adjust. The admin side uses a sidebar layout, dashboard charts (Chart.js and CanvasJS), and dedicated screens for room and booking management, housekeeping, maintenance, finance, customers, staff, and security, with EN/TH language hooks on the dashboard to match the hostel's audience.",
        'The stack is plain HTML, CSS, and JavaScript—no separate server or database in the repo. Content and room metadata live in shared static data (for example a central hostelData object), while the booking confirmation and customer account behavior use localStorage so the flow feels persistent in the browser. The admin modules use their own JavaScript engines with mock booking and operations data to drive tables, filters, and UI updates, which keeps the dashboard interactive without wiring up a real API yet.',
        'A practical challenge was keeping a multi-step booking experience reliable without a server: I had to validate dates (for example ensuring check-out is after check-in and enforcing sensible minimums), pass state between pages, and redirect away from the confirmation page if confirmation data was missing, so users never saw an empty or broken summary. On the admin side, splitting features into focused JS modules next to matching CSS helped me avoid one huge file and made it easier to extend screens like booking or housekeeping independently.',
      ],
      gallery: projectGalleryFrames(HOSTEL, GOOD_NIGHT_HOSTEL_FRAMES) as NonEmptyArray<string>,
      description:
        'A booking website and staff dashboard I built for a hostel. Guests can look at rooms and switch languages, while staff can manage bookings, housekeeping, and view charts in their own admin area.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
    },
  ],
  skills: [
    {
      id: '00-1',
      title: 'FRONTEND ENGINEERING',
      details: [
        'REACT & NEXT.JS',
        'ASTRO & ISLANDS',
        'VITE',
        'REDUX TOOLKIT',
        'TAILWIND CSS',
        'RADIX UI',
        'VANILLA HTML/CSS/JS',
        'RESPONSIVE UI',
        'COMPONENT DESIGN',
        'TIPTAP (RICH TEXT)',
      ],
    },
    {
      id: '00-2',
      title: 'MOTION & INTERACTION',
      details: [
        'FRAMER MOTION',
        'SCROLL ANIMATIONS',
        'MICRO-INTERACTIONS',
        'CSS TRANSITIONS',
        'CHART.JS',
        'RECHARTS',
      ],
    },
    {
      id: '00-3',
      title: 'BACKEND & APIS',
      details: [
        'NODE.JS & EXPRESS',
        'PYTHON FLASK',
        'RESTFUL ROUTING',
        'USER AUTHENTICATION',
        'SOCKET.IO',
        'JWT & COOKIE SESSIONS',
        'CORS & SPLIT DEPLOYS',
        'RATE LIMITING & FILE UPLOADS',
      ],
    },
    {
      id: '00-4',
      title: 'DATABASES & DATA',
      details: [
        'MYSQL & POSTGRESQL',
        'NEON (SERVERLESS POSTGRES)',
        'SQLITE',
        'FIREBASE',
        'SQL & JSON (STRUCTURED FIELDS)',
        'DATA STRUCTURING',
      ],
    },
    {
      id: '00-5',
      title: 'END-TO-END DEVELOPMENT',
      details: [
        'FULL-STACK FLOW',
        'FRONTEND + BACKEND WIRING',
        'DOCKER COMPOSE',
        'CI & STATIC HOSTING',
        'DEPLOYMENT & HOSTING',
        'DEBUGGING & ITERATION',
      ],
    },
  ],
} as const satisfies PortfolioContent
