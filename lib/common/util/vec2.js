// @flow

type Vec2 = [number, number];

export const lerp =
  (v0: Vec2, v1: Vec2, t: number) => {
    const ax = v0[0];
    const ay = v0[1];

    return [
      ax + t * (v1[0] - ax),
      ay + t * (v1[1] - ay)
    ];
  };
