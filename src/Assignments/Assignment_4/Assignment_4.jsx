import * as THREE from "three";
import { useRef, useEffect } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Timer } from "three";

function Assignment_4() {
  const canvasRef = useRef(null);
  let angle = 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    //const axesHelper = new THREE.AxesHelper(5);
    const scene = new THREE.Scene();
    //scene.add(axesHelper);

    const camera = new THREE.PerspectiveCamera(
      angle,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resize);

    const loader = new GLTFLoader();
    loader.load(
      "/three_js/phoenix_bird.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(0, -3, 0);
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();

          const timer = new Timer();
          const animate = (timeStamp) => {
            timer.update(timeStamp);
            const delta = timer.getDelta();
            angle += delta / 2;

            const radius = 15;

            camera.position.x = Math.cos(angle) + 20;
            camera.position.z = Math.sin(angle) + 5;

            model.position.x = Math.cos(angle) * radius;
            model.position.z = Math.sin(angle) * radius;

            mixer.update(delta);
            renderer.render(scene, camera);
          };
          renderer.setAnimationLoop(animate);
        }
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    for (let i = 0; i < 1000; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
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

    loader.load(
      "/three_js/sakura_model.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(25, 25, 25);
        model.position.set(0, -5, 0);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.set(50, 0, 10);
    camera.lookAt(0, 0, 0);
    const animate = () => {
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.dispose();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    ></canvas>
  );
}

export default Assignment_4;
