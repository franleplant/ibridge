import iBridge from "./index";
import isValidEvent from "./isValidEvent";

jest.mock("./isValidEvent");

// do not check for origin mismatch since we are doing
// crazy testing faking
(isValidEvent as jest.Mock).mockImplementation(() => true);

test("integration", async () => {
  const context = { ctxValue: "im a context"};
  const model = {
    users: {
      getUser(this: {ctxValue: string}, userId: number): any {
        return {
          fake: true,
          userId,
          context: this.ctxValue
        }
      }

    }
  };

  const parent = new iBridge.Parent({ url: "about:blank" });
  (parent as any).childOrigin = "http://localhost";

  const parentWindow = window;
  const childWindow = parent.child;

  const child = new iBridge.Child(model, context);
  (child as any).parent = parentWindow;
  (child as any).child = childWindow;
  (child as any).setListeners();

  await Promise.all([child.handshake(), parent.handshake()]);

  const userId = 123
  const value = await parent.get("users.getUser", userId)
  expect(value).toEqual({
    userId,
    fake: true,
    context: context.ctxValue,
  })
});
