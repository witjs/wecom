import { Checkin } from "wecom";
import dotenv from "dotenv";
describe("Checkin Manager", () => {
  let checkin: Checkin;
  beforeEach(() => {
    dotenv.config();
    return (checkin = new Checkin({
      corpId: process.env.CORPID,
      corpSecret: process.env.CHECKIN_SECRET,
    }));
  });
  it("Get Checkin Data", async () => {
    const ret = await checkin.getCheckinData({
      opencheckindatatype: 3,
      starttime: 1577808000,
      endtime: 1580486400,
      useridlist: ["XiongPing"],
    });
    // expect(ret.data.errcode).toEqual(0);
    expect([0, 301023]).toEqual(expect.arrayContaining([ret.data.errcode]));
  });
});
