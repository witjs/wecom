import { BaseRet } from "../../../common/interface";

/**
 * @description 菜单按钮的类型
 * @export
 * @enum {number}
 */
export enum AgentMenuButtonType {
  // 点击推事件
  CLICK = "click",
  // 跳转URL
  VIEW = "view",
  // 扫码推事件
  SCANCODEPUSH = "scancode_push",
  //扫码推事件 且弹出“消息接收中”提示框
  SCANCODEWAITMSG = "scancode_waitmsg",
  // 弹出系统拍照发图
  PICSYSPHOTO = "pic_sysphoto",
  // 弹出拍照或者相册发图
  PICPHOTOORALBUM = "pic_photo_or_album",
  // 弹出企业微信相册发图器
  PICWEIXIN = "pic_weixin",
  // 弹出地理位置选择器
  LOCATIONSELECT = "location_select",
  // 跳转到小程序
  VIEW_MINIPROGRAM = "view_miniprogram",
}

export interface BaseAgentMenuButtonItem {
  // 菜单的名字。不能为空，主菜单不能超过16字节，子菜单不能超过40字节。
  name: string;
  // 菜单的响应动作类型
  type?: AgentMenuButtonType;
  sub_button?: Array<
    BaseAgentMenuButtonItem | ClickItem | ViewItem | MiniProgramItem
  >;
}

/**
 * @description 点击类型
 * @export
 * @interface ClickItem
 * @extends {BaseAgentMenuButtonItem}
 */
export interface ClickItem extends BaseAgentMenuButtonItem {
  // 菜单KEY值，用于消息接口推送，不超过128字节 click等点击类型必须
  key: string;
}

/**
 * @description 链接跳转
 * @export
 * @interface ViewItem
 * @extends {BaseAgentMenuButtonItem}
 */
export interface ViewItem extends BaseAgentMenuButtonItem {
  // 网页链接，成员点击菜单可打开链接，不超过1024字节。为了提高安全性，建议使用https的url view类型必须
  url: string;
}

/**
 * @description 小程序
 * @export
 * @interface MiniProgramItem
 * @extends {BaseAgentMenuButtonItem}
 */
export interface MiniProgramItem extends BaseAgentMenuButtonItem {
  // 小程序的页面路径 view_miniprogram类型必须
  pagepath: string;
  // 小程序的appid（仅与企业绑定的小程序可配置）  view_miniprogram类型必须
  appid: string;
}

export type ICreateAgentMenuButton =
  | BaseAgentMenuButtonItem
  | ClickItem
  | ViewItem
  | MiniProgramItem;

/**
 * @description 创建菜单
 * @export
 * @interface ICreateAgentMenu
 */
export interface ICreateAgentMenu {
  button: Array<ICreateAgentMenuButton>;
}

export interface AgentMenuRet extends BaseRet, ICreateAgentMenu {}
