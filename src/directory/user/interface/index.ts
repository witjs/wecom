import { BaseRet } from "../../../../src/common/interface";

export interface IAttrBase {
  // 属性类型: 0-文本 1-网页 2-小程序
  type: 0 | 1 | 2;
  // 属性名称： 需要先确保在管理端有创建该属性，否则会忽略
  name: string;
}
export interface IAttrText {
  type: 0;
  // 文本类型的属性
  text: {
    // 文本属性内容,长度限制12个UTF8字符
    value: string;
  };
}
export interface IAttrWeb {
  type: 1;
  // 网页类型的属性，url和title字段要么同时为空表示清除该属性，要么同时不为空
  web: {
    // 网页的url,必须包含http或者https头
    url: string;
    // 网页的展示标题,长度限制12个UTF8字符
    title: string;
  };
}
export interface IAttrMiniprogram {
  // 小程序类型的属性，appid和title字段要么同时为空表示清除改属性，要么同时不为空
  type: 2;
  miniprogram: {
    // 小程序appid，必须是有在本企业安装授权的小程序，否则会被忽略
    appid: string;
    // 小程序的展示标题,长度限制12个UTF8字符
    pagepath: string;
    // 小程序的页面路径
    title: string;
  };
}

export type IAttr = IAttrText | IAttrWeb | IAttrMiniprogram;

export interface IUser {
  // 成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节
  userid: string;
  // 成员名称，此字段从2019年12月30日起，对新创建第三方应用不再返回真实name，使用userid代替name，2020年6月30日起，对所有历史第三方应用不再返回真实name，使用userid代替name，后续第三方仅通讯录应用可获取，第三方页面需要通过通讯录展示组件来展示名字
  name: string;
  // 成员所属部门id列表，仅返回该应用有查看权限的部门id
  department: number[];
  // 部门内的排序值，默认为0。数量必须和department一致，数值越大排序越前面。值范围是[0, 2^32)
  order: number[];
  // 职务信息；第三方仅通讯录应用可获取
  position: string;
  // 手机号码，第三方仅通讯录应用可获取
  mobile: string;
  // 性别。0表示未定义，1表示男性，2表示女性
  gender: "0" | "1" | "2";
  // 邮箱，第三方仅通讯录应用可获取
  email: string;
  // 表示在所在的部门内是否为上级。；第三方仅通讯录应用可获取
  is_leader_in_dept: number[];
  // 头像url。 第三方仅通讯录应用可获取
  avatar: string;
  // 头像缩略图url。第三方仅通讯录应用可获取
  thumb_avatar: string;
  // 座机。第三方仅通讯录应用可获取
  telephone: string;
  // 别名；第三方仅通讯录应用可获取
  alias: string;
  // 地址。第三方仅通讯录应用可获取
  address: string;
  // 全局唯一。对于同一个服务商，不同应用获取到企业内同一个成员的open_userid是相同的，最多64个字节。仅第三方应用可获取
  open_userid: string;
  // 主部门
  main_department: number;
  // 扩展属性，第三方仅通讯录应用可获取
  extattr: {
    attrs: Array<IAttr>;
  };
  //   激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业。
  // 已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。
  status: 1 | 2 | 4 | 5;
  // 员工个人二维码，扫描可添加为外部联系人(注意返回的是一个url，可在浏览器上打开该url以展示二维码)；第三方仅通讯录应用可获取
  qrcode: string;
  // 对外职务，如果设置了该值，则以此作为对外展示的职务，否则以position来展示。第三方仅通讯录应用可获取
  external_position: string;
  // 成员对外属性，字段详情见对外属性；第三方仅通讯录应用可获取
  external_profile: {
    // 企业对外简称，需从已认证的企业简称中选填。可在“我的企业”页中查看企业简称认证状态。
    external_corp_name: string;
    external_attr: Array<IAttr>;
  };
}

export interface IUserRet extends IUser, BaseRet {}
