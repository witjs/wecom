import type { BaseRet } from '../../common/interface';
import type { WecomConfig } from '../../wecom';
import { Wecom } from '../../wecom';
import type {
  AppChatMessage,
  CreateAppChatDto,
  CreateAppChatRet,
  GetAppChatRet,
  IMessageRet,
  UpdateAppChatDto,
} from './interface';

export class AppChat extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
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
