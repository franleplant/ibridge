import { JSDOM } from "jsdom";
import ibridge from "./index";

jest.mock("./isValidEvent");

// Create a fake second window to
// represent the child window
const child = new JSDOM();
const childWindow = child.window;

test("integration", async () => {
  const context = { ctxValue: "im a context" };
  const model = {
    users: {
      getUser(this: { ctxValue: string }, userId: number): any {
        return {
          fake: true,
          userId,
          context: this.ctxValue,
        };
      },
    },
  };

  const parentChannel = new ibridge.WindowChannel({ localWindow: parentWindow, remoteWindow: childWindow, remoteOrigin: "*" })
  const parent = new ibridge.Parent({channel: parentChannel});

  const childChannel = new ibridge.WindowChannel({localWindow: childWindow, remoteWindow: parentWindow, remoteOrigin: "*"})
  const child = new ibridge.Parent({channel: childChannel, model, context});


  await Promise.all([child.handshake(), parent.handshake()]);

  const userId = 123;
  const value = await parent.call("users.getUser", userId);
  expect(value).toEqual({
    userId,
    fake: true,
    context: context.ctxValue,
  });
});
