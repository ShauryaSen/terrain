import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const terrain = {
    
    viewAngle : -Math.PI/2,
    segments : 500,
    segments : 500,
    planeWidth : 500,
    planeLength : 500,
    geometry : null,
    material : null,
    texture : new THREE.TextureLoader().load('textures/TerrainTexture.jpg' ),
    
    init: function() {
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(10, 10); 
        this.geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeLength, this.segments, this.segments);
        this.material = new THREE.MeshStandardMaterial({ map: this.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = this.viewAngle;
        
        return this.mesh;
    },

    generateTerrain : function() {
        const perlin = new ImprovedNoise();
        const height = 50; 
        const positionAttribute = this.geometry.getAttribute('position');
        for (let i = 0; i < positionAttribute.count; i++) {
    
            let x = i % (this.segments + 1);
            let y = Math.floor(i / (this.segments + 1));

            let noise = perlin.noise(x / 30, y / 30, 0); 
            positionAttribute.setZ(i, noise * height);
        }
        this.geometry.computeVertexNormals(); 
    }

}

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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);

// terrain
const terrainMesh = terrain.init();
scene.add(terrainMesh);
terrain.generateTerrain();

// skybox
const loader = new THREE.CubeTextureLoader();
loader.setPath('textures/skybox/');

const skyboxTexture = loader.load([
    'right.bmp', 'left.bmp',
    'top.bmp', 'bottom.bmp',
    'front.bmp', 'back.bmp'
]);

scene.background = skyboxTexture;

function animate() {
	requestAnimationFrame( animate );
    controller.update(1);
	renderer.render( scene, camera );
}
animate();
