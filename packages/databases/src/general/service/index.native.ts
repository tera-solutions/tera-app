import { parseValue, stringifyValue } from '@tera/common/utils';
import DB from '@databases/database.native';
import { Q } from '@nozbe/watermelondb';
import General from '../models/general.native';

const GeneralService = {
  /**
   * Tạo hoặc cập nhật giá trị theo Key (Upsert)
   * Thường dùng cho db_ver, token, hoặc cấu hình ngành hàng
   */
  upsert: async (key: string, value: any, version?: number) => {
    if (!version) return;
    const generals = DB.instance.get<General>('generals');

    const stringifiedValue = stringifyValue(value);

    await DB.instance.write(async () => {
      const existing = await generals.query(Q.where('key', key)).fetch();

      if (existing.length > 0) {
        await existing[0].update((record) => {
          record.value = stringifiedValue;
          record.version = version;
          record._raw._status = 'synced';
        });
      } else {
        await generals.create((record) => {
          record.key = key;
          record.value = stringifiedValue;
          record.version = version;
          record._raw._status = 'synced';
        });
      }
    });
  },
  fetchAll: async () => {
    const collection = DB.instance.get<General>('generals');
    const records = await collection
      .query([Q.sortBy('updated_at', Q.desc)])
      .unsafeFetchRaw();

    return records;
  },
  /**
   * GetValue: Tự động Parse dữ liệu khi lấy ra
   */
  getValue: async (key: string, version?: number): Promise<any> => {
    const generals = DB.instance.get<General>('generals');

    const conditions = [];

    if (key) {
      conditions.push(Q.where('key', key));
    }

    if (version) {
      conditions.push(Q.where('version', version));
    }

    const records = await generals.query(...conditions).fetch();

    if (records.length > 0) {
      return parseValue(records[0].value);
    }
    return null;
  },

  /**
   * Xóa một cấu hình theo Key
   */
  deleteByKey: async (key: string) => {
    const generals = DB.instance.get<General>('generals');

    await DB.instance.write(async () => {
      const records = await generals.query(Q.where('key', key)).fetch();
      const batches = records.map((record) =>
        record.prepareDestroyPermanently(),
      );
      await DB.instance.batch(...batches);
    });
  },
  mappingGeneral: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    try {
      if (!DB.instance) return;
      for (const [index, data] of dataTables.entries()) {
        const serverId = data.key.toString() as string;

        // Ưu tiên tìm theo server_id, sau đó mới đến client_id (UUID)
        const stringifiedValue = stringifyValue(data?.value || {});

        const mapCommonFields: any = {
          key: serverId,
          value: stringifiedValue,
          version: Number(data.version) ?? 0,
        };

        if (data?.key) {
          mapCommonFields.id = data?.key.toString();
        }
        changesLocal.updated.push({
          ...mapCommonFields,
        });
      }

      console.tron('changesLocal General', changesLocal);

      return changesLocal;
    } catch (error) {
      console.error(error);
      return changesLocal;
    }
  },
  /**
   * Bulk Update - Cập nhật hàng loạt (Tối ưu cho đồng bộ API)
   */
  bulkUpdate: async (
    data: Array<{ key: string; value: string; version: number }>,
  ) => {
    const generals = DB.instance.get<General>('generals');

    await DB.instance.write(async () => {
      const allPrepared = data.map((item) =>
        generals.prepareCreate((record) => {
          record.key = item.key;
          record.value = stringifyValue(item.value);
          record.version = item.version;
          record._raw._status = 'synced';
        }),
      );
      await DB.instance.batch(...allPrepared);
    });
  },
};

export default GeneralService;
