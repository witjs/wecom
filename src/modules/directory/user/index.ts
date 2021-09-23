import { AxiosResponse } from "axios";
import { BaseRet, ZeroOrOne } from "../../../common/interface";
import { QrCodeSizeType } from "../../../common/interface";
import { Wecom, WecomConfig } from "../../../wecom";
import {
  IUserCreateDto,
  UserRet,
  IUserUpdateDto,
  UserSampleListRet,
  UserListRet,
  ConvertToOpenIdRet,
  IUserInvite,
  InviteRet,
  GetJoinQrCodeRet,
  GetActiveStatRet,
} from "./interface";

export class User extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  /**
   * @description 创建成员
   * @param {IUserCreateDto} user
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof User
   */
  create(user: IUserCreateDto): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "user/create",
      method: "POST",
      data: user,
    });
  }

  /**
   * @description 读取成员
   * @param {string} userid
   * @return {*}  {Promise<AxiosResponse<UserRet>>}
   * @memberof User
   */
  get(userid: string): Promise<AxiosResponse<UserRet>> {
    return this.request<UserRet>({
      url: "user/get",
      method: "GET",
      params: {
        userid,
      },
    });
  }

  /**
   * @description 更新成员
   * @param {IUserUpdateDto} user
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof User
   */
  update(user: IUserUpdateDto): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "user/update",
      method: "POST",
      data: user,
    });
  }

  /**
   * @description 删除成员
   * @param {string} userid 成员UserID。对应管理端的帐号
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof User
   */
  delete(userid: string): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "user/delete",
      method: "GET",
      params: {
        userid,
      },
    });
  }

  /**
   * @description 批量删除成员
   * @param {string[]} useridlist
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof User
   */
  batchDelete(useridlist: string[]): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "user/batchdelete",
      method: "POST",
      data: {
        useridlist,
      },
    });
  }

  /**
   * @description 获取部门成员
   * @param {number} department_id 获取的部门id
   * @param {ZeroOrOne} [fetch_child=0] 是否递归获取子部门下面的成员：1-递归获取，0-只获取本部门
   * @return {*}  {Promise<AxiosResponse<UserSampleListRet>>}
   * @memberof User
   */
  simpleList(
    department_id: number,
    fetch_child: ZeroOrOne = 0
  ): Promise<AxiosResponse<UserSampleListRet>> {
    return this.request<UserSampleListRet>({
      url: "user/simplelist",
      method: "GET",
      params: {
        department_id,
        fetch_child,
      },
    });
  }

  /**
   * @description 获取部门成员详情？
   * @template T
   * @param {number} department_id 部门ID
   * @param {ZeroOrOne} [fetch_child=0] 是否递归获取子部门下面的成员：1-递归获取，0-只获取本部门
   * @param {ZeroOrOne} [simple=0] 是否只是要获取详情 默认需要 不需要的情况下 和simpleList方法一致
   * @return {*}  {Promise<AxiosResponse<T>>}
   * @memberof User
   */
  list<T = UserListRet>(
    department_id: number,
    fetch_child: ZeroOrOne = 0,
    simple: ZeroOrOne = 0
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      url: `user/${simple === 0 ? "" : "simple"}list`,
      method: "GET",
      params: {
        department_id,
        fetch_child,
      },
    });
  }

  /**
   * @description userid与openid互换
   * @param {string} userid  企业内的成员id
   * @return {*}  {Promise<AxiosResponse<ConvertToOpenIdRet>>}
   * @memberof User
   */
  convertToOpenid(userid: string): Promise<AxiosResponse<ConvertToOpenIdRet>> {
    return this.request<ConvertToOpenIdRet>({
      url: "user/convert_to_openid",
      method: "POST",
      data: {
        userid,
      },
    });
  }

  /**
   * @description 二次验证
   * @param {string} userid
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof User
   */
  authSucc(userid: string): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "user/authsucc",
      method: "GET",
      params: {
        userid,
      },
    });
  }

  /**
   * @description 邀请成员
   * @param {IUserInvite} data
   * @return {*}  {Promise<AxiosResponse<InviteRet>>}
   * @memberof User
   */
  invite(data: IUserInvite): Promise<AxiosResponse<InviteRet>> {
    return this.request<InviteRet>({
      url: "batch/invite",
      method: "POST",
      data,
    });
  }

  /**
   * @description 获取加入企业二维码
   * @param {QrCodeSizeType} size_type qrcode尺寸类型，1: 171 x 171; 2: 399 x 399; 3: 741 x 741; 4: 2052 x 2052
   * @return {*}  {Promise<AxiosResponse<GetJoinQrCodeRet>>}
   * @memberof User
   */
  getJoinQrCode(
    size_type: QrCodeSizeType
  ): Promise<AxiosResponse<GetJoinQrCodeRet>> {
    return this.request<GetJoinQrCodeRet>({
      url: "corp/get_join_qrcode",
      method: "GET",
      params: {
        size_type,
      },
    });
  }

  /**
   * @description 获取企业活跃成员数
   * @param {string} date 具体某天的活跃人数，最长支持获取30天前数据
   * @return {*}  {Promise<AxiosResponse<GetActiveStatRet>>}
   * @memberof User
   */
  getActiveStat(date: string): Promise<AxiosResponse<GetActiveStatRet>> {
    return this.request<GetActiveStatRet>({
      url: "user/get_active_stat",
      method: "POST",
      data: {
        date,
      },
    });
  }
}
