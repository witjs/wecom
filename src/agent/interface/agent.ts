export enum ReportLocationFlag {
  // 不上报地理位置
  NO = 0,
  // 上报地址位置
  YES = 1,
}

export enum IsReportEnter {
  // 不上报用户进入应用事件
  NO = 0,
  // 上报用户进入应用事件
  YES = 1,
}

/**
 * @description 修改应用数据格式
 * @export
 * @interface ISetAgent
 */
export interface ISetAgent {
  // 企业应用是否打开地理位置上报 0：不上报；1：进入会话上报；
  report_location_flag?: ReportLocationFlag;
  // 企业应用头像的mediaid，通过素材管理接口上传图片获得mediaid，上传后会自动裁剪成方形和圆形两个头像
  logo_mediaid?: string;
  // 企业应用名称，长度不超过32个utf8字符
  name?: string;
  // 企业应用详情，长度为4至120个utf8字符
  description?: string;
  // 企业应用可信域名。注意：域名需通过所有权校验，否则jssdk功能将受限，此时返回错误码85005
  redirect_domain?: string;
  // 是否上报用户进入应用事件。0：不接收；1：接收。
  isreportenter?: number;
  // 应用主页url。url必须以http或者https开头（为了提高安全性，建议使用https）。
  home_url?: string;
}
