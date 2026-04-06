import {
  ISyncStatus,
  ISyncType,
  SpecificTables,
  SyncStatus,
} from '@common/interfaces';
import { handleClearApp } from '@common/utils/helper';
import BusinessLocationService from '@databases/business_locations/service';
import CustomerService from '@databases/customer/service';
import DB from '@databases/database'; // Giả định là IndexDB wrapper
import { SyncAPI } from '@services/api/SyncAPI';
import { rootStore } from '@stores/index';
import moment from 'moment';
import GeneralService from '../../general/service';
import SyncQueueService from '../../sync_queues/service';
import TableVersionService from '../../table_version/service';

interface TableChanges {
  created: any[];
  updated: any[];
  deleted: string[] | number[];
}

export type IChangeProps = {
  [K in SpecificTables]?: TableChanges;
};

// --- Utilities ---

export const resetDatabase = async (shouldReset: boolean) => {
  if (shouldReset) {
    await DB.delete(); // Xóa IndexDB
    await DB.open(); // Khởi tạo lại
    console.log('❌ RESET DATABASE INDEXDB ❌');
    handleClearApp();
  }
};

export const hasChangesTable = (table: any): boolean => {
  return (
    table?.created?.length > 0 ||
    table?.updated?.length > 0 ||
    table?.deleted?.length > 0
  );
};

// --- Mapping Logic ---

export const mappingDataQueue = async (queueData: any[]) => {
  const changes: Record<string, any> = {};
  const actionMap: Record<string, string> = {
    CREATE: 'created',
    UPDATE: 'updated',
    DELETE: 'deleted',
  };

  queueData.forEach((item) => {
    const { table_name, action, payload, record_id } = item;
    const changeKey = actionMap[action as string];
    if (!changeKey || !table_name) return;

    const tableName = table_name as SpecificTables;

    if (!changes[tableName]) {
      changes[tableName] = { created: [], updated: [], deleted: [] };
    }

    if (action === 'DELETE') {
      if (record_id) changes[tableName].deleted.push(record_id);
    } else {
      try {
        const data =
          typeof payload === 'string' ? JSON.parse(payload) : payload || {};
        if (record_id) {
          if (data.is_delete === 1) {
            changes[tableName].deleted.push(data.id);
          } else {
            changes[tableName].updated.push({ ...data, id: record_id });
          }
        } else {
          changes[tableName].created.push({ ...data });
        }
      } catch (e) {
        console.error(`[Sync Web] Parse error:`, e);
      }
    }
  });
  return changes;
};

export const mappingDataServer = async (
  changes: any,
  timestamp: number,
  version?: number,
) => {
  const safeChanges: IChangeProps = {
    business_locations: { created: [], updated: [], deleted: [] },
    customers: { created: [], updated: [], deleted: [] },
    generals: { created: [], updated: [], deleted: [] },
    table_version_logs: { created: [], updated: [], deleted: [] },
  };

  try {
    // 1. Map Business Locations
    if (changes?.business_locations) {
      safeChanges.business_locations =
        await BusinessLocationService.mappingLocation(
          changes.business_locations,
          timestamp,
        );
    }

    if (changes?.customers) {
      safeChanges.customers = await CustomerService.mappingCustomer(
        changes.customers,
        timestamp,
      );
    }

    // 2. Map Table Versions
    if (changes?.table_version_logs?.length > 0) {
      safeChanges.table_version_logs =
        await TableVersionService.mappingTableVersion(
          changes.table_version_logs,
          timestamp,
        );
    }

    // 3. Map General Data (Settings, User, Business)
    const generals: any[] = [];
    ['settings', 'users', 'business'].forEach((key) => {
      if (changes?.[key]) {
        generals.push({ key, value: changes[key], version });
      }
    });

    if (generals.length > 0) {
      safeChanges.generals = await GeneralService.mappingGeneral(
        generals,
        timestamp,
      );
    }

    return { safeChanges, registry: { lastPulledAt: timestamp } };
  } catch (error) {
    console.error('ERROR MAPPING WEB:', error);
    return { safeChanges, registry: { lastPulledAt: timestamp } };
  }
};

// --- Sync Actions ---

export const syncDataFromServer = async (
  type: ISyncType,
  status: ISyncStatus[],
) => {
  const queueList = await SyncQueueService.getAll({ status, type });
  if (!queueList?.length) return;

  const tables = [
    ...new Set(
      queueList.filter((i) => i.action === 'GET').map((i) => i.table_name),
    ),
  ];
  if (!tables.length) return;

  try {
    const storageKey = `${tables.join('_')}:lastPulledAt`;
    const localPullAt = localStorage.getItem(storageKey);

    const response = await SyncAPI.pullChanges({
      tables: tables.join(', '),
      updated_at: localPullAt
        ? moment(Number(localPullAt) * 1000).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    });

    const { changes, timestamp, db_version } = response;
    const { safeChanges } = await mappingDataServer(
      changes,
      timestamp,
      db_version,
    );

    console.log('safeChanges', safeChanges);

    const syncTables = Object.keys(safeChanges) as Array<keyof IChangeProps>;

    await DB.transaction('rw', syncTables, async () => {
      try {
        const promises = syncTables.map(async (tableName) => {
          const data = safeChanges[tableName];
          if (!data) return;
          const recordsToUpsert = [
            ...(data.created || []),
            ...(data.updated || []),
          ];
          const idsToDelete = data.deleted || [];

          const table = DB.table(tableName);

          if (recordsToUpsert.length > 0) {
            await table.bulkPut(recordsToUpsert);
          }

          if (idsToDelete.length > 0) {
            await table.bulkDelete(idsToDelete);
          }

          console.log(
            `[Sync] Table ${tableName}: +${data.created.length} ~${data.updated.length} -${idsToDelete.length}`,
          );
        });

        await Promise.all(promises);
      } catch (error) {
        console.error('[Sync Transaction] Failed:', error);
        // Transaction sẽ tự động Rollback nếu có lỗi throw ra ở đây
        throw error;
      }
    });

    localStorage.setItem(storageKey, String(timestamp));
    await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.COMPLETE);

    // Update Stores
    rootStore.generalStore.fetchSettingsFromLocal();
    rootStore.authStore.fetchUserFromLocal();
  } catch (error) {
    console.error('SYNC FROM SERVER WEB ERROR:', error);
  }
};

export const pushDataToServer = async (
  type: ISyncType,
  status: ISyncStatus[],
) => {
  const queueList = await SyncQueueService.getAll({ status, type });
  if (!queueList?.length) throw new Error('No process sync table found');

  try {
    const changes = await mappingDataQueue(queueList);
    await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.RUNNING);

    const result = await SyncAPI.pushChanges({
      changes: changes,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    if (result?.success) {
      await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.COMPLETE);
      return true;
    }
    throw new Error(result.msg);
  } catch (error) {
    await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.FAILED);
    return false;
  }
};
