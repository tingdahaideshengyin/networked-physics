// @flow

const _UserCommand = {
  THRUST: 0,
  THRUST_END: 1,
  THRUST_REVERSE: 2,
  THRUST_REVERSE_END: 3,
  THRUST_LEFT: 4,
  THRUST_LEFT_END: 5,
  THRUST_RIGHT: 6,
  THRUST_RIGHT_END: 7
};

export type UserCommand = $Values<typeof _UserCommand>;

export default _UserCommand;
