import { Message } from "../src/message/index";
import dotenv from "dotenv";

describe("Message Module", () => {
  let message: Message;
  beforeEach(() => {
    dotenv.config();
    return (message = new Message({
      corpId: process.env.CORPID,
      corpSecret: process.env.TEST_SECRET,
    }));
  });

  it("Send Text Message", async () => {
    const { data } = await message.send(
      {
        touser: "XiongPing",
        msgtype: "text",
        text: {
          content: "test",
        },
      },
      Number(process.env.TEST_AGENT_ID)
    );
    expect(data.errcode).toEqual(0);
  });
  it("Send Text Message", async () => {
    const { data } = await message.send(
      {
        touser: "XiongPing",
        msgtype: "text",
        text: {
          content: "test",
        },
      },
      Number(process.env.TEST_AGENT_ID)
    );
    expect(data.errcode).toEqual(0);
  });
});
