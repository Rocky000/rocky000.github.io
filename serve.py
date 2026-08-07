#!/usr/bin/env python3
"""Local static server with Cache-Control: no-store so edits show on refresh."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST = '127.0.0.1'
PORT = 4173


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


if __name__ == '__main__':
    server = ThreadingHTTPServer((HOST, PORT), NoCacheHandler)
    print(f'Serving {HOST}:{PORT} (no-cache) — http://{HOST}:{PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
