import DB from '@databases/database.native';
import { Q } from '@nozbe/watermelondb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncManager } from '@services/sync/SyncManager';
import IBusinessLocation from '../models/business_locations';
import BusinessLocation from '../models/business_locations.native';

const BusinessLocationService = {
  /**
   * Tạo hoặc cập nhật giá trị theo Key (Upsert)
   * Thường dùng cho db_ver, token, hoặc cấu hình ngành hàng
   */
  upsert: async (data: IBusinessLocation) => {
    const collection = DB.instance.get<BusinessLocation>('business_locations');

    const result = await DB.instance.write(async () => {
      const existing = await collection
        .query(Q.where('id', data?.id ?? ''))
        .fetch();

      const cleanData: any = { ...data, is_dirty: 1 };
      delete cleanData.id;

      if (existing.length > 0) {
        return await existing[0].update((record) => {
          Object.assign(record, cleanData);
        });
      } else {
        return await collection.create((record) => {
          if (data.id) {
            record._raw.id = data.id.toString();
          }
          Object.assign(record, cleanData);
        });
      }
    });

    if (result?.id) {
      await syncManager.addQueue({
        table_name: 'business_locations',
        type: 'background',
        record_id: result.id,
        payload: { ...data, id: result.id },
        action: data.id ? 'UPDATE' : 'CREATE',
      });
    }

    return result;
  },

  getTotalRows: async (): Promise<any> => {
    const collection = DB.instance.get<BusinessLocation>('business_locations');

    return await collection.query(Q.where('is_delete', 0)).count;
  },
  fetchAll: async () => {
    const collection = DB.instance.get<BusinessLocation>('business_locations');
    const records = await collection
      .query([Q.sortBy('updated_at', Q.desc)])
      .unsafeFetchRaw();

    return records;
  },
  getAll: async (
    filter: any = {
      page: 1,
      limit: 20,
      sort: 'desc',
    },
  ): Promise<any> => {
    try {
      if (!DB.instance) {
        // Nếu chưa init mà đã call instance thì sẽ gây lỗi property 'get' of null
        console.log('Database chưa được khởi tạo!');
        return [];
      }

      const page = filter?.page ? Number(filter?.page) : 1;
      const pageSize = filter?.limit ? Number(filter?.limit) : 20;
      delete filter?.limit;
      delete filter?.page;

      const collection =
        DB.instance.get<BusinessLocation>('business_locations');

      const queryClauses: any[] = [
        Q.sortBy('updated_at', Q.desc),
        Q.skip((page - 1) * pageSize),
        Q.take(pageSize),
      ];
      Object.keys(filter).forEach((key) => {
        const value = filter[key];
        if (value !== undefined && value !== null) {
          if (key === 'name' || key === 'address') {
            queryClauses.push(
              Q.where(
                key,
                Q.like(`%${Q.sanitizeLikeString(value?.toLowerCase())}%`),
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
      console.log('queryClauses', queryClauses);

      const result = await collection.query(...queryClauses).fetch();
      return result;
    } catch (error) {
      console.error('ERROR', error);
      return [];
    }
  },

  getAllDelete: async (): Promise<any> => {
    try {
      if (!DB.instance) {
        console.log('Database chưa được khởi tạo!');
        return [];
      }

      const collection =
        DB.instance.get<BusinessLocation>('business_locations');

      // const result = await (collection as any).experimentalGetDeletedIds();

      const result = await collection.query(Q.where('is_delete', 1)).fetch();
      return result;
    } catch (error) {
      console.error('ERROR', error);
      return [];
    }
  },

  /**
   * GetValue: Tự động Parse dữ liệu khi lấy ra
   */
  getDetail: async (id: string): Promise<any> => {
    const collection = DB.instance.get<BusinessLocation>('business_locations');

    const conditions = [];
    console.log('id', id);

    if (id) {
      conditions.push(Q.where('id', id));
    }

    const records = await collection.query(...conditions).fetch();

    if (records.length > 0) {
      return records[0];
    }
    return null;
  },

  /**
   * Lấy toàn bộ danh sách cấu hình (Observable cho UI)
   */
  observeBusinessLocations: () => {
    const collection = DB.instance.get<BusinessLocation>('business_locations');
    return collection.query().observe();
  },

  /**
   * Xóa một cấu hình theo Key
   */
  deleteByKey: async (id: string) => {
    const collection = DB.instance.get<BusinessLocation>('business_locations');

    try {
      const recordExist = await collection.find(id);
      console.tron(recordExist);
      if (recordExist) {
        await recordExist.markAsDeleted();
        await syncManager.addQueue({
          table_name: 'business_locations',
          type: 'background',
          record_id: id,
          action: 'DELETE',
        });
      }
    } catch (error) {
      console.warn(`Record với id ${id} không tồn tại hoặc đã bị xóa.`);
    }
  },
  truncateTable: async () => {
    await DB.instance.write(async () => {
      // Lưu ý: Lệnh này xóa trực tiếp trong SQLite, rất nhanh
      console.tron(`Data local being truncateTable!`);
      await DB.instance.adapter.unsafeExecute({
        sqls: [['delete from business_locations', []]],
      });
    });
  },
  /**
   * Bulk Update - Cập nhật hàng loạt (Tối ưu cho đồng bộ API)
   */
  bulkUpdate: async (
    dataTables: Array<IBusinessLocation>,
    last_sync_at: number,
  ) => {
    try {
      if (!DB.instance) return;

      const collection =
        DB.instance.get<BusinessLocation>('business_locations');

      // 1. Thu thập IDs để query một lần (Batch Query)
      const serverIds = dataTables.map((l) => l.id as number);
      const clientIds = dataTables
        .filter((d) => d.client_id)
        .map((d) => d.client_id as string);

      const [existingByServerId, existingByClientId] = await Promise.all([
        collection.query(Q.where('server_id', Q.oneOf(serverIds))).fetch(),
        clientIds.length
          ? collection.query(Q.where('id', Q.oneOf(clientIds))).fetch()
          : [],
      ]);

      const existingMap = new Map(
        existingByServerId.map((r) => [r.server_id, r]),
      );
      const localMap = new Map(existingByClientId.map((r) => [r.id, r]));

      await DB.instance.write(async () => {
        const operations: any[] = [];

        // Dùng for...of thay vì forEach để đảm bảo await chạy đúng
        for (const [index, data] of dataTables.entries()) {
          const serverId = data.id as number;
          const clientId = data.client_id as string;

          // Ưu tiên tìm theo server_id, sau đó mới đến client_id (UUID)
          const existing =
            existingMap.get(serverId) ||
            (clientId ? localMap.get(clientId) : null);

          const mapCommonFields = (record: BusinessLocation) => {
            record.server_id = serverId;
            record.location_id = data.location_id ?? '';
            record.name = data.name ?? '';
            record.mobile = data.mobile ?? '';
            record.address = data.address ?? '';
            record.ward = data.ward ?? '';
            record.city = data.city ?? '';
            record.last_sync_at = last_sync_at;

            // QUAN TRỌNG: Chỉ set synced nếu không có thay đổi local đang chờ
            // Hoặc ép buộc đồng bộ dữ liệu từ server về
          };

          if (existing) {
            // Tránh lỗi "Pending changes": Kiểm tra status trước khi update
            // Nếu record đang 'created' hoặc 'updated' ở local, cân nhắc kĩ có nên đè không
            operations.push(
              existing.prepareUpdate((record) => {
                mapCommonFields(record);
                record._raw = Object.assign({}, record._raw, {
                  _status: 'synced',
                });
              }),
            );
          } else {
            operations.push(
              collection.prepareCreate((record) => {
                if (data?.client_id) {
                  console.tron('created ===== new ', data?.client_id);
                  // record._raw.id = data?.client_id.toString();
                }
                mapCommonFields(record);

                if (!data?.client_id || index === 0) {
                  record._raw = Object.assign({}, record._raw, {
                    _status: 'updated',
                  });
                } else {
                  record._raw = Object.assign({}, record._raw, {
                    _status: 'synced',
                  });
                }
              }),
            );
          }
        }

        if (operations.length > 0) {
          await DB.instance.batch(...operations);
          console.log(`[BulkUpdate] Success: ${operations.length} items`);
        }
      });
    } catch (error) {
      console.error('bulkUpdate ERROR: ', error);
    }
  },
  upsertMapping: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal = [];

    try {
      for (const [index, data] of dataTables.entries()) {
        const serverId = data.id as number;

        const mapCommonFields: any = {
          id: data?.client_id.toString(),
          server_id: serverId,
          location_id: data.location_id ?? '',
          name: data.name ?? '',
          mobile: data.mobile ?? '',
          address: data.address ?? '',
          ward: data.ward ?? '',
          city: data.city ?? '',
          last_sync_at: last_sync_at,
          is_new_address: data?.is_new_address ?? 0,
          is_default: data?.is_default ?? 0,
        };
        changesLocal.push(mapCommonFields);
      }

      return changesLocal;
    } catch (error) {
      console.error(error);
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
      changesLocal.updated = await BusinessLocationService.upsertMapping(
        dataTables?.updated || [],
        last_sync_at,
      );
      changesLocal.deleted = dataTables?.deleted || [];
      return changesLocal;
    } catch (error) {
      console.error(error);
      return changesLocal;
    }
  },
  clearData: async () => {
    try {
      await BusinessLocationService.truncateTable();
      await AsyncStorage.removeItem(`business_locations:lastPulledAt`);
      console.log('Clear all data business_locations');
    } catch (error) {
      console.error('Dexie Delete Error:', error);
    }
  },
  // syncData: async () => {
  //   const syncRegistry = {
  //     business_locations: {
  //       pulled: false,
  //       pushed: false,
  //       version: 0,
  //       timestamp: 0,
  //     },
  //   };
  //   const table_version =
  //     await TableVersionService.getData('business_locations');
  //   const updatedAt = table_version?.last_sync_at
  //     ? moment.unix(table_version?.last_sync_at).format('YYYY-MM-DD HH:mm:ss')
  //     : null;

  //   await synchronize({
  //     database: DB.instance,
  //     pullChanges: async () => {
  //       let mappingData: any = {
  //         created: [],
  //         updated: [],
  //         deleted: [],
  //       };
  //       let lastPulledAt = moment().unix();

  //       if (!!table_version?.is_dirty) {
  //         console.tron('table_version business_locations', table_version);
  //         console.tron(
  //           'pullChanges lastPulledAt',
  //           table_version?.last_sync_at,
  //           updatedAt,
  //         );

  //         const response = await BusinessLocationAPI.getList({
  //           params: {
  //             updated_at: updatedAt,
  //             limit: 100,
  //           },
  //         });
  //         console.tron('get new from server table_version', response);

  //         const { data, timestamp, version } = response;
  //         console.tron('get new from server timestamp', timestamp, data);

  //         if (data?.data?.length) {
  //           // BusinessLocationService.truncateTable();
  //           // await BusinessLocationService.bulkUpdate(data?.data || [], timestamp);
  //         }

  //         mappingData = await BusinessLocationService.mappingLocation(
  //           (data?.data as any) || [],
  //           timestamp,
  //         );

  //         lastPulledAt = timestamp || moment().unix();
  //         syncRegistry.business_locations.pulled = true;
  //         syncRegistry.business_locations.timestamp = lastPulledAt as any;
  //         syncRegistry.business_locations.version = version;
  //         console.tron('mappingData change', mappingData);
  //       }

  //       return {
  //         changes: {
  //           business_locations: mappingData,
  //         },
  //         timestamp: Number(lastPulledAt) * 1000,
  //       };
  //     },
  //     pushChanges: async ({ changes, lastPulledAt }: any) => {
  //       const hasOrderChanges = hasChangesTable(changes.business_locations);
  //       console.tron('hasOrderChanges', changes, hasOrderChanges);
  //       console.tron('syncRegistry', syncRegistry);

  //       if (hasOrderChanges) {
  //         console.tron('pushChanges lastPulledAt', changes, updatedAt);
  //         const safeChanges = {
  //           created: changes.business_locations.created,
  //           updated: [] as any[],
  //           deleted: [] as any[],
  //         };

  //         changes.business_locations.updated.forEach((record: any) => {
  //           if (record.is_delete === 1) {
  //             safeChanges.deleted.push(record.id);
  //           } else {
  //             safeChanges.updated.push(record);
  //           }
  //         });
  //         console.tron('state change', safeChanges);

  //         const result = await BusinessLocationAPI.pushChange({
  //           params: {
  //             ...safeChanges,
  //             version: table_version?.version,
  //             updated_at: updatedAt,
  //           },
  //         });

  //         if (result?.code === 200 && result?.success === true) {
  //           console.log('pushChanges success');
  //           if (result?.data?.length > 0) {
  //             console.tron('bulkUpdate data', result?.data);
  //             await BusinessLocationService.bulkUpdate(
  //               result?.data || [],
  //               lastPulledAt,
  //             );
  //           }
  //           return result?.success;
  //         } else {
  //           throw new Error(result);
  //         }
  //       }

  //       return true;
  //       // await SyncAPI.uploadChanges(changes);
  //       // throw new Error('No data sync!');
  //     },
  //   })
  //     .then(async () => {
  //       if (syncRegistry.business_locations.pulled) {
  //         await TableVersionService.updateLastSync(
  //           'business_locations',
  //           syncRegistry.business_locations.timestamp,
  //           syncRegistry.business_locations.version,
  //         );
  //         console.tron(
  //           'Pull step finished logic',
  //           syncRegistry.business_locations,
  //           moment
  //             .unix(syncRegistry.business_locations.timestamp)
  //             .format('HH:mm:ss'),
  //         );
  //       }
  //       console.tron('FULL SYNC COMPLETED SUCCESSFULLY', syncRegistry);
  //       // Cập nhật UI icon: cloud-check
  //     })
  //     .catch(async (err) => {
  //       console.tron('ERROR SYNC business_locations:', err);
  //     });
  // },
};

export default BusinessLocationService;
