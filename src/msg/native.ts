export const IBRIDGE_MARKER = "@ibridge";

/**
 * This is the raw payload we send through
 * postMessage message.data, inside of it
 * we have the inner higher level event information
 */
export interface INativeEventData<T = unknown> {
  /* simple ibridge marker for all ibridge events */
  type: typeof IBRIDGE_MARKER;
  /* id for the connection between a given pair of bridges */
  sessionId: string | undefined;

  /* the inner higher level emittery event name */
  eventName: string;
  /* the inner higher level emittery event data */
  data: T;
}

export function createNativeEventData<T = unknown>(
  sessionId: string | undefined,
  eventName: string,
  data: T
): INativeEventData<T> {
  return {
    type: IBRIDGE_MARKER,
    sessionId,
    eventName,
    data,
  };
}
