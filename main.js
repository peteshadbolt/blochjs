var camera, controls, scene, renderer, material;
var vertices=[];
var edges=[];

// Run on startup
$(document).ready(main);

function de2ra(degree)  { return degree*(Math.PI/180); }

function addSphere(pos, radius, color, quality, opacity) {
    if (quality==null){quality=10;}
    var material = new THREE.MeshLambertMaterial({color:color});
    if (opacity!=null){material.opacity=opacity; material.transparent=true;}
    var geometry=new THREE.SphereGeometry(radius, quality, quality)
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(pos.x, pos.y, pos.z);
    scene.add(sphere);
    vertices.push(sphere);
}

function addCylinder(start, end, radius, color, opacity) {
    var material = new THREE.MeshLambertMaterial({color:color});
    if (opacity!=null){material.opacity=opacity; material.transparent=true;}
    var length = Math.pow((end.x-start.x), 2) + Math.pow((end.y-start.y), 2) + Math.pow((end.z-start.z), 2)
    length = Math.sqrt(length);
    var geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set((start.x+end.x)/2, (start.y+end.y)/2, (start.z+end.z)/2);
    cylinder.rotation.z=-Math.atan2(end.x-start.x, end.y-start.y);
    cylinder.rotation.x=Math.atan2(end.z-start.z, end.y-start.y);
    scene.add(cylinder);
    edges.push(cylinder);
}

function onGeometry(data) {
    var jsonGeometry=data;

    // Vertices
    for (var i = 0; i<jsonGeometry.length; i++)
    {
        var e=jsonGeometry[i];
        if (e.type=='sphere'){ addSphere(e.position, e.radius, e.color); }
        if (e.type=='cylinder'){ addCylinder(e.start, e.end, e.radius, e.color); }
    }

    // Render when ready
    animate();
}

function buildAxes() {
    var l=1.1;
    var r=0.005
    addCylinder({x:-l, y:0, z:0}, {x:l, y:0, z:0}, r, 'black');
    addCylinder({x:0, y:-l, z:0}, {x:0, y:l, z:0}, r, 'black');
    addCylinder({x:0, y:0, z:-l}, {x:0, y:0, z:l}, r, 'black');
    addSphere({x:0, y:0, z:0}, 1, 'white', 100, 0.5);
    
    //Tori
    var material = new THREE.MeshLambertMaterial({color:'black'});
    var geometry = new THREE.TorusGeometry(1+r, r, 6, 100);
    var x = new THREE.Mesh(geometry, material); scene.add(x);
    var y = new THREE.Mesh(geometry, material); y.rotation.set(Math.PI/2,0,0); scene.add(y);
    var z = new THREE.Mesh(geometry, material); z.rotation.set(0,Math.PI/2,0); scene.add(z);
    
    // Cones
    var material = new THREE.MeshLambertMaterial({color:'black'});
    var p=r*5;
    var geometry = new THREE.CylinderGeometry(p, 0, p*4, 8);
    var x = new THREE.Mesh(geometry, material); x.position.set(l,0,0); x.rotation.set(0,0,Math.PI/2); scene.add(x);
    var y = new THREE.Mesh(geometry, material); y.position.set(0,l,0); y.rotation.set(Math.PI,0,0); scene.add(y);
    var z = new THREE.Mesh(geometry, material); z.position.set(0,0,l); z.rotation.set(-Math.PI/2,0,0); scene.add(z);

}

function main() {
    // Set up the container and renderer
    var $container = $('body');
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
    var WIDTH=x;
    var HEIGHT=y;

    // Renderer
    renderer = new THREE.WebGLRenderer( { antialias: true });
    renderer.setSize(WIDTH, HEIGHT-20);
    renderer.setClearColor( 0xffffff, 1 );
    $container.append(renderer.domElement);
    scene = new THREE.Scene();

    // Camera and lighting
    camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 10000);
    var d=2.3;
    camera.position.set(d,d,d);
    scene.add(camera);
    var pointLight = new THREE.PointLight(0xeeeeee);
    pointLight.intensity=.8; pointLight.position.set(100,100,130); scene.add(pointLight);
    var pointLight2 = new THREE.PointLight(0xeeeeee);
    pointLight.intensity=.95; pointLight.position.set(50,100,130); scene.add(pointLight);


    // Controls and axes
    controls = new THREE.OrbitControls(camera);
    controls.center.set(0,0,0);
    buildAxes();
    controls.addEventListener('change', render);
    controls.userPanSpeed=.05;

    // Load the json
    $.getJSON('geometry', onGeometry);

}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

