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
      name: 'AuthMobileStore',
      properties: ['token', 'user'],
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
}
