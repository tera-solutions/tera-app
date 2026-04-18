import {
  ISyncStatus,
  ISyncType,
  SpecificTables,
  SyncStatus,
} from "@tera/commons/interfaces";
import BusinessLocationService from "@databases/business_locations/service/index.native";
import DB from "@databases/database";
import { synchronize } from "@nozbe/watermelondb/sync";
import { SyncAPI } from "@services/api/SyncAPI";
import moment from "moment";

import { handleClearApp } from "@tera/commons/utils/helper";
import CustomerService from "@databases/customer/service/index.native";
import GeneralService from "@databases/general/service/index.native";
import SyncQueueService from "@databases/sync_queues/service/index.native";
import TableVersionService from "@databases/table_version/service/index.native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rootStore } from "@states/index";

interface TableChanges {
  created: any[];
  updated: any[];
  deleted: string[] | number[];
}

export type IChangeProps = {
  [K in SpecificTables]?: TableChanges;
};

export const resetDatabase = async (shouldReset: boolean) => {
  if (shouldReset) {
    // Phải bọc trong database.write
    await DB.instance.write(async () => {
      await DB.instance.unsafeResetDatabase();
      console.log("❌ RESET DATABASE WATERMELON ❌");
    });

    console.log(" call handleClearApp");

    await handleClearApp();
  }
};

export const filterChangesTable = (changes: any, tables: string[]) => {
  const filtered: any = {};
  tables.forEach((table) => {
    if (changes[table]) filtered[table] = changes[table];
  });
  return filtered;
};

export const hasChangesTable = (table: any): boolean => {
  try {
    return (
      table?.created?.length > 0 ||
      table?.updated?.length > 0 ||
      table?.deleted?.length > 0
    );
  } catch (err) {
    console.tron("ERR", err);
    return false;
  }
};

export const mappingDataQueue = async (queueData: any[]) => {
  const changes: Record<string, any> = {};

  // Map mapping giữa action record và key trong IChangeProps
  const actionMap: Record<string, string> = {
    CREATE: "created",
    UPDATE: "updated",
    DELETE: "deleted",
  };

  queueData.forEach((item) => {
    const { table_name, action, payload, record_id } = item;

    // 1. Chỉ lấy các action hợp lệ (CREATE, UPDATE, DELETE)
    const changeKey = actionMap[action as string];
    if (!changeKey || !action) return;

    // 2. Kiểm tra table_name có thuộc danh sách SpecificTables không
    const tableName = table_name as SpecificTables;

    // 3. Khởi tạo cấu trúc cho table nếu chưa tồn tại
    if (!changes[tableName] && tableName) {
      changes[tableName] = {
        created: [],
        updated: [],
        deleted: [],
      };
    }

    // 4. Parse payload và push vào mảng tương ứng
    if (action === "DELETE") {
      const deletedId = record_id as string;
      if (deletedId) {
        changes[tableName]!.deleted.push(deletedId);
      }
    } else {
      try {
        const data =
          typeof payload === "string" && payload !== ""
            ? JSON.parse(payload)
            : payload || {};

        if (record_id) {
          if (data.is_delete === 1) {
            changes[tableName]!.deleted.push(record_id);
          } else {
            changes[tableName]!.updated.push({
              ...data,
              id: record_id,
            });
          }
        } else {
          changes[tableName]!.created.push({
            ...data,
          });
        }
      } catch (e) {
        console.error(`[Sync] Parse error at ${record_id}:`, e);
      }
    }
  });

  return changes;
};

const getUniqueTableNames = (queueList: any[]): string[] => {
  const uniqueTables = [
    ...new Set(
      queueList
        .filter((item) => item.action === "GET")
        .map((item) => item.table_name),
    ),
  ];

  return uniqueTables;
};

