import { Wecom, WecomConfig } from "../wecom";
import { IMediaRet, IMediaType } from "./interface";
import FormData from "form-data";
import { AxiosResponse } from "axios";
import { ReadStream } from "fs";

interface Boundary {
  _boundary?: string;
}

/**
 * @description 企业微信素材管理
 * @export
 * @class Media
 * @extends {Wecom}
 */
export class Media extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }
  /**
   * @description 上传文件到企业微信
   * @template T
   * @template R
   * @param {(Buffer | ReadStream)} file
   * @param {IMediaType} [type="file"]
   * @return {*}  {Promise<R>}
   * @memberof Media
   */
  upload(
    file: Buffer | ReadStream,
    type: IMediaType = "file"
  ): Promise<AxiosResponse<IMediaRet>> {
    const form: FormData & Boundary = new FormData();
    form.append("media", file);
    return this.request<IMediaRet>({
      url: "media/upload",
      method: "POST",
      params: {
        type,
      },
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      },
      data: form,
    });
  }
}
