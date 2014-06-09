import BaseHTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
import urllib
import json

def sphere(x,y,z,radius=0.03,color='red'): 
    return {'type':'sphere', 'position': {'x':x, 'y':y, 'z':z}, 'radius':radius, 'color':color}

def cylinder(x1,y1,z1,x2,y2,z2, radius,color): return {'type':'cylinder', \
        'start': {'x':x1, 'y':y1, 'z':z1},
        'end': {'x':x2, 'y':y2, 'z':z2}, 'radius':radius, 'color':color}


class Proxy(SimpleHTTPRequestHandler):
    geometry=[]
    def get_data(self):
        return json.dumps(self.geometry)

    def do_GET(self):
        print self.path
        if self.path=='/geometry':
            data=self.get_data()
            self.wfile.write(data)
        elif self.path=='/stop':
            self.wfile.write('Bloch sphere server stopped')
            self.server.stop = True
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

class StoppableHttpServer(BaseHTTPServer.HTTPServer):
    """http server that reacts to self.stop flag"""
    def serve_forever (self):
        """Handle one request at a time until stopped."""
        self.stop = False
        while not self.stop:
            self.handle_request()

def show(geometry):
    Proxy.geometry=geometry
    httpd = StoppableHttpServer(('127.0.0.1', 8000), Proxy)
    sa = httpd.socket.getsockname()
    print 'Open a browser and go to localhost:%s' % sa[1]
    httpd.serve_forever()

