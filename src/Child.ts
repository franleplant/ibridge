import debugFactory from "debug";
import { HANDSHAKE_REQUEST, HANDSHAKE_RESPONSE } from "./msg/handshake";

import Bridge, { IConstructorArgs } from "./Bridge";
import { WindowChannel } from "./channel";

export default class ChildAPI<TModel, TContext = undefined> extends Bridge<
  TModel,
  TContext
> {
  static fromWindow<TModel, TContext = undefined>(
    model: TModel,
    context?: TContext
  ): ChildAPI<TModel, TContext> {
    const channel = new WindowChannel({
      remoteWindow: window.parent,
      remoteOrigin: "*",
    });

    return new ChildAPI({ channel, model, context });
  }

  constructor(args: IConstructorArgs<TModel, TContext>) {
    super(args);

    this.debug = debugFactory(`ibridge:child-{without-session}`);
    this.sessionId = undefined;
  }

  async handshake(): Promise<ChildAPI<TModel, TContext>> {
    const { sessionId } = (await this.once(HANDSHAKE_REQUEST)) as any;
    this.debug(
      "received handshake from Parent, storing sessionId %s",
      sessionId
    );
    this.sessionId = sessionId;
    this.debug = debugFactory(`ibridge:child-${this.sessionId}`);
    this.channel.setDebugPrefix(sessionId);

    this.debug("sending handshake reply to Parent");
    this.emitToRemote(HANDSHAKE_RESPONSE, undefined);
    this.debug("handshake ok");
    return this;
  }
}
