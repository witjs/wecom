import { Agent } from "wecom";
import dotenv from "dotenv";

describe("Agent Manager", () => {
  let agent: Agent;
  beforeEach(() => {
    dotenv.config();
    return (agent = new Agent({
      corpId: process.env.CORPID,
      corpSecret: process.env.TEST_SECRET,
      agentId: Number(process.env.TEST_AGENT_ID),
    }));
  });

  it("Show agent detail", async () => {
    const ret = await agent.get();
    expect(ret.data.agentid).toEqual(Number(process.env.TEST_AGENT_ID));
  });

  it("Set agent", async () => {
    const ret = await agent.set({
      name: "修改成测试的",
    });
    // 修改回本来的名称
    await agent.set({
      name: "TEST",
    });
    expect(ret.data.errcode).toEqual(0);
  });
});
