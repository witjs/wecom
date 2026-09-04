import type { BaseRet } from '../../common/interface';
import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  AddCalendarDto,
  AddCalendarRet,
  DelCalendarDto,
  GetCalendarDto,
  GetCalendarRet,
  UpdateCalendarDto,
} from './interface';

export class Calendar extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
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

export type {
  AddCalendarDto,
  AddCalendarRet,
  CalendarInfo,
  CalendarSharer,
  DelCalendarDto,
  GetCalendarDto,
  GetCalendarRet,
  UpdateCalendarDto,
} from './interface';
