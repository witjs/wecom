import type { BaseRet } from '../../../common/interface';
import type { WecomConfig } from '../../../wecom';
import { Wecom } from '../../../wecom';
import type {
  ICreateDepartment,
  ICreateDepartmentRet,
  IDepartmentGetRet,
  IDepartmentRet,
  IDepartmentSimpleListRet,
  IUpdateDepartment,
} from './interface';

export class Department extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
  }

  /**
   * @description 创建部门
   */
  create(data: ICreateDepartment): Promise<ICreateDepartmentRet> {
    return this.request<ICreateDepartmentRet>({
      url: '/department/create',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 修改部门
   */
  update(data: IUpdateDepartment): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/department/update',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 删除部门
   */
  delete(id: number): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/department/delete',
      method: 'GET',
      params: { id },
    });
  }

  /**
   * @description 获取部门列表
   */
  list(id?: number): Promise<IDepartmentRet> {
    return this.request<IDepartmentRet>({
      url: '/department/list',
      method: 'GET',
      params: { id },
    });
  }

  /**
   * @description 获取子部门 ID 列表
   */
  simpleList(id?: number): Promise<IDepartmentSimpleListRet> {
    return this.request<IDepartmentSimpleListRet>({
      url: '/department/simplelist',
      method: 'GET',
      params: { id },
    });
  }

  /**
   * @description 获取单个部门详情
   */
  get(id: number): Promise<IDepartmentGetRet> {
    return this.request<IDepartmentGetRet>({
      url: '/department/get',
      method: 'GET',
      params: { id },
    });
  }
}

export type {
  ICreateDepartment,
  ICreateDepartmentRet,
  IDepartment,
  IDepartmentGetRet,
  IDepartmentIdItem,
  IDepartmentRet,
  IDepartmentSimpleListRet,
  IUpdateDepartment,
} from './interface';
