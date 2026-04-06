import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '@stores/authStore';
import { rootStore } from '@stores/index';
import { PrintStore } from '@stores/printStore';
import { UIStore } from '@stores/uiStore';
import { stopPersisting } from 'mobx-persist-store';

export const handleClearApp = async () => {
  try {
    // 1. Dừng đồng bộ hóa để tránh leak
    stopPersisting(AuthStore);
    stopPersisting(PrintStore);
    stopPersisting(UIStore);

    rootStore.clearAllStores();
    await AsyncStorage.removeItem('AuthStore');
    await AsyncStorage.removeItem('UIStore');
    await AsyncStorage.removeItem('PrintStore');

    console.log('==== CLEAR ALL DATA APP ==== ');
  } catch (error) {
    console.error('CLEAR APP ERROR: ', error);
  }
};
