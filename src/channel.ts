import { INativeEventData, IBRIDGE_MARKER } from "./msg/native";

export type MessageListener = (event: MessageEvent) => void;
export type ListenerRemover = () => void;

/**
 * The raw communication interface
 */
export interface IChannel {
  emitMsg: (message: any) => void;
  onMsg: (listener: MessageListener) => ListenerRemover;
}

// TODO jsdocs
export class WindowChannel implements IChannel {
  localWindow: Window = window;
  remoteWindow: Window;
  remoteOrigin: string;

  constructor({
    localWindow = window,
    remoteWindow,
    remoteOrigin,
  }: {
    localWindow: Window;
    remoteWindow: Window;
    remoteOrigin: string;
  }) {
    this.localWindow = localWindow;
    this.remoteWindow = remoteWindow;
    this.remoteOrigin = remoteOrigin;
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
      () => event?.data?.type !== IBRIDGE_MARKER,
    ];

    return validators.every((validator) => validator());
  }
}

// TODO jsdocs
export class WorkerChannel implements IChannel {
  worker: Worker | DedicatedWorkerGlobalScope;

  constructor(worker: Worker | DedicatedWorkerGlobalScope) {
    this.worker = worker;
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
