import { AxiosResponse } from "axios";
import { BaseRet } from "src/common/interface";
import { Wecom, WecomConfig } from "../../wecom";
import {
  ICheckinDataRet,
  ICheckinOptionRet,
  QueryCheckinData,
  QueryCheckinOption,
} from "./interface";

export class Checkin extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  /**
   * @description 获取打卡数据
   * @param {QueryCheckinData} data
   * @return {*}  {Promise<AxiosResponse<ICheckinDataRet>>}
   * @memberof Checkin
   */
  getCheckinData(
    data: QueryCheckinData
  ): Promise<AxiosResponse<ICheckinDataRet>> {
    return this.request<ICheckinDataRet>({
      url: "checkin/getcheckindata",
      method: "POST",
      data,
    });
  }

  /**
   * @description 获取打卡规则
   * @param {QueryCheckinOption} data
   * @return {*}  {Promise<AxiosResponse<ICheckinOptionRet>>}
   * @memberof Checkin
   */
  getCheckinOption(
    data: QueryCheckinOption
  ): Promise<AxiosResponse<ICheckinOptionRet>> {
    return this.request<ICheckinOptionRet>({
      url: "checkin/getcheckinoption",
      method: "POST",
      data,
    });
  }
}
