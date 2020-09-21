import { Agent } from "../src/agent/index";
import dotenv from "dotenv";

describe("message", () => {
  let agent: Agent;
  beforeEach(() => {
    dotenv.config();
    return (agent = new Agent({
      corpId: process.env.CORPID,
      corpSecret: process.env.TEST_SECRET,
    }));
  });

  it("Show agent detail", async () => {
    const ret = await agent.get(Number(process.env.TEST_AGENT_ID));
    expect(ret.data.agentid).toEqual(Number(process.env.TEST_AGENT_ID));
  });

  it("Set agent", async () => {
    const ret = await agent.set({
      agentid: Number(process.env.TEST_AGENT_ID),
      name: "修改成测试的",
    });
    // 修改回本来的名称
    await agent.set({
      agentid: Number(process.env.TEST_AGENT_ID),
      name: "TEST",
    });
    expect(ret.data.errcode).toEqual(0);
  });
});
