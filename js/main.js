/**
 * Created by daniele on 08/06/16.
 */

// check if browser support WebGL and warn the user if it is not supported
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

/* =========================================== */
// Create important variable for the project
var scene
// camera settings
  , camera
  , aspectRatio           // camera aspect ratio
  , fieldOfView = 90      // FOV height (in degrees)
  , nearPlane = 1         // minimum distance from camera to render the scene
  , farPlane = 100000000  // maximum distance from camera to render the scene
// render object
  , renderer
// orbit control object
  , controls
// statistic panel
  , stats
// solar system object
  ,solarSystem
  ;

// screen variables
var HEIGHT, WIDTH;

// camera initial position
var STARTX = 0, STARTY = 0, STARTZ = 4000;

// define if solar system should move or not
var UPDATE = false;
/* =========================================== */

// initialize Threejs project and start to render
function init() {
  // add statistic panel
  addStats();
  // create the scene
  createScene();
  // add lights to scene
  createLights();

  // add event listener for UI panels
  document.querySelector("#close-info").addEventListener("click", toggleInfoBox, false);
  document.querySelector("#close-keys").addEventListener("click", toggleKeyBindingBox, false);
  document.querySelector("#close-planet-panel").addEventListener("click", function () {
    document.querySelector("#planet-info").style.display = "none";
  }, false);
  document.querySelector("#close-keys").addEventListener("click", closeCenterBox, false);

  // create the Solar System
  solarSystem = new SolarSystem();

  // start the rendering
  loop();
}

/** Create Stats object that will monitor project performance */
function addStats() {
  stats = new Stats();
  // 0: fps => Frame Per Second
  // 1: ms  => Millisecond to render the scene
  // 2: MB  => memory allocated for the project
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}

/** create the scene that will contain solar system */
function createScene() {
  // set screen dimension
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // create scene object
  scene = new THREE.Scene();

  // create camera
  aspectRatio = WIDTH / HEIGHT;
  camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
  );
  camera.position.x = STARTX;
  camera.position.y = STARTY;
  camera.position.z = STARTZ;
  // add the camera to scene, so we can observe it
  scene.add(camera);

  // create render object
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  // set background color
  renderer.setClearColor(0x0a0a12, 0.1);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  // add to the document the canvas on which will be rendered the scene
  document.querySelector("#solar-system").appendChild(renderer.domElement);

  // add orbit controls management
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.75;
  controls.minDistance = -5000;
  // controls.zoomSpeed = 2.0;

  // adjust scene size if screen size change
  window.addEventListener('resize', handleWindowResize, false);
  window.addEventListener('keydown', keyHandler, false);
}

/** Add Ambiental light */
function createLights() {
  var ambientLight = new THREE.AmbientLight(0x121212, 0.4); // soft white light
  scene.add(ambientLight);

  // Sun light is added when the Sun object is created
}

function loop() {
  // start to analyze project performance
  stats.begin();

  solarSystem.update();

  // update the scene
  renderer.render(scene, camera);

  // update orbit control camera
  controls.update();
  // end to analyze project performance
  stats.end();
  // tell to browser to render the canvas at 60 fps
  requestAnimationFrame(loop);
}

// when DOM window object is loaded, then call init function
window.addEventListener('load', init, false);

/* =================== */
/*  UTILITY FUNCTIONS  */
/* =================== */
/** Recompute screen size when it is called
 *  and update both renderer and camera settings
 * */
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}
/**
 * Load a JSON file into a resource and pass it to callback function
 * @param JSONFile - The path of the file that contain JSON data
 * @param callback - A function to process loaded resource
 */
