# Interview Prep and Consistency Tracker

## Your AI-Powered Interview Coach

Meet the most exciting part of this project: an AI Personalized Coach that feels less like a chatbot and more like a study mentor. It remembers your struggles, your progress, and your goals, then adapts its advice to help you stay consistent, improve faster, and prepare smarter for interviews.

This platform combines structured study tracking with intelligent coaching so users can log their work, review analytics, and receive guidance that evolves with them over time.

---

## Why this project stands out

The standout feature is the AI coach experience:

- It remembers past conversations and uses prior context to give personalized advice.
- It summarizes important patterns such as weak topics, recurring struggles, and improvement areas.
- It helps users stay motivated by responding like a coach, not just a generic assistant.
- It turns daily practice into a more guided and meaningful journey.

If someone lands on this README and reads only the first section, they should immediately understand that this project is not just a tracker — it is a smart, adaptive interview prep companion.

---

## What the app does

Users can:

- sign up and log in securely
- choose and manage the skills they want to improve
- log daily study sessions with topic, status, difficulty, and time spent
- track streaks and consistency over time
- monitor weak areas and revision queues
- explore progress analytics and activity visuals
- interact with an AI coach for personalized guidance and motivation

---

## ✨ AI Personalized Coach

The AI coach is the heart of the product. It is designed to provide contextual support that feels personal and useful.

### What makes it special

- It stores conversation history for each user.
- It retrieves relevant past memory summaries to personalize responses.
- It uses conversation summaries to remember user patterns, goals, and challenges.
- It gives advice that is more tailored to the user’s actual learning behavior.

### Example experience

Instead of giving generic advice like “keep practicing,” the coach can say things like:

- “You have been struggling with recursion and tend to get stuck when translating logic into code.”
- “Your practice has been inconsistent lately, so a short daily drill may be more effective than long irregular sessions.”

That makes the experience feel like a real mentor guiding the user through interview preparation.

---

## Core features

### Study tracking

- daily study logging
- streak tracking
- consistency scoring
- progress monitoring by skill
- revision queue management

### Smart analytics

- weekly and skill-based progress insights
- weak-area detection
- visual activity heatmaps
- engagement and study behavior tracking

### AI coaching

- conversational AI support from the dashboard
- memory-based personalization
- context-aware coaching over time
- motivation and strategy guidance tailored to the learner

---

## Tech stack

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt for password hashing
- Groq-powered AI features

### Frontend

- React + Vite
- React Router
- Axios
- Framer Motion
- Tailwind CSS
- Context API for state management

---

## Project structure

```text
backend/
  controllers/
  models/
  routes/
  middleware/
  database/
  utils/

frontend/
  src/
    components/
    context/
    pages/
    services/
```

---

## Getting started

### 1. Clone the repository

```bash
git clone <repo-url>
cd "Interview Prep and Consistency Tracker"
```

### 2. Setup the backend

```bash
cd backend
npm install
npm start
```

### 3. Setup the frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Environment variables

Create a `.env` file in the backend with the required values for:

- MongoDB connection
- JWT secret
- AI/Groq API credentials

---

## Deployment

- Frontend: https://celebrated-donut-9a3bb7.netlify.app/
- Backend: https://interviewprep-and-consistency-tracker.onrender.com

---

## Summary

This project is more than a consistency tracker. It is a personalized interview preparation system that helps users stay disciplined, improve steadily, and receive support that adapts to their learning journey — with an AI coach that makes the experience feel truly intelligent and personal.
