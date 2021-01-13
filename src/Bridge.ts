import Emittery from "emittery";
import debugFactory from "debug";
import _get from "lodash.get";
import { v4 as uuid } from "uuid";
import { IMessenger } from "./messenger";
import {
  CALL_REQUEST,
  ICallRequest,
  ICallResponse,
  createCallRequest,
  createCallResponse,
  createCallResponseEventName,
} from "./msg/call";
import { INativeEventData, createNativeEventData } from "./msg/native";

import { getResponse, IGetRequest, IGetResponse, IParentEmit } from "./events";
const debug = debugFactory("ibridge:parent");

export interface IConstructorArgs<TModel, TContext = undefined> {
  model: TModel;
  context: TContext;
  window: Window; // TODO others
  // The window needs to be fully loaded
  // i.e. the iframe has triggered the onLoad event
  remoteWindow: Window; // TODO  others
  remoteOrigin?: string;
}

export default class Bridge<TModel, TContext = undefined> extends Emittery {
  window: Window;
  remoteWindow: Window;
  remoteOrigin?: string;
  model: TModel;
  context: TContext;
  private sessionId: string;

  constructor(args: IConstructorArgs<TModel, TContext>) {
    super();

    this.window = args.window;
    this.remoteWindow = args.remoteWindow;
    this.remoteOrigin = args.remoteOrigin;
    this.model = args.model;
    this.context = args.context
    this.sessionId = uuid();

    this.remoteWindow.onmessage = this.dispatcher.bind(this);
    this.on(CALL_REQUEST, this.handleCall.bind(this) as any);
  }

  private dispatcher(event: MessageEvent<INativeEventData>): void {
    debug(`dispatcher got native event %O`, event);
    const { eventName, data, sessionId } = event.data;
    if (sessionId !== this.sessionId) {
      return;
    }
    debug(`dispatcher got ibridge event "%s" with data %O`, eventName, data);
    this.emitToLocal(eventName, data);
  }

  // This is only to avoid confusions between Emittery's
  // this.emit and this.emitToRemote, as a rule of thumb this.emit
  // should only be used by the dispatcher, the restof the code
  // and even the lib consumers should use emitToRemote
  private emitToLocal(eventName: string, data?: unknown): void {
    super.emit(eventName, data);
  }

  async emit(eventName: string, data?: unknown): Promise<void> {
    console.warn(
      "this function is private and has now effect, you should probably want to use emitToRemote"
    );
  }

  emitToRemote(eventName: string, data?: unknown): void {
    debug(`emit "%s" with data %O`, eventName, data);

    // TODO make this use webworker.postMessage
    this.remoteWindow.postMessage(
      createParentEmit(eventName, data),
      this.remoteOrigin!
    );
  }

  async call(property: string, ...args: Array<any>): Promise<any> {
    const callId = uuid();

    this.emitToRemote(...createCallRequest({ callId, property, args }));
    const eventName = createCallResponseEventName(callId);
    debug("call await for response event %s", eventName);
    const { value, error } = (await this.once(eventName)) as ICallResponse<any>;
    if (error) {
      throw error;
    }

    return value;
  }

  private async handleCall<TArgs extends Array<any>>(
    data: ICallRequest<TArgs>
  ): Promise<void> {
    const { callId, property, args } = data;
    // property might be a full lodash path
    const fn = _get(this.model, property);

    let value, error;
    try {
      if (typeof fn !== "function") {
        debug(
          `the model ${property} was called, but it isn't a function, got ${fn}`
        );
        throw new Error("model function not found");
      }
      value = await fn.call(this.context, ...args);
    } catch (err) {
      error = err;
    }

    this.emitToRemote(
      ...createCallResponse({
        callId,
        property,
        value,
        error,
      })
    );
  }
}
