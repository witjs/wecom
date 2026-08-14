import type { WecomConfig } from '../../../wecom';
import { Wecom } from '../../../wecom';
import type {
  BatchImportDto,
  BatchJobRet,
  BatchReplacePartyDto,
  BatchResultRet,
} from './interface';

export class Batch extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
  }

  /**
   * @description 增量更新成员
   */
  syncUser(data: BatchImportDto): Promise<BatchJobRet> {
    return this.request<BatchJobRet>({
      url: '/batch/syncuser',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 全量覆盖成员
   */
  replaceUser(data: BatchImportDto): Promise<BatchJobRet> {
    return this.request<BatchJobRet>({
      url: '/batch/replaceuser',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 全量覆盖部门
   */
  replaceParty(data: BatchReplacePartyDto): Promise<BatchJobRet> {
    return this.request<BatchJobRet>({
      url: '/batch/replaceparty',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 获取异步任务结果
   */
  getResult(jobid: string): Promise<BatchResultRet> {
    return this.request<BatchResultRet>({
      url: '/batch/getresult',
      method: 'GET',
      params: { jobid },
    });
  }
}

export type {
  BatchCallback,
  BatchImportDto,
  BatchJobRet,
  BatchReplacePartyDto,
  BatchResultItem,
  BatchResultRet,
} from './interface';
