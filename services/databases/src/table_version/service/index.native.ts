import DB from "@databases/database.native";
import { Q } from "@nozbe/watermelondb";
import moment from "moment";
import TableVersion from "../models/table_version.native.";

const TableVersionService = {
  /**
   * Tạo hoặc cập nhật giá trị theo Key (Upsert)
   * Thường dùng cho db_ver, token, hoặc cấu hình ngành hàng
   */
  upsert: async (
    table_name: string,
    version?: number,
    is_dirty: number = 0,
  ) => {
    if (!version) return;
    const oldVersion = await TableVersionService.getValue(table_name);

    if (oldVersion === version && !is_dirty) return;

    const collection = DB.instance.get<TableVersion>("table_version_logs");

    await DB.instance.write(async () => {
      const existing = await collection
        .query(Q.where("table_name", table_name))
        .fetch();

      if (existing.length > 0) {
        await existing[0].update((record) => {
          record.version = version;
          record.is_dirty = oldVersion === version ? 0 : 1;
          record._raw = Object.assign({}, record._raw, {
            _status: "synced",
          });
        });
      } else {
        await collection.create((record) => {
          record.table_name = table_name;
          record.version = version;
          record.is_dirty = 1;
          record._raw = Object.assign({}, record._raw, {
            _status: "synced",
          });
        });
      }
    });
  },

  updateLastSync: async (
    table_name: string,
    last_sync_at: number,
    version?: number,
  ) => {
    if (!version) return;
    if (!last_sync_at) return;
    const collection = DB.instance.get<TableVersion>("table_version_logs");

    await DB.instance.write(async () => {
      const existing = await collection
        .query(Q.where("table_name", table_name))
        .fetch();

      if (existing.length > 0) {
        await existing[0].update((record) => {
          record.version = version;
          record.is_dirty = 0;
          record.last_sync_at = last_sync_at;
          record._raw = Object.assign({}, record._raw, {
            _status: "synced",
          });
        });
      }
    });
  },

  /**
   * GetValue: Tự động Parse dữ liệu khi lấy ra
   */
  getValue: async (table_name: string, version?: number): Promise<any> => {
    const collection = DB.instance.get<TableVersion>("table_version_logs");

    const conditions = [];

    if (table_name) {
      conditions.push(Q.where("table_name", table_name));
    }

    if (version) {
      conditions.push(Q.where("version", version));
    }

    const records = await collection.query(...conditions).fetch();

    if (records.length > 0) {
      return records[0].version;
    }
    return null;
  },

  getData: async (table_name: string, version?: number): Promise<any> => {
    const collection = DB.instance.get<TableVersion>("table_version_logs");

    const conditions = [];

    if (table_name) {
      conditions.push(Q.where("table_name", table_name));
    }

    if (version) {
      conditions.push(Q.where("version", version));
    }

    const records = await collection.query(...conditions).fetch();

    if (records.length > 0) {
      return records[0];
    }
    return null;
  },

  fetchAll: async () => {
    const collection = DB.instance.get<TableVersion>("table_version_logs");
    const records = await collection
      .query([Q.sortBy("updated_at", Q.desc)])
      .unsafeFetchRaw();

    return records;
  },

  /**
   * Lấy toàn bộ danh sách cấu hình (Observable cho UI)
   */
  observeTableVersions: () => {
    const collection = DB.instance.get<TableVersion>("table_version_logs");
    return collection.query().observe();
  },

  /**
   * Xóa một cấu hình theo Key
   */
  deleteByKey: async (table_name: string) => {
    const collection = DB.instance.get<TableVersion>("table_version_logs");

    await DB.instance.write(async () => {
      const records = await collection
        .query(Q.where("table_name", table_name))
        .fetch();
      const batches = records.map((record) =>
        record.prepareDestroyPermanently(),
      );
      await DB.instance.batch(...batches);
    });
  },
  mappingTableVersion: async (dataTables: Array<any>, last_sync_at: number) => {
    const changesLocal = {
      created: [] as any[],
      updated: [] as any[],
      deleted: [] as any[],
    };

    try {
      if (!DB.instance) return;

      const collection = DB.instance.get<TableVersion>("table_version_logs");

      // 1. Thu thập IDs để query một lần (Batch Query)
      const serverIds = dataTables.map((l) => String(l.id));
      if (serverIds.length === 0) return changesLocal;

      const [existingByServerId] = await Promise.all([
        collection.query(Q.where("id", Q.oneOf(serverIds))).fetch(),
      ]);

      const existingMap = new Map(existingByServerId.map((r) => [r.id, r]));
      for (const [index, data] of dataTables.entries()) {
        const serverId = String(data.id);

        // Ưu tiên tìm theo server_id, sau đó mới đến client_id (UUID)
        const existing = existingMap.get(serverId);

        const mapCommonFields: any = {
          table_name: data.table_name ?? "",
          version: data.version ?? 0,
          updated_at: moment(data.updated_at).unix() ?? moment().unix(),
          is_dirty: existing?.version !== data?.version ? 1 : 0,
          last_sync_at: last_sync_at,
        };

        if (data.id) {
          mapCommonFields.id = serverId;
        }

        if (!existing || existing.version !== data.version) {
          changesLocal.updated.push({
            ...mapCommonFields,
          });
        }
      }

      console.tron("changesLocal Table version", changesLocal);

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
    dataTables: Array<{
      table_name: string;
      version: number;
      updated_at?: Date;
    }>,
  ) => {
    try {
      const collection = DB.instance.get<TableVersion>("table_version_logs");

      await DB.instance.write(async () => {
        // 1. Fetch toàn bộ để map vào bộ nhớ
        const allTableNames = dataTables.map((p) => p.table_name);
        const existingProducts = await collection
          .query(Q.where("table_name", Q.oneOf(allTableNames)))
          .fetch();

        const existingMap = new Map(
          existingProducts.map((p) => [p.table_name, p]),
        );
        const operations = [];

        for (const data of dataTables) {
          const existingRecord = existingMap.get(data.table_name);

          if (existingRecord) {
            // KHÔNG dùng TableVersionService.getValue ở đây
            // So sánh trực tiếp với giá trị đang có trong model record
            if (existingRecord.version !== data.version) {
              console.log(
                "🔄 Trigger Update Version:",
                data.table_name,
                "->",
                data.version,
              );

              operations.push(
                existingRecord.prepareUpdate((record) => {
                  record.version = data.version;
                  record.is_dirty = 1;
                  record._raw = Object.assign({}, record._raw, {
                    _status: "synced",
                  });
                }),
              );
            }
          } else {
            console.log("🆕 Trigger Create Version:", data.table_name);
            operations.push(
              collection.prepareCreate((record) => {
                record.table_name = data.table_name;
                record.version = data.version;
                record.last_sync_at = 0;
                record.is_dirty = 1;
                record._raw = Object.assign({}, record._raw, {
                  _status: "synced",
                });
              }),
            );
          }
        }

        // 2. Batch thực thi
        if (operations.length > 0) {
          await DB.instance.batch(...operations);
          console.log(
            "✅ Batch update thành công, observer sẽ nhận được tín hiệu.",
          );
        }
      });
    } catch (error) {
      console.error("bulkUpdate Table Logs ERROR: ", error);
    }
  },
};

export default TableVersionService;
