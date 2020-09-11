import { Media } from "../src/media/index";
import dotenv from "dotenv";
import * as fs from "fs";

describe("message", () => {
  let media: Media;
  beforeEach(() => {
    dotenv.config();
    return (media = new Media({
      agentId: Number(process.env.AGENT_ID),
      corpId: process.env.CORPID,
      corpSecret: process.env.CORP_SECRET,
    }));
  });

  it("Media Upload", async () => {
    const ret = await media.upload(
      fs.createReadStream("/Users/aidenxiong/Downloads/abac.png")
    );
    console.log(ret);
    expect(ret.data.errcode).toEqual(0);
  });
});