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
export class WindowCom implements IChannel {
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

  isValid(event: MessageEvent): boolean {
    const { source, origin } = event;

    if (source !== this.remoteWindow) {
      return false;
    }

    if (this.remoteOrigin !== "*" && origin !== this.remoteOrigin) {
      return false;
    }

    return true;
  }
}

// TODO jsdocs
export class WorkerCom implements IChannel {
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
