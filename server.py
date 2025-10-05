import http.server
import socketserver
import os

PORT = 9000
os.chdir('/Users/vaibhavkumar/Documents/attendance_system_new')

with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print("Access demo at: http://localhost:9000/demo.html")
    httpd.serve_forever()