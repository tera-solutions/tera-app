import { syncManager } from '@services/sync/SyncManager';
import DB from '../../database'; // Giả định đây là file khởi tạo Dexie (new Dexie)

const CustomerService = {
  /**
   * Upsert: Tự động xử lý Insert/Update dựa trên ID
   */
  upsert: async (data: any, version?: number) => {
    try {
      // put() của Dexie: Có ID thì update, chưa có thì insert
      const resultId = await DB.customers.put({
        ...data,
        is_dirty: 1, // Đánh dấu có thay đổi local để sync
        is_delete: data.is_delete ? 1 : 0,
        updated_at: new Date(),
        raw_data: data, // Lưu full object vào raw_data
      });

      const finalId = (data.id || resultId).toString();
      if (finalId) {
        await syncManager.addQueue({
          table_name: 'customers',
          type: 'background',
          record_id: finalId,
          payload: data,
          action: data.id ? 'UPDATE' : 'CREATE',
        });
      }
      return finalId;
    } catch (error) {
      console.error('[Web DB] Customer Upsert Error:', error);
    }
  },

  /**
   * getDetail: Lấy chi tiết kèm raw object
   */
  getDetail: async (id: string): Promise<any> => {
    try {
      const record = await DB.customers.get(id);
      if (record) {
        return {
          ...record,
          _raw: record,
        };
      }
      return null;
    } catch (error) {
      console.error('[Web DB] Customer getDetail Error:', error);
      return null;
    }
  },

  /**
   * getTotalRows: Đếm số lượng record chưa xóa
   */
  getTotalRows: async (): Promise<number> => {
    return await DB.customers.where('is_delete').equals(0).count();
  },
  fetchAll: async () => {
    return [];
  },
  /**
   * getAll: Phân trang, Sắp xếp và Filter động
   */
  getAll: async (
    filter: any = {
      page: 1,
      limit: 20,
      sort: 'desc',
    },
  ): Promise<any[]> => {
    try {
      const page = filter?.page ? Number(filter?.page) : 1;
      const pageSize = filter?.limit ? Number(filter?.limit) : 20;
      const skip = (page - 1) * pageSize;

      const activeFilters = { ...filter };
      const sortOrder = activeFilters.sort || 'desc';

      delete activeFilters.limit;
      delete activeFilters.page;
      delete activeFilters.sort;

      // 1. Sắp xếp
      let collection =
        sortOrder === 'desc'
          ? DB.customers.orderBy('id').reverse()
          : DB.customers.orderBy('id');

      // 2. Filter động theo các trường
      collection = collection.filter((item: any) => {
        return Object.keys(activeFilters).every((key) => {
          const value = activeFilters[key];
          if (value === undefined || value === null || value === '')
            return true;

          // Search mờ cho tên, mã hoặc địa chỉ
          if (['business_name', 'code', 'address', 'phone'].includes(key)) {
            return item[key]?.toLowerCase().includes(value.toLowerCase());
          }

          if (key === '_status') {
            return item._status !== 'synced';
          }

          return item[key] === value;
        });
      });

      return await collection.offset(skip).limit(pageSize).toArray();
    } catch (error) {
      console.error('[Web DB] Customer getAll Error:', error);
      return [];
    }
  },

  upsertMapping: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal: any[] = [];
    try {
      for (const data of dataTables) {
        changesLocal.push({
          ...data,
          id: (data?.client_id || data?.id).toString(),
          server_id: data.id,
          is_delete: data.is_delete ? 1 : 0,
          is_dirty: 0,
          _status: 'synced',
          last_sync_at: last_sync_at,
          updated_at: new Date(),
          raw_data: data,
        });
      }
      return changesLocal;
    } catch (error) {
      console.error('[Web] upsertMapping Error:', error);
      return changesLocal;
    }
  },

  /**
   * mappingCustomer: Tương tự bản Native nhưng trả về cho Dexie logic
   */
  mappingCustomer: async (dataTables: any, last_sync_at: number) => {
    const changesLocal = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    try {
      const serverChanges =
        dataTables?.updated || dataTables?.created || dataTables || [];

      if (Array.isArray(serverChanges) && serverChanges.length > 0) {
        changesLocal.updated = await CustomerService.upsertMapping(
          serverChanges,
          last_sync_at,
        );
      }

      if (Array.isArray(dataTables?.deleted)) {
        changesLocal.deleted = dataTables.deleted.map((id: any) =>
          id.toString(),
        );
      }

      return changesLocal;
    } catch (error) {
      console.error('[Web] mappingCustomer Error:', error);
      return changesLocal;
    }
  },

  /**
   * bulkUpdate: Ghi hàng loạt dữ liệu (Batch Operation)
   */
  bulkUpdate: async (dataTables: Array<any>, version?: number) => {
    try {
      if (!version) return;
      const operations = dataTables.map((data) => ({
        ...data,
        server_id: data.id,
        is_dirty: 0,
        _status: 'synced',
        updated_at: new Date(),
        raw_data: data,
      }));

      await DB.customers.bulkPut(operations);
      return { success: true, count: operations.length };
    } catch (error) {
      console.error('[Web DB] bulkUpdate Error:', error);
      throw error;
    }
  },

  /**
   * deleteByKey: Xóa vĩnh viễn khỏi IndexedDB
   */
  deleteByKey: async (id: string) => {
    try {
      await DB.customers.delete(id);
      await syncManager.addQueue({
        table_name: 'customers',
        type: 'background',
        record_id: id,
        action: 'DELETE',
      });
      console.log(`[Web DB] Deleted customer ${id}`);
    } catch (error) {
      console.error('[Web DB] Delete Error:', error);
    }
  },

  /**
   * clearData: Xóa sạch bảng
   */
  clearData: async () => {
    try {
      await DB.customers.clear();
      console.log('[Web DB] Table Customers cleared');
    } catch (error) {
      console.error('[Web DB] Clear Error:', error);
    }
  },
};

export default CustomerService;
