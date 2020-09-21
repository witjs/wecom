import { AxiosResponse } from "axios";
import { Wecom, WecomConfig } from "../wecom";
import { ISetAgent } from "./interface";

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

  /**
   * @description 修改自建应用信息
   * @template T
   * @template R
   * @param {ISetAgent} data
   * @return {*}  {Promise<R>}
   * @memberof Agent
   */
  set<T = any, R = AxiosResponse<T>>(data: ISetAgent): Promise<R> {
    data.agentid = data.agentid || data.id;
    return this.request({
      url: "/agent/set",
      method: "POST",
      data,
    });
  }
}
