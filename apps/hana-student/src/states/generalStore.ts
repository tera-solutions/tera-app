import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

import { appVersion } from '@tera/commons/constants/common';

export class GeneralStore {
  device = '';

  general = {};

  logo = '';

  version = appVersion;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      storage: AsyncStorage,
      name: 'GeneralStore',
      properties: ['device', 'version'],
    });
  }

  clear = () => {
    this.general = {};
    this.device = '';
    this.logo = '';
    this.version = appVersion;
    stopPersisting(this);
  };

  setGeneral = (data: any) => {
    runInAction(() => {
      this.device = data?.device_code;
      const general = data?.general || [];
      this.logo = data?.logo_url;
      const newsValue: any = {};

      general.forEach((item: any) => {
        newsValue[item.name] = item.value;
        if (item.value === '0') {
          newsValue[item.name] = false;
        }
      });

      this.general = newsValue;
    });
  };

  setDevice = (device_code: string) => {
    runInAction(() => {
      this.device = device_code || this.device;
    });
  };

  setInitData = (data: any) => {
    runInAction(() => {
      this.device = data?.device_code || this.device;
    });
  };

  setVersion = (ver: number) => {
    runInAction(() => {
      this.version = ver || this.version;
    });
  };
}
