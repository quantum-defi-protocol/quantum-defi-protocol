#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def serve():
    os.chdir('public')
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Quantum DeFi Protocol Server")
        print(f"🌐 Serving at: http://localhost:{PORT}")
        print(f"📱 Open: http://localhost:{PORT}/standalone.html")
        print(f"🛑 Press Ctrl+C to stop")
        
        try:
            webbrowser.open(f'http://localhost:{PORT}/standalone.html')
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")
            httpd.shutdown()

if __name__ == "__main__":
    serve()
