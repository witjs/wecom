import { Wecom, WecomConfig } from "../wecom";
import { IMessage } from "./interface/index";
import { AxiosResponse } from "axios";

export class Message extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }
  async send<T = any, R = AxiosResponse<T>>(
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
  ): Promise<R> {
    message.agentid = message.agentid || this.config.agentId;
    return this.request({
      url: "message/send",
      method: "POST",
      data: message,
    });
  }
}
