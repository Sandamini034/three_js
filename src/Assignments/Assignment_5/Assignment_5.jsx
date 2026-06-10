import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Assignment_5() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const plateGeometry = new THREE.PlaneGeometry(100, 100);
    const plateMaterial = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.rotation.x = -Math.PI / 2;
    plate.position.y = -3;
    scene.add(plate);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let model = null;
    let mixer = null;
    const targetPosition = new THREE.Vector3();
    let hasTarget = false;

    const onClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(plate);

      if (intersects.length > 0) {
        targetPosition.copy(intersects[0].point);
        targetPosition.y = plate.position.y + 1;
        hasTarget = true;
      }
    };

    canvas.addEventListener("click", onClick);

    const loader = new GLTFLoader();
    loader.load(
      "/three_js/phoenix_bird.glb",
      (gltf) => {
        model = gltf.scene;
        model.position.set(0, plate.position.y + 1, 0);
        model.scale.set(0.007, 0.007, 0.007);
        model.castShadow = true;
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      if (model && hasTarget) {
        model.position.lerp(targetPosition, 0.04);

        const direction = new THREE.Vector3()
          .subVectors(targetPosition, model.position)
          .normalize();
        if (direction.length() > 0.01) {
          const angle = Math.atan2(direction.x, direction.z);
          model.rotation.y = angle;
        }
      }

      orbitControls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100vw", height: "100vh" }}
    />
  );
}

export default Assignment_5;
