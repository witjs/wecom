import type { BaseRet } from '../../common/interface';

export interface ScheduleAttendee {
  userid: string;
  response_status?: number;
}

export interface ScheduleReminder {
  is_remind?: 0 | 1;
  remind_before_event_secs?: number[];
  is_repeat?: 0 | 1;
  repeat_type?: number;
  repeat_until?: number;
  is_custom_repeat?: 0 | 1;
  repeat_interval?: number;
  repeat_day_of_week?: number[];
  repeat_day_of_month?: number[];
  timezone?: number;
}

export interface ScheduleInfo {
  schedule_id?: string;
  organizer?: string;
  start_time: number;
  end_time: number;
  attendees?: ScheduleAttendee[];
  summary?: string;
  description?: string;
  reminders?: ScheduleReminder;
  location?: string;
  cal_id?: string;
  status?: number;
}

export interface AddScheduleDto {
  schedule: ScheduleInfo;
  agentid?: number;
}

export interface AddScheduleRet extends BaseRet {
  schedule_id: string;
}

export interface UpdateScheduleDto {
  schedule: ScheduleInfo & { schedule_id: string };
}

export interface GetScheduleDto {
  schedule_id_list: string[];
}

export interface GetScheduleRet extends BaseRet {
  schedule_list: ScheduleInfo[];
}

export interface DelScheduleDto {
  schedule_id: string;
}

export interface GetScheduleByCalendarDto {
  cal_id: string;
  offset?: number;
  limit?: number;
}

export interface GetScheduleByCalendarRet extends BaseRet {
  schedule_list: ScheduleInfo[];
}
