export interface Customer {
  id: string;
  client_id?: string;
  business_id?: number;
  code?: string;
  business_name?: string;
  foreign_name?: string;
  phone?: string;
  avatar_url?: string;
  email?: string;
  address?: string;
  tax?: string;
  founding?: string;
  birthday?: string;
  sex?: string;
  customer_type?: string;
  customer_type_text?: any;
  object?: CustomerObjectType;
  object_text?: any;
  debt_limit?: number;
  debt_period?: number;
  staff?: any;
  note?: string;
  company_size_text?: string;
  raw_data?: any;
  is_delete?: number;
  updated_at?: number;
  created_at?: number;
}

export const CustomerObject = Object.freeze({
  NEW: 'crm_customer-object_new',
  INDIVIDUAL: 'crm_customer-object_individual',
  COMPANY: 'crm_customer-object_company',
});

export type CustomerObjectType =
  | 'crm_customer-object_new'
  | 'crm_customer-object_individual'
  | 'crm_customer-object_company';

export const CustomerObjectText = Object.freeze({
  [CustomerObject.NEW]: 'Khách mới',
  [CustomerObject.INDIVIDUAL]: 'Khách lẻ',
  [CustomerObject.COMPANY]: 'Doanh nghiệp',
});
