import { AxiosResponse } from "axios";
import { Wecom } from "../wecom";
import { AgentRet, IAgentWecom, ISetAgent } from "./interface/agent";

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
  get<T = AgentRet>(): Promise<AxiosResponse<T>> {
    return this.request<T>({
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
  set(data: ISetAgent): Promise<AxiosResponse<AgentRet>> {
    return this.request<AgentRet>({
      url: "/agent/set",
      method: "POST",
      data: Object.assign(data, { agentid: this.agentId }),
    });
  }
}
