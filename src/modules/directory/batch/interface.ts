import type { BaseRet } from '../../../common/interface';

export interface BatchCallback {
  url?: string;
  token?: string;
  encodingaeskey?: string;
}

export interface BatchImportDto {
  media_id: string;
  to_invite?: boolean;
  callback?: BatchCallback;
}

export interface BatchReplacePartyDto {
  media_id: string;
  callback?: BatchCallback;
}

export interface BatchJobRet extends BaseRet {
  jobid: string;
}

export interface BatchResultItem {
  userid?: string;
  action?: number;
  partyid?: number;
  errcode: number;
  errmsg: string;
}

export interface BatchResultRet extends BaseRet {
  status: number;
  type: string;
  total: number;
  percentage: number;
  result?: BatchResultItem[];
}
