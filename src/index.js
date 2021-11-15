import "./styles.css";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/scene";
import { DeviceOrientationCamera, SixDofDragBehavior } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { GLTFLoader } from "@babylonjs/loaders/glTF/2.0/glTFLoader";
import { Animation } from "@babylonjs/core";

var initSetup = async function () {
  // Basic setup
  const canvas = document.querySelector("#app");
  const engine = new Engine(canvas, true, null, true);
  const scene = new Scene(engine);

  //vytoření kamery v pozici -5 (dozadu)
  //const camera = new UniversalCamera("Camera", new Vector3(0, 5, 10), scene);
  //const camera = new UniversalCamera("kamera",new Vector3(1,1,10),scene);
  const camera = new DeviceOrientationCamera(
    "kamera",
    new Vector3(1, 1, 10),
    scene
  );

  //zaměřit kameru do středu
  camera.setTarget(new Vector3(0, 1, 0));
  scene.activeCamera.attachControl(canvas, false);
  const environment1 = scene.createDefaultEnvironment({
    enableGroundShadow: true
  });
  await scene.createDefaultXRExperienceAsync({
    floorMeshes: [environment1.ground]
  });
  new DirectionalLight("dir01", new Vector3(0.25, -1, 0), scene);

  window.addEventListener("resize", () => engine.resize());

  engine.runRenderLoop(() => scene.render());
  return scene;
};

var initModel2Function = async function (scene) {
  var freza1 = await SceneLoader.ImportMeshAsync(
    "",
    "public/",
    "mill.glb",
    scene
  );
  // .then(function(newMeshes){
  //   newMeshes.meshes[0].scaling = new Vector3(0.1, 0.1, 0.07);
  //   newMeshes.meshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  //   //newMeshes.meshes[0].position.x = 2;
  //   newMeshes.meshes[0].position.z = 2;
  // });
  var frezaMesh1 = freza1.meshes[0];
  frezaMesh1.rotate(new Vector3(0, 0, 1), (frezaMesh1.rotation.y += 0.00001));

  frezaMesh1.scaling = new Vector3(0.1, 0.1, 0.07);
  frezaMesh1.rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  frezaMesh1.position.x = -1;
  frezaMesh1.position.z = -2;
  var sixDofDragBehavior = new SixDofDragBehavior();
  sixDofDragBehavior.rotateDraggedObject = true;
  // sixDofDragBehavior. = false;
  let frezasubmesh;
  frezasubmesh = frezaMesh1;
  frezasubmesh.addBehavior(sixDofDragBehavior);
};

var initModelFunction = async function (scene) {
  var frezaMeshaset = await SceneLoader.ImportMeshAsync(
    "",
    "public/",
    "endmill.glb",
    scene
  );
  var frezaMesh2 = frezaMeshaset.meshes[0];
  frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.00001));

  frezaMesh2.scaling = new Vector3(0.15, 0.15, 0.15);
  frezaMesh2.rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  frezaMesh2.position.x = 2;
  frezaMesh2.position.z = -2;

  //před vykreslením se vždy provede
  scene.registerBeforeRender(function () {
    //sphere.position.x += 0.03;
    //light1.setDirectionToTarget(sphere.position);
    if (frezaMesh2.position.x > 2) {
      frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.01));
    }

    //frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.001));
  });
  var animationFunction = function (frezaMesh2) {
    const frameRate = 10;
    const xSlide = new Animation(
      "xSlide",
      "position.x",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keyFrames = [];

    keyFrames.push({
      frame: 0,
      value: 1
    });

    keyFrames.push({
      frame: frameRate,
      value: 5
    });

    keyFrames.push({
      frame: 2 * frameRate,
      value: 1
    });

    xSlide.setKeys(keyFrames);
    frezaMesh2.animations.push(xSlide);
    scene.beginAnimation(frezaMesh2, 0, 2 * frameRate, true);
  };
  animationFunction(frezaMesh2);
};

initSetup().then((scene) => {
  initModelFunction(scene);
  initModel2Function(scene);
});
