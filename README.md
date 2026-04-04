# Interview Prep and Consistency Tracker

This project is a full-stack study tracking system for interview preparation. It lets users register, select skills to track, log daily work, monitor streaks, review weak areas, maintain revision queues, and visualize engagement with analytics and a click heatmap.

The system is split into:

- A Node.js + Express backend for authentication, business logic, analytics, and MongoDB persistence
- A React + Vite frontend for onboarding, dashboarding, profile management, and interactive visualizations

## Core Features

- User registration, login, and password change
- JWT-based protected APIs
- Skill onboarding and custom skill management
- Daily study log creation with topic, skill, status, difficulty, and time spent
- Automatic streak tracking when a new log is created
- Dashboard metrics for:
  - current streak
  - consistency score
  - total time invested
  - active skills
- Daily log, weekly log, and skill-based log filtering
- Skill progress analytics grouped by practice volume and time spent
- Weekly velocity analytics grouped by ISO week
- Weak-area detection based on low practice frequency or repeated struggle
- Revision queue tracking with revision counts
- Activity heatmap and click-tracking support
- Theme support and animated modern UI

## User Flow

1. A user signs up or logs in from the frontend.
2. The backend validates credentials and returns a JWT access token.
3. The frontend stores the token in `localStorage` and attaches it to future API calls through Axios interceptors.
4. During onboarding, the user selects or creates skills to track.
5. On the dashboard, the user logs study sessions by skill, topic, status, difficulty, and time spent.
6. Each new log is saved in MongoDB and also triggers streak recalculation.
7. Analytics endpoints aggregate the stored logs to produce:
   - skill progress
   - weekly progress
   - consistency score
   - weak areas
8. Revision items are created and maintained separately so topics can stay in a follow-up queue.
9. Heatmap click events can be saved and later replayed per route for UI behavior analysis.

## Data Flow

### Authentication Flow

- `frontend/src/pages/Login.jsx` and `frontend/src/pages/Signup.jsx` call the auth service
- `frontend/src/services/authService.js` sends requests to `/api/auth/*`
- `controllers/auth-controller.js` handles register, login, and password change
- Passwords are hashed with `bcrypt`
- Successful login returns a JWT signed with `jsonwebtoken`
- `frontend/src/services/sessionService.js` stores the token and checks expiry
- `frontend/src/services/axiosConfig.js` injects `Authorization: Bearer <token>` into protected requests

### Skill Management Flow

- Onboarding and dashboard call skill service helpers
- Requests hit `/api/skills/add`, `/api/skills/fetch`, and `/api/skills/delete/:skillId`
- Skills are stored as embedded subdocuments inside the `user` document
- The frontend `SkillContext` refreshes dashboard state after skill changes

### Study Log Flow

- The dashboard log form calls `addDailyLog()` from `SkillContext`
- `frontend/src/services/logService.js` posts to `/api/log/add`
- `controllers/log-controller.js` saves a `log` document in MongoDB
- After saving, `utils/streak-utils.js` updates the user streak record
- The frontend then refreshes dashboard analytics and visible lists

### Analytics Flow

- Dashboard load triggers `refreshDashboard()` inside `frontend/src/context/SkillContext.jsx`
- That context fetches data in parallel from:
  - skills
  - streak
  - consistency
  - skill progress
  - all logs
  - weekly progress
  - weak areas
  - revisions
  - today logs
  - weekly logs
- Backend analytics controllers use MongoDB aggregation pipelines over `logs`
- Results are rendered into cards, tables, progress bars, and charts on the dashboard

### Revision Flow

- Revision data is stored in a dedicated `Revision` collection
- Each revision item tracks:
  - user
  - skill
  - topic
  - revision count
  - last revised timestamp
- The frontend fetches revision items from `/api/revision/fetch`
- When a topic is marked revised in the dashboard, the item is removed through `/api/revision/:revisionId`

### Heatmap Flow

- Frontend heatmap components record click locations by route
- `frontend/src/services/analyticsService.js` sends click batches to `/api/analytics/click`
- `controllers/heat-map-controller.js` stores click coordinates, element ids, route, resolution, and optional user id
- Heatmap data is fetched with `/api/analytics/heatmap?route=...`

## System Architecture

### Backend

Backend responsibilities:

- connect to MongoDB
- expose REST APIs
- protect routes with JWT middleware
- persist study, skill, streak, revision, and heatmap data
- compute analytics from log history

