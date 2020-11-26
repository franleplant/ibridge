import { CHILD_EMIT, MESSAGE_TYPE, PARENT_EMIT } from "./constants";

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
  kind: typeof CHILD_EMIT;
  eventName: string;
  data: unknown;
}

export interface IParentEmit {
  type: typeof MESSAGE_TYPE;
  kind: typeof PARENT_EMIT;
  eventName: string;
  data: any;
}

export function createChildEmit(eventName: string, data: unknown): IChildEmit {
  return {
    type: MESSAGE_TYPE,
    kind: CHILD_EMIT,
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
    kind: PARENT_EMIT,
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
