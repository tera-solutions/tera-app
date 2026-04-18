import { parseValue, stringifyValue } from "@tera/commons/utils";
import DB from "../../database";

const GeneralService = {
  /**
   * Mock Upsert bằng AsyncStorage
   */
  upsert: async (key: string, value: any, version?: number) => {
    if (!version) return;
    try {
      const stringifiedValue = stringifyValue(value);
      return await DB.generals.put({
        key: key,
        value: stringifiedValue,
        version: version,
      });
    } catch (error) {
      console.error("Dexie Upsert Error:", error);
    }
  },
  fetchAll: async () => {
    return [];
  },
  /**
   * Mock GetValue
   */
  getValue: async (key: string, _version?: number): Promise<any> => {
    const query = DB.generals.toCollection();
    const records = await query
      .filter((rows) => {
        return (
          (!key || rows.key === key) && (!_version || rows.version === _version)
        );
      })
      .toArray();
    if (records.length > 0 && records[0]?.value) {
      return parseValue(records[0]?.value);
    }
    return null;
  },

  /**
   * Mock Xóa theo Key
   */
  deleteByKey: async (key: string) => {
    try {
      await DB.generals.delete(key);
      console.log(`Deleted item ${key} from generals`);
    } catch (error) {
      console.error("Dexie Delete Error:", error);
    }
  },

  mappingGeneral: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    try {
      const generalsTable = DB.table("generals");

      const keys = dataTables.map((d) => d.key.toString());

      const existingRecords = await generalsTable
        .where("key")
        .anyOf(keys)
        .toArray();

      const existingMap = new Map(existingRecords.map((r) => [r.key, r]));

      for (const data of dataTables) {
        const serverKey = data.key.toString();
        const existing = existingMap.get(serverKey);

        const stringifiedValue = stringifyValue(data?.value || {});

        const mapCommonFields = {
          ...(existing || {}),
          key: serverKey,
          value: stringifiedValue,
          version: Number(data.version) ?? 0,
          last_sync_at: last_sync_at,
          updated_at: new Date(),
        };

        if (!existing) {
          changesLocal.created.push(mapCommonFields);
        } else {
          changesLocal.updated.push(mapCommonFields);
        }
      }

      console.log("[General Web] mappingGeneral result:", changesLocal);
      return changesLocal;
    } catch (error) {
      console.error("[General Web] mappingGeneral Error:", error);
      return changesLocal;
    }
  },

  /**
   * Mock Bulk Update
   */
  bulkUpdate: async (
    dataTables: Array<{ key: string; value: string; version: number }>,
  ) => {
    try {
      const startTime = performance.now();

      const operations = [];

      // 2. Phân loại Create hoặc Update
      for (const data of dataTables) {
        const stringifiedValue = stringifyValue(data.value);
        operations.push({
          key: data.key,
          value: stringifiedValue,
          version: data.version,
        });
      }

      // bulkPut: Nếu trùng ID thì update, chưa có thì insert
      await DB.generals.bulkPut(operations);

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

export default GeneralService;
