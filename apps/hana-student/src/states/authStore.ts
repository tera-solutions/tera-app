import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

// Tên key AsyncStorage phải khớp đúng "AuthMobileStore" — interceptor dùng
// chung ở @tera/api/drivers đọc trực tiếp key này làm phương án dự phòng khi
// lấy token trên native (@tera/stores chỉ persist được trên web).
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
    return !!this.token;
  }

  clear = async () => {
    runInAction(() => {
      this.token = '';
      this.user = null;
      this.role = 'user';
    });
    await AsyncStorage.removeItem('AuthMobileStore');
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
