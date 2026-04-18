import { ISyncStatus, SyncStatus } from "@tera/commons/interfaces";
import { parseValue, stringifyValue } from "@tera/commons/utils";
import ISyncQueue from "@databases/sync_queues/models/sync_queues";

import DB from "../../database"; // Dexie instance

const SyncQueueService = {
  /**
   * Tạo hoặc cập nhật giá trị theo ID (Upsert)
   * Tương ứng với logic mapping của bản Native
   */
  upsert: async (data: ISyncQueue) => {
    try {
      const stringifiedValue = stringifyValue(data?.payload);

      const record: any = {
        id: data?.id,
        table_name: data?.table_name ?? "",
        record_id: data?.record_id ?? "",
        type: data?.type ?? "manual",
        action: data?.action ?? "",
        payload: stringifiedValue,
        retries: data?.retries ?? 1,
        status: data?.status ?? SyncStatus.QUEUED,
        updated_at: Date.now(),
      };

      // bulkPut trong Dexie sẽ tự động insert nếu chưa có hoặc update nếu đã có ID
      return await DB.sync_queues.put(record);
    } catch (error) {
      console.error("Dexie SyncQueue Upsert Error:", error);
    }
  },
  getAll: async (filter: any = { page: 1, limit: 100 }) => {
    try {
      const page = filter?.page ? Number(filter?.page) : 1;
      const pageSize = filter?.limit ? Number(filter?.limit) : 100;
      const skip = (page - 1) * pageSize;

      const activeFilters = { ...filter };
      delete activeFilters.limit;
      delete activeFilters.page;

      let collection = DB.sync_queues.orderBy("updated_at").reverse();

      collection = collection.filter((item: any) => {
        return Object.keys(activeFilters).every((key) => {
          const filterValue = activeFilters[key];
          if (
            filterValue === undefined ||
            filterValue === null ||
            filterValue === ""
          )
            return true;

          const itemValue = item[key];

          if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue);
          }

          if (typeof filterValue === "string") {
            return (itemValue || "")
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }

          return itemValue === filterValue;
        });
      });

      const result = await collection.offset(skip).limit(pageSize).toArray();

      console.log("[SyncQueue] Result count:", result.length);
      return result;
    } catch (error) {
      console.error("WEB DB ERROR:", error);
      return [];
    }
  },
  /**
   * Lấy toàn bộ dữ liệu từ bảng sync_queues
   */
  fetchAll: async () => {
    try {
      return await DB.sync_queues.toArray();
    } catch (error) {
      console.error("Dexie FetchAll Error:", error);
      return [];
    }
  },

  /**
   * Lấy một bản ghi theo ID và parse dữ liệu payload
   */
  getValue: async (id: string): Promise<any> => {
    try {
      const record = await DB.sync_queues.get(id);
      if (record && record.payload) {
        // Có thể parse payload nếu cần giống getValue của GeneralService
        return {
          ...record,
          payload: parseValue(record.payload),
        };
      }
      return record || null;
    } catch (error) {
      console.error("Dexie GetValue Error:", error);
      return null;
    }
  },

  /**
   * Xóa một bản ghi theo ID
   */
  deleteByKey: async (id: string) => {
    try {
      await DB.sync_queues.delete(id);
      console.log(`Deleted item ${id} from sync_queues`);
    } catch (error) {
      console.error("Dexie Delete Error:", error);
    }
  },

  bulkUpdateStatus: async (data: Array<ISyncQueue>, status: ISyncStatus) => {
    try {
      const operations: any = data.map((item) => {
        let retries = 0;
        let type = item?.type;
        if (status === SyncStatus.FAILED) {
          retries += 1;
        }
        if (status === SyncStatus.QUEUED) {
          retries = 0;
          type = "background";
        }
        return {
          id: item?.id,
          retries: retries ?? 1,
          type: type,
          status: status ?? SyncStatus.RUNNING,
          updated_at: Date.now(),
        };
      });

      console.tron("operations", operations);
      await DB.sync_queues.bulkPut(operations);

      console.log(
        `Bulk update ${operations.length} items in sync_queues status is ${SyncStatus.RUNNING}`,
      );

      return { success: true };
    } catch (error) {
      console.error("Bulk update failed:", error);
      throw error;
    }
  },
  /**
   * Cập nhật hàng loạt (Bulk Update)
   * Tối ưu cho việc đẩy dữ liệu lớn vào IndexDB
   */
  bulkUpdate: async (data: Array<ISyncQueue>) => {
    try {
      const startTime = performance.now();

      const operations: any = data.map((item) => ({
        id: item?.id,
        table_name: item?.table_name ?? "",
        record_id: item?.record_id ?? "",
        type: item?.type ?? "manual",
        action: item?.action ?? "",
        payload: stringifyValue(item?.payload ?? ""),
        retries: item?.retries ?? 0,
        status: item?.status ?? SyncStatus.QUEUED,
        updated_at: Date.now(),
      }));

      await DB.sync_queues.bulkPut(operations);

      const endTime = performance.now();
      console.log(
        `Bulk update ${operations.length} items in sync_queues in ${endTime - startTime}ms`,
      );

      return { success: true };
    } catch (error) {
      console.tron("Bulk update failed:", error);
      throw error;
    }
  },
};

export default SyncQueueService;
