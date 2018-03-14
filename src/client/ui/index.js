import React from "react";
import { render } from "react-dom";

import { App } from "./App";

export const mount = el => render(<App />, el);
