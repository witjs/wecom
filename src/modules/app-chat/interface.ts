import type { BaseRet } from '../../common/interface';
import type { IMessage } from '../message/interface';

export interface CreateAppChatDto {
  name?: string;
  owner?: string;
  userlist: string[];
  chatid?: string;
}

export interface CreateAppChatRet extends BaseRet {
  chatid: string;
}

export interface UpdateAppChatDto {
  chatid: string;
  name?: string;
  owner?: string;
  add_user_list?: string[];
  del_user_list?: string[];
}

export interface AppChatInfo {
  chatid: string;
  name: string;
  owner: string;
  userlist: string[];
}

export interface GetAppChatRet extends BaseRet {
  chat_info: AppChatInfo;
}

export type AppChatMessage = {
  chatid: string;
} & (
  | IMessage.Text
  | IMessage.Image
  | IMessage.Voice
  | IMessage.File
  | IMessage.TextCard
  | IMessage.News
  | IMessage.MPNews
  | IMessage.Markdown
);
