import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  IMediaFile,
  IMediaRet,
  IMediaType,
  IMediaUploadImgRet,
} from './interface';
import { toFormData, type MediaUploadSource } from './upload';

export class Media extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  /**
   * @description 上传临时素材
   */
  async upload(
    file: MediaUploadSource,
    type: IMediaType = 'file',
    filename?: string
  ): Promise<IMediaRet> {
    return this.request<IMediaRet>({
      url: '/media/upload',
      method: 'POST',
      params: { type },
      data: await toFormData(file, filename),
    });
  }

  /**
   * @description 上传图片，返回永久 URL
   */
  async uploadImg(
    file: MediaUploadSource,
    filename?: string
  ): Promise<IMediaUploadImgRet> {
    return this.request<IMediaUploadImgRet>({
      url: '/media/uploadimg',
      method: 'POST',
      data: await toFormData(file, filename),
    });
  }

  /**
   * @description 获取临时素材
   */
  get(mediaId: string, range?: string): Promise<IMediaFile> {
    return this.request<IMediaFile>({
      url: '/media/get',
      method: 'GET',
      params: { media_id: mediaId },
      headers: range ? { Range: range } : undefined,
      responseType: 'arrayBuffer',
    });
  }

  /**
   * @description 获取高清语音素材
   */
  getHdVoice(mediaId: string): Promise<IMediaFile> {
    return this.request<IMediaFile>({
      url: '/media/get/jssdk',
      method: 'GET',
      params: { media_id: mediaId },
      responseType: 'arrayBuffer',
    });
  }
}

export type { MediaUploadSource } from './upload';
export type {
  IMediaFile,
  IMediaRet,
  IMediaType,
  IMediaUploadImgRet,
} from './interface';
