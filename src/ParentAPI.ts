import { v4 as uuid } from "uuid";
import debugFactory from "debug";
import Emittery from "emittery";

import type {
  IChildEmit,
  IHandshakeRes,
  IRejectData,
  IResolveData,
  IGetData,
} from "./events";
import { createHandshakeReq, createParentEmit, isValidEvent } from "./events";

const debug = debugFactory("PARENT");

/**
 * The maximum number of attempts to send a handshake request to the parent
 */
export const maxHandshakeRequests = 5;

interface IConstructorArgs {
  parent: Window;
  child: Window;
  frame: HTMLIFrameElement;
  childOrigin: string;
}

export interface IInitArgs {
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

  static async init({
    container = document.body,
    url,
    name = "",
    classList = [],
  }: IInitArgs): Promise<ParentAPI> {
    const parent = window;
    const frame = document.createElement("iframe");
    frame.name = name;
    frame.classList.add.apply(frame.classList, classList);
    container.appendChild(frame);

    const child =
      frame.contentWindow || (frame.contentDocument as any)?.parentWindow;
    let childOrigin = resolveOrigin(url);

    let attempt = 0;
    let responseInterval: NodeJS.Timeout;
    return new Promise((resolve, reject) => {
      function reply(e: MessageEvent) {
        if (!isValidEvent(e, childOrigin)) {
          return false;
        }

        const data = e.data as IHandshakeRes;
        if (data.kind !== "handshake-reply") {
          debug("Parent: Invalid handshake reply");
          return reject("Failed handshake");
        }

        clearInterval(responseInterval);
        debug("Parent: Received handshake reply from Child");
        parent.removeEventListener("message", reply, false);
        //TODO do we need this?
        childOrigin = e.origin;
        debug("Parent: Saving Child origin", childOrigin);
        return resolve(
          new ParentAPI({
            parent,
            child,
            frame,
            childOrigin,
          })
        );
      }

      function doSend() {
        attempt++;
        debug(`Parent: Sending handshake attempt ${attempt} %s`, childOrigin);
        child.postMessage(createHandshakeReq(), childOrigin);

        if (attempt === maxHandshakeRequests) {
          clearInterval(responseInterval);
        }
      }

      function loaded() {
        doSend();
        responseInterval = setInterval(doSend, 500);
      }

      frame.addEventListener("load", loaded);
      parent.addEventListener("message", reply, false);
      debug("Parent: Loading frame %s", url);
      frame.src = url;
    });
  }

  constructor({ parent, child, frame, childOrigin }: IConstructorArgs) {
    super();
    this.parent = parent;
    this.frame = frame;
    this.child = child;
    this.childOrigin = childOrigin;

    debug("Parent: Registering API");
    debug("Parent: Awaiting messages...");
    this.parent.addEventListener("message", this.listener.bind(this), false);
  }

  private listener(e: MessageEvent): void {
    if (!isValidEvent(e, this.childOrigin)) {
      return;
    }

    if (e.data.kind === "child-emit") {
      const { eventName, data } = e.data as IChildEmit;
      debug(`Parent: Received event emission: ${eventName}`);
      this.emit(eventName, data);
    }
  }

  get(property: string, ...args: Array<any>): Promise<any> {
    const id = uuid();

    return new Promise((resolve, reject) => {
      this.emitToChild("get", { id, property, args } as IGetData);
      const onResolve = ({ value, id: receivedId }: IResolveData) => {
        if (receivedId !== id) {
          return;
        }

        this.off("get:resolve", onResolve as any);
        resolve(value);
      };

      const onReject = ({ error, id: receivedId }: IRejectData) => {
        if (receivedId !== id) {
          return;
        }

        this.off("get:reject", onReject as any);
        reject(error);
      };

      this.on("get:resolve", onResolve as any);
      this.on("get:reject", onReject as any);
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
