import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'Hana Teacher App',
    port: 9095,
  })
  .useReactNative()
  .connect();

if (__DEV__) {
  console.tron = Reactotron.log;
} else {
  // Tránh lỗi ở bản build production
  console.tron = () => {};
}

export default reactotron;
