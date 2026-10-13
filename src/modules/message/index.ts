import type { BaseRet } from '../../common/interface';
import { WecomConfigError } from '../../core/errors';
import type { WecomConfig } from '../../core/config';
import { Wecom } from '../../wecom';
import { WecomModule, isWecom } from '../../wecom-module';
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

export type MessageSource =
  | (Partial<WecomConfig> & { agentId?: number })
  | Wecom;

export class Message extends WecomModule {
  /** Default agent id; overridden by send(..., agentId) or message.agentid. */
  readonly agentId?: number;

  constructor(source: MessageSource = {}, agentId?: number) {
    if (isWecom(source)) {
      super(source);
      this.agentId = agentId;
      return;
    }
    const { agentId: fromConfig, ...config } = source;
    super(config);
    this.agentId = agentId ?? fromConfig;
  }

  /**
   * @description 发送应用消息
   */
  send(message: SendableMessage, agentId?: number): Promise<IMessageRet> {
    const resolvedAgentId = message.agentid ?? agentId ?? this.agentId;
    if (!resolvedAgentId) {
      throw new WecomConfigError('agentid should not be empty');
    }
    return this.request<IMessageRet>({
      url: '/message/send',
      method: 'POST',
      data: {
        ...message,
        agentid: resolvedAgentId,
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

export type {
  GetMessageStatisticsDto,
  GetMessageStatisticsRet,
  IMessage,
  IMessageRet,
  MessageStatisticsItem,
  RecallMessageDto,
  UpdateTemplateCardDto,
} from './interface';
