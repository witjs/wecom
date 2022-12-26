import { Wecom } from "wecom";
import dotenv from "dotenv";

describe("createApi", () => {
  let wecom: Wecom;
  beforeEach(() => {
    dotenv.config();
    return (wecom = new Wecom({
      corpId: process.env.CORPID,
      corpSecret: process.env.TEST_SECRET,
    }));
  });
  it("Create Api", async () => {
    wecom.createApi<void>("message.send", () => {
      console.log("adcd");
    });
    expect(wecom.api.message.send).toBeDefined();
  });
});
