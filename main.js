var camera, controls, scene, renderer, material;

// Run on startup
$(document).ready(main);

function addSphere(pos, radius, color, quality, opacity) {
    if (quality==null){quality=10;}
    var material = new THREE.MeshLambertMaterial({color:color});
    if (opacity!=null){material.opacity=opacity; material.transparent=true;}
    var geometry=new THREE.SphereGeometry(radius, quality, quality)
    var sphere=new THREE.Mesh(geometry, material);
    sphere.position.set(pos.x, pos.y, pos.z);
    scene.add(sphere);
}

function addCylinder(start, end, radius, color, opacity) {
    var pointStart = new THREE.Vector3(start.x, start.y, start.z);
    var pointEnd = new THREE.Vector3(end.x, end.y, end.z);
    var material = new THREE.MeshLambertMaterial({color:color});
    if (opacity!=null){material.opacity=opacity; material.transparent=true;}
    var direction = new THREE.Vector3().subVectors(pointEnd, pointStart);
    var arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointStart);
    var rotation = new THREE.Euler().setFromQuaternion(arrow.quaternion);
    var geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), 8);
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.set(rotation.x, rotation.y, rotation.z);
    cylinder.position = new THREE.Vector3().addVectors(pointStart, direction.multiplyScalar(0.5));
    scene.add(cylinder);
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

    // Axes and big sphere
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

function fillScreen(){
    // Fill the whole screen
    console.log('eh');
    var $container = $('#container')
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();
    $container.width(viewportWidth);
    $container.height(viewportHeight);
    renderer.setSize(viewportWidth, viewportHeight);
    camera.aspect = viewportWidth/viewportHeight;
    camera.updateProjectionMatrix();
    render();
}

function main() {
    // Renderer
    var $container = $('#container')
    renderer = new THREE.WebGLRenderer( { antialias: true });
    renderer.setClearColor( 0xffffff, 1 );
    $container.append(renderer.domElement);
    scene = new THREE.Scene();

    // Camera and lighting
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
    var d=2.3;
    camera.position.set(d,d,d);
    scene.add(camera);
    var pointLight = new THREE.PointLight(0xeeeeee);
    pointLight.intensity=.8; pointLight.position.set(100,100,130); scene.add(pointLight);
    var pointLight2 = new THREE.PointLight(0xeeeeee);
    pointLight.intensity=.95; pointLight.position.set(50,100,130); scene.add(pointLight);
    fillScreen();

    // Controls and axes
    controls = new THREE.OrbitControls(camera);
    controls.center.set(0,0,0);
    buildAxes();
    controls.addEventListener('change', render);
    controls.userPanSpeed=.05;

    // Bind window resize events 
    $(window).resize(fillScreen);

    // Load the json
    $.getJSON('geometry', onGeometry);
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
}

function render() {
    renderer.render(scene, camera);
    console.log('Render');
}

