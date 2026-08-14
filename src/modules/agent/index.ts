import { WecomConfigError } from '../../core/errors';
import { Wecom } from '../../wecom';
import type { BaseRet } from '../../common/interface';
import type {
  AgentListRet,
  AgentRet,
  GetWorkbenchTemplateRet,
  IAgentWecom,
  ISetAgent,
  SetWorkbenchDataDto,
  SetWorkbenchTemplateDto,
} from './interface';

/**
 * @description 应用管理相关接口
 */
export class Agent extends Wecom {
  agentId: number;

  constructor(config: IAgentWecom) {
    super(config);
    this.agentId = config.agentId;
    if (!this.agentId) {
      throw new WecomConfigError('agentId must be specified');
    }
  }

  /**
   * @description 获取应用详情
   */
  get<T = AgentRet>(): Promise<T> {
    return this.request<T>({
      url: '/agent/get',
      method: 'GET',
      params: {
        agentid: this.agentId,
      },
    });
  }

  /**
   * @description 获取当前凭证对应的应用列表
   */
  list(): Promise<AgentListRet> {
    return this.request<AgentListRet>({
      url: '/agent/list',
      method: 'GET',
    });
  }

  /**
   * @description 修改自建应用信息
   */
  set(data: ISetAgent): Promise<AgentRet> {
    return this.request<AgentRet>({
      url: '/agent/set',
      method: 'POST',
      data: {
        ...data,
        agentid: this.agentId,
      },
    });
  }

  /**
   * @description 设置应用在工作台展示的模版
   */
  setWorkbenchTemplate(data: SetWorkbenchTemplateDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/agent/set_workbench_template',
      method: 'POST',
      data: {
        ...data,
        agentid: this.agentId,
      },
    });
  }

  /**
   * @description 获取应用在工作台展示的模版
   */
  getWorkbenchTemplate(): Promise<GetWorkbenchTemplateRet> {
    return this.request<GetWorkbenchTemplateRet>({
      url: '/agent/get_workbench_template',
      method: 'POST',
      data: {
        agentid: this.agentId,
      },
    });
  }

  /**
   * @description 设置应用在用户工作台展示的数据
   */
  setWorkbenchData(data: SetWorkbenchDataDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/agent/set_workbench_data',
      method: 'POST',
      data: {
        ...data,
        agentid: this.agentId,
      },
    });
  }
}

export type {
  AgentListItem,
  AgentListRet,
  AgentRet,
  AgentRetUser,
  GetWorkbenchTemplateRet,
  IAgentBase,
  IAgentWecom,
  ISetAgent,
  SetWorkbenchDataDto,
  SetWorkbenchTemplateDto,
  WorkbenchKeyDataItem,
  WorkbenchListItem,
  WorkbenchTemplate,
  WorkbenchType,
} from './interface';
