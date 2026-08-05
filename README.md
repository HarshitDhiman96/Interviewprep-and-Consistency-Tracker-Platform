# Interview Prep and Consistency Tracker

## Project Overview

This project is a full-stack interview preparation and consistency tracker built around a personalized AI coach. It combines daily study logging, streak and consistency tracking, weak-area detection, revision planning, heatmap analytics, and an AI-powered coaching assistant.

The app is designed to help learners stay accountable, understand their weak spots, and get adaptive study advice based on their conversation history and logged activity.

---

## What makes this project stand out

### ⭐ AI Personalized Coach 

The AI coach is the core differentiator:

- Provides conversational coaching from the dashboard.
- Stores user chat history in `Chat` documents.
- Generates semantic memory embeddings in `Embed` documents.
- Retrieves relevant past summaries to personalize responses.
- Uses external LLM providers via `backend/utils/llm-utils.js`.
- Summarizes conversations for long-term context using `/api/AI/chatbot/summary`.

This makes the coach feel like a real mentor rather than a generic chatbot.

---

## Full architecture

### Backend architecture

The backend is a Node.js + Express API with a layered architecture:

- `backend/index.js` - main Express server and route registration
- `backend/routes/` - route definitions for auth, skills, logs, analytics, AI, revision, streak, and more
- `backend/controllers/` - request handling and business logic
- `backend/models/` - Mongoose schemas for persistent data
- `backend/middleware/` - authentication and inconsistency gating
- `backend/utils/` - utilities for cookies, AI, streak updates, and heatmap logic

### Frontend architecture

The frontend is a React + Vite app structured around:

- `frontend/src/pages/` - page-level views (Landing, Login, Signup, Onboarding, Dashboard, Profile)
- `frontend/src/components/` - reusable UI components and feature widgets
- `frontend/src/context/` - `AuthContext` and `SkillContext` state management
- `frontend/src/services/` - API service wrappers using Axios
- `frontend/src/App.jsx` - application routing and global layout

### Data flow

1. User interacts with the React UI.
2. Frontend sends authenticated `Axios` requests to backend `/api/*` endpoints.
3. Backend validates JWT via `auth-middleware.js`.
4. Business logic runs in controllers.
5. Data is persisted and queried in MongoDB using Mongoose models.
6. AI conversations use Groq / Gemini through `llm-utils.js`.

---

## Models and Schemas

### User (`backend/models/user-model.js`)

Fields:
- `name`, `email`, `password`
- `role` (`user` or `admin`)
- `rememberMe`, `lastActiveDate`, `currentStreak`, `lastLoginDate`
- `isFirstTimeUser`, `needsInconsistencyReason`, `inconsistencyGapDays`
- `primaryGoal`, `goalCompleted`, `goalCreatedAt`
- `skills` array with `name`, `active`, `addedAt`

### Log (`backend/models/logs-model.js`)

Fields:
- `user` reference
- `skill`, `topic`, `status` (`solved`, `stuck`, `revised`)
- `difficulty` (`easy`, `medium`, `hard`)
- `timespent`, `reflection`, `mood`

### Chat (`backend/models/AI-Chat-model.js`)

Fields:
- `userId`, `conversationId`
- `fullChat` array of message objects
- `summary`, `lastSummarizedMessageCount`, `lastActivityAt`, `isSummaryGenerated`

### Embed (`backend/models/embed-model.js`)

Fields:
- `userId`, `chatId`, `conversationId`
- `summary`, `embedding`, `createdAt`

### InconsistencyReason (`backend/models/inconsistency-reason-model.js`)

Fields:
- `userId`, `reason`, `tag`
- `gapDays`, `createdAt`

### Revision (`backend/models/revision-model.js`)

Fields:
- `user`, `skill`, `topic`
- `revisionCount`, `lastRevisedAt`

### Streak (`backend/models/streak_model.js`)

Fields:
- `userId`, `currentStreak`, `longestStreak`, `lastActiveDate`

### Heatmap (`backend/models/heatmap-model.js`)

Fields:
- `user`, `x`, `y`, `route`, `elementId`, `resolution`

---

## Key features

### AI coach and personalization

