import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  ICheckinDataRet,
  ICheckinOptionRet,
  QueryCheckinData,
  QueryCheckinOption,
} from './interface';

export class Checkin extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
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
