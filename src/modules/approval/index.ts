import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  ApplyEventDto,
  ApplyEventRet,
  GetApprovalDetailDto,
  GetApprovalDetailRet,
  GetApprovalInfoDto,
  GetApprovalInfoRet,
  GetApprovalTemplateDto,
  GetApprovalTemplateRet,
} from './interface';

export class Approval extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  /**
   * @description 获取审批模板详情
   */
  getTemplateDetail(
    data: GetApprovalTemplateDto
  ): Promise<GetApprovalTemplateRet> {
    return this.request<GetApprovalTemplateRet>({
      url: '/oa/gettemplatedetail',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 提交审批申请
   */
  applyEvent(data: ApplyEventDto): Promise<ApplyEventRet> {
    return this.request<ApplyEventRet>({
      url: '/oa/applyevent',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 批量获取审批单号
   */
  getApprovalInfo(data: GetApprovalInfoDto): Promise<GetApprovalInfoRet> {
    return this.request<GetApprovalInfoRet>({
      url: '/oa/getapprovalinfo',
      method: 'POST',
      data,
    });
  }

  /**
   * @description 获取审批申请详情
   */
  getApprovalDetail(data: GetApprovalDetailDto): Promise<GetApprovalDetailRet> {
    return this.request<GetApprovalDetailRet>({
      url: '/oa/getapprovaldetail',
      method: 'POST',
      data,
    });
  }
}

export type {
  ApplyEventDto,
  ApplyEventRet,
  ApprovalApplyContent,
  ApprovalTemplateControl,
  GetApprovalDetailDto,
  GetApprovalDetailRet,
  GetApprovalInfoDto,
  GetApprovalInfoRet,
  GetApprovalTemplateDto,
  GetApprovalTemplateRet,
} from './interface';
