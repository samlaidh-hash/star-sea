#!/usr/bin/env python3
"""
Star Sea - Local Development Server
Simple HTTP server for running the game locally
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

class StarSeaHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler for Star Sea game"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Handle root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Handle .js files with correct MIME type
        if self.path.endswith('.js'):
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open(self.path[1:], 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Handle .css files
        if self.path.endswith('.css'):
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            with open(self.path[1:], 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Handle .html files
        if self.path.endswith('.html'):
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open(self.path[1:], 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Default handling
        super().do_GET()

def start_server(port=8000, host='localhost'):
    """Start the Star Sea development server"""
    
    # Check if we're in the right directory
    if not os.path.exists('index.html'):
        print("❌ Error: index.html not found!")
        print("Please run this script from the Star Sea game directory.")
        sys.exit(1)
    
    # Create server
    handler = StarSeaHTTPRequestHandler
    
    try:
        with socketserver.TCPServer((host, port), handler) as httpd:
            print("🚀 Star Sea Development Server")
            print("=" * 40)
            print(f"🌐 Server running at: http://{host}:{port}")
            print(f"📁 Serving from: {os.getcwd()}")
            print("=" * 40)
            print("🎮 Game Controls:")
            print("  WASD - Movement")
            print("  Mouse - Aiming")
            print("  Left Click - Fire Beam")
            print("  Right Click - Fire Torpedo")
            print("  Q - Tractor Beam")
            print("  T - Transporter")
            print("  TAB - Power Management")
            print("  1-6 - Shuttle Missions")
            print("  7-8 - Fighter/Bomber")
            print("  V - Warp Drive")
            print("  ESC - Pause/Menu")
            print("=" * 40)
            print("🛑 Press Ctrl+C to stop the server")
            print("=" * 40)
            
            # Open browser automatically
            try:
                webbrowser.open(f'http://{host}:{port}')
                print("🌐 Opening browser...")
            except:
                print("⚠️  Could not open browser automatically")
                print(f"   Please open: http://{host}:{port}")
            
            print("\n🎯 Server started successfully!")
            print("   The game should now be running in your browser.")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {port} is already in use!")
            print(f"   Try a different port: python server.py --port {port + 1}")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

def main():
    """Main function to parse arguments and start server"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Star Sea Development Server')
    parser.add_argument('--port', '-p', type=int, default=8000, 
                       help='Port to run server on (default: 8000)')
    parser.add_argument('--host', '-H', default='localhost', 
                       help='Host to bind server to (default: localhost)')
    parser.add_argument('--no-browser', action='store_true', 
                       help='Do not open browser automatically')
    
    args = parser.parse_args()
    
    # Override browser opening if requested
    if args.no_browser:
        global webbrowser
        webbrowser = None
    
    start_server(args.port, args.host)

if __name__ == '__main__':
    main()

