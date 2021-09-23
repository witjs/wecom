import { Wecom, WecomConfig } from "../../wecom";
import { IMessage, IMessageRet } from "./interface/index";
import { AxiosResponse } from "axios";

export class Message extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }
  /**
   * @description
   * @template T
   * @template R
   * @param {(IMessage.Text
   *       | IMessage.Image
   *       | IMessage.Voice
   *       | IMessage.File
   *       | IMessage.TextCard
   *       | IMessage.News
   *       | IMessage.MPNews
   *       | IMessage.Markdown
   *       | IMessage.MiniProgramNotice
   *       | IMessage.TaskCard)} message 发送的消息主题
   * @param {number} agentId 应用ID
   * @return {*}  {Promise<R>}
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
      | IMessage.TaskCard,
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
