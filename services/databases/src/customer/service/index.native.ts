import { parseValue, stringifyValue } from '@tera/commons/utils';
import DB from '@databases/database.native';
import { Q } from '@nozbe/watermelondb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncManager } from '@services/sync/SyncManager';
import Customer from '../models/customer.native';

const CustomerService = {
  /**
   * Helper mapping dữ liệu đồng nhất giữa các field index và raw_data
   */
  _mapFields: (record: Customer, data: any) => {
    record.server_id = data.id || data.server_id || record.server_id || 0;
    record.code = data.code || record.code || '';
    record.business_name =
      data.business_name || data.business_name || record.business_name || '';
    record.phone = data.phone || record.phone || '';
    record.avatar_url =
      data.avatar_url || data.avatar || record.avatar_url || '';
    record.email = data.email || record.email || '';
    record.address = data.address || record.address || '';
    record.tax = data.tax || record.tax || '';
    record.object = data.object || record.object || 'crm_customer-object_new';
    record.debt_limit = Number(data.debt_limit) || record.debt_limit || 0;
    record.debt_period = Number(data.debt_period) || record.debt_period || 0;
    record.is_delete = data.is_delete || 0;

    // Lưu toàn bộ object vào JSON field
    record.raw_data = stringifyValue(data);
  },

  /**
   * Upsert: Tạo hoặc cập nhật record từ UI
   */
  upsert: async (data: any) => {
    const collection = DB.instance.get<Customer>('customers');

    const result = await DB.instance.write(async () => {
      const existing = await collection
        .query(Q.or(Q.where('id', data?.id ?? '')))
        .fetch();

      console.log('existing', existing);

      if (existing.length > 0) {
        return await existing[0].update((record) => {
          CustomerService._mapFields(record, data);
        });
      } else {
        return await collection.create((record) => {
          if (data.id && typeof data.id === 'string') {
            record._raw.id = data.id;
          }
          CustomerService._mapFields(record, data);
        });
      }
    });

    console.log('result', result);

    if (result?.id) {
      await syncManager.addQueue({
        table_name: 'customers',
        type: 'background',
        record_id: result.id,
        payload: { ...data, id: result.id },
        action: data.id ? 'UPDATE' : 'CREATE',
      });
    }

    return result;
  },

  /**
   * Lấy tổng số dòng (không bao gồm đã xóa)
   */
  getTotalRows: async (): Promise<number> => {
    const collection = DB.instance.get<Customer>('customers');
    return await collection.query(Q.where('is_delete', 0)).count;
  },

  /**
   * Fetch All: Lấy raw data nhanh (thường dùng cho sync hoặc export)
   */
  fetchAll: async () => {
    const collection = DB.instance.get<Customer>('customers');
    return await collection
      .query(Q.sortBy('updated_at', Q.desc))
      .unsafeFetchRaw();
  },

  /**
   * getAll: Lấy danh sách có phân trang và search
   */
  getAll: async (filter: any = { page: 1, limit: 20 }): Promise<any[]> => {
    try {
      if (!DB.instance) return [];

      const page = filter?.page ? Number(filter?.page) : 1;
      const pageSize = filter?.limit ? Number(filter?.limit) : 20;
      delete filter?.limit;
      delete filter?.page;

      const collection = DB.instance.get<Customer>('customers');
      const queryClauses: any[] = [
        Q.sortBy('updated_at', Q.desc),
        Q.skip((page - 1) * pageSize),
        Q.take(pageSize),
      ];

      Object.keys(filter).forEach((key) => {
        const value = filter[key];
        if (value !== undefined && value !== null) {
          if (key === 'keyword') {
            const searchStr = `%${Q.sanitizeLikeString(value.toLowerCase())}%`;
            queryClauses.push(
              Q.or(
                Q.where('code', Q.like(`%${searchStr}%`)),
                Q.where('phone', Q.like(`%${searchStr}%`)),
                Q.where('address', Q.like(`%${searchStr}%`)),
                Q.where('business_name', Q.like(`%${searchStr}%`)),
              ),
            );
          } else if (key === '_status') {
            queryClauses.push(Q.where('_status', Q.notEq('synced')));
          } else if (key === 'sort') {
            if (value === 'desc') {
              queryClauses.push(Q.sortBy('server_id', Q.desc));
            } else {
              queryClauses.push(Q.sortBy('server_id', Q.asc));
            }
          } else {
            queryClauses.push(Q.where(key, value));
          }
        }
      });

      const records = await collection.query(...queryClauses).fetch();
      return records.map((r) => ({
        ...r.raw_data,
        id: r.id,
        server_id: r.server_id,
        raw_data: parseValue(r?.raw_data),
        business_name: r.business_name,
      }));
    } catch (error) {
      console.error('[CustomerService] getAll error', error);
      return [];
    }
  },

  /**
   * getDetail: Lấy chi tiết 1 khách hàng
   */
  getDetail: async (id: string): Promise<Customer | null> => {
    try {
      const collection = DB.instance.get<Customer>('customers');
      const result = await collection.find(id);
      return { ...result, raw_data: parseValue(result?.raw_data) } as Customer;
    } catch (error) {
      return null;
    }
  },

  /**
   * getAllDelete: Lấy danh sách record đang chờ xóa
   */
  getAllDelete: async (): Promise<any[]> => {
    const collection = DB.instance.get<Customer>('customers');
    return await collection.query(Q.where('is_delete', 1)).fetch();
  },

  /**
   * Observe: Theo dõi thay đổi database cho UI (Realtime)
   */
  observeCustomers: () => {
    const collection = DB.instance.get<Customer>('customers');
    return collection.query(Q.where('is_delete', 0)).observe();
  },

  /**
   * Xóa theo ID (Sử dụng hàm markAsDeleted trong Model)
   */
  deleteByKey: async (id: string) => {
    try {
      const collection = DB.instance.get<Customer>('customers');
      const record = await collection.find(id);
      if (record) {
        await record.markAsDeleted();
        if (record?.server_id) {
          await syncManager.addQueue({
            table_name: 'customers',
            type: 'background',
            action: 'DELETE',
            record_id: id,
          });
        }

        return true;
      }
    } catch (error) {
      console.warn(`Record ${id} không tồn tại.`);
    }
    return false;
  },

  checkCleanData: async () => {
    const collection = DB.instance.get<Customer>('customers');
    const dataDirty = await collection.query(Q.where('is_dirty', 1)).fetch();
    if (dataDirty && dataDirty.length > 0) {
      console.tron('Tìm thấy ' + dataDirty.length + ' bản ghi dirty');
      // Thực hiện logic sync lên Laravel
    } else {
      console.tron('Không có dữ liệu thay đổi.');
    }
  },

  upsertMapping: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal: any[] = [];
    try {
      for (const data of dataTables) {
        changesLocal.push({
          id: (data?.client_id || data.id).toString(),
          server_id: data.id,
          business_id: data.business_id || 0,
          code: data.code || '',
          business_name: data.business_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          email: data.email || '',
          address: data.address || '',
          tax: data.tax || '',
          object: data.object || 'crm_customer-object_new',
          debt_limit: Number(data.debt_limit) || 0,
          debt_period: Number(data.debt_period) || 0,
          is_delete: data.is_delete ? 1 : 0,
          is_dirty: !data?.client_id ? 1 : 0,
          last_sync_at: last_sync_at,
          raw_data: stringifyValue(data),
        });
      }
      return changesLocal;
    } catch (error) {
      console.error('[Native] upsertMapping Error:', error);
      return changesLocal;
    }
  },

  /**
   * mappingCustomer: Function anh đang thiếu để dùng trong synchronize()
   */
  mappingCustomer: async (dataTables: any, last_sync_at: number) => {
    const changesLocal = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    try {
      // API thường trả về data trong trường 'updated' hoặc 'created' hoặc mảng phẳng
      const serverChanges =
        dataTables?.updated || dataTables?.created || dataTables || [];

      if (Array.isArray(serverChanges) && serverChanges.length > 0) {
        const dataUpdated = await CustomerService.upsertMapping(
          serverChanges,
          last_sync_at,
        );

        changesLocal.updated = dataUpdated;
      }

      if (Array.isArray(dataTables?.deleted)) {
        changesLocal.deleted = dataTables.deleted.map((id: any) =>
          id.toString(),
        );
      }

      return changesLocal;
    } catch (error) {
      console.error('[Native] mappingCustomer Error:', error);
      return changesLocal;
    }
  },

  /**
   * bulkUpdate: Cập nhật hàng loạt từ Server (Pull Changes)
   */
  bulkUpdate: async (dataTables: Array<any>, last_sync_at: number) => {
    try {
      if (!DB.instance || !dataTables.length) return;
      const collection = DB.instance.get<Customer>('customers');

      const serverIds = dataTables.map((d) => d.id);
      const existingRecords = await collection
        .query(Q.where('server_id', Q.oneOf(serverIds)))
        .fetch();
      const existingMap = new Map(existingRecords.map((r) => [r.server_id, r]));

      await DB.instance.write(async () => {
        const operations = dataTables.map((data) => {
          const existing = existingMap.get(data.id);
          const mapper = (record: Customer) => {
            CustomerService._mapFields(record, data);
            record._raw = Object.assign({}, record._raw, { _status: 'synced' });
          };

          return existing
            ? existing.prepareUpdate(mapper)
            : collection.prepareCreate(mapper);
        });

        if (operations.length > 0) await DB.instance.batch(...operations);
      });
    } catch (error) {
      console.error('[CustomerService] bulkUpdate error', error);
    }
  },

  /**
   * Truncate Table: Xóa sạch dữ liệu bảng
   */
  truncateTable: async () => {
    await DB.instance.write(async () => {
      await DB.instance.adapter.unsafeExecute({
        sqls: [['delete from customers', []]],
      });
    });
  },

  /**
   * Clear Data: Reset bảng và last sync time
   */
  clearData: async () => {
    try {
      await CustomerService.truncateTable();
      await AsyncStorage.removeItem(`customers:lastPulledAt`);
    } catch (error) {
      console.error('[CustomerService] clearData error', error);
    }
  },
};

export default CustomerService;
