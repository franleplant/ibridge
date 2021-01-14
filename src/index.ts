import "regenerator-runtime/runtime.js";

import Bridge from "./Bridge";
import { WindowChannel, WorkerChannel } from "./channel";
import Parent from "./Parent";
import Child from "./Child";

export type { IChannel } from "./channel";
export { Bridge, Parent, Child, WindowChannel, WorkerChannel };

export default { Bridge, Parent, Child, WindowChannel, WorkerChannel };
