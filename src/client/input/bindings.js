// @flow

import UserCommand from "../../../lib/common/user-command";

const _Bindings = {
  "+w": UserCommand.THRUST,
  "-w": UserCommand.THRUST_END,
  "+s": UserCommand.THRUST_REVERSE,
  "-s": UserCommand.THRUST_REVERSE_END,
  "+a": UserCommand.THRUST_LEFT,
  "-a": UserCommand.THRUST_LEFT_END,
  "+d": UserCommand.THRUST_RIGHT,
  "-d": UserCommand.THRUST_RIGHT_END,
};

export type Bindings = $Keys<typeof _Bindings>;

export default _Bindings;
