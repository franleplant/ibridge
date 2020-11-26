import debugFactory from "debug";
import Emittery from "emittery";
import _get from "lodash.get";
import {
  GET_REQUEST,
  HANDHSAKE_START,
  HANDSHAKE_REPLY,
  PARENT_EMIT,
} from "./constants";

import { getResponse, IGetRequest, IGetResponse, IParentEmit } from "./events";
import { createChildEmit } from "./events";
import isValidEvent from "./isValidEvent";

const debug = debugFactory("ibridge:child");

export interface IConstructorArgs<TModel, TContext> {
  model: TModel;
  context: TContext;
}

export default class ChildAPI<TModel, TContext = any> extends Emittery {
  private model: TModel;
  public readonly parent: Window;
  public readonly child: Window;
  public readonly parentOrigin: string;
  public context?: TContext;

  constructor(model: TModel, context?: TContext) {
    super();
    this.child = window;
    this.parent = this.child.parent;
    this.parentOrigin = this.parent.origin;
    this.model = model;
    this.context = context;

    this.setListeners();
  }

  private setListeners(): void {
    debug("setting up main listeners");
    this.child.addEventListener("message", this.dispatcher.bind(this));
    this.on(GET_REQUEST, this.handleGet.bind(this) as any);
  }

  private async dispatcher(event: MessageEvent): Promise<void> {
    debug(`dispatcher got event %O`, event);
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
      debug(`dispatcher emit internally "%s" with data %O`, eventName, data);
      this.emit(eventName, data);
    }
  }

  emitToParent(eventName: string, data: unknown): void {
    debug(`emitToParent "%s" with data %O`, eventName, data);

    this.parent.postMessage(
      createChildEmit(eventName, data),
      this.parentOrigin
    );
  }

  async handshake(): Promise<ChildAPI<TModel, TContext>> {
    await this.once(HANDHSAKE_START);
    debug("received handshake from Parent");
    debug("sending handshake reply to Parent");
    this.emitToParent(HANDSHAKE_REPLY, undefined);
    debug("handshake ok");
    return this;
  }

  async handleGet({ id, property, args }: IGetRequest): Promise<void> {
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
  }
}
