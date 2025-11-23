#!/bin/bash

echo "🚀 Starting Star Sea Development Server..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "   Please install Python 3.6+ from your package manager"
    echo "   Ubuntu/Debian: sudo apt install python3"
    echo "   macOS: brew install python3"
    echo "   Or download from https://python.org"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "   Please run this script from the Star Sea game directory"
    exit 1
fi

# Make server.py executable
chmod +x server.py

# Start the server
echo "🌐 Starting server on http://localhost:8000"
echo "🛑 Press Ctrl+C to stop the server"
echo

python3 server.py

