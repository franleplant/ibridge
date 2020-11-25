export const MESSAGE_TYPE = "application/x-postmate-v1+json";

export interface IHandshakeReq {
  kind: "handshake";
  type: typeof MESSAGE_TYPE;
}

export interface IHandshakeRes {
  kind: "handshake-reply";
  type: typeof MESSAGE_TYPE;
}

export function createHandshakeReq(): IHandshakeReq {
  return {
    kind: "handshake",
    type: MESSAGE_TYPE,
  };
}

export function createHandshakeRes(): IHandshakeRes {
  return {
    kind: "handshake-reply",
    type: MESSAGE_TYPE,
  };
}

export interface IGetData {
  id: string;
  property: string;
  args: Array<any>;
}

export interface IResolveData {
  id: string;
  value: any;
}

export interface IRejectData {
  id: string;
  error: any;
}

export interface IChildEmit {
  type: typeof MESSAGE_TYPE;
  kind: "child-emit";
  eventName: string;
  data: unknown;
}

export interface IParentEmit {
  type: typeof MESSAGE_TYPE;
  kind: "parent-emit";
  eventName: string;
  data: unknown;
}

export function createChildEmit(eventName: string, data: unknown): IChildEmit {
  return {
    type: MESSAGE_TYPE,
    kind: "child-emit",
    eventName,
    data,
  };
}

export function createParentEmit(
  eventName: string,
  data: unknown
): IParentEmit {
  return {
    type: MESSAGE_TYPE,
    kind: "parent-emit",
    eventName,
    data,
  };
}

/**
 * Ensures that a message is safe to interpret
 */
export function isValidEvent(
  event: MessageEvent,
  allowedOrigin: string
): boolean {
  const validators = [
    () => event.origin === allowedOrigin,
    () => !!event.data,
    () => event.data?.type === MESSAGE_TYPE,
  ];

  return validators.every((validator) => validator());
}
