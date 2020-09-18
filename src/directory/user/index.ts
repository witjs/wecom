import { Wecom, WecomConfig } from "../../wecom";

export class User extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  get(userid: string) {
    return this.request({
      url: "user/get",
      method: "GET",
      params: {
        userid,
      },
    });
  }
}
