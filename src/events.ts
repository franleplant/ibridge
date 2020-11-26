import {
  GET_RESPONSE,
  CHILD_EMIT,
  MESSAGE_TYPE,
  PARENT_EMIT,
} from "./constants";

export function getResponse(id: string): string {
  return `${GET_RESPONSE}/${id}`;
}

export interface IGetRequest {
  id: string;
  property: string;
  args: Array<any>;
}

export interface IGetResponse {
  id: string;
  property: string;
  value?: any;
  error?: any;
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
