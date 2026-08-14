import type { BaseRet } from '../../common/interface';

export interface FollowUserListRet extends BaseRet {
  follow_user: string[];
}

export interface ExternalUserListRet extends BaseRet {
  external_userid: string[];
}

export interface ExternalFollowUser {
  userid: string;
  remark?: string;
  description?: string;
  createtime: number;
  tags?: Array<{
    group_name?: string;
    tag_name?: string;
    tag_id?: string;
    type?: number;
  }>;
  remark_corp_name?: string;
  remark_mobiles?: string[];
  add_way?: number;
  oper_userid?: string;
}

export interface ExternalContactInfo {
  external_userid: string;
  name: string;
  avatar?: string;
  type: number;
  gender: number;
  unionid?: string;
  position?: string;
  corp_name?: string;
  corp_full_name?: string;
}

export interface ExternalContactGetRet extends BaseRet {
  external_contact: ExternalContactInfo;
  follow_user: ExternalFollowUser[];
  next_cursor?: string;
}

export interface BatchGetByUserDto {
  userid_list: string[];
  cursor?: string;
  limit?: number;
}

export interface BatchGetByUserRet extends BaseRet {
  external_contact_list: Array<{
    external_contact: ExternalContactInfo;
    follow_info: ExternalFollowUser;
  }>;
  next_cursor?: string;
}

export interface RemarkExternalContactDto {
  userid: string;
  external_userid: string;
  remark?: string;
  description?: string;
  remark_company?: string;
  remark_mobiles?: string[];
  remark_pic_mediaid?: string;
}

export interface AddContactWayDto {
  type: 1 | 2;
  scene: 1 | 2;
  style?: number;
  remark?: string;
  skip_verify?: boolean;
  state?: string;
  user?: string[];
  party?: number[];
  is_temp?: boolean;
  expires_in?: number;
  chat_expires_in?: number;
  unionid?: string;
  conclusions?: Record<string, unknown>;
}

export interface AddContactWayRet extends BaseRet {
  config_id: string;
  qr_code: string;
}

export interface ContactWayRet extends BaseRet {
  contact_way: AddContactWayDto & {
    config_id: string;
    qr_code?: string;
  };
}

export interface UpdateContactWayDto extends Partial<AddContactWayDto> {
  config_id: string;
}

export interface ListContactWayDto {
  start_time?: number;
  end_time?: number;
  cursor?: string;
  limit?: number;
}

export interface ListContactWayRet extends BaseRet {
  contact_way: Array<{ config_id: string }>;
  next_cursor?: string;
}

export interface CorpTag {
  id: string;
  name: string;
  create_time?: number;
  order?: number;
  deleted?: boolean;
}

export interface CorpTagGroup {
  group_id: string;
  group_name: string;
  create_time?: number;
  order?: number;
  deleted?: boolean;
  tag: CorpTag[];
}

export interface GetCorpTagListRet extends BaseRet {
  tag_group: CorpTagGroup[];
}

export interface AddCorpTagDto {
  group_id?: string;
  group_name?: string;
  order?: number;
  tag: Array<{ name: string; order?: number }>;
}

export interface AddCorpTagRet extends BaseRet {
  tag_group: CorpTagGroup;
}

export interface EditCorpTagDto {
  id: string;
  name?: string;
  order?: number;
}

export interface DelCorpTagDto {
  tag_id?: string[];
  group_id?: string[];
}

export interface MarkTagDto {
  userid: string;
  external_userid: string;
  add_tag?: string[];
  remove_tag?: string[];
}

export interface GroupChatListDto {
  status_filter?: 0 | 1 | 2 | 3;
  owner_filter?: { userid_list: string[] };
  cursor?: string;
  limit: number;
}

export interface GroupChatListRet extends BaseRet {
  group_chat_list: Array<{
    chat_id: string;
    status: number;
  }>;
  next_cursor?: string;
}

export interface GroupChatGetDto {
  chat_id: string;
  need_name?: 0 | 1;
}

export interface GroupChatGetRet extends BaseRet {
  group_chat: {
    chat_id: string;
    name: string;
    owner: string;
    create_time: number;
    notice?: string;
    member_list: Array<{
      userid: string;
      type: number;
      unionid?: string;
      join_time: number;
      join_scene: number;
      invitor?: { userid: string };
      group_nickname?: string;
      name?: string;
    }>;
    admin_list?: Array<{ userid: string }>;
  };
}

export interface SendWelcomeMsgDto {
  welcome_code: string;
  text?: { content: string };
  attachments?: Array<Record<string, unknown>>;
}

export interface AddMsgTemplateDto {
  chat_type: 'single' | 'group';
  external_userid?: string[];
  chat_id_list?: string[];
  sender?: string;
  allow_select?: boolean;
  text?: { content: string };
  attachments?: Array<Record<string, unknown>>;
}

export interface AddMsgTemplateRet extends BaseRet {
  fail_list?: string[];
  msgid: string;
}

export interface TransferCustomerDto {
  handover_userid: string;
  takeover_userid: string;
  external_userid: string[];
  transfer_success_msg?: string;
}

export interface TransferCustomerRet extends BaseRet {
  customer: Array<{
    external_userid: string;
    errcode: number;
  }>;
}

export interface GetUnassignedListDto {
  cursor?: string;
  page_size?: number;
}

export interface GetUnassignedListRet extends BaseRet {
  info: Array<{
    handover_userid: string;
    external_userid: string;
    dimission_time: number;
  }>;
  is_last: boolean;
  next_cursor?: string;
}

export interface GetUserBehaviorDataDto {
  userid?: string[];
  partyid?: number[];
  start_time: number;
  end_time: number;
}

export interface GetUserBehaviorDataRet extends BaseRet {
  behavior_data: Array<{
    stat_time: number;
    chat_cnt: number;
    message_cnt: number;
    reply_percentage: number;
    avg_reply_time: number;
    negative_feedback_cnt: number;
    new_apply_cnt: number;
    new_contact_cnt: number;
  }>;
}
