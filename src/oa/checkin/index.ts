import { Wecom, WecomConfig } from "../../wecom";
import { QueryCheckinData, QueryCheckinOption } from "./interface";

export class Checkin extends Wecom {
  constructor(config: Partial<WecomConfig>) {
    super(config);
  }

  getCheckinData(data: QueryCheckinData) {
    return this.request({
      url: "checkin/getcheckindata",
      method: "POST",
      data,
    });
  }

  getCheckinOption(data: QueryCheckinOption) {
    return this.request({
      url: "checkin/getcheckinoption",
      method: "POST",
      data,
    });
  }
}
