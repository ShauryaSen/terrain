import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const Terrain = {
    
    viewAngle : -Math.PI/2,
    segments : 500,
    segments : 500,
    planeWidth : 500,
    planeLength : 500,
    geometry : null,
    material : null,
    texture : new THREE.TextureLoader().load('assets/textures/TerrainTexture.jpg' ),
    
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

const Eagle = {
    object : null,
    mixer : null,
    controller : null,

    init : function() {
        const eagleLoader = new GLTFLoader();
        eagleLoader.load('assets/eagle/scene.gltf', function(gltf) {
            Eagle.loadModel(gltf);
        });
    },

    loadModel : function (gltf) {
        this.object = gltf.scene;
        this.object.position.set(10, 15, 0);
        this.object.scale.set(0.3, 0.3, 0.3);
        scene.add(this.object);
    
        this.mixer = new THREE.AnimationMixer(this.object);
        gltf.animations.forEach((clip) => {
            this.mixer.clipAction(clip).play();
        });
    
        this.mixer.timeScale = 0.02;
    
        // fly controller
        this.controller = new FlyControls(this.object, renderer.domElement);
        this.controller.movementSpeed = 0.4;
        this.controller.autoForward = true;
        this.controller.rollSpeed = 0.01;
    },

    update: function(delta) {
        if (this.mixer) this.mixer.update(delta);
        if (this.controller) this.controller.update(delta);
    }
}

// scene //
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let cameraPos = {x: 10, y: 15}
camera.position.set(cameraPos.x, cameraPos.y, 0);

// lighting //
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);

// skybox //
const loader = new THREE.CubeTextureLoader();
loader.setPath('assets/textures/skybox/');
const skyboxTexture = loader.load([
    'right.bmp', 'left.bmp',
    'top.bmp', 'bottom.bmp',
    'front.bmp', 'back.bmp'
]);
scene.background = skyboxTexture;

// terrain //
const terrainMesh = Terrain.init();
scene.add(terrainMesh);
Terrain.generateTerrain();

// eagle //
Eagle.init();

function animate() {
	requestAnimationFrame( animate );

    Eagle.update(1);
    const eagle = Eagle.object;
    if (eagle) {
        camera.position.copy(eagle.position).add(new THREE.Vector3(0, 10, 20).applyQuaternion(eagle.quaternion));
        camera.lookAt(eagle.position);
    }

	renderer.render( scene, camera );
}
animate();
