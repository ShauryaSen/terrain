import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';


// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
let cameraPos = {x: 0, y: 15}
camera.position.set(cameraPos.x, cameraPos.y, 0);

// controls
const controller = new FlyControls( camera, document );
controller.movementSpeed=0.3
controller.autoForward = true;
controller.rollSpeed = 0.008

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // sunlight
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);


// load texture
const terrainTexture = new THREE.TextureLoader().load('assets/TerrainTexture.jpg' ); 
terrainTexture.wrapS = THREE.RepeatWrapping;
terrainTexture.wrapT = THREE.RepeatWrapping;
terrainTexture.repeat.set(10, 10); 


// plane
const viewAngle = -Math.PI/2;
const segments = 500;
const planeWidth = 500;
const planeLength = 500;
const geometry = new THREE.PlaneGeometry( planeWidth, planeLength, segments, segments);

const material = new THREE.MeshStandardMaterial({
    map: terrainTexture,
});

const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = viewAngle;
scene.add( plane );

// perlin
const perlin = new ImprovedNoise();
const height = 50; 
const positionAttribute = geometry.getAttribute('position');
for (let i = 0; i < positionAttribute.count; i++) {
    
    let x = i % (segments + 1);
    let y = Math.floor(i / (segments + 1));

    let noise = perlin.noise(x / 30, y / 30, 0); 
    positionAttribute.setZ(i, noise * height);
}
geometry.computeVertexNormals(); 

function animate() {
	requestAnimationFrame( animate );
    controller.update(1);
	renderer.render( scene, camera );
}
animate();
