import { afterEach, describe, expect, it } from 'vitest';
import {
  Agent,
  AgentMenu,
  AppChat,
  Approval,
  Batch,
  Calendar,
  Checkin,
  Department,
  Dial,
  ExternalContact,
  Invoice,
  Media,
  MeetingRoom,
  Message,
  Schedule,
  Tag,
  User,
} from '../../src';
import {
  createMockFetch,
  createWecomFetch,
  resetSdkState,
} from '../helpers/mock-fetch';

const config = {
  corpId: 'ww-corp',
  corpSecret: 'secret',
};

afterEach(() => {
  resetSdkState();
});

function lastApiCall(
  calls: { url: URL; method: string; body: unknown; headers: Headers }[]
) {
  return calls.filter((call) => !call.url.pathname.includes('gettoken')).at(-1);
}

describe('module endpoint contracts', () => {
  it('User methods use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const user = new User({ ...config, fetch });
    await user.create({ userid: 'a', name: 'A', department: [1] });
    expect(lastApiCall(calls)).toMatchObject({
      method: 'POST',
      body: { userid: 'a', name: 'A', department: [1] },
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/create');

    await user.get('a');
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/get');
    expect(lastApiCall(calls)?.url.searchParams.get('userid')).toBe('a');

    await user.update({ userid: 'a' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/update');

    await user.delete('a');
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/delete');

    await user.batchDelete(['a', 'b']);
    expect(lastApiCall(calls)?.body).toEqual({ useridlist: ['a', 'b'] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/batchdelete');

    await user.simpleList(1, 1);
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/simplelist');

    await user.list(1, 0, 0);
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/list');

    await user.list(1, 0, 1);
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/simplelist');

    await user.convertToOpenid('a');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/user/convert_to_openid'
    );

    await user.authSucc('a');
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/authsucc');

    await user.invite({ user: ['a'] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/batch/invite');

    await user.getJoinQrCode(1);
    expect(lastApiCall(calls)?.url.pathname).toContain('/corp/get_join_qrcode');

    await user.getActiveStat('2026-08-14');
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/get_active_stat');

    await user.getUseridByMobile('13800000000');
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/getuserid');
    await user.getUseridByEmail({ email: 'a@example.com' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/user/get_userid_by_email'
    );
    await user.listId({ limit: 100 });
    expect(lastApiCall(calls)?.url.pathname).toContain('/user/list_id');
  });

  it('Department methods use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const department = new Department({ ...config, fetch });
    await department.create({ name: 'RD', parentid: 1 });
    expect(lastApiCall(calls)?.url.pathname).toContain('/department/create');
    await department.update({ id: 2, name: 'RD2' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/department/update');
    await department.delete(2);
    expect(lastApiCall(calls)?.url.pathname).toContain('/department/delete');
    await department.list(1);
    expect(lastApiCall(calls)?.url.pathname).toContain('/department/list');
    expect(lastApiCall(calls)?.url.searchParams.get('id')).toBe('1');
    await department.simpleList(1);
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/department/simplelist'
    );
    await department.get(1);
    expect(lastApiCall(calls)?.url.pathname).toContain('/department/get');
  });

  it('Tag methods use the official paths and string create overload', async () => {
    const { fetch, calls } = createWecomFetch();
    const tag = new Tag({ ...config, fetch });
    await tag.create('vip');
    expect(lastApiCall(calls)?.body).toEqual({ tagname: 'vip' });
    await tag.create({ tagname: 'vip', tagid: 8 });
    expect(lastApiCall(calls)?.url.pathname).toContain('/tag/create');
    await tag.update({ tagid: 8, tagname: 'vip2' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/tag/update');
    await tag.delete(8);
    expect(lastApiCall(calls)?.url.pathname).toContain('/tag/delete');
    await tag.get(8);
    expect(lastApiCall(calls)?.url.pathname).toContain('/tag/get');
    await tag.addTagUser({ tagid: 8, userlist: ['a'] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/tag/addtagusers');
    await tag.delTagUser({ tagid: 8, userlist: ['a'] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/tag/deltagusers');
    await tag.list();
    expect(lastApiCall(calls)?.url.pathname).toContain('/tag/list');
  });

  it('Agent and AgentMenu keep agentid out of caller payloads', async () => {
    const { fetch, calls } = createWecomFetch();
    const payload = { name: 'TEST' };
    const agent = new Agent({ ...config, agentId: 1000002, fetch });
    await agent.get();
    expect(lastApiCall(calls)?.url.pathname).toContain('/agent/get');
    expect(lastApiCall(calls)?.url.searchParams.get('agentid')).toBe('1000002');
    await agent.list();
    expect(lastApiCall(calls)?.url.pathname).toContain('/agent/list');
    await agent.set(payload);
    expect(payload).toEqual({ name: 'TEST' });
    expect(lastApiCall(calls)?.body).toEqual({
      name: 'TEST',
      agentid: 1000002,
    });

    const menu = new AgentMenu({ ...config, agentId: 1000002, fetch });
    await menu.create({ button: [{ name: 'home' }] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/menu/create');
    await menu.get();
    expect(lastApiCall(calls)?.url.pathname).toContain('/menu/get');
    await menu.delete();
    expect(lastApiCall(calls)?.url.pathname).toContain('/menu/delete');
  });

  it('Message.send does not mutate the input object', async () => {
    const { fetch, calls } = createWecomFetch();
    const message = new Message({ ...config, fetch });
    const payload = {
      touser: 'alice',
      msgtype: 'text' as const,
      text: { content: 'hi' },
    };
    await message.send(payload, 1000002);
    expect(payload).not.toHaveProperty('agentid');
    expect(lastApiCall(calls)?.body).toMatchObject({
      touser: 'alice',
      agentid: 1000002,
      msgtype: 'text',
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/message/send');
  });

  it('Checkin methods use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const checkin = new Checkin({ ...config, fetch });
    await checkin.getCheckinData({
      opencheckindatatype: 3,
      starttime: 1,
      endtime: 2,
      useridlist: ['a'],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/checkin/getcheckindata'
    );
    await checkin.getCheckinOption({ datetime: 1, useridlist: ['a'] });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/checkin/getcheckinoption'
    );
  });

  it('Media.upload sends multipart form data', async () => {
    const { fetch, calls } = createWecomFetch();
    const media = new Media({ ...config, fetch });
    await media.upload(Buffer.from('hello'), 'file', 'hello.txt');
    const call = lastApiCall(calls);
    expect(call?.url.pathname).toContain('/media/upload');
    expect(call?.url.searchParams.get('type')).toBe('file');
    expect(call?.body).toBeInstanceOf(FormData);
    expect(call?.headers.get('content-type') ?? '').not.toContain(
      'boundary=undefined'
    );
  });

  it('covers remaining official module paths', async () => {
    const { fetch, calls } = createWecomFetch();

    const batch = new Batch({ ...config, fetch });
    await batch.syncUser({ media_id: 'm' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/batch/syncuser');
    await batch.replaceUser({ media_id: 'm' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/batch/replaceuser');
    await batch.replaceParty({ media_id: 'm' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/batch/replaceparty');
    await batch.getResult('job-1');
    expect(lastApiCall(calls)?.url.pathname).toContain('/batch/getresult');

    const message = new Message({ ...config, fetch });
    await message.recall({ msgid: 'mid' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/message/recall');
    await message.updateTemplateCard({
      agentid: 1,
      response_code: 'code',
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/message/update_template_card'
    );
    await message.getStatistics({ time_type: 0 });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/message/get_statistics'
    );

    const chat = new AppChat({ ...config, fetch });
    await chat.create({ userlist: ['a', 'b'] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/appchat/create');
    await chat.update({ chatid: 'c1' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/appchat/update');
    await chat.get('c1');
    expect(lastApiCall(calls)?.url.pathname).toContain('/appchat/get');
    await chat.send({
      chatid: 'c1',
      msgtype: 'text',
      text: { content: 'hi' },
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/appchat/send');

    const agent = new Agent({ ...config, agentId: 1000002, fetch });
    await agent.setWorkbenchTemplate({ type: 'normal' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/agent/set_workbench_template'
    );
    await agent.getWorkbenchTemplate();
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/agent/get_workbench_template'
    );
    await agent.setWorkbenchData({ type: 'normal', userid: 'a' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/agent/set_workbench_data'
    );

    const approval = new Approval({ ...config, fetch });
    await approval.getTemplateDetail({ template_id: 't' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/gettemplatedetail');
    await approval.applyEvent({
      creator_userid: 'a',
      template_id: 't',
      use_template_approver: 1,
      apply_data: { contents: [] },
      summary_list: [],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/applyevent');
    await approval.getApprovalInfo({
      starttime: 1,
      endtime: 2,
      cursor: 0,
      size: 100,
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/getapprovalinfo');
    await approval.getApprovalDetail({ sp_no: '20200101' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/getapprovaldetail');

    const dial = new Dial({ ...config, fetch });
    await dial.getDialRecord({ start_time: 1, end_time: 2 });
    expect(lastApiCall(calls)?.url.pathname).toContain('/dial/get_dial_record');

    const external = new ExternalContact({ ...config, fetch });
    await external.getFollowUserList();
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/get_follow_user_list'
    );
    await external.list('alice');
    expect(lastApiCall(calls)?.url.pathname).toContain('/externalcontact/list');
    await external.get('wo1');
    expect(lastApiCall(calls)?.url.pathname).toContain('/externalcontact/get');
    await external.batchGetByUser({ userid_list: ['alice'] });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/batch/get_by_user'
    );
    await external.groupChatList({ limit: 10 });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/groupchat/list'
    );

    const calendar = new Calendar({ ...config, fetch });
    await calendar.add({
      calendar: { summary: 'team', color: 1 },
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/calendar/add');
    const schedule = new Schedule({ ...config, fetch });
    await schedule.add({
      schedule: { start_time: 1, end_time: 2 },
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/schedule/add');

    const room = new MeetingRoom({ ...config, fetch });
    await room.add({ name: 'A1', capacity: 8 });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/meetingroom/add');
    await room.book({
      meetingroom_id: 1,
      start_time: 1,
      end_time: 2,
      booker: 'alice',
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/meetingroom/book');

    const invoice = new Invoice({ ...config, fetch });
    await invoice.getInvoiceInfo({ card_id: 'c', encrypt_code: 'e' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/card/invoice/reimburse/getinvoiceinfo'
    );
  });

  it('Media.get returns binary content', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('gettoken')) {
        return {
          errcode: 0,
          errmsg: 'ok',
          access_token: 'token-1',
          expires_in: 7200,
        };
      }
      return new Response(Buffer.from('image-bytes'), {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': 'attachment; filename="logo.jpg"',
        },
      });
    });
    const media = new Media({ ...config, fetch });
    const file = await media.get('media-1');
    expect(file.contentType).toBe('image/jpeg');
    expect(file.filename).toBe('logo.jpg');
    expect(file.data.toString()).toBe('image-bytes');
    expect(lastApiCall(calls)?.url.pathname).toContain('/media/get');
  });
});
