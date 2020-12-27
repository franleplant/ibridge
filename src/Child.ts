import debugFactory from "debug";
import { HANDHSAKE_START, HANDSHAKE_REPLY } from "./constants";

import Bridge, { IConstructorArgs } from "./Bridge";

const debug = debugFactory("ibridge:child");

export default class ChildAPI extends Bridge {
  constructor(args: IConstructorArgs) {
    super(args);
  }

  async handshake(): Promise<ChildAPI> {
    await this.once(HANDHSAKE_START);
    debug("received handshake from Parent");
    debug("sending handshake reply to Parent");
    this.emitToRemote(HANDSHAKE_REPLY, undefined);
    debug("handshake ok");
    return this;
  }
}
