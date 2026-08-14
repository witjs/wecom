import type { BaseRet } from '../../common/interface';
import type { WecomConfig } from '../../wecom';
import { Wecom } from '../../wecom';
import type {
  AddCalendarDto,
  AddCalendarRet,
  AddScheduleDto,
  AddScheduleRet,
  DelCalendarDto,
  DelScheduleDto,
  GetCalendarDto,
  GetCalendarRet,
  GetScheduleByCalendarDto,
  GetScheduleByCalendarRet,
  GetScheduleDto,
  GetScheduleRet,
  UpdateCalendarDto,
  UpdateScheduleDto,
} from './interface';

export class Calendar extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
  }

  add(data: AddCalendarDto): Promise<AddCalendarRet> {
    return this.request<AddCalendarRet>({
      url: '/oa/calendar/add',
      method: 'POST',
      data,
    });
  }

  update(data: UpdateCalendarDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/oa/calendar/update',
      method: 'POST',
      data,
    });
  }

  get(data: GetCalendarDto): Promise<GetCalendarRet> {
    return this.request<GetCalendarRet>({
      url: '/oa/calendar/get',
      method: 'POST',
      data,
    });
  }

  delete(data: DelCalendarDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/oa/calendar/del',
      method: 'POST',
      data,
    });
  }
}

export class Schedule extends Wecom {
  constructor(config: Partial<WecomConfig> = {}) {
    super(config);
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

export type * from './interface';
