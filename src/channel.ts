import debugFactory from "debug";
import { INativeEventData, IBRIDGE_MARKER } from "./msg/native";
import { getRemoteWindow } from "./iframe";
import { getOrigin } from "./url";

export type MessageListener = (event: MessageEvent) => void;
export type ListenerRemover = () => void;

/**
 * The raw communication interface
 */
export interface IChannel {
  emitMsg: (message: any) => void;
  onMsg: (listener: MessageListener) => ListenerRemover;
  setDebugPrefix: (prefix: string) => void;
}

export interface IIframeOpts {
  url: string;
  container?: HTMLElement;
  show?: boolean;
}

/**
 * A Window Channel for communication across windows
 * i.e. through iframes.
 *
 * Make sure both window have already triggered the `onLoad` event,
 * otherwise ibridge wont work
 */
export class WindowChannel implements IChannel {
  static async createIframe(args: IIframeOpts): Promise<WindowChannel> {
    const { container = document.body } = args;
    const iframe = document.createElement("iframe");
    if (!args.show) {
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
    }

    const remoteWindowPromise = getRemoteWindow(iframe);
    iframe.src = args.url;
    container.appendChild(iframe);
    const remoteWindow = await remoteWindowPromise;

    return new WindowChannel({
      localWindow: window,
      remoteWindow,
      remoteOrigin: getOrigin(args.url),
    });
  }

  debug: debugFactory.Debugger = debugFactory("ibridge:WindowChannel");
  localWindow: Window = window;
  remoteWindow: Window;
  remoteOrigin: string;

  constructor({
    localWindow = window,
    remoteWindow,
    remoteOrigin,
  }: {
    localWindow?: Window;
    remoteWindow: Window;
    remoteOrigin: string;
  }) {
    this.localWindow = localWindow;
    this.remoteWindow = remoteWindow;
    this.remoteOrigin = remoteOrigin;
  }

  setDebugPrefix(prefix: string) {
    this.debug = debugFactory(`ibridge:WindowChannel-${prefix}`);
  }

  emitMsg(message: any): void {
    this.remoteWindow.postMessage(message, this.remoteOrigin);
  }

  onMsg(listener: MessageListener): ListenerRemover {
    const outerListener = (event: MessageEvent) => {
      if (this.isValid(event)) {
        listener(event);
      }
    };

    this.localWindow.addEventListener("message", outerListener);

    const removeListener = () => {
      this.localWindow.removeEventListener("message", outerListener);
    };

    return removeListener;
  }

  isValid(event: MessageEvent<INativeEventData>): boolean {
    const { source, origin } = event;

    const validators = [
      () => source === this.remoteWindow,
      () => this.remoteOrigin === "*" || origin === this.remoteOrigin,
      () => !!event.data,
      () => event?.data?.type === IBRIDGE_MARKER,
    ];

    const isValid = validators.every((validator) => validator());
    this.debug("isValid: %s event: %o", isValid, event);
    return isValid;
  }
}

// TODO jsdocs
export class WorkerChannel implements IChannel {
  worker: Worker | DedicatedWorkerGlobalScope;
  debug: debugFactory.Debugger = debugFactory("ibridge:WorkerChannel");

  constructor(worker: Worker | DedicatedWorkerGlobalScope) {
    this.worker = worker;
  }

  setDebugPrefix(prefix: string) {
    this.debug = debugFactory(`ibridge:WorkerChannel-${prefix}`);
  }

  emitMsg(message: any): void {
    this.worker.postMessage(message);
  }

  onMsg(listener: MessageListener): ListenerRemover {
    // TODO remove any
    this.worker.addEventListener("message", listener as any);

    // TODO remove any
    const removeListener = () => {
      this.worker.removeEventListener("message", listener as any);
    };

    return removeListener;
  }
}
