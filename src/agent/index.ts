import { AxiosResponse } from "axios";
import { Wecom, WecomConfig } from "../wecom";

/**
 * @description 应用管理相关接口
 * @export
 * @class Agent
 * @extends {Wecom}
 */
export class Agent extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  /**
   * @description 获取应用详情
   * @template T
   * @template R
   * @param {number} agentid
   * @return {*}  {Promise<R>}
   * @memberof Agent
   */
  get<T = any, R = AxiosResponse<T>>(agentid: number): Promise<R> {
    return this.request({
      url: "/agent/get",
      params: {
        agentid,
      },
    });
  }
}
