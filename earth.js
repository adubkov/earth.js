
"use strict";
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var container, scene, camera, renderer, controls, stats, axis;
var graphMesh, atmosphere, earth, x,y,z = 0;
var sphereMaterial, earthTexture;
var pointLight, ambientLight;
var textures = [false,false];

init();


function init() 
{
  // set the screen size
  var width = window.innerWidth,
      height = window.innerHeight;

  // set camera attributes
  var view_angle = 45,
      aspect = width / height,
      near = 0.1,
      far = 1000;

  // get DOM element to attach
  container = document.getElementById('container'); //$('#container');

  // create scene
  scene = new THREE.Scene();

  // create camera view
  camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
  camera.position.set(-15.208551057179958, -25.347585095300026, 4.055613615247988);

  // create a light
  pointLight = new THREE.PointLight(0xFFFFFF,3.0);
  pointLight.position.set(-50, -100, -100);
  ambientLight = new THREE.AmbientLight(0x333333);
  ambientLight.position.set(pointLight.position);

  // create renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  // attach the render to the DOM element
  container.appendChild(renderer.domElement);

  // FullScreen
  THREEx.FullScreen.bindKey({ charCode: 'f'.charCodeAt(0) });
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  //axis = new THREE.AxisHelper(1000);

  var textMessage = document.createElement('div');
  textMessage.id = 'textMessage';
  textMessage.innerHTML = 'Loading, please wait...';
  document.body.insertBefore(textMessage, document.body.firstChild);

  /*
    Initialize textures
  */
  var earthTexture = THREE.ImageUtils.loadTexture('./images/earth.jpg', undefined, function(){
    textures[0] = true;
    if (textures[0] == textures[1] == true) {
      var e = document.getElementById("textMessage");
      e.parentNode.removeChild(e);
      animate();
    }
  });  
  earthTexture.flipY = false;
  var atmospereTexture = THREE.ImageUtils.loadTexture('./images/clouds.jpg', undefined, function(){
    textures[1] = true;
    if (textures[0] == textures[1] == true) {
      var e = document.getElementById("textMessage");
      e.parentNode.removeChild(e);
      animate();
    }
  });
  
  /*
    Initialize material
  */
  var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, wireframe: false, transparent: true, map: atmospereTexture, opacity: 0.6, blending: THREE.NormalBlending });
  var earthMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, wireframe: false, transparent: false, map: earthTexture});

  /*
    Initialize objects
  */
  atmosphere = createSphere(10, 32, 32, sphereMaterial);
  earth = createSphere(9.8, 32, 32, earthMaterial);
  
  /*
    Initialize scene
  */
  scene.add(camera);      // add camera to the scene 
  scene.add(pointLight);  // add light to scene
  scene.add(ambientLight);
  scene.add(axis);  
  scene.add(atmosphere);
  scene.add(earth);

  scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

  earth.rotateZ(23.439281);
  atmosphere.rotateZ(23.439281);

  /* Run Stats */
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIntex = 100;
  container.appendChild(stats.domElement);
}

function animate() {
  requestAnimationFrame( animate, container );
  update();
  render();
}

function update() {
  var t = Math.PI / 180 * clock.getDelta();
  var earth_y_delta =  t / 2;
  var atmosphere_y_delta = t / 1;
  atmosphere.rotateY(atmosphere_y_delta);
  earth.rotateY(earth_y_delta);

  controls.update();
  stats.update();
}

function render() {
  renderer.render( scene, camera );
}

/*
  Create mesh with sphere geometry
*/
function createSphere(radius, segments, rings, sphereMaterial) {
  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      sphereMaterial
    );
  return sphere;
}