function loadJSON(JSONFile, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', JSONFile, true); // true => asynchronous mode
  xobj.onreadystatechange = function () {
    // if file is loaded in the correct way
    if (xobj.readyState == 4 && xobj.status == "200") {
      // function to call when the JSON is loaded
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

/** Handle all key down event selecting the right event handler */
function keyHandler(event) {
  // call the right event handler based on the pressed key
  // console.log(event.keyCode); // For DEBUG
  switch (event.keyCode) {
    case 32 : UPDATE = !UPDATE;       break; // 32 => space
    case 65 : showPlanet(3);          break; // 65 => A
    case 69 : showPlanet(2);          break; // 69 => E
    case 72 : toggleKeyBindingBox();  break; // 72 => H
    case 73 : toggleInfoBox();        break; // 73 => I
    case 74 : showPlanet(4);          break; // 74 => J
    case 77 : showPlanet(0);          break; // 77 => M
    case 78 : showPlanet(7);          break; // 78 => N
    case 80 : showPlanet(8);          break; // 80 => P
    case 82 : displayReset();         break; // 82 => R
    case 83 : showPlanet(5);          break; // 83 => S
    case 85 : showPlanet(6);          break; // 85 => U
    case 86 : showPlanet(1);          break; // 86 => V
  }
}

/** Reset the camera adn UI viewport */
function displayReset() {
  controls.reset();
  document.querySelector("#planet-info").style.display = "none";
  closeCenterBox();
}

/** Set the camera to the position of the n-th planet of Solar System
 *  @param number - the planet number (starting from Mercury with 0)
 * */
function showPlanet(number) {
  // close, if it is open, info panel
  document.querySelector("#info").style.display = "none";
  document.querySelector("#keybindings").style.display = "none";
  var zoomMap = {
    0 : 64,
    1 : 64,
    2 : 64,
    3 : 96,
    4 : 32,
    5 : 64,
    6 : 168,
    7 : 256,
    8 : 4096
  };
  controls.reset();
  console.log(solarSystem.getPlanetPosition(number));
  controls.target.copy(solarSystem.getPlanetPosition(number));
  // camera.position.z = 3000;
  camera.zoom = zoomMap[number];
  camera.updateProjectionMatrix();
  camera.lookAt(solarSystem.getPlanetPosition(number));

  // Display planet data to the user
  fillInfo(solarSystem.getPlanetByNumber(number).data);
}

/* ====================================== */
/*          UI INTERFACE FUNCTIONS        */
/* ====================================== */
/** Fill a table with planet information and display it
 * @param data - JSON object that contain planet data*/
function fillInfo(data) {
  document.querySelector("#planet-info").style.display = "block";
  document.querySelector("#name").textContent = data['name'];
  document.querySelector("#mass").textContent = data['mass'];
  document.querySelector("#diameter").textContent = data['diameter'];
  document.querySelector("#density").textContent = data['density'];
  document.querySelector("#gravity").textContent = data['gravity'];
  document.querySelector("#escapeVelocity").textContent = data['escapeVelocity'];
  document.querySelector("#rotationPeriod").textContent = data['rotationPeriod'];
  document.querySelector("#lengthOfDay").textContent = data['lengthOfDay'];
  document.querySelector("#distanceFromSun").textContent = data['distanceFromSun'];
  document.querySelector("#perihelion").textContent = data['perihelion'];
  document.querySelector("#aphelion").textContent = data['aphelion'];
  document.querySelector("#orbitalPeriod").textContent = data['orbitalPeriod'];
  document.querySelector("#orbitalVelocity").textContent = data['orbitalVelocity'];
  document.querySelector("#orbitalInclination").textContent = data['orbitalInclination'];
  document.querySelector("#orbitalEccentricity").textContent = data['orbitalEccentricity'];
  document.querySelector("#obliquityToOrbit").textContent = data['obliquityToOrbit'];
  document.querySelector("#meanTemperature").textContent = data['meanTemperature'];
}

/** Toggle information box visualization */
function toggleInfoBox() {
  // hide other box
  document.querySelector("#keybindings").style.display = "none";
  // toggle project information box visualization
  var infoBox = document.querySelector("#info");
  infoBox.style.display = infoBox.style.display === "block" ? "none" : "block";
}

/** Toggle keybinding box visualization */
function toggleKeyBindingBox() {
  // hide other box
  document.querySelector("#info").style.display = "none";
  // toggle project keys binding box visualization
  var keyBindingBox = document.querySelector("#keybindings");
  keyBindingBox.style.display = keyBindingBox.style.display === "block" ? "none" : "block";
}

/** Hide info box and keybinding box */
function closeCenterBox() {
  document.querySelector("#info").style.display = "none";
  document.querySelector("#keybindings").style.display = "none";
}