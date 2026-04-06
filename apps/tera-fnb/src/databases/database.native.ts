import { dbName } from '@common/constants/common';
import appSchema from '@databases/appSchema.native';
import BusinessLocation from '@databases/business_locations/models/business_locations.native';
import Customer from '@databases/customer/models/customer.native';
import General from '@databases/general/models/general.native';
import SyncQueue from '@databases/sync_queues/models/sync_queues.native';
import TableVersion from '@databases/table_version/models/table_version.native.';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { File, Paths } from 'expo-file-system';
import { NativeModules, Platform } from 'react-native';

const { DatabaseSizeModule } = NativeModules;

class DatabaseService {
  private db: any = null;

  // 1. Mở kết nối
  initConnection = () => {
    // 2. Chỉ require thư viện khi ở Mobile (Android/iOS)
    try {
      const isJSIAvailable = !!global.nativeWatermelonCreateAdapter;

      console.log('isJSIAvailable', isJSIAvailable);

      const adapter = new SQLiteAdapter({
        dbName: dbName,
        schema: appSchema,
        jsi: Platform.OS === 'android' ? isJSIAvailable : true,
      });

      this.db = new Database({
        adapter,
        modelClasses: [
          General,
          TableVersion,
          BusinessLocation,
          SyncQueue,
          Customer,
        ],
      });

      return this.db;
    } catch (error) {
      console.error('❌ Lỗi Native Module:', error);
      return null;
    }
  };

  startInitialSync = async () => {
    // gọi hàm pull data mới từ đầu
  };

  getMemoryAndroid = async () => {
    try {
      const memory = await DatabaseSizeModule.getMemoryUsage();
      console.log(`📊 Memory Size:`, memory);
      return 0;
    } catch (error) {
      console.error('❌ Không thể lấy dung lượng DB:', error);
      return 0;
    }
  };

  getDbSizeAndroid = async () => {
    try {
      const size = await DatabaseSizeModule.getDbSize('RKStorage');
      console.log(`📊 [Tera-FNB] Database Physical Size: ${size} MB`, size);
      return size;
    } catch (error) {
      console.error('❌ Không thể lấy dung lượng DB:', error);
      return 0;
    }
  };

  getDbSizeIOS = async () => {
    try {
      let dbUri = '';

      const filesToCheck = [
        `${dbName}.db`,
        `${dbName}.db-wal`,
        `${dbName}.db-shm`,
      ];

      let dbSize = 0;
      for (const fileName of filesToCheck) {
        if (Platform.OS === 'ios') {
          // iOS: Nằm trực tiếp trong Documents
          dbUri = `${Paths.document.uri}${fileName}`;
        } else {
          const rootPath = Paths.document.uri.replace('/files/', '/');
          dbUri = `${rootPath}databases/${fileName}`;
        }

        const dbFile = new File(dbUri);
        if (dbFile.exists) {
          const info = await dbFile.info();
          if (info.size) {
            dbSize += info.size / (1024 * 1024);
            console.log(`📊 Size ${fileName}: ${dbSize} MB`);
          }
        } else {
          console.warn(`⚠️ Không thấy tại: ${dbUri}`);
        }
      }
      console.log(`📊 DB Size: ${dbSize} MB`);
      return dbSize;
    } catch (error) {
      console.error('❌ Không thể lấy dung lượng DB:', error);
      return 0;
    }
  };

  getStorageDatabase = async () => {
    if (Platform.OS === 'android') {
      await this.getMemoryAndroid();
      const result = await this.getDbSizeAndroid();
      return result;
    }

    if (Platform.OS === 'ios') {
      const result = await this.getDbSizeIOS();
      return result;
    }

    return 0;
  };

  get instance(): Database {
    if (!this.db) {
      return this.initConnection();
    }
    return this.db;
  }
}

const DB = new DatabaseService();
export default DB;
