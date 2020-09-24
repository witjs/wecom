import { AxiosResponse } from "axios";
import { BaseRet } from "../../common/interface";
import { Agent } from "..";
import { IAgentWecom } from "../interface/agent";
import { ICreateAgentMenu, AgentMenuRet } from "../interface/menu";

export class AgentMenu extends Agent {
  constructor(config: IAgentWecom) {
    super(config);
  }

  /**
   * @description 创建菜单
   * @param {ICreateAgentMenu} data
   * @return {*}
   * @memberof AgentMenu
   */
  create(data: ICreateAgentMenu): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "menu/create",
      method: "POST",
      params: { agentid: this.agentId },
      data,
    });
  }

  /**
   * @description 获取菜单信息
   * @template T
   * @template R
   * @return {*}  {Promise<R>}
   * @memberof AgentMenu
   */
  get<T = AgentMenuRet>(): Promise<AxiosResponse<T>> {
    return this.request<T>({
      url: "menu/get",
      method: "GET",
      params: { agentid: this.agentId },
    });
  }

  /**
   * @description 删除菜单
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof AgentMenu
   */
  delete(): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "menu/delete",
      method: "GET",
      params: { agentid: this.agentId },
    });
  }
}
