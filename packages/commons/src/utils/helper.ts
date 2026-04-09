import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStore } from 'src/states/globalStore';
import { rootStore } from 'src/states/index';
import { PrintStore } from 'src/states/printStore';
import { UIStore } from 'src/states/uiStore';
import { stopPersisting } from 'mobx-persist-store';

export const handleClearApp = async () => {
  try {
    // 1. Dừng đồng bộ hóa để tránh leak
    stopPersisting(globalStore);
    stopPersisting(PrintStore);
    stopPersisting(UIStore);

    rootStore.clearAllStores();
    await AsyncStorage.removeItem('globalStore');
    await AsyncStorage.removeItem('UIStore');
    await AsyncStorage.removeItem('PrintStore');

    console.log('==== CLEAR ALL DATA APP ==== ');
  } catch (error) {
    console.error('CLEAR APP ERROR: ', error);
  }
};
