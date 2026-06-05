import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Assignment_1.css";
import { Timer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Assignment_1() {
  const mountRef = useRef(null);

  useEffect(() => {
    const canvas = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
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

    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const points = [];
    points.push(new THREE.Vector3(-4.5, -4.0, -1.5));
    points.push(new THREE.Vector3(4.5, -4.0, -1.5));

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let model = null;
    loader.load(
      "/three_js/sakura_model.glb",
      function (gltf) {
        model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.set(0, -1, 0);
        scene.add(model);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    camera.position.z = 5;
    const timer = new Timer();

    function animate(timeStamp) {
      timer.update(timeStamp);
      const delta = timer.getDelta();

      cube.rotation.x += delta;
      cube.rotation.y += delta;

      if (model) {
        model.rotation.y += delta;
      }

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
      <div id="title">Cube</div>
      <canvas ref={mountRef} style={{ display: "block" }} />
    </>
  );
}

export default Assignment_1;
