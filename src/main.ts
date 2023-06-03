import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import "./style.css";

import environmentMapNx from "/textures/nx.jpg";
import environmentMapNy from "/textures/ny.jpg";
import environmentMapNz from "/textures/nz.jpg";
import environmentMapPx from "/textures/px.jpg";
import environmentMapPy from "/textures/py.jpg";
import environmentMapPz from "/textures/pz.jpg";

const cubeTextureLoader = new THREE.CubeTextureLoader();
const gui = new dat.GUI();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100,
);
camera.position.set(4, 1, -4);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const environmentMap = cubeTextureLoader.load([
	environmentMapPx,
	environmentMapNx,
	environmentMapPy,
	environmentMapNy,
	environmentMapPz,
	environmentMapNz,
]);
scene.background = environmentMap;
scene.environment = environmentMap;

gui
	.add(renderer, "toneMapping", {
		No: THREE.NoToneMapping,
		Linear: THREE.LinearToneMapping,
		Reinhard: THREE.ReinhardToneMapping,
		Cineon: THREE.CineonToneMapping,
		ACESFilmic: THREE.ACESFilmicToneMapping,
	})
	.onFinishChange(() => {
		renderer.toneMapping = Number(renderer.toneMapping) as THREE.ToneMapping;
	});
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

const tick = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};
tick();
