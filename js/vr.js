var camera, scene, renderer;
var geom, mesh, lineGeometry, lineMaterial, vertice3D, cube;

var ctrlFlag = false;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 20000 );
	camera.position.set(0, 0, 1200);

    scene = new THREE.Scene();

    controls = new THREE.OrbitControls( camera );
    controls.update();
    controls.enabled = false;

    //stats = new Stats();
    //document.body.appendChild( stats.dom );

    // LIGHTS

    var light = new THREE.AmbientLight( 0xffffff ); // clean white light
    scene.add( light );

    // TEXTURES

	var texture = new THREE.TextureLoader().load( 'tex/test_image.png' );
	texture.minFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

    // OBJECTS

	var geometry = new THREE.PlaneBufferGeometry( 2552, 1600, 1, 1 );
	var material = new THREE.MeshLambertMaterial({ color: 0xffffff, map : texture, side: THREE.DoubleSide });
	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );

	//in case if earcut needed
	//THREE.Triangulation.setLibrary('earcut');

	//filling geometry
    geom = new THREE.Geometry(); 
    var v1 = new THREE.Vector3(0,0,0);
    var v2 = new THREE.Vector3(0,19,0);
    var v3 = new THREE.Vector3(77,19,0);
    var v4 = new THREE.Vector3(77,0,0);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    geom.vertices.push(v4);

    var vertices = geom.vertices;
    var holes = [];

    var cursorMaterial = new THREE.MeshPhongMaterial( { color: 0xFF7373, transparent:true, opacity: 0.3 } )
    cursorMaterial.side = THREE.DoubleSide;

    //auto triangulation
    var triangles;
    triangles = THREE.ShapeUtils.triangulateShape( vertices, holes );
    for( var i = 0; i < triangles.length; i++ ){ geom.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] )) };

    cursor = new THREE.Mesh( geom, cursorMaterial );
    cursor.position.set (-1276+406, 800-645-19,1); // I kept calculations so backend will understand it easier
    scene.add( cursor );

    lineMaterial = new THREE.LineBasicMaterial({
        color: 0xFF7373,
        transparent: true,
        opacity: 0
    });
    lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
        new THREE.Vector3( -870, 155, 0 ),
        new THREE.Vector3( -1101, 130, 500 )
    );
    var line = new THREE.Line( lineGeometry, lineMaterial );
    scene.add( line );

    var cubeGeometry = new THREE.CubeGeometry(50,50,50);
    var cubeMaterial = new THREE.MeshBasicMaterial({color:0xFF7373, transparent:true, opacity:0.8});
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.set ( -1650, -400, 0 );
    scene.add ( cube );

    // RENDERER

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x666666 );
    $('#canvasContainer').append( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function drawCursor(data) {
    var yDelta = cursorPosition[1]*20;
    var r = cursor.material.color.r;
    var g = cursor.material.color.g;
    var b = cursor.material.color.b;
    var cursorScaleCoefficient = data[1] / (geom.vertices[2].x - geom.vertices[1].x);
    var cp = { cursorScaleX: cursor.scale.x, cursorX: cursor.position.x, cursorY: cursor.position.y, cursorColorR: r, cursorColorG: g, cursorColorB: b };
    var tp = { cursorScaleX: cursorScaleCoefficient, cursorX: data[0], cursorY: 136 - yDelta, cursorColorR: data[2].r/255, cursorColorG: data[2].g/255, cursorColorB: data[2].b/255 };
    var tween = new TWEEN.Tween(cp).to(tp, 600);
    tween.easing(TWEEN.Easing.Quartic.Out)
    tween.onUpdate(function(){
        cursor.position.x = cp.cursorX;
        cursor.position.y = cp.cursorY;
        cursor.scale.x = cp.cursorScaleX;
        cursor.material.color.setRGB( cp.cursorColorR, cp.cursorColorG, cp.cursorColorB );
        lineGeometry.vertices[0].x = cursor.geometry.vertices[1].x + cp.cursorX;
        lineGeometry.vertices[0].y = cursor.geometry.vertices[1].y + cp.cursorY;
        lineMaterial.color.setRGB( cp.cursorColorR, cp.cursorColorG, cp.cursorColorB );
        $('.info').css('background', 'rgb('+cp.cursorColorR*255+','+cp.cursorColorG*255+','+cp.cursorColorB*255+')');
    });
    tween.start();
    tween.onComplete(function(){
        if (ctrlFlag == true) { controls.enabled = true }
    });
}
function moveCam() {
    var cp = { camposX: camera.position.x, camposY: camera.position.y, camposZ: camera.position.z };
    var tp = { camposX: -900, camposY: 0, camposZ: 800 };
    var tween = new TWEEN.Tween(cp).to(tp, 2000);
    tween.easing(TWEEN.Easing.Quartic.Out)
    tween.onUpdate(function(){
        camera.position.set( cp.camposX, cp.camposY, cp.camposZ );
    });
    tween.start();
    tween.onComplete(function(){
        lineMaterial.opacity = 1;
        $('.info').addClass('shown');
        $('.prod').addClass('shown');
        $('.tip').css('right','100px');
    });
}
function moveCamBack() {
    var cp = { camposX: camera.position.x, camposY: camera.position.y, camposZ: camera.position.z };
    var tp = { camposX: 0, camposY: 0, camposZ: 1200 };
    var tween = new TWEEN.Tween(cp).to(tp, 2000);
    tween.easing(TWEEN.Easing.Quartic.Out)
    tween.onUpdate(function(){
        camera.position.set( cp.camposX, cp.camposY, cp.camposZ );
    });
    tween.start();
    tween.onComplete(function(){
        controls.enabled = true;
        ctrlFlag = true;
    });
}
function updateLine() {
    //screen to world
    var point3D = new THREE.Vector3( ( x / window.innerWidth ) * 2 - 1, -( y / window.innerHeight ) * 2 + 1, 500 );
    vertice3D = point3D.unproject(camera);
    lineGeometry.vertices[1].x = vertice3D.x;
    lineGeometry.vertices[1].y = vertice3D.y;
}
function updateInfo(data) {
    var leftValue;
    var rightValue;
    if ( data[1] !== 0 ) {
        var scaleRate = data[0] / 100000;
        var r = cube.material.color.r;
        var g = cube.material.color.g;
        var b = cube.material.color.b;
        var cp = { cubeHeight: cube.scale.y, cubeColorR: r, cubeColorG: g, cubeColorB: b };
        var tp = { cubeHeight: scaleRate, cubeColorR: data[2].r/255, cubeColorG: data[2].g/255, cubeColorB: data[2].b/255 };
        var tween = new TWEEN.Tween(cp).to(tp, 1000);
        tween.easing(TWEEN.Easing.Quartic.Out)
        tween.onUpdate(function(){
            cube.scale.set( cp.cubeHeight, cp.cubeHeight, cp.cubeHeight );
            cube.material.color.setRGB( cp.cubeColorR, cp.cubeColorG, cp.cubeColorB );
        });
        tween.start();
    } else {
        leftValue = 'Nothing ';
        rightValue = 'to show';
    };
    if ( data[1] == 1 ) {
        leftValue = 'Baseline: ';
        rightValue = '$'+data[0];
    };
    if ( data[1] == 2 ) {
        leftValue = 'Adjusted: ';
        rightValue = '$'+data[0];
    };
    $('#addInfo').html(''+leftValue+rightValue+'');
}
function animate() {
    lineGeometry.verticesNeedUpdate = true;

    requestAnimationFrame( animate );

    cube.rotation.y += 0.01;

    TWEEN.update();

    //updateLine();

    //camera.lookAt(scene.position);

    //stats.update();

    renderer.render( scene, camera );

}
