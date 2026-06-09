import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Load from "../Loading/Load.jsx";

function Assignment_4() {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    const group = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < 1000; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      const star = new THREE.Mesh(geometry, material);
      star.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      scene.add(star);
    }

    const flatGeometry = new THREE.PlaneGeometry(50, 50);
    const texture = new THREE.TextureLoader().load(
      "/three_js/soil_texture.jpg"
    );
    const flatMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const flat = new THREE.Mesh(flatGeometry, flatMaterial);
    flat.rotation.x = -Math.PI / 2;
    flat.position.y = -5;
    scene.add(flat);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemisphereLight.position.set(0, 50, 0);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const state = {
      angle: 0,
      mixer: null,
      bird: null,
    };
    const RADIUS = 10;
    const BIRD_HEIGHT = 2;
    const SPEED = 0.5;

    const loader = new GLTFLoader();

    loader.load(
      "/three_js/sakura_model.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(25, 25, 25);
        model.position.set(0, -5, 0);
        group.add(model);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Sakura load error:", error);
        setLoading(false);
      }
    );

    loader.load(
      "/three_js/phoenix_bird.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        group.add(model);
        state.bird = model;

        if (gltf.animations && gltf.animations.length > 0) {
          state.mixer = new THREE.AnimationMixer(model);
          state.mixer.clipAction(gltf.animations[0]).play();
        }

        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Bird load error:", error);
        setLoading(false);
      }
    );

    let lastTime = null;

    const animate = (timeStamp) => {
      const delta = lastTime !== null ? (timeStamp - lastTime) / 1000 : 0;
      lastTime = timeStamp;

      state.angle += SPEED * delta;

      camera.position.x = Math.cos(state.angle) * RADIUS;

      if (state.bird) {
        const x = Math.cos(state.angle) * RADIUS;
        const z = Math.sin(state.angle) * RADIUS;
        state.bird.position.set(x, BIRD_HEIGHT, z);

        // Face direction of travel
        const tangentAngle = state.angle + Math.PI / 2;
        state.bird.rotation.y = -tangentAngle;
      }

      if (state.mixer) {
        state.mixer.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {loading && <Load />}
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </>
  );
}

export default Assignment_4;
