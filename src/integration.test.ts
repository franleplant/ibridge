import webcrypto from "@trust/webcrypto";
import { JSDOM } from "jsdom";
import ibridge, { Parent } from "./index";

// TODO we jsdom misbehaves in this scenario, we need
// to either figure out jsdom or move this test to a selenium
// pupetteer, chrome driver. But for that we would need to
// figure out the CI part of that which will require extra effort
// and time
test.skip("integration test", async () => {
  const dom = await JSDOM.fromURL(
    "http://localhost:8080/examples/parent.html",
    {
      resources: "usable",
      runScripts: "dangerously",
    }
  );

  (dom.window as any).crypto = webcrypto;

  await new Promise((resolve) => dom.window.addEventListener("load", resolve));
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const iparent = (dom.window as any).iparent as Parent;

  //const value = await iparent.get("vehicles.getCar", 123);
  //expect(value).toBe({ fake: true, carId: 123 });

  //const error = await iparent.get("getError").catch((err: any) => err);
  //expect(error).toBe("fake error");
});
