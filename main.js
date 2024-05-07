import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.set(0, 10, 80);

// plane
const viewAngle = -Math.PI/3;
const segments = 50;
const planeWidth = 100;
const planeLength = 100
const geometry = new THREE.PlaneGeometry( planeWidth, planeLength, segments, segments);
const material = new THREE.MeshBasicMaterial( {color: 0x41980a, wireframe: true} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = viewAngle;
scene.add( plane );

// perlin
const perlin = new ImprovedNoise();
const height = 20; 
for (let i = 0; i < geometry.attributes.position.count; i++) {
    
    let x = i % (segments + 1);
    let y = Math.floor(i / (segments + 1));

    let noise = perlin.noise(x / 10, y / 10, 0); 
    geometry.attributes.position.setZ(i, noise * height);
}
geometry.computeVertexNormals(); 


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
