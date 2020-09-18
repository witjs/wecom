import { Department } from "../../src/directory";
import dotenv from "dotenv";
describe("Department Manager", () => {
  let department: Department;
  beforeEach(() => {
    dotenv.config();
    return (department = new Department({
      corpId: process.env.CORPID,
      corpSecret: process.env.CORP_SECRET,
    }));
  });
  it("Get Department Info", async () => {
    const ret = await department.list(2027320);
    console.log(ret.data);
  });
});
