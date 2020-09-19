import { Agent } from "../src/agent/index";
import dotenv from "dotenv";

describe("message", () => {
  let agent: Agent;
  beforeEach(() => {
    dotenv.config();
    return (agent = new Agent({
      corpId: process.env.CORPID,
      corpSecret: process.env.CORP_SECRET,
    }));
  });

  it("show agent detail", async () => {
    const ret = await agent.get(1000604);
    console.log(ret.data);
    // expect(ret.data.english_name).toEqual("aidenxiong");
  });
});
