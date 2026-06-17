const appSchema = {
  generals: 'key, version',
  table_version_logs: 'table_name',
  business_locations:
    '++id, server_id, location_id, version, is_delete, updated_at',
  sync_queues: '++id, table_name, status, type, updated_at',
  customers: '++id, code, object, is_delete, updated_at',
};

export default appSchema;
