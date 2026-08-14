import type { BaseRet } from '../../common/interface';

export interface CalendarSharer {
  userid: string;
}

export interface CalendarInfo {
  cal_id?: string;
  organizer?: string;
  summary: string;
  color: number;
  description?: string;
  shares?: CalendarSharer[];
  readonly?: 0 | 1;
  set_as_default?: 0 | 1;
  is_public?: 0 | 1;
  public_range?: {
    user_ids?: string[];
    party_ids?: number[];
  };
}

export interface AddCalendarDto {
  calendar: CalendarInfo;
  agentid?: number;
}

export interface AddCalendarRet extends BaseRet {
  cal_id: string;
}

export interface UpdateCalendarDto {
  calendar: CalendarInfo & { cal_id: string };
}

export interface GetCalendarDto {
  cal_id_list: string[];
}

export interface GetCalendarRet extends BaseRet {
  calendar_list: CalendarInfo[];
}

export interface DelCalendarDto {
  cal_id: string;
}
