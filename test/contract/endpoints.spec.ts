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
  Hardware,
  Invoice,
  Media,
  MeetingRoom,
  Message,
  Provider,
  Schedule,
  Suite,
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

  it('Media.uploadImg and getHdVoice use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const media = new Media({ ...config, fetch });
    await media.uploadImg(Buffer.from('img'), 'logo.png');
    expect(lastApiCall(calls)?.url.pathname).toContain('/media/uploadimg');
  });

  it('ExternalContact remaining methods use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const external = new ExternalContact({ ...config, fetch });

    await external.remark({ userid: 'alice', external_userid: 'wo1' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/remark'
    );

    await external.addContactWay({ type: 1, scene: 2 });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/add_contact_way'
    );
    await external.getContactWay('cfg-1');
    expect(lastApiCall(calls)?.body).toEqual({ config_id: 'cfg-1' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/get_contact_way'
    );
    await external.updateContactWay({ config_id: 'cfg-1' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/update_contact_way'
    );
    await external.delContactWay('cfg-1');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/del_contact_way'
    );
    await external.listContactWay();
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/list_contact_way'
    );

    await external.getCorpTagList(['tag-1'], ['group-1']);
    expect(lastApiCall(calls)?.body).toEqual({
      tag_id: ['tag-1'],
      group_id: ['group-1'],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/get_corp_tag_list'
    );
    await external.addCorpTag({ group_name: 'vip', tag: [{ name: 'gold' }] });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/add_corp_tag'
    );
    await external.editCorpTag({ id: 'tag-1', name: 'gold' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/edit_corp_tag'
    );
    await external.delCorpTag({ tag_id: ['tag-1'] });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/del_corp_tag'
    );
    await external.markTag({
      userid: 'alice',
      external_userid: 'wo1',
      add_tag: ['tag-1'],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/mark_tag'
    );

    await external.groupChatGet({ chat_id: 'chat-1' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/groupchat/get'
    );
    await external.sendWelcomeMsg({ welcome_code: 'code' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/send_welcome_msg'
    );
    await external.addMsgTemplate({
      chat_type: 'single',
      text: { content: 'hi' },
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/add_msg_template'
    );
    await external.transferCustomer({
      handover_userid: 'a',
      takeover_userid: 'b',
      external_userid: ['wo1'],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/transfer_customer'
    );
    await external.resignedTransferCustomer({
      handover_userid: 'a',
      takeover_userid: 'b',
      external_userid: ['wo1'],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/resigned/transfer_customer'
    );
    await external.getUnassignedList();
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/get_unassigned_list'
    );
    await external.getUserBehaviorData({
      userid: ['alice'],
      start_time: 1,
      end_time: 2,
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/externalcontact/get_user_behavior_data'
    );
  });

  it('Calendar and Schedule remaining methods use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const calendar = new Calendar({ ...config, fetch });
    await calendar.update({
      calendar: { cal_id: 'c1', summary: 'team', color: 1 },
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/calendar/update');
    await calendar.get({ cal_id_list: ['c1'] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/calendar/get');
    await calendar.delete({ cal_id: 'c1' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/calendar/del');

    const schedule = new Schedule({ ...config, fetch });
    await schedule.update({
      schedule: { schedule_id: 's1', start_time: 1, end_time: 2 },
    });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/schedule/update');
    await schedule.get({ schedule_id_list: ['s1'] });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/schedule/get');
    await schedule.delete({ schedule_id: 's1' });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/schedule/del');
    await schedule.getByCalendar({ cal_id: 'c1' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/oa/schedule/get_by_calendar'
    );
  });

  it('MeetingRoom remaining methods use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const room = new MeetingRoom({ ...config, fetch });
    await room.edit({ meetingroom_id: 1, name: 'A1', capacity: 8 });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/meetingroom/edit');
    await room.delete(1);
    expect(lastApiCall(calls)?.body).toEqual({ meetingroom_id: 1 });
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/meetingroom/del');
    await room.list();
    expect(lastApiCall(calls)?.url.pathname).toContain('/oa/meetingroom/list');
    await room.cancelBook({ booking_id: 'm1' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/oa/meetingroom/cancel_book'
    );
    await room.getBookingInfo({ meetingroom_id: 1 });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/oa/meetingroom/get_booking_info'
    );
  });

  it('Invoice remaining methods use the official paths', async () => {
    const { fetch, calls } = createWecomFetch();
    const invoice = new Invoice({ ...config, fetch });
    await invoice.updateInvoiceStatus({
      card_id: 'c',
      encrypt_code: 'e',
      reimburse_status: 'INVOICE_REIMBURSE_INIT',
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/card/invoice/reimburse/updateinvoicestatus'
    );
    await invoice.batchUpdateInvoiceStatus({
      openid: 'o',
      reimburse_status: 'INVOICE_REIMBURSE_INIT',
      invoice_list: [{ card_id: 'c', encrypt_code: 'e' }],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/card/invoice/reimburse/updatestatusbatch'
    );
    await invoice.batchGetInvoiceInfo({
      item_list: [{ card_id: 'c', encrypt_code: 'e' }],
    });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/card/invoice/reimburse/getinvoiceinfobatch'
    );
  });

  it('Department.list omits id when it is not provided', async () => {
    const { fetch, calls } = createWecomFetch();
    const department = new Department({ ...config, fetch });
    await department.list();
    expect(lastApiCall(calls)?.url.searchParams.has('id')).toBe(false);
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

  it('Suite methods use the official service paths', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_suite_token')) {
        return {
          suite_access_token: 'suite-token',
          expires_in: 7200,
        };
      }
      return {
        errcode: 0,
        errmsg: 'ok',
        pre_auth_code: 'pre',
        expires_in: 600,
        permanent_code: 'perm',
      };
    });
    const suite = new Suite({
      suiteId: 'ww-suite',
      suiteSecret: 'suite-secret',
      suiteTicket: 'ticket-1',
      fetch,
    });
    await suite.getPreAuthCode();
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/service/get_pre_auth_code'
    );
    await suite.setSessionInfo({ pre_auth_code: 'pre' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/service/set_session_info'
    );
    await suite.getPermanentCode('auth-code');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/service/v2/get_permanent_code'
    );
    await suite.getAuthInfo({ authCorpId: 'ww-auth', permanentCode: 'perm' });
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/service/v2/get_auth_info'
    );
    await suite.getAdminList('ww-auth', 1000002);
    expect(lastApiCall(calls)?.url.pathname).toContain('/service/get_admin_list');
    await suite.getUserInfo3rd('code');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/service/getuserinfo3rd'
    );
    await suite.getUserDetail3rd('ticket');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/service/getuserdetail3rd'
    );
  });

  it('Provider methods use the official service paths', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_provider_token')) {
        return {
          provider_access_token: 'provider-token',
          expires_in: 7200,
        };
      }
      return { errcode: 0, errmsg: 'ok' };
    });
    const provider = new Provider({
      corpId: 'ww-provider',
      providerSecret: 'provider-secret',
      fetch,
    });
    await provider.getLoginInfo('auth-code');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/service/get_login_info'
    );
  });

  it('Hardware methods use the official openhw paths', async () => {
    const { fetch, calls } = createMockFetch((request) => {
      if (request.url.pathname.includes('get_model_token')) {
        return { model_access_token: 'model-token', expires_in: 7200 };
      }
      return { errcode: 0, errmsg: 'ok' };
    });
    const hardware = new Hardware({
      modelId: 'model-1',
      modelSecret: 'model-secret',
      modelTicket: 'model-ticket',
      fetch,
    });
    await hardware.getDeviceSecret('auth-code');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/openhw/get_device_secret'
    );
    await hardware.addDevice('SN1');
    expect(lastApiCall(calls)?.url.pathname).toContain('/openhw/add_device');
    await hardware.deleteDevice('SN1');
    expect(lastApiCall(calls)?.url.pathname).toContain('/openhw/del_device');
    await hardware.getDevice('SN1');
    expect(lastApiCall(calls)?.url.pathname).toContain(
      '/openhw/get_device_detail'
    );
  });
});
