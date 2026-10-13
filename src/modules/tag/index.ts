import type { BaseRet } from '../../common/interface';
import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  ITag,
  ITagCreateDto,
  ITagUserDto,
  TagCreateRet,
  TagListRet,
  TagUserListRet,
  TagUserRet,
} from './interface';

export class Tag extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  /**
   * @description 创建标签
   */
  create(tag: ITagCreateDto | string): Promise<TagCreateRet> {
    const data: ITagCreateDto =
      typeof tag === 'string' ? { tagname: tag } : tag;
    return this.request<TagCreateRet>({
      url: '/tag/create',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 更新标签名字
   */
  update(tag: ITag): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/tag/update',
      method: 'POST',
      data: tag,
    });
  }

  /**
   * @description 删除标签
   */
  delete(tagid: number): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/tag/delete',
      method: 'GET',
      params: { tagid },
    });
  }

  /**
   * @description 获取标签成员
   */
  get(tagid: number): Promise<TagUserListRet> {
    return this.request<TagUserListRet>({
      url: '/tag/get',
      method: 'GET',
      params: { tagid },
    });
  }

  /**
   * @description 增加标签成员
   */
  addTagUser(data: ITagUserDto): Promise<TagUserRet> {
    return this.request<TagUserRet>({
      url: '/tag/addtagusers',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 删除标签成员
   */
  delTagUser(data: ITagUserDto): Promise<TagUserRet> {
    return this.request<TagUserRet>({
      url: '/tag/deltagusers',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 获取标签列表
   */
  list(): Promise<TagListRet> {
    return this.request<TagListRet>({
      url: '/tag/list',
      method: 'GET',
    });
  }
}

export type {
  ITag,
  ITagCreateDto,
  ITagUserDto,
  TagCreateRet,
  TagListRet,
  TagUserItem,
  TagUserListRet,
  TagUserRet,
} from './interface';