Important backend folders:

- `controllers/` contains request handlers and business logic
- `routes/` maps endpoints to controllers
- `models/` defines MongoDB schemas via Mongoose
- `middleware/` contains authentication middleware
- `database/` contains DB connection logic
- `utils/` contains streak update logic
- `index.js` is the backend entry point

### Frontend

Frontend responsibilities:

- render landing, auth, onboarding, dashboard, and profile screens
- manage token-based session state
- call backend APIs through service modules
- centralize dashboard data state in context
- display analytics, activity, and heatmap visuals

Important frontend folders:

- `frontend/src/pages/` contains route-level screens
- `frontend/src/components/` contains reusable UI and visualization components
- `frontend/src/services/` contains Axios-based API wrappers
- `frontend/src/context/` contains theme and dashboard state management
- `frontend/src/assets/` contains images and branding assets

## Database Design

### `user`

Stores account identity and selected skills.

Main fields:

- `name`
- `email`
- `password`
- `collegename`
- `role`
- `skills[]`

Each skill subdocument contains:

- `name`
- `active`
- `addedAt`

### `log`

Stores each study session entry.

Main fields:

- `user`
- `skill`
- `status`
- `topic`
- `difficulty`
- `timespent`
- `createdAt`
- `updatedAt`

### `Streak`

Stores streak state per user.

Main fields:

- `userId`
- `currentStreak`
- `longestStreak`
- `lastActiveDate`

### `Revision`

Stores revision follow-up items.

Main fields:

- `user`
- `skill`
- `topic`
- `revisionCount`
- `lastRevisedAt`

### `Heatmap`

Stores click telemetry for UI interaction analysis.

Main fields:

- `user`
- `x`
- `y`
- `route`
- `elementId`
- `resolution`
- `createdAt`

## API Modules

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/changepassword`

### Skill Routes

- `POST /api/skills/add`
- `GET /api/skills/fetch`
- `POST /api/skills/delete/:skillId`

### Log Routes

- `POST /api/log/add`
- `POST /api/log/dailylog`
- `POST /api/log/weeklog`
- `GET /api/log/filterbyskills`
- `GET /api/log/all`

### Streak Routes

- `GET /api/streak/fetch`

### Analytics Routes

- `GET /api/analytics/progressskill`
- `GET /api/analytics/progressweekly`
- `GET /api/analytics/consistency`
- `GET /api/analytics/weakarea`
- `POST /api/analytics/click`
- `GET /api/analytics/heatmap`

### Revision Routes

- `POST /api/revision/add`
- `GET /api/revision/fetch`
- `DELETE /api/revision/:revisionId`

## Folder Structure

```text
.
├── controllers/
├── database/
├── middleware/
├── models/
├── routes/
├── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── index.js
├── package.json
└── README.md
```

## Packages, Libraries, and Technologies Used

### Backend Technologies

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT authentication
- BCrypt password hashing
- Dotenv for environment variables
- Nodemon for backend development
- CommonJS module system

### Frontend Technologies

- React 19
- React DOM
- React Router DOM
- Vite
- Axios
- Tailwind CSS v4
- Framer Motion
- GSAP
- Lucide React icons
- Context API for shared state
- LocalStorage for session persistence

### Tooling

- ESLint
- `@vitejs/plugin-react`
- `@tailwindcss/vite`

## Installed Dependencies

### Root `package.json`

- `bcrypt`
- `dotenv`
- `express`
- `jsonwebtoken`
- `mongoose`
- `nodemon`

### `frontend/package.json`

- `axios`
- `framer-motion`
- `gsap`
- `lucide-react`
- `react`
- `react-dom`
- `react-router-dom`

Dev dependencies:

- `@eslint/js`
- `@tailwindcss/vite`
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react`
- `eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `tailwindcss`
- `vite`

## Environment Variables

The backend expects these environment variables:

- `port`
- `mongooseurl`
- `jwtkey`

The frontend also supports:

- `VITE_API_URL`

If `VITE_API_URL` is not provided, the Vite dev server proxy forwards `/api` requests to `http://localhost:4000`.

## Running the Project

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- The backend currently uses MongoDB Atlas via Mongoose.
- Most dashboard analytics are computed dynamically from the `log` collection.
- Streaks are not manually edited; they are updated automatically when logs are added.
- The project currently does not include automated tests in the root `package.json`.
