import * as Three from "three";

const { innerWidth: width, innerHeight: height } = window;

const scene = new Three.Scene();
const camera = new Three.OrthographicCamera(width / - 50, width / 50, height / 50, height / -50, - 500, 1000);
const renderer = new Three.WebGLRenderer({
  antialias: true
});

renderer.setSize(width, height);

const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshBasicMaterial({ color: 0x0033ff });

const meshes = {};

export const render =
  bodies => {
    for (const id in bodies) {
      const { angle, position: [x, y] } = bodies[id];

      let mesh = meshes[id];

      if (!mesh) {
        mesh = meshes[id] = new Three.Mesh(geometry, material);
        scene.add(mesh);
      }

      mesh.position.set(x, y, 0);
      mesh.rotation.z = angle;
    }

    renderer.render(scene, camera);
  };

export const mount =
  el =>
    el.appendChild(renderer.domElement);
