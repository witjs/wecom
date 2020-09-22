import { AxiosResponse } from "axios";
import { Wecom, WecomConfig } from "../../wecom";
import { IUserRet } from "./interface";

export class User extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  get(userid: string): Promise<AxiosResponse<IUserRet>> {
    return this.request<IUserRet>({
      url: "user/get",
      method: "GET",
      params: {
        userid,
      },
    });
  }
}
