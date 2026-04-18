import DB from "../../database";

const TableVersionService = {
  /**
   * Mock Upsert
   */
  upsert: async (table_name: string, version: number, is_dirty: number = 0) => {
    if (!version) return;
    try {
      const oldVersion = await TableVersionService.getValue(table_name);
      if (oldVersion === version && !is_dirty) return;

      return await DB.table_version_logs.put({
        table_name: table_name,
        version: version,
        is_dirty: oldVersion === version ? 0 : 1,
      });
    } catch (error) {
      console.error("Dexie Upsert Error:", error);
    }
  },

  updateLastSync: async (
    table_name: string,
    last_sync_at: number,
    version?: number,
  ) => {
    if (!version) return;
    if (!last_sync_at) return;
    try {
      return await DB.table_version_logs.put({
        table_name: table_name,
        version: version,
        last_sync_at: last_sync_at,
        is_dirty: 0,
      });
    } catch (error) {
      console.error("Dexie Upsert Error:", error);
    }
  },

  /**
   * Mock GetValue
   */
  getValue: async (table_name: string, _version?: number): Promise<any> => {
    const query = DB.table_version_logs.toCollection();
    const records = await query
      .filter((rows) => {
        return (
          (!table_name || rows.table_name === table_name) &&
          (!_version || rows.version === _version)
        );
      })
      .toArray();
    if (records.length > 0) {
      return Number(records[0].version);
    }
    return null;
  },
  fetchAll: async () => {
    return [];
  },
  getData: async (table_name: string, _version?: number): Promise<any> => {
    const query = DB.table_version_logs.toCollection();
    const records = await query
      .filter((rows) => {
        return (
          (!table_name || rows.table_name === table_name) &&
          (!_version || rows.version === _version)
        );
      })
      .toArray();
    if (records.length > 0) {
      return Number(records[0]);
    }
    return null;
  },

  /**
   * Mock Xóa theo Table Name
   */
  deleteByKey: async (table_name: string) => {
    try {
      await DB.table_version_logs.delete(table_name);
      console.log(`Deleted item ${table_name} from table_version_logs`);
    } catch (error) {
      console.error("Dexie Delete Error:", error);
    }
  },
  mappingTableVersion: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    try {
      const tableNames = dataTables.map((d) => d.table_name);

      const existingRecords = await DB.table_version_logs
        .where("table_name")
        .anyOf(tableNames)
        .toArray();

      const existingMap = new Map(
        existingRecords.map((r) => [r.table_name, r]),
      );

      for (const data of dataTables) {
        const existing = existingMap.get(data.table_name);
        const serverVersion = data.version ?? 0;

        const mapCommonFields = {
          ...(existing || {}),
          table_name: data.table_name,
          version: serverVersion,
          last_sync_at: last_sync_at,
          updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
          is_dirty: existing?.version !== serverVersion ? 1 : 0,
        };

        if (!existing) {
          changesLocal.created.push(mapCommonFields);
        } else if (existing.version !== serverVersion) {
          changesLocal.updated.push(mapCommonFields);
        }
      }

      console.log("[TableVersion] mappingTableVersion result:", changesLocal);
      return changesLocal;
    } catch (error) {
      console.error("[TableVersion Web] mappingTableVersion Error:", error);
      return changesLocal;
    }
  },
  bulkUpdate: async (
    dataTables: Array<{
      table_name: string;
      version: number;
    }>,
  ) => {
    try {
      const startTime = performance.now();

      const operations = [];

      // 2. Phân loại Create hoặc Update
      for (const data of dataTables) {
        const oldVersion = await TableVersionService.getValue(data.table_name);
        let item: any = {
          table_name: data.table_name,
          version: data.version,
          is_dirty: 0,
        };

        console.log("oldVersion", oldVersion);
        if (oldVersion !== data.version) {
          item = {
            ...item,
            is_dirty: 1,
          };
          operations.push(item);
        }
      }

      // bulkPut: Nếu trùng ID thì update, chưa có thì insert
      await DB.table_version_logs.bulkPut(operations);

      const endTime = performance.now();
      console.log(
        `Bulk update ${operations.length} items in ${endTime - startTime}ms`,
      );

      return { success: true };
    } catch (error) {
      console.error("Bulk update failed:", error);
      throw error;
    }
  },
};

export default TableVersionService;
