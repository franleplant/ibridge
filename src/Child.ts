import debugFactory from "debug";
import { HANDSHAKE_REQUEST, HANDSHAKE_RESPONSE } from "./msg/handshake";

import Bridge, { IConstructorArgs } from "./Bridge";

export default class ChildAPI<TModel, TContext = undefined> extends Bridge<
  TModel,
  TContext
> {
  constructor(args: IConstructorArgs<TModel, TContext>) {
    super(args);

    this.debug = debugFactory(`ibridge:child-${this.sessionId}`)
  }

  async handshake(): Promise<ChildAPI<TModel, TContext>> {
    await this.once(HANDSHAKE_REQUEST);
    this.debug("received handshake from Parent");
    this.debug("sending handshake reply to Parent");
    this.emitToRemote(HANDSHAKE_RESPONSE, undefined);
    this.debug("handshake ok");
    return this;
  }
}
