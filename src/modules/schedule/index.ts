import type { BaseRet } from '../../common/interface';
import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  AddScheduleDto,
  AddScheduleRet,
  DelScheduleDto,
  GetScheduleByCalendarDto,
  GetScheduleByCalendarRet,
  GetScheduleDto,
  GetScheduleRet,
  UpdateScheduleDto,
} from './interface';

export class Schedule extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  add(data: AddScheduleDto): Promise<AddScheduleRet> {
    return this.request<AddScheduleRet>({
      url: '/oa/schedule/add',
      method: 'POST',
      data,
    });
  }

  update(data: UpdateScheduleDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/oa/schedule/update',
      method: 'POST',
      data,
    });
  }

  get(data: GetScheduleDto): Promise<GetScheduleRet> {
    return this.request<GetScheduleRet>({
      url: '/oa/schedule/get',
      method: 'POST',
      data,
    });
  }

  delete(data: DelScheduleDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/oa/schedule/del',
      method: 'POST',
      data,
    });
  }

  getByCalendar(
    data: GetScheduleByCalendarDto
  ): Promise<GetScheduleByCalendarRet> {
    return this.request<GetScheduleByCalendarRet>({
      url: '/oa/schedule/get_by_calendar',
      method: 'POST',
      data,
    });
  }
}

export type {
  AddScheduleDto,
  AddScheduleRet,
  DelScheduleDto,
  GetScheduleByCalendarDto,
  GetScheduleByCalendarRet,
  GetScheduleDto,
  GetScheduleRet,
  ScheduleAttendee,
  ScheduleInfo,
  ScheduleReminder,
  UpdateScheduleDto,
} from './interface';
