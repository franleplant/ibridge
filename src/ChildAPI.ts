import debugFactory from "debug";
import Emittery from "emittery";
import _get from "lodash.get";

import type {
  IHandshakeReq,
  IGetData,
  IRejectData,
  IResolveData,
  IParentEmit,
} from "./events";
import { createChildEmit, createHandshakeRes, isValidEvent } from "./events";

const debug = debugFactory("CHILD");

export interface IConstructorArgs<TModel, TContext> {
  child: Window;
  parent: Window;
  parentOrigin: string;
  model: TModel;
  context: TContext;
}

export default class ChildAPI<
  TModel = object,
  TContext = any
> extends Emittery {
  private model: TModel;
  public readonly parent: Window;
  public readonly child: Window;
  public readonly parentOrigin: string;
  public context?: TContext;

  static async init<TModel, TContext>(
    model: TModel,
    context?: TContext
  ): Promise<ChildAPI<TModel, TContext>> {
    const child = window;
    const parent = child.parent;

    return new Promise((resolve, reject) => {
      function shake(e: MessageEvent): void {
        const data = e.data as IHandshakeReq;

        if (data.kind !== "handshake") {
          return reject("Handshake Reply Failed");
        }

        debug("Child: Received handshake from Parent");
        debug("Child: Sending handshake reply to Parent");

        (e.source as Window)?.postMessage(createHandshakeRes(), e.origin);

        const parentOrigin = e.origin;

        debug("Child: Saving Parent origin", parentOrigin);
        child.removeEventListener("message", shake, false);
        return resolve(
          new ChildAPI<TModel, TContext>({
            child,
            parent,
            parentOrigin,
            model,
            context,
          })
        );
      }

      child.addEventListener("message", shake, false);
    });
  }

  constructor({
    child,
    parent,
    parentOrigin,
    model,
    context,
  }: IConstructorArgs<TModel, TContext | undefined>) {
    super();
    this.child = child;
    this.parent = parent;
    this.parentOrigin = parentOrigin;
    this.model = model;
    this.context = context;

    debug("Child: Registering API");
    debug("Child: Awaiting messages...");

    this.child.addEventListener("message", this.listener.bind(this));

    this.listenToGet();
  }

  async listener(e: MessageEvent) {
    debug("Received message %O", e.data);
    if (!isValidEvent(e, this.parentOrigin)) {
      return;
    }

    if (e.data.kind === "parent-emit") {
      const { eventName, data } = e.data as IParentEmit;
      debug(`Parent: Received event emission: ${eventName}`);
      this.emit(eventName, data);
    }
  }

  emitToParent(eventName: string, data: unknown): void {
    debug(`Emitting Event "${eventName}"`, data);

    this.parent.postMessage(
      createChildEmit(eventName, data),
      this.parentOrigin
    );
  }

  listenToGet(): void {
    this.on("get", (async ({ id, property, args }: IGetData) => {
      // property might be a full lodash path
      const fn = _get(this.model, property);
      if (typeof fn !== "function") {
        console.info(
          `the model ${property} was called, but it isn't a function, got ${fn}`
        );
        return;
      }

      try {
        const value = await fn.call(this.context, ...args);
        this.emitToParent("get:resolve", {
          id,
          property,
          value,
        } as IResolveData);
      } catch (error) {
        this.emitToParent("get:reject", { id, property, error } as IRejectData);
      }
    }) as any);
  }
}
