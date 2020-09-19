export enum CheckinDataType {
  DAILY = 1,
  OUTING = 2,
  ALL = 3,
}

export interface QueryCheckinData {
  opencheckindatatype: CheckinDataType;
  starttime: number;
  endtime: number;
  useridlist: string[];
}

export interface QueryCheckinOption {
  datetime: number;
  useridlist: string[];
}
