import { Media } from "../src/media/index";
import dotenv from "dotenv";
import * as fs from "fs";

describe("Media Manager", () => {
  let media: Media;
  beforeEach(() => {
    dotenv.config();
    return (media = new Media({
      corpId: process.env.CORPID,
      corpSecret: process.env.TEST_SECRET,
    }));
  });

  it("Media Upload", async () => {
    const ret = await media.upload(
      fs.createReadStream("/Users/aidenxiong/Downloads/abac.png")
    );
    expect(ret.data.errcode).toEqual(0);
  });
});
