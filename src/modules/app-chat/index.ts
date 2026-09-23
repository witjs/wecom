import type { BaseRet } from '../../common/interface';
import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type { IMessageRet } from '../message/interface';
import type {
  AppChatMessage,
  CreateAppChatDto,
  CreateAppChatRet,
  GetAppChatRet,
  UpdateAppChatDto,
} from './interface';

export class AppChat extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  /**
   * @description 创建群聊会话
   */
  create(data: CreateAppChatDto): Promise<CreateAppChatRet> {
    return this.request<CreateAppChatRet>({
      url: '/appchat/create',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 修改群聊会话
   */
  update(data: UpdateAppChatDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/appchat/update',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 获取群聊会话
   */
  get(chatid: string): Promise<GetAppChatRet> {
    return this.request<GetAppChatRet>({
      url: '/appchat/get',
      method: 'GET',
      params: { chatid },
    });
  }

  /**
   * @description 应用推送消息到群聊
   */
  send(message: AppChatMessage): Promise<IMessageRet> {
    return this.request<IMessageRet>({
      url: '/appchat/send',
      method: 'POST',
      data: message,
    });
  }
}

export type {
  AppChatInfo,
  AppChatMessage,
  CreateAppChatDto,
  CreateAppChatRet,
  GetAppChatRet,
  UpdateAppChatDto,
} from './interface';
