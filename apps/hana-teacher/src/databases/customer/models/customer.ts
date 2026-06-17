import { CustomerObjectType } from '@modules/sale/Customer/_interface';

export default interface ICustomer {
  id?: string;
  server_id?: number;
  client_id?: string;
  code?: string;
  business_name?: string;
  phone?: string;
  avatar_url?: string;
  email?: string;
  address?: string;
  tax?: string;
  object?: CustomerObjectType;
  debt_limit?: number;
  debt_period?: number;
  raw_data?: any;
  is_delete?: number;
  is_dirty?: number;
  updated_at?: number;
  created_at?: number;
}
