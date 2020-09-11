import { Message } from "../src/message/index";
import dotenv from "dotenv";

describe("message", () => {
  let message: Message;
  beforeEach(() => {
    dotenv.config();
    return (message = new Message({
      agentId: Number(process.env.AGENT_ID),
      corpId: process.env.CORPID,
      corpSecret: process.env.CORP_SECRET,
    }));
  });

  it("Send Text Message", async () => {
    const { data } = await message.send({
      touser: "aidenxiong",
      msgtype: "text",
      text: {
        content: "test",
      },
    });
    expect(data.errcode).toEqual(0);
  });
  it("Send Text Message", async () => {
    const { data } = await message.send({
      touser: "aidenxiong",
      msgtype: "text",
      text: {
        content: "test",
      },
    });
    expect(data.errcode).toEqual(0);
  });
});
