import type { Wecom } from '../../wecom.js';
import type { WecomConfig } from '../../core/config.js';
import { WecomModule } from '../../wecom-module.js';
import type { DialRecordList, DialRecordQuery } from './interface.js';

/**
 * 公费电话拨打记录。
 *
 * @see https://developer.work.weixin.qq.com/document/path/90267
 */
export class Dial extends WecomModule {
  constructor(config?: Partial<WecomConfig> | Wecom) {
    super(config);
  }

  /**
   * 获取公费电话拨打记录。
   *
   * @see https://developer.work.weixin.qq.com/document/path/90267
   */
  getDialRecord(data: DialRecordQuery) {
    return this.http.post<DialRecordList>('/dial/get_dial_record', data);
  }
}

export * from './interface.js';
