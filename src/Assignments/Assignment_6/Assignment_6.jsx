import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Load from "../Loading/Load.jsx";

function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

function Assignment_6() {
  const canvasRef = useRef(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 20, 50);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 10);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    //const axis = new THREE.AxesHelper(10);
    //scene.add(axis);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const directionLight = new THREE.DirectionalLight(0xffffff);
    directionLight.position.set(0, 10, 10);
    scene.add(directionLight);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    const Resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", Resize);

    const state = {
      targetAngle: 0,
      mixer: null,
      model: null,
      actions: {},
      currentAction: null,
      idleAnim: "anm_01000004",
      walkAnim: "anm_01020001",
      runAnim: "anm_01020002",
      attackAnim: "anm_00020001_s",
      jumpAnim: "anm_01000034",
      waveAnim: "anm_01000021",
    };

    const playAnimation = (name) => {
      if (!state.actions[name]) return;
      if (state.currentAction === state.actions[name]) return;

      if (state.currentAction) {
        state.currentAction.fadeOut(0.2);
      }

      state.currentAction = state.actions[name];
      state.currentAction.reset().fadeIn(0.2).play();
    };

    const planeGeometry = new THREE.PlaneGeometry(100, 100);

    const texture = new THREE.TextureLoader().load("/three_js/brick_wall.jpg");
    texture.repeat.set(10, 10);
    //enables horizontal repeat
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const planeMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -3;
    scene.add(plane);

    canvas.focus();

    const keyPressed = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      KeyF: false,
      Space: false,
      ShiftLeft: false,
      KeyX: false,
    };

    const onKeyDown = (event) => {
      if (event.code in keyPressed) keyPressed[event.code] = true;
    };
    const onKeyUp = (event) => {
      if (event.code in keyPressed) keyPressed[event.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("keyup", onKeyUp);

    const loader = new GLTFLoader();
    loader.load(
      "/three_js/character.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -3, 0);
        model.scale.set(8, 8, 8);
        scene.add(model);
        setLoad(false);

        state.model = model;

        if (gltf.animations.length > 0) {
          state.mixer = new THREE.AnimationMixer(model);

          gltf.animations.forEach((clip) => {
            state.actions[clip.name] = state.mixer.clipAction(clip);
          });

          console.log(
            "Available animations:",
            gltf.animations.map((a) => a.name)
          );

          playAnimation(state.idleAnim);
        }
      },
      undefined,
      (error) => {
        setLoad(false);
        console.error("Error loading model:", error);
      }
    );

    let lastTime = null;
    let SPEED = 5;

    const animate = (timeStamp) => {
      const delta = lastTime !== null ? (timeStamp - lastTime) / 1000 : 0;
      lastTime = timeStamp;

      if (state.model) {
        const moveDistance = SPEED * delta;
        const isMoving =
          keyPressed.KeyW ||
          keyPressed.KeyS ||
          keyPressed.KeyA ||
          keyPressed.KeyD;

        if (keyPressed.KeyF) {
          playAnimation(state.attackAnim);
        } else if (keyPressed.Space) {
          playAnimation(state.jumpAnim);
        } else if (keyPressed.KeyX) {
          playAnimation(state.waveAnim);
        } else if (keyPressed.ShiftLeft && isMoving) {
          playAnimation(state.runAnim);
        } else if (isMoving) {
          playAnimation(state.walkAnim);
        } else {
          playAnimation(state.idleAnim);
        }

        if (keyPressed.ShiftLeft && isMoving) {
          SPEED = 10;
        } else {
          SPEED = 5;
        }

        if (keyPressed.KeyW) {
          state.model.position.z -= moveDistance;
          state.targetAngle = -Math.PI;
        }
        if (keyPressed.KeyS) {
          state.model.position.z += moveDistance;
          state.targetAngle = 0;
        }
        if (keyPressed.KeyA) {
          state.model.position.x -= moveDistance;
          state.targetAngle = -Math.PI / 2;
        }
        if (keyPressed.KeyD) {
          state.model.position.x += moveDistance;
          state.targetAngle = Math.PI / 2;
        }

        if (state.model.position.length() > 47) {
          state.model.position.setLength(47);
        }
        state.model.rotation.y = lerpAngle(
          state.model.rotation.y,
          state.targetAngle,
          0.15
        );
      }

      if (state.mixer) state.mixer.update(delta);
      orbitControls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener("resize", Resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
      renderer.setAnimationLoop(null);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {load && <Load />}
      <canvas ref={canvasRef} id="canvas" />
    </>
  );
}

export default Assignment_6;
