import { v4 as uuid } from "uuid";
import iBridge from "./index";
import { CHILD_EMIT, GET_RESPONSE, HANDSHAKE_REPLY } from "./constants";
import { createParentEmit, isValidEvent, getResponse } from "./events";

jest.mock("./events");
jest.mock("uuid");

const parentEmit = { fake: true, parent: "emit" };
(createParentEmit as jest.Mock).mockImplementation(() => parentEmit);
(isValidEvent as jest.Mock).mockImplementation(() => true);

const id = 123;
(uuid as jest.Mock).mockImplementation(() => id);

test("Parent handshake", async () => {
  window.addEventListener = jest.fn();
  window.postMessage = jest.fn();
  // create the Parent
  const parent = new iBridge.Parent({ url: "www.fake.com" });

  const iframe = parent.frame;
  iframe.addEventListener = jest.fn();
  const handshake = parent.handshake();
  // we should listen to the iframe "load" event
  expect(iframe.addEventListener).toHaveBeenCalled();
  const onLoad = (iframe.addEventListener as jest.Mock).mock.calls[0][1];
  // call it manually
  onLoad();

  // should register the dispatcher
  expect(window.addEventListener).toHaveBeenCalled();
  // should send the handshake request
  expect(window.postMessage).toHaveBeenCalledWith(
    parentEmit,
    "http://localhost"
  );
  // should get the handhsake response
  (parent as any).dispatcher({
    data: {
      kind: CHILD_EMIT,
      eventName: HANDSHAKE_REPLY,
      data: undefined,
    },
  });

  // let's wait for the handshake to finish
  await handshake;
});

test("Parent.get", async () => {
  const id = 123;
  const eventName = `${GET_RESPONSE}/${id}`;
  (getResponse as jest.Mock).mockImplementation(() => eventName);
  window.postMessage = jest.fn();

  // create the Parent
  const parent = new iBridge.Parent({ url: "www.fake.com" });

  const property = "module.getValue";
  const args = ["fake parameter"];
  // call a fake model function in the fake child
  const valuePromise = parent.get(property, ...args);
  // should send the GET_REQUEST
  expect(window.postMessage).toHaveBeenCalledWith(
    parentEmit,
    "http://localhost"
  );

  const actualValue = "I came from the child";
  // fake dispatch GET_RESPONSE
  (parent as any).dispatcher({
    data: {
      kind: CHILD_EMIT,
      eventName,
      data: {
        id,
        property,
        value: actualValue,
      },
    },
  });

  const value = await valuePromise;
  // should return the value
  expect(value).toBe(actualValue);
});
