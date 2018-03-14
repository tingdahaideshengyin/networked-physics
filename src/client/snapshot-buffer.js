import * as Vec from "../../lib/common/util/vec";
import * as Vec2 from "../../lib/common/util/vec2";

const SNAPSHOT_DELAY = 1/10;

const applyInterpBodyUpdate =
  (a, b, body, t) => {
    body.position = Vec2.lerp(a.position, b.position, t);
    body.velocity = Vec2.lerp(a.velocity, b.velocity, t);
    body.angle = Vec.lerp(a.angle, b.angle, t);
    body.angularVelocity = Vec.lerp(a.angularVelocity, b.angularVelocity, t);

    return body;
  };

export const create =
  (delay = SNAPSHOT_DELAY) => {
    const frames = [];

    const api = {
      insert: (snapshot, time) => {
        frames.push({ time, snapshot });

        return api;
      },
      apply: (bodies, time) => {
        let [prev, next] = frames;
        let dt;

        // Discard expired frames.
        while (prev && next && (dt = time - prev.time) > delay) {
          frames.shift();
          [prev, next] = frames;
        }

        if (!(next && prev)) {
          return bodies;
        }

        const t = dt / delay;

        for (const id in prev.snapshot) {
          if (
            prev.snapshot[id] &&
            next.snapshot[id]
          ) {
            bodies[id] = applyInterpBodyUpdate(
              prev.snapshot[id],
              next.snapshot[id],
              bodies[id],
              t
            );
          }
        }

        return bodies;
      }
    };

    return api;
  };
