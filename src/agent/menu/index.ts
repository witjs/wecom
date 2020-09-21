import { AxiosResponse } from "axios";
import { Agent, IAgentWecom } from "..";
import { ICreateAgentMenu } from "../interface/menu";

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
  create(data: ICreateAgentMenu) {
    return this.request({
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
  get<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.request({
      url: "menu/get",
      method: "GET",
      params: { agentid: this.agentId },
    });
  }

  delete<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.request({
      url: "menu/delete",
      method: "GET",
      params: { agentid: this.agentId },
    });
  }
}
