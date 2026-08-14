import type { BaseRet } from '../../../common/interface';

export interface GetApprovalTemplateDto {
  template_id: string;
}

export interface ApprovalTemplateControl {
  property: {
    control: string;
    id: string;
    title: Array<{ text: string; lang: string }>;
    placeholder?: Array<{ text: string; lang: string }>;
    require?: number;
    un_print?: number;
  };
  config?: Record<string, unknown>;
}

export interface GetApprovalTemplateRet extends BaseRet {
  template_names: Array<{ text: string; lang: string }>;
  template_content: {
    controls: ApprovalTemplateControl[];
  };
}

export interface ApprovalApplyContent {
  control: string;
  id: string;
  value: Record<string, unknown>;
}

export interface ApplyEventDto {
  creator_userid: string;
  template_id: string;
  use_template_approver: 0 | 1;
  choose_department?: number;
  process?: {
    node_list: Array<{
      type: 1 | 2 | 3;
      apv_rel?: 1 | 2 | 3;
      userid: string[];
    }>;
  };
  apply_data: {
    contents: ApprovalApplyContent[];
  };
  summary_list: Array<{
    summary_info: Array<{ text: string; lang: string }>;
  }>;
}

export interface ApplyEventRet extends BaseRet {
  sp_no: string;
}

export interface GetApprovalInfoDto {
  starttime: number;
  endtime: number;
  cursor: number;
  size: number;
  filters?: Array<{
    key: string;
    value: string;
  }>;
}

export interface GetApprovalInfoRet extends BaseRet {
  sp_no_list: string[];
}

export interface GetApprovalDetailDto {
  sp_no: string;
}

export interface GetApprovalDetailRet extends BaseRet {
  info: {
    sp_no: string;
    sp_name: string;
    sp_status: number;
    template_id: string;
    apply_time: number;
    applyer: {
      userid: string;
      partyid: string;
    };
    apply_data: {
      contents: ApprovalApplyContent[];
    };
    [key: string]: unknown;
  };
}
