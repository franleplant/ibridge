import { MESSAGE_TYPE } from "./constants";

/**
 * Ensures that a message is safe to interpret
 */
export default function isValidEvent(
  event: MessageEvent,
  allowedOrigin: string | undefined
): boolean {
  const validators = [
    () => event.origin === allowedOrigin,
    () => !!event.data,
    () => event.data?.type === MESSAGE_TYPE,
  ];

  return validators.every((validator) => validator());
}
