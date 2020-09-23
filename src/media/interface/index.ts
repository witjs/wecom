import { BaseRet } from "src/common/interface";

export type IMediaType = "image" | "voice" | "video" | "file";
export interface IMediaRet extends BaseRet {
  type: IMediaType;
  media_id: string;
  create_at: string;
}
