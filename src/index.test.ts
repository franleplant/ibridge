import { JSDOM } from "jsdom";
import iBridge from "./index";
import isValidEvent from "./isValidEvent";

jest.mock("./isValidEvent");

// do not check for origin mismatch since we are doing
// crazy testing faking
(isValidEvent as jest.Mock).mockImplementation(() => true);

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

  const parent = new iBridge.Parent({ url: "about:blank" });
  // this should never be used in prod
  (parent as any).childOrigin = "*";
  // Hook the parent with the fake childWindow
  (parent as any).child = childWindow;

  const parentWindow = window;

  const child = new iBridge.Child(model, context);
  // this should never be used in prod
  (child as any).parentOrigin = "*";
  // Hook the child with the fake parent and child windows
  (child as any).parent = parentWindow;
  (child as any).child = childWindow;
  (child as any).setListeners();

  await Promise.all([child.handshake(), parent.handshake()]);

  const userId = 123;
  const value = await parent.get("users.getUser", userId);
  expect(value).toEqual({
    userId,
    fake: true,
    context: context.ctxValue,
  });
});
