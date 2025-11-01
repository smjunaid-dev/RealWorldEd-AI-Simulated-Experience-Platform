# 🚀 RealWorldEd - AI Simulated Experience Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)

**Turn Theory into Real-World Practice with AI-Powered Simulations**

RealWorldEd is an innovative AI-driven platform that bridges the gap between theoretical learning and practical experience. Students and entrepreneurs can engage with AI agents in realistic scenarios, receiving personalized feedback and performance analytics.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Demo Credentials](#-demo-credentials)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎓 Education Mode
- **Subject Selection**: Choose from C++, Java, Python, JavaScript, and more
- **Real-World Applications**: Learn practical uses of programming concepts
- **Project Guidance**: AI mentor helps you build actual projects
- **Simulation Testing**: Face realistic client scenarios and debugging challenges
- **Performance Evaluation**: Receive detailed feedback on technical and communication skills

### 💼 Business Mode
- **Business Type Selection**: Explore Food, Tech, Retail, and more industries
- **Location-Based Insights**: Get market analysis for your specific location
- **Idea Generation**: AI helps develop unique business concepts
- **Investor Simulation**: Practice pitching to AI investors
- **Business Evaluation**: Get scored on business acumen, communication, and strategy

### 🤖 AI Multi-Agent System
- **Mentor Agent**: Guides, teaches, and provides supportive feedback
- **Client Agent**: Simulates demanding clients and realistic scenarios
- **Evaluator Agent**: Assesses performance objectively across multiple dimensions
- **Scenario Generator**: Creates dynamic, contextual challenges

### 📊 Analytics & Reports
- **Performance Tracking**: Monitor progress across sessions
- **Detailed Scoring**: Technical skills, communication, creativity, business sense
- **Visual Analytics**: Radar charts and progress graphs
- **Personalized Feedback**: Strengths, improvements, and actionable tips
- **PDF Export**: Download reports for portfolio or reference

---

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **AI/NLP**: LangChain, OpenAI API, spaCy, NLTK
- **Multi-Agent**: LangChain with custom agent implementations

### Frontend
- **Framework**: React 18.2+ with Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **HTTP Client**: Axios

---

## 🏗 System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄───────►│  FastAPI Backend │◄───────►│  SQLite/Postgres│
│   (Port 5173)   │  REST   │   (Port 8000)    │   ORM   │    Database     │
│                 │   API   │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     │
                                     ▼
                            ┌──────────────────┐
                            │                  │
                            │  LangChain       │
                            │  AI Agents       │
                            │  - Mentor        │
                            │  - Client        │
                            │  - Evaluator     │
                            │  - Scenario Gen  │
                            │                  │
                            └──────────────────┘
                                     │
                                     │
                                     ▼
                            ┌──────────────────┐
                            │                  │
                            │   OpenAI API     │
                            │  (GPT-3.5/4)     │
                            │                  │
                            └──────────────────┘
```

---

## 📥 Installation

### Prerequisites
- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### Step 1: Clone the Repository

```powershell
cd c:\Users\samad\OneDrive\Desktop\MSC
cd realworlded
```

### Step 2: Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

### Step 3: Frontend Setup

```powershell
# Navigate to frontend directory (from root)
cd ..\frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. **Create `.env` file** in `backend/` directory:

```powershell
cd backend
Copy-Item .env.example .env
```

2. **Edit `.env` file** with your settings:

```env
# Database
DATABASE_URL=sqlite:///./realworlded.db

# JWT Secret (generate a secure random string)
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# OpenAI API (REQUIRED for full AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# App Settings
APP_NAME=RealWorldEd
DEBUG=True
```

**Important**: Replace `OPENAI_API_KEY` with your actual OpenAI API key!

### Frontend Configuration

1. **Create `.env` file** in `frontend/` directory:

```powershell
cd ..\frontend
Copy-Item .env.example .env
```

2. **Edit `.env` file**:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 🚀 Usage

### Running the Application

#### Terminal 1 - Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

The backend will start at: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

#### Terminal 2 - Frontend

```powershell
cd frontend
npm run dev
```

The frontend will start at: `http://localhost:5173`

### First Time Setup

1. Open browser to `http://localhost:5173`
2. Click **"Sign Up"** and create an account
3. Login with your credentials
4. Choose **Education Mode** or **Business Mode**
5. Start chatting with AI mentors!

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/signup`
Register a new user
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "password": "password123"
}
```

#### POST `/api/v1/auth/login`
Login and receive JWT token
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/v1/auth/me`
Get current user profile (requires auth token)

### Session Endpoints

#### POST `/api/v1/sessions/`
Create a new learning session
```json
{
  "mode": "education",
  "subject": "python"
}
```

#### GET `/api/v1/sessions/`
Get all user sessions

#### GET `/api/v1/sessions/{session_id}`
Get specific session details

### Chat Endpoints

#### POST `/api/v1/chat/`
Send message and get AI response
```json
{
  "message": "I want to learn Python",
  "session_id": 1
}
```

#### GET `/api/v1/chat/{session_id}/messages`
Get all messages for a session

### Evaluation Endpoints

#### POST `/api/v1/evaluation/`
Evaluate a session and generate report
```json
{
  "session_id": 1
}
```

#### GET `/api/v1/evaluation/reports`
Get all user reports

---

## 🔐 Demo Credentials

For testing purposes:

**Email**: `demo@realworlded.com`  
**Password**: `demo123`

*Note: You'll need to create this account first via signup, or create your own.*

---

## 🌐 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com/)
2. Connect your GitHub repository
3. Build Command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`
6. Deploy!

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. From frontend directory: `vercel --prod`
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api/v1`

### Database Migration (Production)

For production, migrate to PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## 📁 Project Structure

```
realworlded/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agent implementations
│   │   │   └── agents.py
│   │   ├── api/             # API routes
│   │   │   ├── deps.py      # Dependencies
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth.py
│   │   │       │   ├── sessions.py
│   │   │       │   ├── chat.py
│   │   │       │   └── evaluation.py
│   │   │       └── api.py
│   │   ├── core/            # Core configuration
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/              # Database
│   │   │   └── database.py
│   │   ├── models/          # SQLAlchemy models
│   │   │   └── models.py
│   │   └── schemas/         # Pydantic schemas
│   │       └── schemas.py
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/          # Reusable UI components
│   │   ├── lib/
│   │   │   ├── api.js       # API client
│   │   │   └── utils.js     # Utilities
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── ReportDetail.jsx
│   │   ├── store/
│   │   │   └── store.js     # Zustand state management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
└── README.md
```

---

## 🎯 Key Features Explained

### Multi-Agent AI System

The platform uses multiple specialized AI agents:

1. **Mentor Agent**: Provides guidance, explains concepts, suggests projects
2. **Client/Investor Agent**: Simulates realistic client interactions and investor questions
3. **Evaluator Agent**: Analyzes conversations and provides objective feedback
4. **Scenario Generator**: Creates dynamic, context-aware challenges

### Evaluation System

Performance is measured across 4 dimensions:
- **Technical Skills** (0-10): Understanding of concepts, problem-solving
- **Communication** (0-10): Clarity, professionalism, explanation quality
- **Creativity** (0-10): Innovation, unique approaches, adaptability
- **Business Sense** (0-10): Market understanding, strategic thinking

### Real-Time Chat

- WebSocket-like experience with REST API
- Typing indicators
- Message history persistence
- Context-aware AI responses

---

## 🔧 Troubleshooting

### Backend Issues

**Error: "Import langchain could not be resolved"**
```powershell
pip install langchain langchain-openai
```

**Error: "Database locked"**
- Close all database connections
- Delete `realworlded.db` and restart

**Error: "OpenAI API key not found"**
- Make sure `.env` file exists in `backend/` directory
- Verify `OPENAI_API_KEY` is set correctly

### Frontend Issues

**Error: "Cannot find module '@/lib/utils'"**
```powershell
npm install
```

**Error: "Failed to fetch"**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `.env`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT models
- **LangChain** for AI agent framework
- **FastAPI** for the amazing Python web framework
- **React** and **Vite** for modern frontend development
- **Tailwind CSS** for utility-first styling

---

## 📞 Support

For support, email support@realworlded.com or open an issue on GitHub.

---

## 🎉 Demo & Live Version

- **Live Demo**: [Coming Soon]
- **Video Walkthrough**: [Coming Soon]
- **Documentation**: `http://localhost:8000/docs` (when backend is running)

---

**Built with ❤️ for the future of education and entrepreneurship**

---

## 🚀 Quick Start Commands

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and start learning! 🎓💼
