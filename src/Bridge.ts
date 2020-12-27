import Emittery from "emittery";
import debugFactory from "debug";
import _get from "lodash.get";
import { v4 as uuid } from "uuid";
import {
  GET_REQUEST,
  HANDHSAKE_START,
  HANDSHAKE_REPLY,
  PARENT_EMIT,
  MESSAGE_TYPE,
} from "./constants";
import { createParentEmit } from "./events";

import { getResponse, IGetRequest, IGetResponse, IParentEmit } from "./events";
const debug = debugFactory("ibridge:parent");

export interface INativeEventData {
  type: typeof MESSAGE_TYPE;
  eventName: string;
  data: unknown;
}

export interface IConstructorArgs {
  window: Window; // TODO others
  // The window needs to be fully loaded
  // i.e. the iframe has triggered the onLoad event
  remoteWindow: Window; // TODO  others
  remoteOrigin?: string;
  model: object;
}

// TODO this needs to be generic on TModel
// TODO support other types of windows like webworkers,
// modal windows, etc
export default class Bridge extends Emittery {
  window: Window;
  remoteWindow: Window;
  remoteOrigin?: string;
  model: object;
  context: any = {};

  constructor(args: IConstructorArgs) {
    super();

    this.window = args.window;
    this.remoteWindow = args.remoteWindow;
    this.remoteOrigin = args.remoteOrigin;
    this.model = args.model;

    // TODO does this work with webworkers? otherwise
    // use addEventListener
    this.remoteWindow.onmessage = this.dispatcher.bind(this);
    this.on(GET_REQUEST, this.handleGet.bind(this) as any);
  }

  private dispatcher(event: MessageEvent): void {
    // TODO validate event (origin? data shape?)
    // TODO rework the events module to contain all the necesary
    // event definition, types, validations, etc
    //if (!isValidEvent(event, this.remoteOrigin)) {
    //return;
    //}

    const { eventName, data } = event.data as INativeEventData;
    this.emitToLocal(eventName, data);
  }

  // This is only to avoid confusions between Emittery's
  // this.emit and this.emitToRemote, as a rule of thumb this.emit
  // should only be used by the dispatcher, the restof the code 
  // and even the lib consumers should use emitToRemote
  private emitToLocal(eventName: string, data?: unknown): void {
    super.emit(eventName, data)
  }

  async emit(eventName: string, data?: unknown): Promise<void> {
    console.warn("this function is private and has now effect, you should probably want to use emitToRemote")
  }

  emitToRemote(eventName: string, data?: unknown): void {
    debug(`emit "%s" with data %O`, eventName, data);

    // TODO make this use webworker.postMessage
    this.remoteWindow.postMessage(
      createParentEmit(eventName, data),
      this.remoteOrigin!
    );
  }

  // TODO rename to "call"
  async get(property: string, ...args: Array<any>): Promise<any> {
    const id = uuid();

    this.emitToRemote(GET_REQUEST, { id, property, args } as IGetRequest);
    const eventName = getResponse(id);
    debug("get await for response event %s", eventName);
    const { value, error } = (await this.once(eventName)) as IGetResponse;
    if (error) {
      throw error;
    }

    return value;
  }

  private async handleGet({ id, property, args }: IGetRequest): Promise<void> {
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
      // TODO remove context?
      value = await fn.call(this.context, ...args);
    } catch (err) {
      error = err;
    }

    this.emitToRemote(getResponse(id), {
      id,
      property,
      value,
      error,
    } as IGetResponse);
  }
}
