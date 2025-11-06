#!/usr/bin/env python3
"""
Simple test to verify Star Sea server setup
"""

import os
import sys
import http.server
import socketserver
import threading
import time
import urllib.request
import urllib.error

def test_server():
    """Test if the server can start and serve files"""
    
    print("🧪 Testing Star Sea Server Setup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists('index.html'):
        print("❌ Error: index.html not found!")
        print("   Please run this script from the Star Sea game directory.")
        return False
    
    # Check if all required files exist
    required_files = [
        'index.html',
        'js/main.js',
        'js/core/Engine.js',
        'js/entities/Ship.js'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ All required files found")
    
    # Test server startup
    port = 8003  # Use a different port for testing
    
    try:
        # Start server in background
        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("localhost", port), handler) as httpd:
            print(f"✅ Server started on port {port}")
            
            # Test server response
            try:
                response = urllib.request.urlopen(f"http://localhost:{port}", timeout=5)
                if response.getcode() == 200:
                    print("✅ Server responding correctly")
                    print("✅ Star Sea server setup is working!")
                    return True
                else:
                    print(f"❌ Server returned status code: {response.getcode()}")
                    return False
            except urllib.error.URLError as e:
                print(f"❌ Server not responding: {e}")
                return False
                
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use")
            return False
        else:
            print(f"❌ Error starting server: {e}")
            return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == '__main__':
    success = test_server()
    if success:
        print("\n🎉 Server setup test passed!")
        print("   You can now run: python server.py")
    else:
        print("\n❌ Server setup test failed!")
        print("   Please check the error messages above.")
        sys.exit(1)

