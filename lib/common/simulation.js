import { Body, Box, World } from "p2/build/p2.js";

import UserCommand from "./user-command";

const FIXED_TIME_STEP = 1 / 60;
const MAX_SUB_STEPS = 10;

const commands =
  Object.keys(UserCommand)
    .map(key => UserCommand[key]);

const updatePlayerBody =
  (player, body) => {
    if (player.thrust.forwards) {
      body.applyForceLocal([0, 15], [0, 0]);
    }

    if (player.thrust.reverse) {
      body.applyForceLocal([0, -15], [0, 0]);
    }

    if (player.thrust.left) {
      body.angle += 0.05;
    }

    if (player.thrust.right) {
      body.angle -= 0.05;
    }
  };

export const create =
  (loop, beforeStep = bodies => bodies) => {
    const state = {
      players: {
        player: {
          bodyId: "player",
          thrust: {
            forwards: false,
            right: false,
            reverse: false,
            left: false
          }
        }
      },
      bodies: {
        player: null
      }
    };

    const step = clock => {
      state.bodies = beforeStep(state.bodies, clock.now);
      // Update with local state.
      updatePlayerBody(state.players.player, state.bodies.player);
      // Move the physics world forward one frame.
      world.step(FIXED_TIME_STEP, clock.dt, MAX_SUB_STEPS);
    };

    const world = new World({
      gravity: [0, 0],
      sleepMode: World.BODY_SLEEPING
    });

    const box = new Box({
      width: 2,
      height: 2
    });

    const body = new Body({
      mass: 1,
      position: [0, 0]
    });

    state.bodies.player = body;

    body.addShape(box);
    world.addBody(body);

    loop(step);

    function applyCommand(input) {
      const [command, time, data] = input;

      switch (command) {
        case UserCommand.THRUST:
          state.players.player.thrust.forwards = true;
          break;
        case UserCommand.THRUST_END:
          state.players.player.thrust.forwards = false;
          break;
        case UserCommand.THRUST_REVERSE:
          state.players.player.thrust.reverse = true;
          break;
        case UserCommand.THRUST_REVERSE_END:
          state.players.player.thrust.reverse = false;
          break;
        case UserCommand.THRUST_RIGHT:
          state.players.player.thrust.right = true;
          break;
        case UserCommand.THRUST_RIGHT_END:
          state.players.player.thrust.right = false;
          break;
        case UserCommand.THRUST_LEFT:
          state.players.player.thrust.left = true;
          break;
        case UserCommand.THRUST_LEFT_END:
          state.players.player.thrust.left = false;
          break;
        default:
          break;
      }
    }

    return {
      handle: function (...inputs) {
        for (let input of inputs) {
          applyCommand(input);
        }
      },
      toJSON: function () {
        return [
          body.position,
          body.velocity,
          body.angle,
          body.angularVelocity,
          [box.width, box.height]
        ];
      },
      present: function () {
        const bodies = {};

        for (const id in state.bodies) {
          bodies[id] = {
            angle: body.interpolatedAngle,
            position: body.interpolatedPosition,
            width: box.width,
            height: box.height
          };
        }

        return bodies;
      }
    };
  }
