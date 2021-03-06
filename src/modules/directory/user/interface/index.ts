import { BaseRet } from "../../../../common/interface";

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

export interface IUserBase {
  // 成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节
  userid: string;
  // 成员名称，此字段从2019年12月30日起，对新创建第三方应用不再返回真实name，使用userid代替name，2020年6月30日起，对所有历史第三方应用不再返回真实name，使用userid代替name，后续第三方仅通讯录应用可获取，第三方页面需要通过通讯录展示组件来展示名字
  name?: string;
  // 别名；第三方仅通讯录应用可获取
  alias?: string;
  // 成员所属部门id列表，仅返回该应用有查看权限的部门id
  department?: number[];
  // 部门内的排序值，默认为0。数量必须和department一致，数值越大排序越前面。值范围是[0, 2^32)
  order?: number[];
  // 职务信息；第三方仅通讯录应用可获取
  position?: string;
  // 手机号码，第三方仅通讯录应用可获取 手机号码。企业内必须唯一，mobile/email二者不能同时为空
  mobile?: string;
  // 性别。0表示未定义，1表示男性，2表示女性
  gender?: "0" | "1" | "2";
  // 邮箱，第三方仅通讯录应用可获取
  email?: string;
  // 表示在所在的部门内是否为上级。；第三方仅通讯录应用可获取
  is_leader_in_dept?: number[];
  // 座机。第三方仅通讯录应用可获取
  telephone?: string;
  // 地址。第三方仅通讯录应用可获取 。长度最大128个字符
  address?: string;
  // 扩展属性，第三方仅通讯录应用可获取
  extattr?: {
    attrs: Array<IAttr>;
  };
  // 主部门
  main_department?: number;
  // 对外职务，如果设置了该值，则以此作为对外展示的职务，否则以position来展示。第三方仅通讯录应用可获取 长度12个汉字内
  external_position?: string;
  // 成员对外属性，字段详情见对外属性；第三方仅通讯录应用可获取
  external_profile?: {
    // 企业对外简称，需从已认证的企业简称中选填。可在“我的企业”页中查看企业简称认证状态。
    external_corp_name: string;
    external_attr: Array<IAttr>;
  };
}

export interface IUser extends IUserBase {
  // 头像url。 第三方仅通讯录应用可获取
  avatar?: string;
  // 头像缩略图url。第三方仅通讯录应用可获取
  thumb_avatar?: string;
  // 全局唯一。对于同一个服务商，不同应用获取到企业内同一个成员的open_userid是相同的，最多64个字节。仅第三方应用可获取
  open_userid: string;
  //   激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业。
  // 已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。
  status: 1 | 2 | 4 | 5;
  // 员工个人二维码，扫描可添加为外部联系人(注意返回的是一个url，可在浏览器上打开该url以展示二维码)；第三方仅通讯录应用可获取
  qrcode: string;
}

export interface IUserUpdateDto extends IUserBase {
  // 启用/禁用成员。1表示启用成员，0表示禁用成员
  enable?: 0 | 1;
  // 成员头像的mediaid，通过素材管理接口上传图片获得的mediaid
  avatar_mediaid?: string;
  // 是否邀请该成员使用企业微信（将通过微信服务通知或短信或邮件下发邀请，每天自动下发一次，最多持续3个工作日），默认值为true。
  to_invite?: boolean;
}

export interface IUserCreateDto extends IUserUpdateDto {
  // 成员所属部门id列表，仅返回该应用有查看权限的部门id
  department: number[];
  // 成员名称，此字段从2019年12月30日起，对新创建第三方应用不再返回真实name，使用userid代替name，2020年6月30日起，对所有历史第三方应用不再返回真实name，使用userid代替name，后续第三方仅通讯录应用可获取，第三方页面需要通过通讯录展示组件来展示名字
  name: string;
}

export interface UserRet extends IUser, BaseRet {}

export interface ISampleUser {
  // 成员UserID。对应管理端的帐号
  userid: string;
  // 成员名称，此字段从2019年12月30日起，对新创建第三方应用不再返回真实name，使用userid代替name，2020年6月30日起，对所有历史第三方应用不再返回真实name，使用userid代替name，后续第三方仅通讯录应用可获取，第三方页面需要通过通讯录展示组件来展示名字
  name: string;
  // 成员所属部门列表。列表项为部门ID，32位整型
  department: number[];
  // 全局唯一。对于同一个服务商，不同应用获取到企业内同一个成员的open_userid是相同的，最多64个字节。仅第三方应用可获取
  open_userid: string;
}

export interface UserSampleListRet extends BaseRet {
  // 成员列表
  userlist: ISampleUser[];
}

export interface UserListRet extends BaseRet {
  userlist: IUser[];
}

export interface ConvertToOpenIdRet extends BaseRet {
  openid: string;
}

export interface IUserInvite {
  // 成员ID列表, 最多支持1000个。
  user?: string[];
  // 部门ID列表，最多支持100个。
  party?: number[];
  // 标签ID列表，最多支持100个。
  tag?: number[];
}

export interface InviteRet extends BaseRet {
  invaliduser?: string[];
  invalidparty?: number[];
  invalidtag?: number[];
}

export interface GetJoinQrCodeRet extends BaseRet {
  join_qrcode: string;
}

export interface GetActiveStatRet extends BaseRet {
  active_cnt: number;
}
