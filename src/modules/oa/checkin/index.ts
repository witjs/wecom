import type { WecomConfig } from '../../../wecom';
import { Wecom } from '../../../wecom';
import type {
  ICheckinDataRet,
  ICheckinOptionRet,
  QueryCheckinData,
  QueryCheckinOption,
} from './interface';

export class Checkin extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
  }

  /**
   * @description 获取打卡数据
   */
  getCheckinData(data: QueryCheckinData): Promise<ICheckinDataRet> {
    return this.request<ICheckinDataRet>({
      url: '/checkin/getcheckindata',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 获取打卡规则
   */
  getCheckinOption(data: QueryCheckinOption): Promise<ICheckinOptionRet> {
    return this.request<ICheckinOptionRet>({
      url: '/checkin/getcheckinoption',
      method: 'POST',
      data,
    });
  }
}

export type {
  ICheckinData,
  ICheckinDataRet,
  ICheckinDateItem,
  ICheckinOptionInfoItem,
  ICheckinOptionRet,
  ICheckinTimeItem,
  IDaysItem,
  ILocInfo,
  IRuleGroupItem,
  IWifiMacInfo,
  QueryCheckinData,
  QueryCheckinOption,
} from './interface';
