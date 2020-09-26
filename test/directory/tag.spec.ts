import { Tag } from "wecom";
import dotenv from "dotenv";
describe("User Manager", () => {
  let tag: Tag;
  const TestTag = {
    tagid: 20200925,
    tagname: "测试标签",
  };
  beforeEach(() => {
    dotenv.config();
    return (tag = new Tag({
      corpId: process.env.CORPID,
      corpSecret: process.env.DIRECTORY_SECRET,
    }));
  });

  it("Create Tag", async () => {
    const ret = await tag.create(TestTag);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Update Tag", async () => {
    TestTag.tagname = "修改后的测试标签";
    const ret = await tag.update(TestTag);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Add Tag User", async () => {
    const ret = await tag.addTagUser({
      tagid: TestTag.tagid,
      userlist: ["XiongPing"],
    });
    expect(ret.data.errcode).toEqual(0);
  });

  it("Get Tag User", async () => {
    const ret = await tag.get(TestTag.tagid);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Del Tag User", async () => {
    const ret = await tag.delTagUser({
      tagid: TestTag.tagid,
      userlist: ["XiongPing"],
    });
    expect(ret.data.errcode).toEqual(0);
  });

  it("Tag List", async () => {
    const ret = await tag.list();
    expect(ret.data.errcode).toEqual(0);
  });

  it("Delete Tag", async () => {
    const ret = await tag.delete(TestTag.tagid);
    expect(ret.data.errcode).toEqual(0);
  });
});
