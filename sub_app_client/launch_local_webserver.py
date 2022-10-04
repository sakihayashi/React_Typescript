from http.server import test, SimpleHTTPRequestHandler
import socketserver
from functools import partial
from pathlib import Path


def main():
    CLIENT_DIST_DIR = str(Path(__file__).parent / 'dist')
    print(f'CLIENT_DIST_DIR: {CLIENT_DIST_DIR}')
    handler_class = partial(SimpleHTTPRequestHandler, directory=CLIENT_DIST_DIR)
    with socketserver.TCPServer(('', 8080), handler_class) as httpd:
        print('serving at port', 8080)
        httpd.serve_forever()


if __name__ == '__main__':
    main()
