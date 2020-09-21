import { Department } from "../../src/directory";
import dotenv from "dotenv";
describe("Department Manager", () => {
  let department: Department;
  const TestDepartmentId = 1999999;
  beforeEach(() => {
    dotenv.config();
    return (department = new Department({
      corpId: process.env.CORPID,
      corpSecret: process.env.DIRECTORY_SECRET,
    }));
  });

  it("Create Department", async () => {
    const ret = await department.create({
      name: "测试部门",
      parentid: 1,
      id: TestDepartmentId,
    });
    // 已存在 或者创建成功都算成功
    expect([0, 60008]).toEqual(expect.arrayContaining([ret.data.errcode]));
  });

  it("Update Department", async () => {
    const ret = await department.update({
      id: 2,
      name: "总办",
    });
    console.log(ret.data);
    expect(ret.data.errcode).toEqual(0);
  });

  it("Get Department Info", async () => {
    const ret = await department.list(TestDepartmentId);
    expect(ret.data.department).toBeDefined();
    expect(ret.data.department[0]).toMatchObject({
      id: TestDepartmentId,
    });
  });

  it("Delete Department", async () => {
    const ret = await department.delete(TestDepartmentId);
    // 删除成功或者是 部门不存在 都算成功
    expect([0, 60123]).toEqual(expect.arrayContaining([ret.data.errcode]));
  });
});
