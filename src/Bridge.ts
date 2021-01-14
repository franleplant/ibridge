import Emittery from "emittery";
import debugFactory from "debug";
import _get from "lodash.get";
import { v4 as uuid } from "uuid";
import { IChannel } from "./channel";
import {
  CALL_REQUEST,
  ICallRequest,
  ICallResponse,
  createCallRequest,
  createCallResponse,
  createCallResponseEventName,
} from "./msg/call";
import { INativeEventData, createNativeEventData } from "./msg/native";

export interface IConstructorArgs<TModel, TContext = undefined> {
  channel: IChannel;
  model?: TModel;
  context?: TContext;
}

export default class Bridge<TModel, TContext = undefined> extends Emittery {
  channel: IChannel;
  model?: TModel;
  context?: TContext;
  sessionId?: string;
  debug: debugFactory.Debugger;

  constructor(args: IConstructorArgs<TModel, TContext>) {
    super();

    this.channel = args.channel;
    this.model = args.model;
    this.context = args.context;
    this.sessionId = uuid();
    this.debug = debugFactory(`ibridge:${this.sessionId}`);
    this.channel.setDebugPrefix(this.sessionId);

    this.channel.onMsg(this.dispatcher.bind(this));
    this.on(CALL_REQUEST, this.handleCall.bind(this) as any);
  }

  private dispatcher(event: MessageEvent<INativeEventData>): void {
    this.debug(`dispatcher got native event %O`, event);
    const { eventName, data, sessionId } = event.data;
    // Allow for session id to be null so that classes that
    // extend Bridge can add logic on top of it, like setting
    // the sessionId on the first handshake request
    if (this.sessionId && sessionId !== this.sessionId) {
      return;
    }
    this.debug(
      `dispatcher got ibridge event "%s" with data %O`,
      eventName,
      data
    );
    this.emitToLocal(eventName, data);
  }

  // This is only to avoid confusions between Emittery's
  // this.emit and this.emitToRemote, as a rule of thumb this.emit
  // should only be used by the dispatcher, the restof the code
  // and even the lib consumers should use emitToRemote
  private emitToLocal(eventName: string, data?: unknown): void {
    super.emit(eventName, data);
  }

  emitToRemote(eventName: string, data?: unknown): void {
    this.debug(`emit "%s" with data %O`, eventName, data);

    this.channel.emitMsg(
      createNativeEventData(this.sessionId, eventName, data)
    );
  }

  async call(property: string, ...args: Array<any>): Promise<any> {
    const callId = uuid();

    this.emitToRemote(...createCallRequest({ callId, property, args }));
    const eventName = createCallResponseEventName(callId);
    this.debug("call await for response event %s", eventName);
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
        this.debug(
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
