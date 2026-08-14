import { describe, expect, it } from 'vitest';
import {
  Agent,
  AgentMenu,
  Approval,
  Calendar,
  Checkin,
  Department,
  Dial,
  ExternalContact,
  Media,
  MeetingRoom,
  Message,
  Tag,
  User,
  Wecom,
} from '../../src';
import {
  appAgentConfig,
  appConfig,
  checkinConfig,
  directoryConfig,
  expectOk,
  expectOkOrUnavailable,
  hasAppSecret,
  hasCheckinSecret,
  hasDirectorySecret,
  integrationEnabled,
  unixDaysAgo,
} from './setup';

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

describe.skipIf(!integrationEnabled())('live WeCom APIs', () => {
  describe('token', () => {
    it.skipIf(!hasAppSecret())('fetches an access token', async () => {
      const wecom = new Wecom(appConfig());
      await expect(wecom.getToken()).resolves.toEqual(expect.any(String));
    });
  });

  describe('directory', () => {
    it.skipIf(!hasDirectorySecret())(
      'lists users and reads one member',
      async () => {
        const user = new User(directoryConfig());
        const simple = await expectOkOrUnavailable(() => user.simpleList(1));
        if (!simple) {
          return;
        }
        expect(simple.userlist).toBeInstanceOf(Array);

        const detailed = await expectOkOrUnavailable(() => user.list(1));
        if (detailed) {
          expect(detailed.userlist).toBeInstanceOf(Array);
        }

        const ids = await expectOkOrUnavailable(() =>
          user.listId({ limit: 10 })
        );
        if (ids) {
          expect(ids.dept_user).toBeInstanceOf(Array);
        }

        const qr = await expectOkOrUnavailable(() => user.getJoinQrCode(1));
        if (qr) {
          expect(qr.join_qrcode).toEqual(expect.any(String));
        }

        const userid =
          process.env.TEST_USERID ||
          simple.userlist[0]?.userid ||
          ids?.dept_user[0]?.userid;
        if (userid) {
          const detail = await expectOkOrUnavailable(() => user.get(userid));
          if (detail) {
            expect(detail.userid).toBe(userid);
          }
        }
      }
    );

    it.skipIf(!hasDirectorySecret())(
      'lists departments and reads one',
      async () => {
        const department = new Department(directoryConfig());
        const list = await expectOkOrUnavailable(() => department.list());
        if (!list?.department[0]) {
          return;
        }
        expect(list.department.length).toBeGreaterThan(0);

        const simple = await expectOkOrUnavailable(() =>
          department.simpleList()
        );
        if (simple) {
          expect(simple.department_id.length).toBeGreaterThan(0);
        }

        const firstId = list.department[0].id;
        const detail = await expectOkOrUnavailable(() =>
          department.get(firstId)
        );
        if (detail) {
          expect(detail.department.id).toBe(firstId);
        }
      }
    );

    it.skipIf(!hasDirectorySecret())(
      'lists tags and reads members when present',
      async () => {
        const tag = new Tag(directoryConfig());
        const list = await expectOkOrUnavailable(() => tag.list());
        if (!list) {
          return;
        }
        expect(list.taglist).toBeInstanceOf(Array);
        if (list.taglist[0]) {
          const members = await expectOkOrUnavailable(() =>
            tag.get(list.taglist[0].tagid)
          );
          if (members) {
            expect(members.tagname).toEqual(expect.any(String));
          }
        }
      }
    );
  });

  describe('agent', () => {
    it.skipIf(!hasAppSecret())(
      'reads agent detail, list and workbench template',
      async () => {
        const agent = new Agent(appAgentConfig());
        const detail = expectOk(await agent.get());
        expect(detail.agentid).toBe(Number(process.env.TEST_AGENT_ID));

        const list = expectOk(await agent.list());
        expect(
          list.agentlist.some((item) => item.agentid === detail.agentid)
        ).toBe(true);

        await expectOkOrUnavailable(() => agent.getWorkbenchTemplate());
      }
    );

    it.skipIf(!hasAppSecret())(
      'reads the custom menu when it exists',
      async () => {
        const menu = new AgentMenu(appAgentConfig());
        await expectOkOrUnavailable(() => menu.get());
      }
    );
  });

  describe('media', () => {
    it.skipIf(!hasAppSecret())(
      'uploads a temp file and downloads it back',
      async () => {
        const media = new Media(appConfig());
        const uploaded = expectOk(
          await media.upload(
            Buffer.from('wecom integration'),
            'file',
            'readme.txt'
          )
        );
        expect(uploaded.media_id).toEqual(expect.any(String));

        const file = await media.get(uploaded.media_id);
        expect(file.data.toString()).toBe('wecom integration');
      }
    );

    it.skipIf(!hasAppSecret())('uploads a temporary image', async () => {
      const media = new Media(appConfig());
      const uploaded = expectOk(
        await media.upload(PNG_1X1, 'image', 'dot.png')
      );
      expect(uploaded.media_id).toEqual(expect.any(String));
    });
  });

  describe('message', () => {
    it.skipIf(!hasAppSecret())('reads message statistics', async () => {
      const message = new Message(appConfig());
      const stats = expectOk(await message.getStatistics({ time_type: 0 }));
      expect(stats.list ?? []).toBeInstanceOf(Array);
    });

    it.skipIf(!hasAppSecret())(
      'sends a text message to a member and recalls it',
      async () => {
        const userid = await resolveUserid();
        if (!userid) {
          return;
        }
        const message = new Message(appConfig());
        const sent = expectOk(
          await message.send(
            {
              touser: userid,
              msgtype: 'text',
              text: { content: `wecom integration ${Date.now()}` },
            },
            Number(process.env.TEST_AGENT_ID)
          )
        );
        if (sent.msgid) {
          expectOk(await message.recall({ msgid: sent.msgid }));
        }
      }
    );
  });

  describe('checkin', () => {
    it.skipIf(!hasCheckinSecret())(
      'reads checkin options and recent data',
      async () => {
        const userid = await resolveUserid();
        if (!userid) {
          return;
        }
        const checkin = new Checkin(checkinConfig());
        await expectOkOrUnavailable(() =>
          checkin.getCheckinOption({
            datetime: Math.floor(Date.now() / 1000),
            useridlist: [userid],
          })
        );
        const range = unixDaysAgo(7);
        await expectOkOrUnavailable(() =>
          checkin.getCheckinData({
            opencheckindatatype: 3,
            starttime: range.starttime,
            endtime: range.endtime,
            useridlist: [userid],
          })
        );
      }
    );
  });

  describe('oa and extras', () => {
    it.skipIf(!hasAppSecret())(
      'reads approval numbers when the api is enabled',
      async () => {
        const approval = new Approval(appConfig());
        const range = unixDaysAgo(7);
        await expectOkOrUnavailable(() =>
          approval.getApprovalInfo({
            starttime: range.starttime,
            endtime: range.endtime,
            cursor: 0,
            size: 20,
          })
        );
      }
    );

    it.skipIf(!hasAppSecret())(
      'reads dial records when the api is enabled',
      async () => {
        const dial = new Dial(appConfig());
        const range = unixDaysAgo(7);
        await expectOkOrUnavailable(() =>
          dial.getDialRecord({
            start_time: range.starttime,
            end_time: range.endtime,
            offset: 0,
            limit: 10,
          })
        );
      }
    );

    it.skipIf(!hasAppSecret())(
      'reads external contact follow users when enabled',
      async () => {
        const external = new ExternalContact(appConfig());
        const follow = await expectOkOrUnavailable(() =>
          external.getFollowUserList()
        );
        if (follow?.follow_user[0]) {
          expectOk(await external.list(follow.follow_user[0]));
        }
        await expectOkOrUnavailable(() => external.getCorpTagList());
        await expectOkOrUnavailable(() =>
          external.groupChatList({ limit: 10 })
        );
      }
    );

    it.skipIf(!hasAppSecret())('lists meeting rooms when enabled', async () => {
      const room = new MeetingRoom(appConfig());
      await expectOkOrUnavailable(() => room.list());
    });

    it.skipIf(!hasAppSecret())(
      'adds, reads and deletes a temporary calendar',
      async () => {
        const calendar = new Calendar(appConfig());
        const created = await expectOkOrUnavailable(() =>
          calendar.add({
            calendar: {
              summary: `wecom-sdk-${Date.now()}`,
              color: 1,
            },
          })
        );
        if (!created?.cal_id) {
          return;
        }
        try {
          const detail = expectOk(
            await calendar.get({ cal_id_list: [created.cal_id] })
          );
          expect(
            detail.calendar_list.some((item) => item.cal_id === created.cal_id)
          ).toBe(true);
        } finally {
          expectOk(await calendar.delete({ cal_id: created.cal_id }));
        }
      }
    );
  });
});

async function resolveUserid(): Promise<string | undefined> {
  if (process.env.TEST_USERID) {
    return process.env.TEST_USERID;
  }
  if (!hasDirectorySecret()) {
    return undefined;
  }
  const user = new User(directoryConfig());
  const ret = await expectOkOrUnavailable(() => user.simpleList(1));
  return ret?.userlist[0]?.userid;
}
