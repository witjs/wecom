import type { BaseRet } from '../../common/interface';

export interface MeetingRoomInfo {
  meetingroom_id?: number;
  name: string;
  capacity: number;
  city?: string;
  building?: string;
  floor?: string;
  equipment?: number[];
  coordinate?: {
    latitude: string;
    longitude: string;
  };
  need_approval?: 0 | 1;
}

export interface AddMeetingRoomRet extends BaseRet {
  meetingroom_id: number;
}

export interface ListMeetingRoomDto {
  city?: string;
  building?: string;
  floor?: string;
  equipment?: number[];
}

export interface ListMeetingRoomRet extends BaseRet {
  meetingroom_list: MeetingRoomInfo[];
}

export interface BookMeetingRoomDto {
  meetingroom_id: number;
  start_time: number;
  end_time: number;
  booker: string;
  attendees?: string[];
  subject?: string;
}

export interface BookMeetingRoomRet extends BaseRet {
  booking_id: string;
  schedule_id?: string;
  conflict_list?: Array<{
    booking_id: string;
    schedule_id?: string;
  }>;
}

export interface CancelBookDto {
  booking_id: string;
  keep_schedule?: 0 | 1;
}

export interface GetBookingInfoDto {
  meetingroom_id?: number;
  start_time?: number;
  end_time?: number;
  city?: string;
  building?: string;
  floor?: string;
}

export interface BookingInfo {
  booking_id: string;
  schedule_id?: string;
  start_time: number;
  end_time: number;
  booker: string;
  subject?: string;
}

export interface GetBookingInfoRet extends BaseRet {
  booking_list: Array<{
    meetingroom_id: number;
    schedule?: BookingInfo[];
  }>;
}