- Real-time conversational AI support.
- Memory-based summaries and retrieval.
- Context-aware recommendations and follow-up advice.
- Uses vector similarity to find relevant past memories.
- Supports fallback between Groq and Google Gemini providers.

### Study logging and progress tracking

- Create logs with skill, topic, difficulty, status, time spent.
- Reflect on sessions with mood and reflection notes.
- Track daily logs, weekly logs, and all activity.
- Filter logs by skill.

### Consistency and streaks

- Automatically update streak after each log.
- Calculate a consistency score from active study days.
- Show current streak and progress stats.
- Block progress until inconsistency reason is submitted after a gap.

### Weak-area detection

- Detect weak skills/topics from logged performance.
- Flag areas with low practice or more stuck sessions than solved.
- Surface targeted topics for revision.

### Revision planning

- Add revision items for specific skills/topics.
- Increment revision counts on repeat work.
- Fetch revision queue and remove completed items.

### Goal and habit management

- Set and update a primary interview or study goal.
- Capture goals during onboarding and in profile.
- Use goals to guide AI coaching and progress tracking.

### Heatmap analytics

- Track click heatmap data for frontend routes.
- Persist user interactions to support UI analytics.
- Retrieve heatmap data for visualization.

---

## API overview

This project has 30+ backend endpoints. The main frontend routes include:

### Authentication and user

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/changepassword`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/remember-me`
- `POST /api/auth/goal`
- `PUT /api/auth/goal`
- `POST /api/update-goal`

### AI coach

- `POST /api/AI/chatbot`
- `POST /api/AI/chatbot/summary`

### Study logging

- `POST /api/log/add`
- `POST /api/log/dailylog`
- `POST /api/log/weeklog`
- `GET /api/log/filterbyskills`
- `GET /api/log/all`

### Skills management

- `POST /api/skills/add`
- `GET /api/skills/fetch`
- `POST /api/skills/delete/:skillId`

### Analytics

- `GET /api/analytics/progressskill`
- `GET /api/analytics/progressweekly`
- `GET /api/analytics/consistency`
- `GET /api/analytics/weakarea`
- `POST /api/analytics/click`
- `GET /api/analytics/heatmap`

### Revisions

- `POST /api/revision/add`
- `GET /api/revision/fetch`
- `DELETE /api/revision/:revisionId`

### Streaks

- `GET /api/streak/fetch`

### Inconsistency reason gate

- `POST /api/inconsistency-reason`

---

## How to use this project

### 1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure environment variables

Create a `.env` in `backend/` and add:

```ini
MONGO_URI=<your-mongodb-uri>
jwtkey=<your-jwt-secret>
GROQ_API_KEY=<optional-groq-api-key>
GOOGLE_API_KEY=<optional-google-genai-key>
```

### 3. Start backend and frontend

```bash
cd backend
npm start
```

```bash
cd ../frontend
npm run dev
```

### 4. Use the app

- Visit the landing page and sign up.
- Create or select skills to track.
- Add daily activity logs with status, difficulty, mood, and reflection.
- Use the dashboard to monitor streaks, consistency, weak areas, and revision needs.
- Open the AI coach drawer and ask questions to get personalized study guidance.
- Submit inconsistency reasons if the app detects a gap in your practice.

---

## Packages and plugins

### Backend packages

- `express`, `mongoose`, `bcrypt`, `jsonwebtoken`
- `dotenv`, `cookie-parser`, `nodemon`
- `@google/genai`, `groq-sdk`, `readline-sync`

### Frontend packages

- `react`, `react-dom`, `react-router-dom`
- `axios`, `framer-motion`, `gsap`, `lucide-react`
- `tailwindcss`, `@tailwindcss/vite`, `vite`, `@vitejs/plugin-react`

---

## Deployment notes

- Backend is hosted as a Node/Express API.
- Frontend is served through Vite and deployed on Netlify.
- AI coaching requires valid external API keys when enabled.
- The backend uses MongoDB for all application data.

---

## Why this project is valuable

This app is more than a study tracker. It is a coach-backed practice system that helps users:

- stay consistent with daily interview preparation
- identify and fix weak topics
- maintain streaks and measurable progress
- receive personalized AI guidance based on their study history
- commit to revision planning and long-term improvement

The AI coach is the marquee feature, promoting the app as a smart, adaptive interview mentor.
