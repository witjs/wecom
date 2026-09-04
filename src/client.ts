import { pickHttpConfig, type WecomConfig } from './core/config';
import { Wecom } from './wecom';
import { Agent } from './modules/agent';
import { AgentMenu } from './modules/agent-menu';
import { AppChat } from './modules/app-chat';
import { Approval } from './modules/approval';
import { Batch } from './modules/batch';
import { Calendar } from './modules/calendar';
import { Checkin } from './modules/checkin';
import { Department } from './modules/department';
import { Dial } from './modules/dial';
import { ExternalContact } from './modules/external-contact';
import { Invoice } from './modules/invoice';
import { Media } from './modules/media';
import { MeetingRoom } from './modules/meeting-room';
import { Message } from './modules/message';
import { Schedule } from './modules/schedule';
import { Tag } from './modules/tag';
import { User } from './modules/user';

export interface CreateClientOptions extends Partial<WecomConfig> {
  /** Default agent id for Message (overridable per send / by payload). */
  agentId?: number;
}

export interface WecomClient {
  wecom: Wecom;
  user: User;
  department: Department;
  tag: Tag;
  batch: Batch;
  media: Media;
  message: Message;
  appChat: AppChat;
  externalContact: ExternalContact;
  calendar: Calendar;
  schedule: Schedule;
  meetingRoom: MeetingRoom;
  checkin: Checkin;
  approval: Approval;
  dial: Dial;
  invoice: Invoice;
  agent(agentId: number): Agent;
  agentMenu(agentId: number): AgentMenu;
}

/**
 * Build a suite of module clients that share one Wecom (transport / logger /
 * signal / token). Prefer this over `Wecom.setGlobal` for multi-tenant apps.
 */
export function createClient(options: CreateClientOptions = {}): WecomClient {
  const { agentId, ...config } = options;
  const wecom = new Wecom(config);
  return {
    wecom,
    user: new User(wecom),
    department: new Department(wecom),
    tag: new Tag(wecom),
    batch: new Batch(wecom),
    media: new Media(wecom),
    message: new Message(wecom, agentId),
    appChat: new AppChat(wecom),
    externalContact: new ExternalContact(wecom),
    calendar: new Calendar(wecom),
    schedule: new Schedule(wecom),
    meetingRoom: new MeetingRoom(wecom),
    checkin: new Checkin(wecom),
    approval: new Approval(wecom),
    dial: new Dial(wecom),
    invoice: new Invoice(wecom),
    agent: (id) => new Agent(wecom, id),
    agentMenu: (id) => new AgentMenu(wecom, id),
  };
}

export interface WecomScope {
  readonly defaults: Partial<WecomConfig>;
  createClient(overrides?: CreateClientOptions): WecomClient;
  wecom(overrides?: Partial<WecomConfig>): Wecom;
}

function mergeConfig(
  defaults: Partial<WecomConfig>,
  overrides: Partial<WecomConfig> = {}
): Partial<WecomConfig> {
  return {
    ...defaults,
    ...overrides,
    headers: {
      ...defaults.headers,
      ...overrides.headers,
    },
  };
}

/**
 * Scoped defaults without process-wide globals. Each scope is isolated; use
 * separate scopes (and preferably separate `tokenStore`s) for multi-tenant work.
 */
export function createScope(defaults: Partial<WecomConfig>): WecomScope {
  const frozen = { ...defaults, headers: { ...defaults.headers } };
  return {
    get defaults() {
      return {
        ...frozen,
        headers: frozen.headers ? { ...frozen.headers } : undefined,
      };
    },
    createClient(overrides: CreateClientOptions = {}) {
      const { agentId, ...rest } = overrides;
      return createClient({
        ...mergeConfig(frozen, rest),
        agentId,
      });
    },
    wecom(overrides: Partial<WecomConfig> = {}) {
      return new Wecom(mergeConfig(frozen, overrides));
    },
  };
}

/** Merge HTTP-related fields from a resolved client into a plain config. */
export function clientHttpConfig(wecom: Wecom): Partial<WecomConfig> {
  return {
    ...pickHttpConfig(wecom.config),
    baseURL: wecom.config.baseURL,
    tokenStore: wecom.config.tokenStore,
  };
}
