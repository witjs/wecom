import type { WecomConfig } from '../../../wecom';
import { Wecom } from '../../../wecom';
import type { GetDialRecordDto, GetDialRecordRet } from './interface';

export class Dial extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
  }

  /**
   * @description 获取公费电话拨打记录
   */
  getDialRecord(data: GetDialRecordDto = {}): Promise<GetDialRecordRet> {
    return this.request<GetDialRecordRet>({
      url: '/dial/get_dial_record',
      method: 'POST',
      data,
    });
  }
}

export type {
  DialRecord,
  GetDialRecordDto,
  GetDialRecordRet,
} from './interface';
