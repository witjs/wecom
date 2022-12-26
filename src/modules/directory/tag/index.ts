import { AxiosResponse } from "axios";
import { BaseRet } from "../../../common/interface";
import { Wecom, WecomConfig } from "../../../wecom";
import {
  TagUserRet,
  ITag,
  ITagCreateDto,
  ITagUserDto,
  TagCreateRet,
  TagListRet,
  TagUserListRet,
} from "./interface";

export class Tag extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  /**
   * @description 创建标签
   * @param {(ITagCreateDto | string)} tag
   * @return {*}  {Promise<AxiosResponse<TagCreateRet>>}
   * @memberof Tag
   */
  create(tag: ITagCreateDto | string): Promise<AxiosResponse<TagCreateRet>> {
    if (typeof tag === "string") {
      tag = {
        tagname: tag,
      };
    }
    return this.request<TagCreateRet>({
      url: "tag/create",
      method: "POST",
      data: tag,
    });
  }

  /**
   * @description 更新标签名字
   * @param {ITag} tag
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof Tag
   */
  update(tag: ITag): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "tag/update",
      method: "POST",
      data: tag,
    });
  }

  /**
   * @description 删除标签
   * @param {number} tagid
   * @return {*}  {Promise<AxiosResponse<BaseRet>>}
   * @memberof Tag
   */
  delete(tagid: number): Promise<AxiosResponse<BaseRet>> {
    return this.request<BaseRet>({
      url: "tag/delete",
      method: "GET",
      params: {
        tagid,
      },
    });
  }

  /**
   * @description 获取标签成员
   * @param {number} tagid
   * @return {*}  {Promise<AxiosResponse<TagUserListRet>>}
   * @memberof Tag
   */
  get(tagid: number): Promise<AxiosResponse<TagUserListRet>> {
    return this.request<TagUserListRet>({
      url: "tag/get",
      method: "GET",
      params: { tagid },
    });
  }

  /**
   * @description 增加标签成员
   * @param {ITagUserDto} data
   * @return {*}  {Promise<AxiosResponse<TagUserRet>>}
   * @memberof Tag
   */
  addTagUser(data: ITagUserDto): Promise<AxiosResponse<TagUserRet>> {
    return this.request<TagUserRet>({
      url: "tag/addtagusers",
      method: "POST",
      data,
    });
  }

  /**
   * @description 删除标签成员
   * @param {ITagUserDto} data
   * @return {*}  {Promise<AxiosResponse<TagUserRet>>}
   * @memberof Tag
   */
  delTagUser(data: ITagUserDto): Promise<AxiosResponse<TagUserRet>> {
    return this.request<TagUserRet>({
      url: "tag/deltagusers",
      method: "POST",
      data,
    });
  }

  /**
   * @description 获取标签列表
   * @return {*}  {Promise<AxiosResponse<TagListRet>>}
   * @memberof Tag
   */
  list(): Promise<AxiosResponse<TagListRet>> {
    return this.request<TagListRet>({
      url: "tag/list",
      method: "GET",
    });
  }
}
