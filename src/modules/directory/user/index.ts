import type {
  BaseRet,
  QrCodeSizeType,
  ZeroOrOne,
} from '../../../common/interface';
import type { WecomConfig } from '../../../wecom';
import { Wecom } from '../../../wecom';
import type {
  ConvertToOpenIdRet,
  GetActiveStatRet,
  GetJoinQrCodeRet,
  GetUseridByEmailDto,
  GetUseridByEmailRet,
  GetUseridByMobileRet,
  InviteRet,
  IUserCreateDto,
  IUserCreateRet,
  IUserInvite,
  IUserUpdateDto,
  ListUserIdDto,
  ListUserIdRet,
  UserListRet,
  UserRet,
  UserSampleListRet,
} from './interface';

export class User extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
  }

  /**
   * @description 创建成员
   */
  create(user: IUserCreateDto): Promise<IUserCreateRet> {
    return this.request<IUserCreateRet>({
      url: '/user/create',
      method: 'POST',
      data: user,
    });
  }

  /**
   * @description 读取成员
   */
  get(userid: string): Promise<UserRet> {
    return this.request<UserRet>({
      url: '/user/get',
      method: 'GET',
      params: { userid },
    });
  }

  /**
   * @description 更新成员
   */
  update(user: IUserUpdateDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/user/update',
      method: 'POST',
      data: user,
    });
  }

  /**
   * @description 删除成员
   */
  delete(userid: string): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/user/delete',
      method: 'GET',
      params: { userid },
    });
  }

  /**
   * @description 批量删除成员
   */
  batchDelete(useridlist: string[]): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/user/batchdelete',
      method: 'POST',
      data: { useridlist },
    });
  }

  /**
   * @description 获取部门成员
   */
  simpleList(
    department_id: number,
    fetch_child: ZeroOrOne = 0
  ): Promise<UserSampleListRet> {
    return this.request<UserSampleListRet>({
      url: '/user/simplelist',
      method: 'GET',
      params: {
        department_id,
        fetch_child,
      },
    });
  }

  /**
   * @description 获取部门成员详情
   */
  list(
    department_id: number,
    fetch_child: ZeroOrOne = 0,
    simple: ZeroOrOne = 0
  ): Promise<UserListRet | UserSampleListRet> {
    return this.request<UserListRet | UserSampleListRet>({
      url: simple === 0 ? '/user/list' : '/user/simplelist',
      method: 'GET',
      params: {
        department_id,
        fetch_child,
      },
    });
  }

  /**
   * @description userid与openid互换
   */
  convertToOpenid(userid: string): Promise<ConvertToOpenIdRet> {
    return this.request<ConvertToOpenIdRet>({
      url: '/user/convert_to_openid',
      method: 'POST',
      data: { userid },
    });
  }

  /**
   * @description 二次验证
   */
  authSucc(userid: string): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/user/authsucc',
      method: 'GET',
      params: { userid },
    });
  }

  /**
   * @description 邀请成员
   */
  invite(data: IUserInvite): Promise<InviteRet> {
    return this.request<InviteRet>({
      url: '/batch/invite',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 获取加入企业二维码
   */
  getJoinQrCode(size_type: QrCodeSizeType): Promise<GetJoinQrCodeRet> {
    return this.request<GetJoinQrCodeRet>({
      url: '/corp/get_join_qrcode',
      method: 'GET',
      params: { size_type },
    });
  }

  /**
   * @description 获取企业活跃成员数
   */
  getActiveStat(date: string): Promise<GetActiveStatRet> {
    return this.request<GetActiveStatRet>({
      url: '/user/get_active_stat',
      method: 'POST',
      data: { date },
    });
  }

  /**
   * @description 手机号获取 userid
   */
  getUseridByMobile(mobile: string): Promise<GetUseridByMobileRet> {
    return this.request<GetUseridByMobileRet>({
      url: '/user/getuserid',
      method: 'POST',
      data: { mobile },
    });
  }

  /**
   * @description 邮箱获取 userid
   */
  getUseridByEmail(data: GetUseridByEmailDto): Promise<GetUseridByEmailRet> {
    return this.request<GetUseridByEmailRet>({
      url: '/user/get_userid_by_email',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 获取成员 ID 列表
   */
  listId(data: ListUserIdDto = {}): Promise<ListUserIdRet> {
    return this.request<ListUserIdRet>({
      url: '/user/list_id',
      method: 'POST',
      data,
    });
  }
}

export type {
  ConvertToOpenIdRet,
  DeptUserItem,
  GetActiveStatRet,
  GetJoinQrCodeRet,
  GetUseridByEmailDto,
  GetUseridByEmailRet,
  GetUseridByMobileRet,
  IAttr,
  IAttrBase,
  IAttrMiniprogram,
  IAttrText,
  IAttrWeb,
  InviteRet,
  ISampleUser,
  IUser,
  IUserBase,
  CreatedDepartmentInfo,
  IUserCreateDto,
  IUserCreateRet,
  IUserInvite,
  IUserUpdateDto,
  ListUserIdDto,
  ListUserIdRet,
  UserListRet,
  UserRet,
  UserSampleListRet,
} from './interface';
