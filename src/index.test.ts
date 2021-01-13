import { JSDOM } from "jsdom";
import ibridge from "./index";

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

  const parentWindow = window;
  // Create a fake second window to
  // represent the child window
  const childDOM = new JSDOM();
  const childWindow = { ...childDOM.window, parent: parentWindow };

  const parentChannel = new ibridge.WindowChannel({
    localWindow: parentWindow,
    remoteWindow: childWindow as any,
    remoteOrigin: "*",
  });
  const iparent = new ibridge.Parent({ channel: parentChannel });

  const childChannel = new ibridge.WindowChannel({
    localWindow: childWindow as any,
    remoteWindow: parentWindow,
    remoteOrigin: "*",
  });
  const ichild = new ibridge.Parent({ channel: childChannel, model, context });

  await Promise.all([ichild.handshake(), iparent.handshake()]);

  const userId = 123;
  const value = await iparent.call("users.getUser", userId);
  expect(value).toEqual({
    userId,
    fake: true,
    context: context.ctxValue,
  });
});
