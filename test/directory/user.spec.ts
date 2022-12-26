import { User } from "wecom";
import dotenv from "dotenv";
import { IUser } from "../../src/modules/directory/user/interface";
describe("User Manager", () => {
  let user: User;
  let userinfo: IUser;
  const TestUserId = "testtesttesttesttesttesttesttesttest";
  beforeEach(() => {
    dotenv.config();
    return (user = new User({
      corpId: process.env.CORPID,
      corpSecret: process.env.DIRECTORY_SECRET,
    }));
  });

  it("Create User", async () => {
    const ret = await user.create({
      name: "测试专属",
      userid: TestUserId,
      mobile: "17688716790",
      department: [2],
    });

    // 创建两个后面为了方便删除的成员
    await user.create({
      name: "测试专属",
      userid: TestUserId + "1",
      mobile: "17688716791",
      department: [2],
    });
    await user.create({
      name: "测试专属",
      userid: TestUserId + "2",
      mobile: "17688716792",
      department: [2],
    });
    expect(ret.data.errcode).toEqual(0);
  });

  it("Get User Info", async () => {
    const ret = await user.get(TestUserId);
    userinfo = ret.data;
    expect(ret.data.userid).toEqual(TestUserId);
  });

  it("Update User", async () => {
    userinfo.name = "修改后的名称";
    const ret = await user.update(userinfo);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Delete User", async () => {
    const ret = await user.delete(userinfo.userid);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Sample List", async () => {
    const ret = await user.simpleList(2);
    expect(ret.data.errcode).toEqual(0);
  });

  it("User List", async () => {
    const ret = await user.list(2);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Convert To OpenId", async () => {
    const ret = await user.convertToOpenid(TestUserId + "1");
    expect([0, 43004]).toEqual(expect.arrayContaining([ret.data.errcode]));
  });

  it("AuthSucc", async () => {
    const ret = await user.authSucc(TestUserId + "1");
    expect(ret.data.errcode).toEqual(0);
  });

  it("Invate", async () => {
    const ret = await user.invite({
      user: [TestUserId + "1"],
    });
    expect(ret.data.errcode).toEqual(0);
  });

  it("Get Join Qrcode", async () => {
    const ret = await user.getJoinQrCode(2);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Get Active Stat", async () => {
    const ret = await user.getActiveStat("2020-09-23");
    expect(ret.data.errcode).toEqual(0);
  });

  it("Batch Delete User", async () => {
    const ret = await user.batchDelete([TestUserId + "1", TestUserId + "2"]);
    expect(ret.data.errcode).toEqual(0);
  });
});
