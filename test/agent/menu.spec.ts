import { AgentMenu } from "wecom";
import dotenv from "dotenv";
import {
  AgentMenuButtonType,
  ICreateAgentMenuButton,
} from "../../src/modules/agent/interface/menu";

describe("Agent Menu Manger", () => {
  let menu: AgentMenu;
  let originalButton: Array<ICreateAgentMenuButton>;
  beforeEach(() => {
    dotenv.config();
    return (menu = new AgentMenu({
      corpId: process.env.CORPID,
      corpSecret: process.env.TEST_SECRET,
      agentId: Number(process.env.TEST_AGENT_ID),
    }));
  });

  it("Create Menu", async () => {
    // 获取原始的导航菜单
    const {
      data: { button: originalButton },
    } = await menu.get();
    // 设置新的菜单
    const ret = await menu.create({
      button: [
        {
          type: AgentMenuButtonType.CLICK,
          name: "关于我们",
          key: "V1001_TODAY_MUSIC",
        },
        {
          name: "个人中心",
          sub_button: [
            {
              type: AgentMenuButtonType.VIEW,
              name: "个人资料",
              url: "http://www.deno.me/",
            },
            {
              type: AgentMenuButtonType.CLICK,
              name: "我的团队",
              key: "V1001_GOOD",
            },
          ],
        },
      ],
    });
    expect(ret.data.errcode).toEqual(0);
    // 数据还原
    await menu.create({
      button: originalButton,
    });
  });

  it("Get Menu", async () => {
    const ret = await menu.get();
    expect(ret.data.errcode).toEqual(0);
  });

  it("Delete Menu", async () => {
    const ret = await menu.delete();
    expect(ret.data.errcode).toEqual(0);
    // 数据还原
    await menu.create({
      button: originalButton,
    });
  });
});
