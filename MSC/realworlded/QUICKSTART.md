# Quick Start Guide for RealWorldEd

## 🚀 Fastest Way to Get Started

### Step 1: Run Setup Script
```powershell
cd c:\Users\samad\OneDrive\Desktop\MSC\realworlded
.\run.ps1
```

Choose option **1** to install all dependencies.

### Step 2: Add OpenAI API Key

1. Get your API key from: https://platform.openai.com/api-keys
2. Edit `backend/.env` file
3. Replace `OPENAI_API_KEY=your-openai-api-key-here` with your actual key

Example:
```env
OPENAI_API_KEY=sk-proj-abc123xyz...
```

### Step 3: Run the App
```powershell
.\run.ps1
```

Choose option **4** to run both servers.

### Step 4: Open Your Browser

Visit: **http://localhost:5173**

---

## 📖 Manual Setup (Alternative)

### Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Copy and edit .env
Copy-Item .env.example .env
# Add your OpenAI API key to .env

# Run
python main.py
```

### Frontend (New Terminal)
```powershell
cd frontend
npm install

# Copy .env
Copy-Item .env.example .env

# Run
npm run dev
```

---

## ✅ Verify Installation

1. **Backend Health Check**: http://localhost:8000/health
2. **API Documentation**: http://localhost:8000/docs
3. **Frontend**: http://localhost:5173

---

## 🎯 First Time User Flow

1. **Sign Up**: Create an account at http://localhost:5173/signup
2. **Choose Mode**: Select Education or Business mode
3. **Start Chatting**: Interact with AI mentors
4. **Get Evaluated**: Click "Get Evaluated" after conversation
5. **View Reports**: Check your performance analytics

---

## 🆘 Common Issues

### "OpenAI API key not found"
- Make sure you've added your API key to `backend/.env`
- Restart the backend server after adding the key

### "Port 8000 already in use"
- Stop any other processes using port 8000
- Or change the port in `backend/main.py`

### "Module not found" errors
- Make sure you ran the setup script (option 1)
- Try reinstalling: `pip install -r requirements.txt`

### Frontend won't start
- Make sure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again

---

## 🎓 Demo Account

For testing without OpenAI API:
- The app works in demo mode with fallback responses
- Full AI features require OpenAI API key

---

## 📞 Need Help?

Check the main README.md for detailed documentation!
