@echo off
echo Starting local server for Star Sea...
echo.
echo Server will be available at: http://localhost:8100
echo Game URL: http://localhost:8100/index.html
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python -m http.server 8100

pause