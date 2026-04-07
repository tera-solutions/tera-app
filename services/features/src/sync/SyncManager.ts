import {
  IQueueProps,
  ISyncAction,
  ISyncType,
  SpecificTables,
  SyncStatus,
} from '@tera/commons/interfaces/index';
import {
  pushDataToServer,
  syncDataFromServer,
} from '@databases/sync/service/sync.service';
import SyncQueueService from '@databases/sync_queues/service';
import NetInfo from '@react-native-community/netinfo';
import { debounce } from 'lodash';

interface AddQueueProps {
  table_name: SpecificTables;
  type: ISyncType;
  action: ISyncAction;
  record_id?: string;
  payload?: any;
}

class SyncManager {
  public queue: Array<IQueueProps> = [];
  public isProcessing = false;
  public isSyncing = false;

  public triggerSync = debounce(async (type: ISyncType) => {
    await this.sync(type);
  }, 1000);

  public async sync(type: ISyncType) {
    if (this.isSyncing) return;

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.warn('No internet connection, skipping sync.');
      return;
    }

    this.isSyncing = true;
    try {
      await syncDataFromServer(type, [SyncStatus.QUEUED, SyncStatus.FAILED]);
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Thêm một yêu cầu sync vào hàng đợi
  public async addQueue(data: AddQueueProps) {
    if (data?.action === 'GET') {
      const queueList = await SyncQueueService.getAll({
        status: [SyncStatus.QUEUED],
        type: data?.type,
        action: data?.action,
      });
      console.tron('queueList', data, queueList);
      if (queueList?.length > 0) {
        this.triggerSync(data?.type);
        return;
      }
    }
    await SyncQueueService.upsert(data);
    if (data?.type === 'realtime') {
      this.triggerSync(data?.type);
    }
    if (data?.type === 'background') {
      setTimeout(() => {
        this.processQueue(data?.type);
      }, 1000);
    }
  }

  public async processQueueContinue() {
    if (this.isProcessing) return;
    const queueList = await SyncQueueService.getAll({
      status: [SyncStatus.RUNNING, SyncStatus.FAILED],
    });
    console.log(queueList);
    if (!Array.isArray(queueList) || queueList.length === 0) {
      console.tron('No queue to process');
      return;
    }
    this.isProcessing = true;
    try {
      await SyncQueueService.bulkUpdateStatus(queueList, SyncStatus.QUEUED);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown Error';
      console.tron('[Queue] Sync failed', errorMessage);
      this.isProcessing = false;
    } finally {
      this.isProcessing = false;
    }
  }

  public async processQueue(type: ISyncType) {
    if (this.isProcessing) return;
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.warn('No internet connection, skipping sync.');
      return;
    }

    const queueList = await SyncQueueService.getAll({
      status: [SyncStatus.QUEUED, SyncStatus.FAILED],
      type: type,
    });
    if (!Array.isArray(queueList) || queueList.length === 0) {
      console.tron('No queue to process');
      return;
    }
    this.isProcessing = true;
    try {
      await pushDataToServer(type, [SyncStatus.QUEUED, SyncStatus.FAILED]);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown Error';
      console.tron('[Queue] Sync failed', errorMessage);
      this.isProcessing = false;
    } finally {
      this.isProcessing = false;
    }
  }

  public async processQueueManual(type: ISyncType) {
    if (this.isProcessing) return;
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.warn('No internet connection, skipping sync.');
      return;
    }

    const queueList = await SyncQueueService.getAll({
      status: [SyncStatus.FAILED],
      type: type,
    });

    if (!Array.isArray(queueList) || queueList.length === 0) {
      console.tron('No queue to process');
      return;
    }
    this.isProcessing = true;
    try {
      await pushDataToServer(type, [SyncStatus.FAILED]);
    } catch (error: any) {
      this.isProcessing = false;
      const errorMessage = error?.message || 'Unknown Error';
      console.tron('[Queue] Sync failed', errorMessage);
    } finally {
      this.isProcessing = false;
    }
  }
}

export const syncManager = new SyncManager();
