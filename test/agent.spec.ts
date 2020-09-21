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
    const ret = await agent.get(Number(process.env.AGENT_ID));
    expect(ret.data.agentid).toEqual(Number(process.env.AGENT_ID));
  });
});
