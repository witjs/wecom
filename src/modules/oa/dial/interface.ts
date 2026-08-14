import type { BaseRet } from '../../../common/interface';

export interface GetDialRecordDto {
  start_time?: number;
  end_time?: number;
  offset?: number;
  limit?: number;
}

export interface DialRecord {
  call_time: number;
  total_duration: number;
  call_type: number;
  caller: {
    userid: string;
    duration: number;
  };
  callee: Array<{
    phone?: string;
    userid?: string;
    duration: number;
  }>;
}

export interface GetDialRecordRet extends BaseRet {
  record: DialRecord[];
}
