import { appVersion, dbName } from "@tera/commons/constants/common";
import appSchema from "@databases/appSchema";
import BusinessLocation from "@databases/business_locations/models/business_locations";
import ICustomer from "@databases/customer/models/customer";
import Geneal from "@databases/general/models/general";
import SyncQueue from "@databases/sync_queues/models/sync_queues";
import TableVersion from "@databases/table_version/models/table_version";
import Dexie, { Table } from "dexie";

// database.ts
class DatabaseService extends Dexie {
  table_version_logs!: Table<TableVersion>;
  generals!: Table<Geneal>;
  business_locations!: Table<BusinessLocation>;
  sync_queues!: Table<SyncQueue>;
  customers!: Table<ICustomer>;

  constructor() {
    super(dbName);
  }

  initConnection = () => {
    try {
      this.version(appVersion).stores(appSchema);
      console.log("🌐 Web Mode: Database initConnection IndexDB");
      return null;
    } catch (error) {
      console.error("❌ Lỗi Web Module:", error);
      return null;
    }
  };

  getStorageDatabase = async () => {
    return 0;
  };

  // Mock getter instance để tránh lỗi undefined khi gọi DB.instance
  get instance(): any {
    return {
      get: () => ({
        query: () => ({
          fetch: () => Promise.resolve([]),
          observe: () => ({ subscribe: () => {} }),
        }),
      }),
      write: async (cb: any) => await cb(),
    };
  }
}

const DB = new DatabaseService();
export default DB;
