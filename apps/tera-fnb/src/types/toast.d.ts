import 'react-native-toast-message';

declare module 'react-native-toast-message' {
  interface ToastShowParams {
    text2NumberOfLines?: number;
    text1NumberOfLines?: number;
  }
}