"""Server lokal sederhana untuk membuka surat Hari Guru di browser."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import webbrowser

HOST = "127.0.0.1"
PORT = 8000
PROJECT_DIR = Path(__file__).resolve().parent


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print("[RAS LETTER]", format % args)


if __name__ == "__main__":
    os.chdir(PROJECT_DIR)
    url = f"http://{HOST}:{PORT}"
    print("Surat Hari Guru untuk Bu Dea")
    print(f"Buka: {url}")
    print("Tekan Ctrl+C di terminal untuk menghentikan server.")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    ThreadingHTTPServer((HOST, PORT), QuietHandler).serve_forever()
