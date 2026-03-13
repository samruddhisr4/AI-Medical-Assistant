# 🩺 MediAssist — AI Medical Assistant

> An AI-powered medical assistant that helps users understand their symptoms, explore possible causes, and find the right specialist — all through a beautifully designed chat interface.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb)](https://mongodb.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat&logo=openai)](https://openai.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://render.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)
- [Deployment](#-deployment)
- [Disclaimer](#%EF%B8%8F-disclaimer)

---

## ✨ Features

### Core Features
- 🤖 **AI-Powered Analysis** — Powered by OpenAI GPT-4o-mini with a structured medical system prompt
- 📊 **Structured Responses** — Every response includes:
  - Symptom identification
  - Possible causes / conditions
  - Recommended specialist types
  - Urgency level (Low / Medium / High / Emergency)
  - General advice + medical disclaimer
- 💬 **Persistent Chat History** — Conversations saved to MongoDB per session
- 🎨 **Premium Dark UI** — Glassmorphism, gradient accents, smooth animations
- ⚡ **Quick Prompts** — Pre-built symptom prompts to get started instantly
- 📱 **Responsive Design** — Works on desktop and mobile

### Bonus Features ⭐
- 🎤 **Voice Input** — Speak your symptoms using the Web Speech API (Chrome/Edge)
- 🔒 **Session-based History** — Each browser session gets a unique ID, history persists across page refreshes
- 🛡️ **Rate Limiting** — Two-tier protection: 100 req/15min globally, 20 chat messages/min per IP

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB, Mongoose |
| **AI** | OpenAI API (GPT-4o-mini) |
| **Styling** | Vanilla CSS with CSS Variables |
| **Rate Limiting** | express-rate-limit |
| **Voice Input** | Web Speech API |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

---

## 📁 Project Structure

```
AI-Medical-Assistant/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   └── chatController.js   # Chat logic + OpenAI integration
│   ├── models/
│   │   └── Conversation.js     # Mongoose schema
│   ├── routes/
│   │   └── chat.js             # Express routes
│   ├── .env                    # Environment variables (not committed)
│   ├── .env.example            # Template for env vars
│   ├── render.yaml             # Render deployment config
│   ├── package.json
│   └── server.js               # Entry point with rate limiting
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx   # Input bar with voice + quick prompts
│   │   │   ├── ChatInput.css
│   │   │   ├── ChatMessage.jsx  # Structured response cards
│   │   │   ├── ChatMessage.css
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   ├── Sidebar.css
│   │   │   ├── VoiceInput.jsx  # 🎤 Web Speech API voice input
│   │   │   ├── VoiceInput.css
│   │   │   ├── WelcomeScreen.jsx # Empty state with sample prompts
│   │   │   └── WelcomeScreen.css
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # Global styles & design system
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env                    # Frontend env vars (not committed)
│   ├── .env.example            # Template for env vars
│   ├── vercel.json             # Vercel deployment config
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json                # Root convenience scripts
└── README.md
```

---

## ✅ Prerequisites

- **Node.js** v18 or higher → [Download](https://nodejs.org)
- **MongoDB** local OR **MongoDB Atlas** → [Get Atlas Free](https://www.mongodb.com/cloud/atlas)
- **OpenAI API Key** → [Get one here](https://platform.openai.com/api-keys)
- **Git** → [Download](https://git-scm.com)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/samruddhisr4/AI-Medical-Assistant.git
cd AI-Medical-Assistant
```

### 2. Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mediassist
OPENAI_API_KEY=sk-your_openai_api_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev     # Development (nodemon auto-reload)
npm start       # Production
```

> Backend runs at: **http://localhost:5000**

### 3. Set Up the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
cp .env.example .env
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs at: **http://localhost:5173**

### 4. Open in Browser

Navigate to **http://localhost:5173** and start chatting! 🎉

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `5000` |
| `MONGO_URI` | ✅ Yes | MongoDB connection string | `mongodb://localhost:27017/mediassist` |
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key | `sk-...` |
| `CLIENT_URL` | No | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

#### `POST /chat`
Send a message and get an AI response.

**Rate Limit:** 20 requests/minute per IP

**Request:**
```json
{
  "message": "I have a headache and fever for 2 days",
  "sessionId": "uuid-string"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-string",
  "response": {
    "summary": "You appear to be experiencing a febrile illness...",
    "symptoms": ["Headache", "Fever"],
    "possibleCauses": ["Viral infection", "Influenza", "COVID-19"],
    "recommendedDoctors": ["General Practitioner", "Internist"],
    "urgencyLevel": "medium",
    "generalAdvice": "Rest, stay hydrated, and take OTC fever reducers...",
    "disclaimer": "This is not a substitute for professional medical advice..."
  }
}
```

#### `GET /chat/history/:sessionId`
Get conversation history for a session.

#### `DELETE /chat/history/:sessionId`
Clear all messages for a session.

#### `GET /health`
Health check. Returns `{ status: "OK", timestamp: "..." }`.

---

## 🧠 How It Works

```
User types/speaks symptom description
        ↓
Frontend sends POST /api/chat with { message, sessionId }
        ↓
Rate limiter checks request frequency per IP
        ↓
Backend fetches last 10 messages from MongoDB (for context)
        ↓
OpenAI GPT-4o-mini processes with structured medical system prompt
        ↓
Response parsed as JSON (summary, symptoms, causes, doctors, urgency)
        ↓
Both messages saved to MongoDB Conversation document
        ↓
Structured response returned to frontend
        ↓
React renders beautiful card with color-coded urgency badge
```

---

## 🚀 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy!

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in Render dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `OPENAI_API_KEY` — your OpenAI key
   - `CLIENT_URL` — your Vercel frontend URL
5. Deploy!

> 💡 **Tip:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a free cloud database that works with Render.

---

## 🎤 Voice Input

MediAssist supports voice input via the **Web Speech API**:

- Click the 🎤 microphone button next to the input field
- Speak your symptoms clearly
- The transcript appears in the text field automatically
- Only supported in **Chrome**, **Edge**, and **Safari** browsers

---

## ⚕️ Disclaimer

> **MediAssist is for informational and educational purposes only.**
>
> It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions regarding a medical condition. In case of a medical emergency, call your local emergency number immediately.

---

## 📄 License

This project is licensed under the MIT License.

---

*Built with ❤️ using React, Node.js, MongoDB & OpenAI*
