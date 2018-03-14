export const NS_PER_SEC = 1e9;

export const add =
  (t1, t2) =>
    [
      t1[0] + t2[0],
      t1[1] + t2[1]
    ];

export const sub =
  (t1, t2) =>
    [
      t1[0] - t2[0],
      t1[1] - t2[1]
    ];

export const sum =
  t =>
    t[0] * NS_PER_SEC + t[1];
