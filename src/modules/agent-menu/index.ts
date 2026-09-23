import type { BaseRet } from '../../common/interface';
import { Wecom } from '../../wecom';
import { Agent } from '../agent';
import type { IAgentWecom } from '../agent';
import type { AgentMenuRet, ICreateAgentMenu } from './interface';

export class AgentMenu extends Agent {
  constructor(config: IAgentWecom);
  constructor(client: Wecom, agentId: number);
  constructor(configOrClient: IAgentWecom | Wecom, agentId?: number) {
    if (configOrClient instanceof Wecom) {
      super(configOrClient, agentId as number);
      return;
    }
    super(configOrClient);
  }

  /**
   * @description 创建菜单
   */
  create(data: ICreateAgentMenu): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/menu/create',
      method: 'POST',
      params: { agentid: this.agentId },
      data,
    });
  }

  /**
   * @description 获取菜单信息
   */
  override get<T = AgentMenuRet>(): Promise<T> {
    return this.request<T>({
      url: '/menu/get',
      method: 'GET',
      params: { agentid: this.agentId },
    });
  }

  /**
   * @description 删除菜单
   */
  delete(): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/menu/delete',
      method: 'GET',
      params: { agentid: this.agentId },
    });
  }
}

export {
  AgentMenuButtonType,
  type AgentMenuRet,
  type BaseAgentMenuButtonItem,
  type ClickItem,
  type ICreateAgentMenu,
  type ICreateAgentMenuButton,
  type MiniProgramItem,
  type ViewItem,
} from './interface';
