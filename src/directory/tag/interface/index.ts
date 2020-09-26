import { BaseRet } from "../../../common/interface";

export interface ITag {
  // 标签名称，长度限制为32个字以内（汉字或英文字母），标签名不可与其他标签重名。
  tagname: string;
  // 标签id，非负整型，指定此参数时新增的标签会生成对应的标签id，不指定时则以目前最大的id自增。
  tagid: number;
}

export interface ITagCreateDto extends Partial<ITag> {
  // 标签名称，长度限制为32个字以内（汉字或英文字母），标签名不可与其他标签重名。
  tagname: string;
}

export interface ITagUserDto {
  // 标签id，非负整型，指定此参数时新增的标签会生成对应的标签id，不指定时则以目前最大的id自增。
  tagid: number;
  // 企业成员ID列表，注意：userlist、partylist不能同时为空，单次请求个数不超过1000
  userlist?: string[];
  // 企业部门ID列表，注意：userlist、partylist不能同时为空，单次请求个数不超过100
  partylist?: number[];
}

export interface TagCreateRet extends BaseRet {
  tagid: number;
}

export interface TagUserItem {
  // 成员帐号
  userid: string;
  // 成员名称，此字段从2019年12月30日起，对新创建第三方应用不再返回，2020年6月30日起，对所有历史第三方应用不再返回，后续第三方仅通讯录应用可获取，第三方页面需要通过通讯录展示组件来展示名字
  name: string;
}
export interface TagUserListRet extends BaseRet {
  // 标签名
  tagname: string;
  // 标签中包含的成员列表
  userlist?: TagUserItem[];
  // 标签中包含的部门id列表
  partylist?: number[];
}

export interface TagListRet extends BaseRet {
  taglist: ITag[];
}

export interface TagUserRet extends BaseRet {
  invalidlist?: string;
  invalidparty?: number[];
}
