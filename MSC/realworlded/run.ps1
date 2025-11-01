# RealWorldEd - Setup and Run Script
# This script helps you set up and run the RealWorldEd platform

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 RealWorldEd Setup & Run Script   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found! Please install Python 3.9+ from https://www.python.org/" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1. First-time setup (install dependencies)" -ForegroundColor White
Write-Host "2. Run backend only" -ForegroundColor White
Write-Host "3. Run frontend only" -ForegroundColor White
Write-Host "4. Run both (backend + frontend)" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  📦 Installing Dependencies...        " -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        
        # Backend setup
        Write-Host "Setting up BACKEND..." -ForegroundColor Yellow
        Set-Location backend
        
        # Create virtual environment
        if (!(Test-Path "venv")) {
            Write-Host "Creating virtual environment..." -ForegroundColor Yellow
            python -m venv venv
        }
        
        # Activate and install
        Write-Host "Installing Python packages..." -ForegroundColor Yellow
        .\venv\Scripts\Activate.ps1
        pip install -r requirements.txt
        python -m spacy download en_core_web_sm
        
        # Create .env if not exists
        if (!(Test-Path ".env")) {
            Write-Host "Creating .env file..." -ForegroundColor Yellow
            Copy-Item .env.example .env
            Write-Host "⚠️  IMPORTANT: Edit backend/.env and add your OPENAI_API_KEY!" -ForegroundColor Red
        }
        
        deactivate
        Set-Location ..
        
        Write-Host "✓ Backend setup complete!" -ForegroundColor Green
        Write-Host ""
        
        # Frontend setup
        Write-Host "Setting up FRONTEND..." -ForegroundColor Yellow
        Set-Location frontend
        
        Write-Host "Installing npm packages..." -ForegroundColor Yellow
        npm install
        
        # Create .env if not exists
        if (!(Test-Path ".env")) {
            Write-Host "Creating .env file..." -ForegroundColor Yellow
            Copy-Item .env.example .env
        }
        
        Set-Location ..
        
        Write-Host "✓ Frontend setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ Setup Complete!                    " -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Edit backend/.env and add your OpenAI API key" -ForegroundColor White
        Write-Host "2. Run this script again and choose option 4 to start both servers" -ForegroundColor White
        Write-Host ""
    }
    
    "2" {
        Write-Host ""
        Write-Host "Starting BACKEND server..." -ForegroundColor Yellow
        Set-Location backend
        .\venv\Scripts\Activate.ps1
        Write-Host ""
        Write-Host "Backend running at: http://localhost:8000" -ForegroundColor Green
        Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Green
        Write-Host ""
        python main.py
    }
    
    "3" {
        Write-Host ""
        Write-Host "Starting FRONTEND server..." -ForegroundColor Yellow
        Set-Location frontend
        Write-Host ""
        Write-Host "Frontend running at: http://localhost:5173" -ForegroundColor Green
        Write-Host ""
        npm run dev
    }
    
    "4" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  🚀 Starting RealWorldEd...           " -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Backend will run at: http://localhost:8000" -ForegroundColor Green
        Write-Host "Frontend will run at: http://localhost:5173" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opening two terminals..." -ForegroundColor Yellow
        Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow
        Write-Host ""
        
        # Start backend in new terminal
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\Activate.ps1; Write-Host 'Backend Server Starting...' -ForegroundColor Green; python main.py"
        
        Start-Sleep -Seconds 2
        
        # Start frontend in new terminal
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"
        
        Write-Host ""
        Write-Host "✓ Both servers are starting in separate terminals!" -ForegroundColor Green
        Write-Host "✓ Visit http://localhost:5173 to use the app!" -ForegroundColor Green
        Write-Host ""
    }
    
    "5" {
        Write-Host "Goodbye! 👋" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}
