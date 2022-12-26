import { BaseRet } from "../../../../common/interface";

export interface QueryCheckinData {
  opencheckindatatype: 1 | 2 | 3;
  starttime: number;
  endtime: number;
  useridlist: string[];
}

export interface QueryCheckinOption {
  datetime: number;
  useridlist: string[];
}

export interface ICheckinData {
  // 用户id
  userid: string;
  // 打卡规则名称
  groupname: string;
  // 打卡类型。字符串，目前有：上班打卡，下班打卡，外出打卡
  checkin_type: string;
  // 异常类型，字符串，包括：时间异常，地点异常，未打卡，wifi异常，非常用设备。如果有多个异常，以分号间隔
  exception_type: string;
  // 打卡时间。Unix时间戳
  checkin_time: number;
  // 打卡地点title
  location_title: string;
  // 打卡地点详情
  location_detail: string;
  // 打卡wifi名称
  wifiname: string;
  // 打卡备注
  notes: string;
  // 打卡的MAC地址/bssid
  wifimac: string;
  // 打卡的附件media_id，可使用media/get获取附件
  mediaids: string[];
  // 位置打卡地点纬度，是实际纬度的1000000倍，与腾讯地图一致采用GCJ-02坐标系统标准
  lat?: number;
  // 位置打卡地点经度，是实际经度的1000000倍，与腾讯地图一致采用GCJ-02坐标系统标准
  lng?: number;
  // 打卡设备id
  deviceid?: string;
}
/**
 * @description 获取打卡信息的返回值
 * @export
 * @interface ICheckinDataRet
 * @extends {BaseRet}
 */
export interface ICheckinDataRet extends BaseRet {
  checkindata: ICheckinData[];
}

/**
 * @description 位置信息
 * @export
 * @interface ILocInfo
 */
export interface ILocInfo {
  // 位置打卡地点纬度，是实际纬度的1000000倍，与腾讯地图一致采用GCJ-02坐标系统标准
  lat: number;
  // 位置打卡地点经度，是实际经度的1000000倍，与腾讯地图一致采用GCJ-02坐标系统标准
  lng: number;
  // 位置打卡地点名称
  loc_title: string;
  // 位置打卡地点详情
  loc_detail: string;
  // 允许打卡范围（米）
  distance: number;
}

/**
 * @description wifi mac 信息
 * @export
 * @interface IWifiMacInfo
 */
export interface IWifiMacInfo {
  // WiFi打卡地点名称
  wifiname: string;
  // WiFi打卡地点MAC地址/bssid
  wifimac: string;
}

/**
 * @description 单词打卡信息
 * @export
 * @interface ICheckinTime
 */
export interface ICheckinTimeItem {
  // 上班时间，表示为距离当天0点的秒数。
  work_sec: number;
  // 下班时间，表示为距离当天0点的秒数。
  off_work_sec: number;
  // 上班提醒时间，表示为距离当天0点的秒数。
  remind_work_sec: number;
  // 下班提醒时间，表示为距离当天0点的秒数。
  remind_off_work_sec: number;
}

export interface ICheckinDateItem {
  // 工作日。若为固定时间上下班或自由上下班，则1到6分别表示星期一到星期六，0表示星期日；若为按班次上下班，则表示拉取班次的日期。
  workdays: number[];
  checkintime: ICheckinTimeItem[];
  // 弹性时间（毫秒）
  flex_time: number;
  // 下班不需要打卡
  noneed_offwork: boolean;
  // 打卡时间限制（毫秒）
  limit_aheadtime: number;
}

export interface IDaysItem {
  // 特殊日期具体时间
  timestamp: number;
  // 特殊日期备注
  notes: string;
  // 打卡信息
  checkintime: ICheckinTimeItem[];
}

export interface IRuleGroupItem {
  // 打卡规则类型。1：固定时间上下班；2：按班次上下班；3：自由上下班 。
  grouptype: 1 | 2 | 3;
  // 打卡规则id
  groupid: number;
  // 打卡时间
  checkindate: ICheckinDateItem[];
  // 特殊日期
  spe_workdays: IDaysItem[];
  // 放假日期？ 官方文档上没有写
  spe_offdays: IDaysItem[];
  // 是否同步法定节假日;
  sync_holidays: boolean;
  // 打卡规则名称
  groupname: string;
  // 是否打卡必须拍照
  need_photo: boolean;
  // WiFi打卡地点信息
  wifimac_infos: IWifiMacInfo[];
  // 是否备注时允许上传本地图片
  note_can_use_local_pic: boolean;
  // 是否非工作日允许打卡
  allow_checkin_offworkday: boolean;
  // 是否允许异常打卡时提交申请
  allow_apply_offworkday: boolean;
  // 位置打卡地点信息;
  loc_infos: ILocInfo[];
}
export interface ICheckinOptionInfoItem {
  userid: string;
  group: IRuleGroupItem;
}

export interface ICheckinOptionRet extends BaseRet {
  info: ICheckinOptionInfoItem[];
}
