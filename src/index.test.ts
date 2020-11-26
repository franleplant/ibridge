import iBridge from "./index";
import { isValidEvent, createChildEmit, createParentEmit } from "./events";
const realEventsModule = jest.requireActual("./events");

jest.mock("./events");

// do not check for origin mismatch since we are doing
// crazy testing faking
(isValidEvent as jest.Mock).mockImplementation(() => true);
// weird way of telling jest not mock these members
(createChildEmit as jest.Mock).mockImplementation(
  realEventsModule.createChildEmit
);
(createParentEmit as jest.Mock).mockImplementation(
  realEventsModule.createParentEmit
);

test("integration", async () => {
  const model = {};

  const parent = new iBridge.Parent({ url: "about:blank" });
  (parent as any).childOrigin = "http://localhost";

  const parentWindow = window;
  const childWindow = parent.child;

  const child = new iBridge.Child(model);
  (child as any).parent = parentWindow;
  (child as any).child = childWindow;
  (child as any).setListeners();

  await Promise.all([child.handshake(), parent.handshake()]);
});
