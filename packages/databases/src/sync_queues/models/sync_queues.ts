import { ISyncAction, ISyncStatus, ISyncType } from '@tera/common/interfaces';

export default interface SyncQueue {
  id?: string;
  table_name?: string;
  record_id?: string;
  type?: ISyncType;
  action?: ISyncAction;
  payload?: string;
  retries?: number;
  status?: ISyncStatus;
  created_at?: Date;
  updated_at?: Date;
}
