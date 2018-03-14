import * as Hrtime from "./util/hrtime";

export const create =
  rate => {
    const nsPerTick = rate * Hrtime.NS_PER_SEC;
    const step = [0, nsPerTick];

    let previous = process.hrtime();

    const clock = {
      now: 0,
      dt: 0,
      tick: -1
    };

    const loop =
      fn => {
        const diff = process.hrtime(previous);
        const delta = Hrtime.sub(diff, step);
        const d = Hrtime.sum(delta);

        if (d >= 0) {
          const t = process.hrtime();

          previous = Hrtime.add(t, delta);

          clock.dt = (d + nsPerTick) / Hrtime.NS_PER_SEC;
          clock.now = Hrtime.sum(t);
          clock.tick = clock.tick + 1;

          fn(clock);
          loop(fn);
        } else {
          setImmediate(() => loop(fn));
        }
      };

    return loop;
  };
