import { Reactotron } from 'reactotron-react-native';

declare global {
  interface Console {
    tron:
      | typeof Reactotron
      | {
          log: (...args: any[]) => void;
          display: (config: any) => void;
          error: (message: string, stack: any) => void;
          warn: (message: string) => void;
        };
  }

  var nativeWatermelonCreateAdapter: ((...args: any[]) => any) | undefined;
}
