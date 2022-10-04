from http.server import test, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path

UI_PORT_NUMBER = 8000


def main():
    CLIENT_DIST_DIR = str(Path(__file__).parent / 'dist')
    handler_class = partial(SimpleHTTPRequestHandler, directory=CLIENT_DIST_DIR)
    test(HandlerClass=handler_class, port=UI_PORT_NUMBER)


if __name__ == '__main__':
    main()
