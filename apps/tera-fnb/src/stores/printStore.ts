import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';
import {
  PrintConnectionType,
  PrintDeviceType,
  PrintPageSizeType,
  PrintStatusType,
} from './_interface';

export class PrintStore {
  connection: PrintConnectionType = 'BT';

  status: PrintStatusType = 'disconnected';

  device = {};

  page_size: PrintPageSizeType = 'k57';

  allow_bluetooth = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      storage: AsyncStorage,
      name: 'PrintStore',
      properties: ['connection', 'device', 'page_size'],
    });
  }

  clear = () => {
    this.device = {};
    stopPersisting(this);
  };

  setConnection = (key: PrintConnectionType) => {
    runInAction(() => {
      this.connection = key || this.connection;
    });
  };

  setDevice = (device: PrintDeviceType) => {
    runInAction(() => {
      this.device = device || this.device;
    });
  };

  setPageSize = (page_size: PrintPageSizeType) => {
    runInAction(() => {
      this.page_size = page_size || this.page_size;
    });
  };

  setStatusConnect = (status: PrintStatusType) => {
    runInAction(() => {
      this.status = status || this.status;
    });
  };

  setPermissionBluetooth = (value: boolean) => {
    runInAction(() => {
      this.allow_bluetooth = value || this.allow_bluetooth;
    });
  };
}
