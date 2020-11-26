import { v4 as uuid } from "uuid";
import debugFactory from "debug";
import Emittery from "emittery";

import type {
  IChildEmit,
  IRejectData,
  IResolveData,
  IGetData,
} from "./events";
import {  createParentEmit, isValidEvent } from "./events";
import {
  GET_START,
  GET_REJECT,
  GET_RESOLVE,
  HANDHSAKE_START,
  HANDSHAKE_REPLY,
  CHILD_EMIT,
} from "./constants";

const debug = debugFactory("PARENT");

interface IConstructorArgs {
  container?: HTMLElement;
  url: string;
  name?: string;
  classList?: Array<string>;
}

export default class ParentAPI extends Emittery {
  public readonly parent: Window;
  public readonly child: Window;
  public readonly frame: HTMLIFrameElement;
  public readonly childOrigin: string;
  public readonly container: HTMLElement;

  /**
   * The maximum number of attempts to send a handshake request to the parent
   */
  static maxHandshakeRequests: number = 5;

  constructor({
    container = document.body,
    url,
    name = "",
    classList = [],
  }: IConstructorArgs) {
    super();
    this.container = container;
    this.parent = window;
    this.frame = document.createElement("iframe");
    this.frame.name = name;
    this.frame.classList.add.apply(this.frame.classList, classList);
    debug("Parent: Loading frame %s", url);
    this.frame.src = url;
    this.container.appendChild(this.frame);

    this.child =
      this.frame.contentWindow ||
      (this.frame.contentDocument as any)?.parentWindow;
    this.childOrigin = resolveOrigin(url);

    debug("Parent: Registering API");
    debug("Parent: Awaiting messages...");
    this.parent.addEventListener("message", this.listener.bind(this), false);
  }

  private listener(event: MessageEvent): void {
    if (!isValidEvent(event, this.childOrigin)) {
      debug(
        "parent origin mismatch. Expected %s got %s",
        this.childOrigin,
        event.origin
      );
      return;
    }

    if (event.data.kind === CHILD_EMIT) {
      const { eventName, data } = event.data as IChildEmit;
      debug(`Parent: Received event emission: ${eventName}`);
      this.emit(eventName, data);
    }
  }

  async handshake(): Promise<ParentAPI> {
    let attempt = 0;

    const tryHandshake = async () => {
      while (attempt < ParentAPI.maxHandshakeRequests) {
        attempt++;
        debug(`handshake attempt %s %s`, attempt, this.childOrigin);
        this.emitToChild(HANDHSAKE_START, undefined);

        try {
          await Promise.race([this.once(HANDSHAKE_REPLY), timeout(500)]);
        } catch (err) {
          // this should only happen if the timeout is reached, try again
          continue;
        }

        debug("Parent: Received handshake reply from Child");
        return;
      }

      throw new Error("maximum handshake attempts reached");
    };

    return new Promise((resolve, reject) => {
      this.frame.addEventListener("load", async () => {
        try {
          await tryHandshake();
          resolve(this);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  get(property: string, ...args: Array<any>): Promise<any> {
    const id = uuid();

    return new Promise((resolve, reject) => {
      this.emitToChild(GET_START, { id, property, args } as IGetData);
      const onResolve = ({ value, id: receivedId }: IResolveData) => {
        if (receivedId !== id) {
          return;
        }

        this.off(GET_RESOLVE, onResolve as any);
        this.off(GET_REJECT, onReject as any);
        resolve(value);
      };

      const onReject = ({ error, id: receivedId }: IRejectData) => {
        if (receivedId !== id) {
          return;
        }

        this.off(GET_RESOLVE, onResolve as any);
        this.off(GET_REJECT, onReject as any);
        reject(error);
      };

      this.on(GET_RESOLVE, onResolve as any);
      this.on(GET_REJECT, onReject as any);
    });
  }

  emitToChild(eventName: string, data: unknown): void {
    debug(`Emitting Event "${eventName}"`, data);

    this.parent.postMessage(
      createParentEmit(eventName, data),
      this.childOrigin
    );
  }

  destroy() {
    debug("Parent: Destroying Postmate instance");
    window.removeEventListener("message", this.listener, false);
    this.frame.parentNode?.removeChild(this.frame);
  }
}

/**
 * Takes a URL and returns the origin
 */
function resolveOrigin(url: string): string {
  const a = document.createElement("a");
  a.href = url;
  const protocol =
    a.protocol.length > 4 ? a.protocol : window.location.protocol;
  const host = a.host.length
    ? a.port === "80" || a.port === "443"
      ? a.hostname
      : a.host
    : window.location.host;
  return a.origin || `${protocol}//${host}`;
}

export function timeout(ms: number): Promise<never> {
  return new Promise((_resolve, reject) => setTimeout(reject, ms));
}
