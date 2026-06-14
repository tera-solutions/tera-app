export default interface TableVersion {
  table_name: string;
  version: number;
  updated_at?: Date;
  is_dirty?: number;
  last_sync_at?: number;
}
