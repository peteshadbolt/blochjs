import blochjs as b

geometry=[b.sphere(0,0,1),
          b.sphere(0,1,0),
          b.sphere(1,0,0),
          b.sphere(0,0,0),
          b.cylinder(0,0,0, 1,1,1)]

b.show(geometry)

print 'Stopped'
