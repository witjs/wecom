import type { BaseRet } from '../../common/interface';
import type { ClientSource } from '../../wecom-module';
import { WecomModule } from '../../wecom-module';
import type {
  BatchGetInvoiceInfoDto,
  BatchGetInvoiceInfoRet,
  BatchUpdateInvoiceStatusDto,
  GetInvoiceInfoRet,
  InvoiceItem,
  UpdateInvoiceStatusDto,
} from './interface';

export class Invoice extends WecomModule {
  constructor(source: ClientSource = {}) {
    super(source);
  }

  getInvoiceInfo(data: InvoiceItem): Promise<GetInvoiceInfoRet> {
    return this.request<GetInvoiceInfoRet>({
      url: '/card/invoice/reimburse/getinvoiceinfo',
      method: 'POST',
      data,
    });
  }

  updateInvoiceStatus(data: UpdateInvoiceStatusDto): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/card/invoice/reimburse/updateinvoicestatus',
      method: 'POST',
      data,
    });
  }

  batchUpdateInvoiceStatus(
    data: BatchUpdateInvoiceStatusDto
  ): Promise<BaseRet> {
    return this.request<BaseRet>({
      url: '/card/invoice/reimburse/updatestatusbatch',
      method: 'POST',
      data,
    });
  }

  batchGetInvoiceInfo(
    data: BatchGetInvoiceInfoDto
  ): Promise<BatchGetInvoiceInfoRet> {
    return this.request<BatchGetInvoiceInfoRet>({
      url: '/card/invoice/reimburse/getinvoiceinfobatch',
      method: 'POST',
      data,
    });
  }
}

export type * from './interface';
