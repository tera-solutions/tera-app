import { ISyncStatus, SyncStatus } from '@tera/common/interfaces';
import { stringifyValue } from '@tera/common/utils';
import DB from '@databases/database.native';
import ISyncQueue from '@databases/sync_queues/models/sync_queues';
import SyncQueue from '@databases/sync_queues/models/sync_queues.native';
import { Q } from '@nozbe/watermelondb';

const SyncQueueService = {
  /**
   * Tạo hoặc cập nhật giá trị theo Key (Upsert)
   * Thường dùng cho db_ver, token, hoặc cấu hình ngành hàng
   */
  upsert: async (data: ISyncQueue) => {
    const collection = DB.instance.get<SyncQueue>('sync_queues');

    const stringifiedValue = stringifyValue(data?.payload ?? '');
    const mapCommonFields = (record: SyncQueue) => {
      record.table_name = data?.table_name ?? '';
      record.record_id = data?.record_id ?? '';
      record.type = data?.type ?? 'manual';
      record.action = data?.action ?? 'GET';
      record.payload = stringifiedValue;
      record.retries = data?.retries ?? 0;
      record.status = data?.status ?? SyncStatus.QUEUED;
      record._raw._status = 'synced';
    };
    console.tron('mapCommonFields', mapCommonFields);

    await DB.instance.write(async () => {
      const existing = await collection
        .query(Q.where('id', data?.id ?? null))
        .fetch();
      if (existing.length > 0) {
        await existing[0].update((record) => {
          mapCommonFields(record);
        });
      } else {
        await collection.create((record) => {
          mapCommonFields(record);
        });
      }
    });
  },
  getAll: async (
    filter: any = {
      page: 1,
      limit: 100,
    },
  ): Promise<any> => {
    try {
      if (!DB.instance) {
        // Nếu chưa init mà đã call instance thì sẽ gây lỗi property 'get' of null
        console.log('Database chưa được khởi tạo!');
        return [];
      }

      const page = filter?.page ? Number(filter?.page) : 1;
      const pageSize = filter?.limit ? Number(filter?.limit) : 100;
      delete filter?.limit;
      delete filter?.page;
      const collection = DB.instance.get<SyncQueue>('sync_queues');

      const queryClauses: any[] = [
        Q.sortBy('created_at', Q.asc),
        Q.skip((page - 1) * pageSize),
        Q.take(pageSize),
      ];
      Object.keys(filter).forEach((key) => {
        const value = filter[key];

        if (value !== undefined && value !== null) {
          if (key === 'name') {
            queryClauses.push(
              Q.where(key, Q.like(`%${Q.sanitizeLikeString(value)}%`)),
            );
          } else if (key === '_status') {
            queryClauses.push(Q.where('_status', Q.notEq('synced')));
          } else if (
            key === 'status' &&
            Array.isArray(value) &&
            value?.length > 0
          ) {
            return queryClauses.push(Q.where('status', Q.oneOf(value)));
          } else {
            queryClauses.push(Q.where(key, value));
          }
        }
      });
      const result = await collection.query(...queryClauses).fetch();
      return result;
    } catch (error) {
      console.error('ERROR', error);
      return [];
    }
  },
  fetchAll: async () => {
    const collection = DB.instance.get<SyncQueue>('sync_queues');
    const records = await collection
      .query([Q.sortBy('updated_at', Q.desc)])
      .unsafeFetchRaw();

    return records;
  },
  /**
   * GetValue: Tự động Parse dữ liệu khi lấy ra
   */
  getValue: async (id: string): Promise<any> => {
    const sync_queues = DB.instance.get<SyncQueue>('sync_queues');

    const conditions = [];

    if (id) {
      conditions.push(Q.where('id', id));
    }

    const records = await sync_queues.query(...conditions).fetch();

    if (records.length > 0) {
      return records[0];
    }
    return null;
  },

  /**
   * Xóa một cấu hình theo Key
   */
  deleteByKey: async (id: string) => {
    const sync_queues = DB.instance.get<SyncQueue>('sync_queues');

    await DB.instance.write(async () => {
      const records = await sync_queues.query(Q.where('id', id)).fetch();
      const batches = records.map((record) =>
        record.prepareDestroyPermanently(),
      );
      await DB.instance.batch(...batches);
    });
  },
  bulkUpdateStatus: async (data: Array<ISyncQueue>, status: ISyncStatus) => {
    try {
      if (!DB.instance) return;

      const collection = DB.instance.get<SyncQueue>('sync_queues');
      const ids = data.map((item) => item.id as string);

      // 1. Fetch tất cả instances từ DB dựa trên list ID truyền vào
      const recordsToUpdate = await collection
        .query(Q.where('id', Q.oneOf(ids)))
        .fetch();

      await DB.instance.write(async () => {
        const allPrepared = recordsToUpdate.map((record) => {
          // Tìm thông tin update tương ứng từ data truyền vào
          const updateInfo = data.find((d) => d.id === record.id);

          return record.prepareUpdate((rec) => {
            let retry = updateInfo?.retries ?? 0;
            if (status === SyncStatus.FAILED) {
              retry += 1;
            }
            if (retry >= 3) {
              rec.type = 'manual';
            }
            if (status === SyncStatus.QUEUED) {
              retry = 0;
              rec.type = 'background';
            }
            rec.status = status ?? SyncStatus.RUNNING;
            rec.retries = retry;
            rec._raw._status = 'synced';
          });
        });

        // 2. Thực thi update hàng loạt trong 1 transaction
        await DB.instance.batch(...allPrepared);
      });
    } catch (error) {
      console.error('Bulk Update Status Error:', error);
    }
  },
  /**
   * Bulk Update - Cập nhật hàng loạt (Tối ưu cho đồng bộ API)
   */
  bulkUpdate: async (data: Array<ISyncQueue>) => {
    const sync_queues = DB.instance.get<SyncQueue>('sync_queues');

    await DB.instance.write(async () => {
      const allPrepared = data.map((item) =>
        sync_queues.prepareCreate((record) => {
          record.table_name = item?.table_name ?? '';
          record.record_id = item?.record_id ?? '';
          record.type = item?.type ?? 'manual';
          record.action = item?.action ?? 'GET';
          record.payload = stringifyValue(item?.payload ?? '');
          record.retries = item?.retries ?? 0;
          record.status = item?.status ?? SyncStatus.QUEUED;
          record._raw._status = 'synced';
        }),
      );
      await DB.instance.batch(...allPrepared);
    });
  },
};

export default SyncQueueService;
