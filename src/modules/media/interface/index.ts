import type { BaseRet } from '../../../common/interface';

export type IMediaType = 'image' | 'voice' | 'video' | 'file';

export interface IMediaRet extends BaseRet {
  type: IMediaType;
  media_id: string;
  created_at: string;
}

export interface IMediaUploadImgRet extends BaseRet {
  url: string;
}

export interface IMediaFile {
  data: Buffer;
  contentType: string;
  filename?: string;
  contentRange?: string;
}
