import type { BaseRet } from '../../common/interface';

export interface InvoiceItem {
  card_id: string;
  encrypt_code: string;
}

export interface InvoiceInfo {
  card_id: string;
  begin_time: number;
  end_time: number;
  opener: string;
  user_info: {
    fee: number;
    title: string;
    billing_time: number;
    billing_no: string;
    billing_code: string;
    info: Array<{
      name: string;
      num: number;
      unit: string;
      fee: number;
    }>;
    fee_without_tax: number;
    tax: number;
  };
}

export interface GetInvoiceInfoRet extends BaseRet {
  payee: string;
  invoice_detail: InvoiceInfo;
}

export interface UpdateInvoiceStatusDto extends InvoiceItem {
  reimburse_status:
    | 'INVOICE_REIMBURSE_INIT'
    | 'INVOICE_REIMBURSE_LOCK'
    | 'INVOICE_REIMBURSE_CLOSURE';
}

export interface BatchUpdateInvoiceStatusDto {
  openid: string;
  reimburse_status: UpdateInvoiceStatusDto['reimburse_status'];
  invoice_list: InvoiceItem[];
}

export interface BatchGetInvoiceInfoDto {
  item_list: InvoiceItem[];
}

export interface BatchGetInvoiceInfoRet extends BaseRet {
  item_list: InvoiceInfo[];
}
