import { AxiosResponse } from "axios";
import { Wecom, WecomConfig } from "../wecom";
import { ISetAgent } from "./interface/agent";

export interface IAgentWecom extends Partial<WecomConfig> {
  agentId: number;
}

/**
 * @description 应用管理相关接口
 * @export
 * @class Agent
 * @extends {Wecom}
 */
export class Agent extends Wecom {
  agentId: number;
  constructor(config: IAgentWecom) {
    super(config);
    this.agentId = config.agentId;

    // 如果没有传入agentId 直接抛出异常
    if (!this.agentId) {
      throw new Error("agentId must be specified");
    }
  }

  /**
   * @description 获取应用详情
   * @template T
   * @template R
   * @param {number} agentid
   * @return {*}  {Promise<R>}
   * @memberof Agent
   */
  get<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.request({
      url: "/agent/get",
      params: {
        agentid: this.agentId,
      },
    });
  }

  /**
   * @description 修改自建应用信息
   * @template T
   * @template R
   * @param {ISetAgent} data
   * @return {*}  {Promise<R>}
   * @memberof Agent
   */
  set<T = any, R = AxiosResponse<T>>(data: ISetAgent): Promise<R> {
    return this.request({
      url: "/agent/set",
      method: "POST",
      data: Object.assign(data, { agentid: this.agentId }),
    });
  }
}
