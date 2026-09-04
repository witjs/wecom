import type { BaseRet } from '../../common/interface';
import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  AddContactWayDto,
  AddContactWayRet,
  AddCorpTagDto,
  AddCorpTagRet,
  AddMsgTemplateDto,
  AddMsgTemplateRet,
  BatchGetByUserDto,
  BatchGetByUserRet,
  ContactWayRet,
  DelCorpTagDto,
  EditCorpTagDto,
  ExternalContactGetRet,
  ExternalUserListRet,
  FollowUserListRet,
  GetCorpTagListRet,
  GetUnassignedListDto,
  GetUnassignedListRet,
  GetUserBehaviorDataDto,
  GetUserBehaviorDataRet,
  GroupChatGetDto,
  GroupChatGetRet,
  GroupChatListDto,
  GroupChatListRet,
  ListContactWayDto,
  ListContactWayRet,
  MarkTagDto,
  RemarkExternalContactDto,
  SendWelcomeMsgDto,
  TransferCustomerDto,
  TransferCustomerRet,
  UpdateContactWayDto,
} from './interface';

export class ExternalContact extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  getFollowUserList(): Promise<FollowUserListRet> {
    return this.request<FollowUserListRet>({
      url: '/externalcontact/get_follow_user_list',
      method: 'GET',
    });
  }

  list(userid: string): Promise<ExternalUserListRet> {
    return this.request<ExternalUserListRet>({
      url: '/externalcontact/list',
      method: 'GET',
      params: { userid },
    });
  }

  get(externalUserid: string, cursor?: string): Promise<ExternalContactGetRet> {
    return this.request<ExternalContactGetRet>({
      url: '/externalcontact/get',
      method: 'GET',
      params: { external_userid: externalUserid, cursor },
    });
  }

  batchGetByUser(data: BatchGetByUserDto): Promise<BatchGetByUserRet> {
    return this.request<BatchGetByUserRet>({
      url: '/externalcontact/batch/get_by_user',
      method: 'POST',
      data,
    });
  }

  remark(data: RemarkExternalContactDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/externalcontact/remark',
      method: 'POST',
      data,
    });
  }

  addContactWay(data: AddContactWayDto): Promise<AddContactWayRet> {
    return this.request<AddContactWayRet>({
      url: '/externalcontact/add_contact_way',
      method: 'POST',
      data,
    });
  }

  getContactWay(configId: string): Promise<ContactWayRet> {
    return this.request<ContactWayRet>({
      url: '/externalcontact/get_contact_way',
      method: 'POST',
      data: { config_id: configId },
    });
  }

  updateContactWay(data: UpdateContactWayDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/externalcontact/update_contact_way',
      method: 'POST',
      data,
    });
  }

  delContactWay(configId: string): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/externalcontact/del_contact_way',
      method: 'POST',
      data: { config_id: configId },
    });
  }

  listContactWay(data: ListContactWayDto = {}): Promise<ListContactWayRet> {
    return this.request<ListContactWayRet>({
      url: '/externalcontact/list_contact_way',
      method: 'POST',
      data,
    });
  }

  getCorpTagList(
    tagId?: string[],
    groupId?: string[]
  ): Promise<GetCorpTagListRet> {
    return this.request<GetCorpTagListRet>({
      url: '/externalcontact/get_corp_tag_list',
      method: 'POST',
      data: { tag_id: tagId, group_id: groupId },
    });
  }

  addCorpTag(data: AddCorpTagDto): Promise<AddCorpTagRet> {
    return this.request<AddCorpTagRet>({
      url: '/externalcontact/add_corp_tag',
      method: 'POST',
      data,
    });
  }

  editCorpTag(data: EditCorpTagDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/externalcontact/edit_corp_tag',
      method: 'POST',
      data,
    });
  }

  delCorpTag(data: DelCorpTagDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/externalcontact/del_corp_tag',
      method: 'POST',
      data,
    });
  }

  markTag(data: MarkTagDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/externalcontact/mark_tag',
      method: 'POST',
      data,
    });
  }

  groupChatList(data: GroupChatListDto): Promise<GroupChatListRet> {
    return this.request<GroupChatListRet>({
      url: '/externalcontact/groupchat/list',
      method: 'POST',
      data,
    });
  }

  groupChatGet(data: GroupChatGetDto): Promise<GroupChatGetRet> {
    return this.request<GroupChatGetRet>({
      url: '/externalcontact/groupchat/get',
      method: 'POST',
      data,
    });
  }

  sendWelcomeMsg(data: SendWelcomeMsgDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/externalcontact/send_welcome_msg',
      method: 'POST',
      data,
    });
  }

  addMsgTemplate(data: AddMsgTemplateDto): Promise<AddMsgTemplateRet> {
    return this.request<AddMsgTemplateRet>({
      url: '/externalcontact/add_msg_template',
      method: 'POST',
      data,
    });
  }

  transferCustomer(data: TransferCustomerDto): Promise<TransferCustomerRet> {
    return this.request<TransferCustomerRet>({
      url: '/externalcontact/transfer_customer',
      method: 'POST',
      data,
    });
  }

  resignedTransferCustomer(
    data: TransferCustomerDto
  ): Promise<TransferCustomerRet> {
    return this.request<TransferCustomerRet>({
      url: '/externalcontact/resigned/transfer_customer',
      method: 'POST',
      data,
    });
  }

  getUnassignedList(
    data: GetUnassignedListDto = {}
  ): Promise<GetUnassignedListRet> {
    return this.request<GetUnassignedListRet>({
      url: '/externalcontact/get_unassigned_list',
      method: 'POST',
      data,
    });
  }

  getUserBehaviorData(
    data: GetUserBehaviorDataDto
  ): Promise<GetUserBehaviorDataRet> {
    return this.request<GetUserBehaviorDataRet>({
      url: '/externalcontact/get_user_behavior_data',
      method: 'POST',
      data,
    });
  }
}

export type * from './interface';
