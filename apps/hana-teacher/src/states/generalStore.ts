import { appVersion } from '@tera/commons/constants/common';
import GeneralService from '@databases/general/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';
import { Platform } from 'react-native';

export class GeneralStore {
  isDbReady = false;

  isOffline = false;

  isSuper = false;

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
    this.isDbReady = false;
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

  async fetchSettingsFromLocal() {
    try {
      const record = await GeneralService.getValue('settings');
      if (record) {
        runInAction(() => {
          this.device = record?.device_code;
          this.isSuper = record?.super || this.isSuper;
          const general = record?.general || [];
          this.logo = record?.logo_url;
          const newsValue: any = {};

          general.forEach((item: any) => {
            newsValue[item.name] = item.value;
            if (item.value === '0') {
              newsValue[item.name] = false;
            }
          });

          this.general = newsValue;
        });
      }
    } catch (e) {
      console.error('No settings found in local', e);
    }
  }

  setIsDbReady = (status: boolean) => {
    runInAction(() => {
      if (Platform.OS === 'web') {
        this.isDbReady = true;
        return;
      }
      this.isDbReady = status || this.isDbReady;
    });
  };

  setIsOffline = (status: boolean) => {
    runInAction(() => {
      if (Platform.OS === 'web') {
        this.isOffline = false;
        return;
      }
      this.isOffline = status || this.isOffline;
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
