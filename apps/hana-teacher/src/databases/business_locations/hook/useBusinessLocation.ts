import { SyncStatus } from '@tera/commons/interfaces';
import DB from '@databases/database';
import { useLiveQuery } from 'dexie-react-hooks';

interface SyncStatus {
  hasPendingUpload: boolean;
  pendingCount: number;
  totalCount: number;
  lastUpdate: number;
  hasUnsynced: boolean;
}
export const useBusinessLocation = () => {
  const defaultStatus: SyncStatus = {
    hasPendingUpload: false,
    pendingCount: 0,
    totalCount: 0,
    lastUpdate: 0,
    hasUnsynced: false,
  };

  const result = useLiveQuery(async () => {
    const unsyncedRecords = await DB.sync_queues
      .where('table_name')
      .equals('business_locations')
      .and((item) => {
        return item.status === SyncStatus.QUEUED && item.action !== 'GET';
      })
      .toArray();

    const totalRecords = await DB.business_locations
      .where('is_delete')
      .equals(0)
      .toArray();

    const lastUpdate = await DB.business_locations.orderBy('updated_at').last();

    return {
      hasPendingUpload: unsyncedRecords.length > 0,
      totalCount: totalRecords?.length || 0,
      pendingCount: unsyncedRecords.length,
      lastUpdate: lastUpdate?.updated_at || 0,
      hasUnsynced: `${unsyncedRecords.length}-${lastUpdate?.updated_at || 0}`,
    };
  }, []);

  return result ?? defaultStatus;
};
