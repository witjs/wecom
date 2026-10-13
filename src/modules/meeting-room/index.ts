import type { BaseRet } from '../../common/interface';
import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  AddMeetingRoomRet,
  BookMeetingRoomDto,
  BookMeetingRoomRet,
  CancelBookDto,
  GetBookingInfoDto,
  GetBookingInfoRet,
  ListMeetingRoomDto,
  ListMeetingRoomRet,
  MeetingRoomInfo,
} from './interface';

export class MeetingRoom extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  add(data: MeetingRoomInfo): Promise<AddMeetingRoomRet> {
    return this.request<AddMeetingRoomRet>({
      url: '/oa/meetingroom/add',
      method: 'POST',
      data,
    });
  }

  edit(data: MeetingRoomInfo & { meetingroom_id: number }): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/oa/meetingroom/edit',
      method: 'POST',
      data,
    });
  }

  delete(meetingroomId: number): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/oa/meetingroom/del',
      method: 'POST',
      data: { meetingroom_id: meetingroomId },
    });
  }

  list(data: ListMeetingRoomDto = {}): Promise<ListMeetingRoomRet> {
    return this.request<ListMeetingRoomRet>({
      url: '/oa/meetingroom/list',
      method: 'POST',
      data,
    });
  }

  book(data: BookMeetingRoomDto): Promise<BookMeetingRoomRet> {
    return this.request<BookMeetingRoomRet>({
      url: '/oa/meetingroom/book',
      method: 'POST',
      data,
    });
  }

  cancelBook(data: CancelBookDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/oa/meetingroom/cancel_book',
      method: 'POST',
      data,
    });
  }

  getBookingInfo(data: GetBookingInfoDto = {}): Promise<GetBookingInfoRet> {
    return this.request<GetBookingInfoRet>({
      url: '/oa/meetingroom/get_booking_info',
      method: 'POST',
      data,
    });
  }
}

export type * from './interface';
