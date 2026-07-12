import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// Khởi tạo an toàn: Chỉ set handler nếu AsyncStorage thực sự tồn tại
if (__DEV__ && AsyncStorage) {
  Reactotron.setAsyncStorageHandler(AsyncStorage);
}

const reactotron = Reactotron
  .configure({
    name: 'Hana Teacher App',
    port: 9095,
  })
  .useReactNative()
  .connect();

if (__DEV__) {
  console.tron = Reactotron.log;
} else {
  console.tron = () => {};
}

export default reactotron;