export const mappingDataServer = async (
  changes: any,
  timestamp: number,
  version?: number,
) => {
  const safeChanges: IChangeProps = {
    business_locations: {
      created: [],
      updated: [],
      deleted: [],
    },
    customers: {
      created: [],
      updated: [],
      deleted: [],
    },
    generals: {
      created: [],
      updated: [],
      deleted: [],
    },
    table_version_logs: {
      created: [],
      updated: [],
      deleted: [],
    },
  };
  const registry = {
    business_locations: {
      pulled: false,
      pushed: false,
      version: 0,
      timestamp: 0,
    },
    customers: {
      pulled: false,
      pushed: false,
      version: 0,
      timestamp: 0,
    },
  };

  try {
    safeChanges.business_locations =
      await BusinessLocationService.mappingLocation(
        changes?.business_locations,
        timestamp,
      );

    safeChanges.customers = await CustomerService.mappingCustomer(
      changes?.customers,
      timestamp,
    );

    if (changes?.table_version_logs?.length > 0) {
      safeChanges.table_version_logs =
        await TableVersionService.mappingTableVersion(
          changes?.table_version_logs,
          timestamp,
        );
    }

    const generals: any[] = [];

    if (changes?.settings?.device_code) {
      generals.push({
        key: "settings",
        value: changes?.settings,
        version: version,
      });
    }

    if (changes?.users?.id) {
      generals.push({
        key: "users",
        value: changes?.users,
        version: version,
      });
    }

    if (changes?.business?.id) {
      generals.push({
        key: "business",
        value: changes?.business,
        version: version,
      });
    }

    if (generals?.length > 0) {
      safeChanges.generals = await GeneralService.mappingGeneral(
        generals,
        timestamp,
      );
    }
    return { safeChanges: safeChanges, registry: registry };
  } catch (error) {
    console.error("ERROR SYNC DB: ", error);
    return { safeChanges: safeChanges, registry: registry };
  }
};

export const updateLastSyncData = async (syncRegistry: any) => {
  try {
    if (syncRegistry.business_locations.pulled) {
      await TableVersionService.updateLastSync(
        "business_locations",
        syncRegistry.business_locations.timestamp,
        syncRegistry.business_locations.version,
      );
      console.tron(
        "Pull step finished logic",
        syncRegistry.business_locations,
        moment
          .unix(syncRegistry.business_locations.timestamp)
          .format("HH:mm:ss"),
      );
    }
    console.tron("FULL SYNC COMPLETED SUCCESSFULLY", syncRegistry);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const syncDataFromServer = async (
  type: ISyncType,
  status: ISyncStatus[],
) => {
  const queueList = await SyncQueueService.getAll({
    status: status,
    type: type,
  });
  if (!queueList?.length) return;
  const tables = await getUniqueTableNames(queueList);
  console.tron("tables", tables);
  let lastPulledAt = moment().unix();

  if (tables?.length > 0) {
    await synchronize({
      database: DB.instance,
      pullChanges: async () => {
        const localPullAt = await AsyncStorage.getItem(
          `${tables.join("_")}:lastPulledAt`,
        );
        console.log("localPullAt", localPullAt);
        const response = await SyncAPI.pullChanges({
          tables: tables.join(", "),
          updated_at: localPullAt
            ? moment(Number(localPullAt) * 1000).format("YYYY-MM-DD HH:mm:ss")
            : undefined,
        });
        console.tron("get new from server", response);

        const { changes, timestamp, db_version } = response;
        lastPulledAt = timestamp || moment().unix();
        const { safeChanges, registry } = await mappingDataServer(
          changes,
          timestamp,
          db_version,
        );
        console.tron("changes", safeChanges);
        return {
          changes: safeChanges,
          timestamp: Number(lastPulledAt) * 1000,
        };
      },
      sendCreatedAsUpdated: true,
    })
      .then(async () => {
        await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.COMPLETE);
        AsyncStorage.setItem(
          `${tables.join("_")}:lastPulledAt`,
          String(lastPulledAt),
        );
        if (tables.includes("customers")) {
          await CustomerService.checkCleanData();
        }
        rootStore.generalStore.fetchSettingsFromLocal();
        rootStore.uiStore.fetchBusinessFromLocal();
      })
      .catch(async (err: any) => {
        const errorMessage = err?.message || "Unknown Error";
        console.tron("ERROR SYNC DB:", errorMessage);
      });
  }
};

export const pushDataToServer = async (
  type: ISyncType,
  status: ISyncStatus[],
) => {
  const queueList = await SyncQueueService.getAll({
    status: status,
    type: type,
  });
  if (!queueList?.length) return;
  try {
    const changes = await mappingDataQueue(queueList);
    console.tron(`[Queue] Starting sync for 'All Tables'}`, changes);
    if (!Object.keys(changes)?.length) {
      throw new Error(`[Queue] No table sync for mapping`);
    }

    await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.RUNNING);

    const result = await SyncAPI.pushChanges({
      changes: changes,
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    console.log("pushChanges result", result);

    if (result?.code === 200 && result?.success === true) {
      console.log("pushChanges success");
      await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.COMPLETE);
      return result?.success;
    }
    throw new Error(result.msg);
  } catch (error: any) {
    console.tron(error?.data);
    await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.FAILED);
    return false;
  }
};
