jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);``

/**
 * silence an error triggered by react-native-gesture-handler/ReanimatedSwipeable when running in jest with jest-expo and library setup files
 */
const actualConsoleError = console.error;
global.console = {
  ...console,
  error: (msg, ...rest) => {
      if (msg === '[react-native-gesture-handler] Some of the callbacks in the gesture are worklets and some are not. Either make sure that all calbacks are marked as \'worklet\' if you wish to run them on the UI thread or use \'.runOnJS(true)\' modifier on the gesture explicitly to run all callbacks on the JS thread.') {
        return;
      } else {
        actualConsoleError(msg, ...rest);
      }
  },
};