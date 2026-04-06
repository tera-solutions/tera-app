export type SpecificTables =
  | 'generals'
  | 'table_version_logs'
  | 'business_locations'
  | 'customers';

export type ISyncType = 'manual' | 'background' | 'realtime';
export type ISyncStatus = 'queued' | 'running' | 'completed' | 'failed';
export type ISyncAction = 'GET' | 'CREATE' | 'UPDATE' | 'DELETE';

export interface IQueueProps {
  type: ISyncType;
  table: SpecificTables;
}

export const SyncStatus = Object.freeze({
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETE: 'completed',
  FAILED: 'failed',
});
