import debugFactory from "debug";
import { HANDSHAKE_REQUEST, HANDSHAKE_RESPONSE } from "./msg/handshake";
import Bridge, { IConstructorArgs } from "./Bridge";

export default class ParentAPI<TModel, TContext = undefined> extends Bridge<
  TModel,
  TContext
> {
  /**
   * The maximum number of attempts to send a handshake request to the parent
   */
  static maxHandshakeRequests = 5;

  constructor(args: IConstructorArgs<TModel, TContext>) {
    super(args);

    this.debug = debugFactory(`ibridge:child-${this.sessionId}`)
  }

  async handshake(): Promise<ParentAPI<TModel, TContext>> {
    this.debug("starting handshake");
    let attempt = 0;

    const tryHandshake = async () => {
      while (attempt < ParentAPI.maxHandshakeRequests) {
        attempt++;
        this.debug(`handshake attempt %s %s`, attempt, this.channel);
        this.emitToRemote(HANDSHAKE_REQUEST);

        try {
          await Promise.race([this.once(HANDSHAKE_RESPONSE), timeout(500)]);
        } catch (err) {
          // this should only happen if the timeout is reached, try again
          continue;
        }

        this.debug("Received handshake reply from Child");
        // Clean up any outstanding handhsake reply "once" listeners
        this.clearListeners(HANDSHAKE_REQUEST);
        return;
      }

      throw new Error("maximum handshake attempts reached");
    };

    await tryHandshake();
    this.debug("handshake ok");
    return this;
  }
}

export function timeout(ms: number): Promise<never> {
  return new Promise((_resolve, reject) => setTimeout(reject, ms));
}
