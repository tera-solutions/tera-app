import { syncManager } from '@services/sync/SyncManager';
import DB from '../../database';
import BusinessLocation from '../models/business_locations';

const BusinessLocationService = {
  /**
   * Mock Upsert
   */
  upsert: async (data: BusinessLocation, version?: number) => {
    if (!version) return;
    try {
      // put() tự động xử lý logic: If exists update, else insert
      const resultId = await DB.business_locations.put({
        is_dirty: 0,
        ...data,
        is_delete: data.is_delete ? 1 : 0,
        is_default: data.is_default ? 1 : 0,
        is_new_address: data.is_new_address ? 1 : 0,
        updated_at: new Date(),
      });
      const finalId = (data.id || resultId).toString();
      if (finalId) {
        await syncManager.addQueue({
          table_name: 'business_locations',
          type: 'background',
          record_id: finalId,
          payload: { ...data, id: finalId },
          action: data.id ? 'UPDATE' : 'CREATE',
        });
      }

      return resultId;
    } catch (error) {
      console.error('Dexie Upsert Error:', error);
    }
  },

  getDetail: async (id: string): Promise<any> => {
    const query = DB.business_locations.toCollection();
    const records = await query
      .filter((rows) => {
        return !id || rows.id === id;
      })
      .toArray();
    if (records.length > 0) {
      return {
        ...records[0],
        _raw: records[0],
      };
    }
    return null;
  },

  getTotalRows: async (): Promise<any> => {
    return await DB.business_locations.where('is_delete').equals(0).count();
  },

  /**
   * Mock GetAll
   */
  getAll: async (
    filter: any = {
      page: 1,
      limit: 20,
      sort: 'desc',
    },
  ): Promise<any> => {
    try {
      const page = filter?.page ? Number(filter?.page) : 1;
      const pageSize = filter?.limit ? Number(filter?.limit) : 20;
      const skip = (page - 1) * pageSize;

      // Sao chép filter để lọc logic (tránh mutate tham số đầu vào)
      const activeFilters = { ...filter };
      const sortOrder = activeFilters.sort || 'desc';

      delete activeFilters.limit;
      delete activeFilters.page;
      delete activeFilters.sort;

      let collection = DB.business_locations.toCollection();

      if (sortOrder === 'desc') {
        collection = DB.business_locations.orderBy('id').reverse();
      } else {
        collection = DB.business_locations.orderBy('id');
      }

      collection = collection.filter((item: any) => {
        return Object.keys(activeFilters).every((key) => {
          const value = activeFilters[key];
          if (value === undefined || value === null || value === '')
            return true;

          if (key === 'name' || key === 'address') {
            return item[key]?.toLowerCase().includes(value.toLowerCase());
          }

          if (key === '_status') {
            return item._status !== 'synced';
          }

          return item[key] === value;
        });
      });

      const result = await collection.offset(skip).limit(pageSize).toArray();

      return result;
    } catch (error) {
      console.error('[Web DB] BusinessLocation getAll Error:', error);
      return [];
    }
  },
  getAllDelete: async (
    filter: any = {
      page: 1,
      limit: 20,
    },
  ): Promise<any> => {
    const page = filter?.page ? Number(filter?.page) : 1;
    const pageSize = filter?.limit ? Number(filter?.limit) : 20;
    const skip = (page - 1) * pageSize;

    const result = await DB.business_locations
      .reverse()
      .offset(skip)
      .limit(pageSize)
      .toArray();
    console.tron('get all list locations', result);

    return result;
  },
  fetchAll: async () => {
    return [];
  },
  /**
   * Mock Xóa theo Table Name
   */
  deleteByKey: async (id: string) => {
    try {
      await DB.business_locations.delete(id);
      await syncManager.addQueue({
        table_name: 'business_locations',
        type: 'background',
        record_id: id,
        action: 'DELETE',
      });
      console.log(`Deleted item ${id} from business_locations`);
    } catch (error) {
      console.error('Dexie Delete Error:', error);
    }
  },

  upsertMapping: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal: any[] = [];

    try {
      for (const data of dataTables) {
        const serverId = data.id;

        const mapCommonFields = {
          id: (data?.client_id || data?.id).toString(),
          server_id: serverId,
          location_id: data.location_id ?? '',
          name: data.name ?? '',
          mobile: data.mobile ?? '',
          address: data.address ?? '',
          ward: data.ward ?? '',
          city: data.city ?? '',
          last_sync_at: last_sync_at,
          is_new_address: data?.is_new_address ? 1 : 0,
          is_default: data?.is_default ? 1 : 0,
          is_delete: data?.is_delete ? 1 : 0,
          is_dirty: 0,
          updated_at: data?.updated_at ? new Date(data.updated_at) : new Date(),
        };

        changesLocal.push(mapCommonFields);
      }

      return changesLocal;
    } catch (error) {
      console.error('[BusinessLocationService] upsertMapping Error:', error);
      return changesLocal;
    }
  },

  mappingLocation: async (dataTables: any, last_sync_at: number) => {
    const changesLocal = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    try {
      const serverChanges = dataTables?.updated || dataTables?.created || [];

      if (Array.isArray(serverChanges) && serverChanges.length > 0) {
        changesLocal.updated = await BusinessLocationService.upsertMapping(
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
      console.error('[BusinessLocationService] mappingLocation Error:', error);
      return changesLocal;
    }
  },

  /**
   * Mock Bulk Update (Tối ưu cho Web bằng cách ghi 1 lần duy nhất)
   */
  bulkUpdate: async (dataTables: Array<BusinessLocation>, version?: number) => {
    try {
      if (!version) return;
      const startTime = performance.now();

      const operations = [];

      // 2. Phân loại Create hoặc Update
      for (const data of dataTables) {
        operations.push({
          is_dirty: 0,
          last_sync_at: data?.updated_at,
          ...data,
          version,
          server_id: data?.id as number,
          is_delete: data.is_delete ? 1 : 0,
          is_default: data.is_default ? 1 : 0,
          is_new_address: data.is_new_address ? 1 : 0,
        });
      }

      // bulkPut: Nếu trùng ID thì update, chưa có thì insert
      await DB.business_locations.bulkPut(operations);

      const endTime = performance.now();
      console.log(
        `Bulk update ${operations.length} items in ${endTime - startTime}ms`,
      );

      return { success: true };
    } catch (error) {
      console.error('Bulk update failed:', error);
      throw error;
    }
  },

  clearData: async () => {
    try {
      console.log('Clear all data business_locations');
    } catch (error) {
      console.error('Dexie Delete Error:', error);
    }
  },

  syncData: async () => {
    //
    console.log('syncData business_locations');
  },
};

export default BusinessLocationService;
