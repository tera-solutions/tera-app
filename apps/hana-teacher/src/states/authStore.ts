import GeneralService from '@databases/general/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export class AuthStore {
  token = '';

  user = null;

  role = 'user';

  isHydrated = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      storage: AsyncStorage,
      name: 'AuthStore',
      properties: ['token'],
    }).then((persistable) => {
      this.setHydrated(persistable.isHydrated);
    });
  }

  get authenticated() {
    // TODO: This logic can be changed on demand
    return !!this.token;
  }

  clear = () => {
    this.token = '';
    this.user = null;
    stopPersisting(this);
    console.log('AuthStore state reset completed');
  };

  updateToken = (token: string) => {
    runInAction(() => {
      this.token = token || this.token;
    });
  };

  setHydrated(value: boolean) {
    this.isHydrated = value;
  }

  updateUser = (data: any) => {
    runInAction(() => {
      this.user = data?.user;
      this.role = data?.user?.role || this.role;
      if (data?.token) {
        this.token = data?.token || this.token;
      }
    });
  };

  async fetchUserFromLocal() {
    try {
      const record = await GeneralService.getValue('users'); // Lấy bản ghi key='settings'
      if (record) {
        runInAction(() => {
          this.user = record;
          this.role = record?.role || this.role;
        });
      }
    } catch (e) {
      console.error('No users found in local', e);
    }
  }
}
