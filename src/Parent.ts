import { v4 as uuid } from "uuid";
import debugFactory from "debug";
import Emittery from "emittery";

import { IChildEmit, IGetResponse, IGetRequest, getResponse } from "./events";
import { createParentEmit } from "./events";
import isValidEvent from "./isValidEvent";
import {
  GET_REQUEST,
  HANDHSAKE_START,
  HANDSHAKE_REPLY,
  CHILD_EMIT,
} from "./constants";

const debug = debugFactory("ibridge:parent");

interface IConstructorArgs {
  container?: HTMLElement;
  url: string;
  name?: string;
  classList?: Array<string>;
  showIframe?: boolean;
}

export default class ParentAPI extends Emittery {
  public readonly url: string;
  public readonly parent: Window;
  public readonly child: Window;
  public readonly frame: HTMLIFrameElement;
  public childOrigin: string;
  public readonly container: HTMLElement;

  /**
   * The maximum number of attempts to send a handshake request to the parent
   */
  static maxHandshakeRequests = 5;

  constructor({
    container = document.body,
    url,
    name = "",
    classList = [],
    showIframe = false,
  }: IConstructorArgs) {
    super();
    this.url = url;
    this.container = container;
    this.parent = window;
    this.frame = document.createElement("iframe");
    this.frame.name = name;
    this.frame.classList.add(...classList);
    if (!showIframe) {
      // Make it invisible
      this.frame.style.width = "0";
      this.frame.style.height = "0";
      this.frame.style.border = "0";
    }
    debug("Loading frame %s", url);
    this.container.appendChild(this.frame);

    this.child =
      this.frame.contentWindow ||
      (this.frame.contentDocument as any)?.parentWindow;
    this.childOrigin = resolveOrigin(url);

    debug("setting up main listeners");
    this.parent.addEventListener("message", this.dispatcher.bind(this), false);
  }

  private dispatcher(event: MessageEvent): void {
    debug(`dispatcher got event %O`, event);
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
      debug(`dispatcher emit internally "%s" with data %O`, eventName, data);
      this.emit(eventName, data);
    }
  }

  emitToChild(eventName: string, data: unknown): void {
    debug(`emitToChild "%s" with data %O`, eventName, data);

    this.child.postMessage(createParentEmit(eventName, data), this.childOrigin);
  }

  async handshake(): Promise<ParentAPI> {
    debug("starting handshake");
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

        debug("Received handshake reply from Child");
        // Clean up any outstanding handhsake reply "once" listeners
        this.clearListeners(HANDSHAKE_REPLY);
        return;
      }

      throw new Error("maximum handshake attempts reached");
    };

    return new Promise((resolve, reject) => {
      debug("waiting for iframe to load");
      this.frame.addEventListener("load", async () => {
        debug("child frame loaded");
        try {
          await tryHandshake();
          debug("handshake ok");
          resolve(this);
        } catch (err) {
          reject(err);
        }
      });
      // kick the iframe loading process off
      this.frame.src = this.url;
    });
  }

  async get(property: string, ...args: Array<any>): Promise<any> {
    const id = uuid();

    this.emitToChild(GET_REQUEST, { id, property, args } as IGetRequest);
    const eventName = getResponse(id);
    debug("get await for response event %s", eventName);
    const { value, error } = (await this.once(eventName)) as IGetResponse;
    if (error) {
      throw error;
    }

    return value;
  }

  destroy(): void {
    debug("Destroying Postmate instance");
    window.removeEventListener("message", this.dispatcher, false);
    this.frame.parentNode?.removeChild(this.frame);
  }
}

/**
 * Takes a URL and returns the origin
 * TODO how about using URL? what is expected of this?
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
