import type { BaseRet } from '../../common/interface';

export interface IAttrBase {
  // 属性类型: 0-文本 1-网页 2-小程序
  type: 0 | 1 | 2;
  // 属性名称： 需要先确保在管理端有创建该属性，否则会忽略
  name: string;
}
export interface IAttrText extends IAttrBase {
  type: 0;
  text: {
    value: string;
  };
}
export interface IAttrWeb extends IAttrBase {
  type: 1;
  web: {
    url: string;
    title: string;
  };
}
export interface IAttrMiniprogram extends IAttrBase {
  type: 2;
  miniprogram: {
    appid: string;
    pagepath: string;
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
  // 手机号码。企业内必须唯一，mobile/email二者不能同时为空
  mobile?: string;
  // 性别。0表示未定义，1表示男性，2表示女性
  gender?: '0' | '1' | '2';
  // 邮箱
  email?: string;
  // 企业邮箱
  biz_mail?: string;
  // 表示在所在的部门内是否为部门负责人。数量必须和 department 一致
  is_leader_in_dept?: number[];
  // 直属上级 UserID，最多 1 个
  direct_leader?: string[];
  // 座机
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
  // 视频号名字，须从企业已绑定的视频号中选择
  nickname?: string;
  external_profile?: {
    external_corp_name?: string;
    wechat_channels?: {
      nickname?: string;
      status?: number;
    };
    external_attr?: Array<IAttr>;
  };
}

export interface IUser extends IUserBase {
  // 头像url。 第三方仅通讯录应用可获取
  avatar?: string;
  // 头像缩略图url。第三方仅通讯录应用可获取
  thumb_avatar?: string;
  // 全局唯一。对于同一个服务商，不同应用获取到企业内同一个成员的open_userid是相同的，最多64个字节。仅第三方应用可获取
  open_userid?: string;
  //   激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业。
  // 已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。
  status?: 1 | 2 | 4 | 5;
  // 员工个人二维码 URL
  qr_code?: string;
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
  name: string;
}

export interface CreatedDepartmentInfo {
  name: string;
  id: number;
}

export interface IUserCreateRet extends BaseRet {
  created_department_list?: {
    department_info: CreatedDepartmentInfo[];
  };
}

export interface UserRet extends IUser, BaseRet {}

export interface ISampleUser {
  // 成员UserID。对应管理端的帐号
  userid: string;
  // 成员名称，此字段从2019年12月30日起，对新创建第三方应用不再返回真实name，使用userid代替name，2020年6月30日起，对所有历史第三方应用不再返回真实name，使用userid代替name，后续第三方仅通讯录应用可获取，第三方页面需要通过通讯录展示组件来展示名字
  name: string;
  // 成员所属部门列表。列表项为部门ID，32位整型
  department: number[];
  open_userid?: string;
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

export interface GetUseridByMobileRet extends BaseRet {
  userid: string;
}

export interface GetUseridByEmailDto {
  email: string;
  email_type?: 1 | 2;
}

export interface GetUseridByEmailRet extends BaseRet {
  userid: string;
}

export interface ListUserIdDto {
  cursor?: string;
  limit?: number;
}

export interface DeptUserItem {
  userid: string;
  department: number;
}

export interface ListUserIdRet extends BaseRet {
  next_cursor?: string;
  dept_user: DeptUserItem[];
}
