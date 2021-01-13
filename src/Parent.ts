import debugFactory from "debug";
import { HANDHSAKE_START, HANDSHAKE_REPLY } from "./constants";
import Bridge, { IConstructorArgs } from "./Bridge";

const debug = debugFactory("ibridge:parent");

// Since all the communication capabilities are inside of the Bridge class
// this Parent class now only needs to deal with the handshake.
// In fact, consumers that might not care about a handshake might use
// Bridge directly, or perhaps they want to build their own handshake logic
// with the communication primitives that Bridge already provides.
//
// TODO perhaps this can be renamed to something else?
// THe main purpose of calling it Parent or Server is that
// this is the thing that "initializes" the handshake process.
export default class ParentAPI extends Bridge {
  /**
   * The maximum number of attempts to send a handshake request to the parent
   */
  static maxHandshakeRequests = 5;

  constructor(args: IConstructorArgs) {
    super(args);
  }

  async handshake(): Promise<ParentAPI> {
    debug("starting handshake");
    let attempt = 0;

    const tryHandshake = async () => {
      while (attempt < ParentAPI.maxHandshakeRequests) {
        attempt++;
        debug(`handshake attempt %s %s`, attempt, this.remoteOrigin);
        // TODO rename these events
        this.emitToRemote(HANDHSAKE_START);

        try {
          await Promise.race([this.once(HANDSHAKE_REPLY), timeout(500)]);
        } catch (err) {
          // this should only happen if the timeout is reached, try again
          continue;
        }

        debug("Received handshake reply from Child");
        // Clean up any outstanding handhsake reply "once" listeners
        this.clearListeners(HANDSHAKE_REPLY);
        return;
      }

      throw new Error("maximum handshake attempts reached");
    };

    await tryHandshake();
    debug("handshake ok");
    return this;
  }
}

export function timeout(ms: number): Promise<never> {
  return new Promise((_resolve, reject) => setTimeout(reject, ms));
}
