import { Wecom, WecomConfig } from "../../wecom";
import { IMessage, IMessageRet } from "./interface/index";
import { AxiosResponse } from "axios";

export class Message extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }
  /**
   * @description
   * @param {(IMessage.Text
   *       | IMessage.Image
   *       | IMessage.Voice
   *       | IMessage.File
   *       | IMessage.TextCard
   *       | IMessage.News
   *       | IMessage.MPNews
   *       | IMessage.Markdown
   *       | IMessage.MiniProgramNotice
   *       | IMessage.TaskCard
   *       | IMessage.TemplateCard.TemplateCardCommon<
   *           | IMessage.TemplateCard.TextNotice
   *           | IMessage.TemplateCard.NewsNotice
   *           | IMessage.TemplateCard.ButtonInteraction
   *           | IMessage.TemplateCard.VoteInteraction
   *           | IMessage.TemplateCard.MultipleInteraction
   *         >)} message
   * @param {number} [agentId]
   * @return {*}  {Promise<AxiosResponse<IMessageRet>>}
   * @memberof Message
   */
  async send(
    message:
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
      | IMessage.TemplateCard.TemplateCardCommon<
          | IMessage.TemplateCard.TextNotice
          | IMessage.TemplateCard.NewsNotice
          | IMessage.TemplateCard.ButtonInteraction
          | IMessage.TemplateCard.VoteInteraction
          | IMessage.TemplateCard.MultipleInteraction
        >,
    agentId?: number
  ): Promise<AxiosResponse<IMessageRet>> {
    message.agentid = message.agentid || agentId;
    return this.request<IMessageRet>({
      url: "message/send",
      method: "POST",
      data: message,
    });
  }
}
