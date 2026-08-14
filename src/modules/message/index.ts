import type { BaseRet } from '../../common/interface';
import type { WecomConfig } from '../../wecom';
import { Wecom } from '../../wecom';
import type {
  GetMessageStatisticsDto,
  GetMessageStatisticsRet,
  IMessage,
  IMessageRet,
  RecallMessageDto,
  UpdateTemplateCardDto,
} from './interface';

export type TemplateCardPayload =
  | IMessage.TemplateCard.TextNotice
  | IMessage.TemplateCard.NewsNotice
  | IMessage.TemplateCard.ButtonInteraction
  | IMessage.TemplateCard.VoteInteraction
  | IMessage.TemplateCard.MultipleInteraction;

export type SendableMessage =
  | IMessage.Text
  | IMessage.Image
  | IMessage.Voice
  | IMessage.File
  | IMessage.TextCard
  | IMessage.News
  | IMessage.MPNews
  | IMessage.Markdown
  | IMessage.MiniProgramNotice
  | IMessage.TaskCard
  | IMessage.TemplateCard.TemplateCardCommon<TemplateCardPayload>;

export class Message extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
  }

  /**
   * @description 发送应用消息
   */
  send(message: SendableMessage, agentId?: number): Promise<IMessageRet> {
    return this.request<IMessageRet>({
      url: '/message/send',
      method: 'POST',
      data: {
        ...message,
        agentid: message.agentid ?? agentId,
      },
    });
  }

  /**
   * @description 撤回应用消息
   */
  recall(data: RecallMessageDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/message/recall',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 更新模版卡片消息
   */
  updateTemplateCard(data: UpdateTemplateCardDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/message/update_template_card',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 查询应用消息发送统计
   */
  getStatistics(
    data: GetMessageStatisticsDto
  ): Promise<GetMessageStatisticsRet> {
    return this.request<GetMessageStatisticsRet>({
      url: '/message/get_statistics',
      method: 'POST',
      data,
    });
  }
}

export { AppChat } from './appchat';
export type {
  AppChatInfo,
  AppChatMessage,
  CreateAppChatDto,
  CreateAppChatRet,
  GetAppChatRet,
  GetMessageStatisticsDto,
  GetMessageStatisticsRet,
  IMessage,
  IMessageRet,
  MessageStatisticsItem,
  RecallMessageDto,
  UpdateAppChatDto,
  UpdateTemplateCardDto,
} from './interface';
