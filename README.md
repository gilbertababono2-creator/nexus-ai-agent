# Nexus AI Agent
A full-stack AI agent with memory, task management, appointments, and file handling.

## Setup
1. Create `.env` in `backend/` with:
   - `FIREBASE_SERVICE_ACCOUNT` = your full JSON key
   - `OPENAI_API_KEY` = your OpenAI key
   - `PORT=5000`

2. Update `frontend/src/firebase.js` with your Firebase client config.

## Run locally
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`

## Deploy
- Backend: Render (Web Service, root `backend`, start `npm start`)
- Frontend: Vercel (root `frontend`, framework Vite)
