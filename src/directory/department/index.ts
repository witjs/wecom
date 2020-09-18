import { Wecom, WecomConfig } from "../../wecom";

export class Department extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  list(id?: number) {
    return this.request({
      url: "department/list",
      method: "GET",
      params: {
        id,
      },
    });
  }
}
