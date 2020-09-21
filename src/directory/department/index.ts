import { AxiosResponse } from "axios";
import { Wecom, WecomConfig } from "../../wecom";
import { ICreateDepartment, IUpdateDepartment } from "./interface";

export class Department extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  /**
   * @description 创建部门： 使用该接口 您需要去到管理工具中 选择通讯录同步 在权限 中开启 接口调用权限
   * @param {ICreateDepartment} data
   * @return {*}
   * @memberof Department
   */
  create(data: ICreateDepartment): Promise<AxiosResponse<any>> {
    return this.request({
      url: "department/create",
      method: "POST",
      data,
    });
  }

  /**
   * @description 修改部门： 使用该接口 您需要去到管理工具中 选择通讯录同步 在权限 中开启 接口调用权限
   * @param {IUpdateDepartment} data
   * @return {*}  {Promise<AxiosResponse<any>>}
   * @memberof Department
   */
  update(data: IUpdateDepartment): Promise<AxiosResponse<any>> {
    return this.request({
      url: "department/update",
      method: "POST",
      data,
    });
  }

  /**
   * @description 删除部门
   * @param {number} id
   * @return {*}  {Promise<AxiosResponse<any>>}
   * @memberof Department
   */
  delete(id: number): Promise<AxiosResponse<any>> {
    return this.request({
      url: "department/delete",
      method: "GET",
      params: {
        id,
      },
    });
  }

  /**
   * @description 获取部门详情
   * @param {number} [id]
   * @return {*}
   * @memberof Department
   */
  list(id?: number): Promise<AxiosResponse<any>> {
    return this.request({
      url: "department/list",
      method: "GET",
      params: {
        id,
      },
    });
  }
}
