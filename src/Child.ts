import debugFactory from "debug";
import Emittery from "emittery";
import _get from "lodash.get";
import {
  GET_REQUEST,
  GET_RESPONSE,
  HANDHSAKE_START,
  HANDSHAKE_REPLY,
  PARENT_EMIT,
} from "./constants";

import { getResponse, IGetRequest, IGetResponse, IParentEmit } from "./events";
import { createChildEmit, isValidEvent } from "./events";

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

  constructor({
    model,
    context,
  }: IConstructorArgs<TModel, TContext | undefined>) {
    super();
    this.child = window;
    this.parent = this.child.parent;
    this.parentOrigin = this.parent.origin;
    this.model = model;
    this.context = context;

    debug("Child: Registering API");
    debug("Child: Awaiting messages...");

    this.child.addEventListener("message", this.dispatcher.bind(this));
    this.listenToGet();
  }

  async dispatcher(event: MessageEvent) {
    debug("Received message %O", event.data);
    if (!isValidEvent(event, this.parentOrigin)) {
      debug(
        "parent origin mismatch. Expected %s got %s",
        this.parentOrigin,
        event.origin
      );
      return;
    }

    if (event.data.kind === PARENT_EMIT) {
      const { eventName, data } = event.data as IParentEmit;
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

  async handshake(): Promise<ChildAPI<TModel, TContext>> {
    await this.once(HANDHSAKE_START);
    debug("Child: Received handshake from Parent");
    debug("Child: Sending handshake reply to Parent");
    this.emitToParent(HANDSHAKE_REPLY, undefined);
    return this;
  }

  listenToGet(): void {
    this.on(GET_REQUEST, (async ({ id, property, args }: IGetRequest) => {
      // property might be a full lodash path
      const fn = _get(this.model, property);
      if (typeof fn !== "function") {
        debug(
          `the model ${property} was called, but it isn't a function, got ${fn}`
        );
        return;
      }

      let value, error;
      try {
        value = await fn.call(this.context, ...args);
      } catch (err) {
        error = err;
      }

      this.emitToParent(getResponse(id), {
        id,
        property,
        value,
        error,
      } as IGetResponse);
    }) as any);
  }
}
