import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./Assignment_3.css";

function Assignment_3() {
  const mountRef = useRef(null);
  const blinkInterval = useRef(null);

  useEffect(() => {
    const canvas = mountRef.current;
    const scene = new THREE.Scene();

    let cameraAngle = 60;

    setInterval(() => {
      cameraAngle += 0.01;
      const radius = 5;
      const x = radius * Math.cos(cameraAngle);
      const z = radius * Math.sin(cameraAngle);
      camera.position.set(x, 0, z);
      camera.lookAt(0, 0, 0);
    }, 20);

    const camera = new THREE.PerspectiveCamera(
      cameraAngle,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const handleSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleSize);

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = i * 2 - 2;
      scene.add(cube);
    }

    for (let i = 0; i < 150; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        opacity: 0.7,
        transparent: true,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(sphere);
    }

    const ambientLight = new THREE.AmbientLight(0xffff000, 0.8);
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 5);
    controls.update();

    const colorArray = [0xaa0000, 0x00aa00, 0x0000aa];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        if (blinkInterval.current) {
          clearInterval(blinkInterval.current);
        }

        let colorIndex = 0;
        blinkInterval.current = setInterval(() => {
          intersectedObject.material.color.set(colorArray[colorIndex]);
          colorIndex = (colorIndex + 1) % colorArray.length;
        }, 500);
      }
    };

    window.addEventListener("click", onClick);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleSize);
      cancelAnimationFrame(animId);
      window.removeEventListener("click", onClick);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="canvas" ref={mountRef} />
      <div id="content">
        <h1 id="topic">Raycasting</h1>
      </div>
    </>
  );
}

export default Assignment_3;
