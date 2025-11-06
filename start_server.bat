@echo off
echo 🚀 Starting Star Sea Development Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed or not in PATH
    echo    Please install Python 3.6+ from https://python.org
    echo    Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: index.html not found!
    echo    Please run this script from the Star Sea game directory
    pause
    exit /b 1
)

REM Start the server
echo 🌐 Starting server on http://localhost:8000
echo 🛑 Press Ctrl+C to stop the server
echo.

python server.py

pause

