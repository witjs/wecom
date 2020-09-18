import { Wecom } from "../src/wecom";
import dotenv from "dotenv";

describe("createApi", () => {
  let wecom: Wecom;
  beforeEach(() => {
    dotenv.config();
    return (wecom = new Wecom({
      corpId: process.env.CORPID,
      corpSecret: process.env.CORP_SECRET,
    }));
  });
  it("Create Api", async () => {
    wecom.createApi("message.send", (): any => {
      console.log("adcd");
    });
    expect(wecom.api.message.send).toBeDefined();
  });
});
