import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "../Assignment_1/Assignment_1.css";
import { Timer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Load from "../Loading/Load.jsx";

function Assignment_1() {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      150,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const handleSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleSize);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 5);
    controls.update();

    const starGeometry = new THREE.Group();
    scene.add(starGeometry);

    for(let i = 0; i < 1000; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 0.1, 0.05);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff , wireframe: true});
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      starGeometry.add(sphere);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load the GLTF model
    const loader = new GLTFLoader();
    let model = null;
    loader.load(
      "/three_js/sakura_model.glb",
      function (gltf) {
        model = gltf.scene;
        model.scale.set(22, 22, 22);
        model.position.set(0, -6, 0);
        scene.add(model);
        setLoading(false);
      },
      undefined,
      function (error) {
        console.error(error);
        setLoading(false);
      }
    );

    camera.position.z = 5;
    const timer = new Timer();

    function animate(timeStamp) {
      timer.update(timeStamp);
      const delta = timer.getDelta();

      if (model) {
        model.rotation.y += delta/10;
      }

      starGeometry.rotation.y += delta/20;

      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener("resize", handleSize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
    };
  }, []);

  return (
    <>
    {loading && <Load />}
      <canvas ref={mountRef} style={{ display: "block" }} />
    </>
  );
}

export default Assignment_1;
