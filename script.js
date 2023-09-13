const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const faq = button.nextElementSibling;
    const icon = button.children[1];

    faq.classList.toggle("show");
    icon.classList.toggle("rotate");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";

class Model3D {
  constructor() {
    this._Initialize();
    this._previousMouseX = 0;
    this._previousMouseY = 0;
    this._modelPivot = new THREE.Group();

    document.addEventListener("mousemove", (event) => {
      this._OnMouseMove(event);
    });
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this._threejs.setClearColor(0x000000, 0);
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.domElement.style.width = "100%"; // Set the width you prefer
    this._threejs.domElement.style.height = "auto";
    document
      .getElementById("model-container")
      .appendChild(this._threejs.domElement);

    this._camera = new THREE.PerspectiveCamera(
      60,
      this._GetAspectRatio(),
      1,
      1000
    );

    this._camera.position.set(300, 300, 300);
    this._camera.lookAt(0, 0, 0);
    document
      .getElementById("model-container")
      .appendChild(this._threejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    const fov = 50;
    const aspect = 640 / 480;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(
      fov,
      this._GetAspectRatio(),
      // aspect,
      near,
      far
    );
    this._camera.position.set(20, 40, 120);

    this._scene = new THREE.Scene();

    // let light = new THREE.DirectionalLight(0xFFFFFF, 50.0);
    // light.position.set(20, 1000, 0);
    // light.target.position.set(30, 50, 80);
    // light.castShadow = false;
    // light.shadow.bias = -0.001;
    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;
    // light.shadow.camera.near = 0.5;
    // light.shadow.camera.far = 200.0;
    // light.shadow.camera.near = 0.5;
    // light.shadow.camera.far = 200.0;
    // light.shadow.camera.left = 100;
    // light.shadow.camera.right = -100;
    // light.shadow.camera.top = 100;
    // light.shadow.camera.bottom = -100;
    // this._scene.add(light);

    // light = new THREE.AmbientLight(0x101010);
    // this._scene.add(light);

    // let light2 = new THREE.DirectionalLight(0xADD8E6, 10.0);
    // light2.position.set(200, -200, 200);
    // light2.target.position.set(30, 50, 80);
    // light2.castShadow = false;
    // light2.shadow.bias = -0.001;
    // light2.shadow.mapSize.width = 2048;
    // light2.shadow.mapSize.height = 2048;
    // light2.shadow.camera.near = 0.5;
    // light2.shadow.camera.far = 200.0;
    // light2.shadow.camera.near = 0.5;
    // light2.shadow.camera.far = 200.0;
    // light2.shadow.camera.left = 100;
    // light2.shadow.camera.right = -100;
    // light2.shadow.camera.top = 100;
    // light2.shadow.camera.bottom = -100;
    // this._scene.add(light2);

    // light2 = new THREE.AmbientLight(0x101010);
    // this._scene.add(light2);

    let light3 = new THREE.DirectionalLight(0xffffe0, 10.0);
    light3.position.set(0, -200, 0);
    light3.target.position.set(0, 0, 80);
    light3.castShadow = false;
    light3.shadow.bias = -0.001;
    light3.shadow.mapSize.width = 2048;
    light3.shadow.mapSize.height = 2048;
    light3.shadow.camera.near = 0.5;
    light3.shadow.camera.far = 200.0;
    light3.shadow.camera.near = 0.5;
    light3.shadow.camera.far = 200.0;
    light3.shadow.camera.left = 100;
    light3.shadow.camera.right = -100;
    light3.shadow.camera.top = 100;
    light3.shadow.camera.bottom = -100;
    this._scene.add(light3);

    light3 = new THREE.AmbientLight(0x101010);
    this._scene.add(light3);

    let light4 = new THREE.DirectionalLight(0xffffe0, 5.0);
    light4.position.set(-30, 50, 0);
    light4.target.position.set(0, 0, 80);
    light4.castShadow = false;
    light4.shadow.bias = -0.001;
    light4.shadow.mapSize.width = 2048;
    light4.shadow.mapSize.height = 2048;
    light4.shadow.camera.near = 0.5;
    light4.shadow.camera.far = 200.0;
    light4.shadow.camera.near = 0.5;
    light4.shadow.camera.far = 200.0;
    light4.shadow.camera.left = 100;
    light4.shadow.camera.right = -100;
    light4.shadow.camera.top = 100;
    light4.shadow.camera.bottom = -100;
    this._scene.add(light4);

    light4 = new THREE.AmbientLight(0x101010);
    this._scene.add(light4);

    this._LoadModel();
    this._RAF();
  }

  _GetAspectRatio() {
    return (
      document.getElementById("model-container").clientWidth /
      document.getElementById("model-container").clientHeight
    );
  }

  _OnMouseMove(event) {
    const deltaX = event.clientX - this._previousMouseX;
    const deltaY = event.clientY - this._previousMouseY;

    if (this._modelPivot) {
      this._modelPivot.rotation.y += deltaX * 0.001;
      this._modelPivot.rotation.x += deltaY * 0.001;
    }

    this._previousMouseX = event.clientX;
    this._previousMouseY = event.clientY;
  }

  _LoadModel() {
    const loader = new GLTFLoader();
    loader.load("./resources/Skare_v2/HD/Skare_hd.gltf", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
        c.scale.set(3.7, 3.7, 3.7);
      });

      this._modelPivot = new THREE.Group();
      this._modelPivot.add(gltf.scene);

      this._modelPivot.position.set(20, 20, 20);

      this._scene.add(this._modelPivot);
    });
  }

  _OnWindowResize() {
    const container = document.getElementById("model-container");
    const windowWidth = window.innerWidth;
    const widthPercentage = 0.2; // 40% width of the window

    const newWidth = Math.min(windowWidth * widthPercentage, windowWidth); // Limit width to the desired percentage
    const aspectRatio = newWidth / container.clientHeight;
    const newHeight = newWidth / aspectRatio;

    this._camera.aspect = aspectRatio;
    this._camera.updateProjectionMatrix();

    this._threejs.setSize(newWidth, newHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      this._threejs.render(this._scene, this._camera);
      this._RAF();
    });
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new Model3D();
});
