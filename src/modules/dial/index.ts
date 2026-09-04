import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type { GetDialRecordDto, GetDialRecordRet } from './interface';

export class Dial extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
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
