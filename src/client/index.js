import { Client as UdpClient } from "web-udp/client";

import UserCommand from "../../lib/common/user-command";
import * as Simulation from "../../lib/common/simulation";
import * as SnapshotBuffer from "./snapshot-buffer";
import * as Graphics from "./graphics";
import Bindings from "./input/bindings";

const CLIENT_SEND_RATE = 1 / 30 * 1000;
const snapshotBuffer = SnapshotBuffer.create();

let t0 = 0;
let master;

const inputBuffer = [];

const client = new UdpClient({
  url: "localhost:3000"
});

const clock = {
  now: 0,
  server: 0
};

const loop =
  fn => {
    requestAnimationFrame(t1 => {
      const dt = (t1 - t0) / 1000;
      
      clock.now += dt;
      clock.dt = dt;

      t0 = t1;

      fn(clock);

      simulation.present()
        |> Graphics.render;

      loop(fn);
    });
  };

const beforeStep =
  bodies =>
    // Apply interpolated server snapshots.
    snapshotBuffer.apply(bodies, clock.now);

const simulation = Simulation.create(loop, beforeStep);

const capture =
  (command, data) => {
    const time = performance.now() / 1000;
    const packet = [command, time, data];

    inputBuffer.push(packet);

    return packet;
  };

const apply =
  (command, data) =>
    capture(command, data)
      |> simulation.handle;

const onKeyDown =
  e => {
    let command = Bindings[`+${e.key}`];

    if (typeof command === "undefined") {
      return;
    }

    apply(command);
  };

const onKeyUp =
  e => {
    let command = Bindings[`-${e.key}`];

    if (typeof command === "undefined") {
      return;
    }

    apply(command);
  };

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

// Send batched inputs to server at a fixed interval.
setInterval(() => {
  if (!master || inputBuffer.length === 0) {
    return;
  }

  inputBuffer
    |> JSON.stringify
    |> master.send;

  inputBuffer.length = 0;
}, CLIENT_SEND_RATE);

const onMessage =
  data => {
    const packet = JSON.parse(data);
    const [ position, velocity, angle, angularVelocity ] = packet;
    const snapshot = {
      player: {
        position,
        velocity,
        angle,
        angularVelocity,
      }
    };

    snapshotBuffer.insert(snapshot, clock.now);
  };

const onConnection =
  connection => {
    connection.messages.subscribe(onMessage);
    master = connection;
  };

Graphics.mount(
  document.getElementById("root-game")
);

import("./ui")
  .then(
    UI => UI.mount(
      document.getElementById("root-ui")
    )
  );

client.connections.subscribe(onConnection);

client.connect();
