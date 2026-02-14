import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import Constants from 'expo-constants';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDummy-Key-For-Emulator-Development",
  authDomain: "plouflog-dev.firebaseapp.com",
  projectId: "plouflog-dev",
  storageBucket: "plouflog-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

// Determine if we should use emulators
// In dev mode, we always use emulators
// You can also set EXPO_PUBLIC_USE_EMULATOR=true in .env
const useEmulator = __DEV__ || Constants.expoConfig?.extra?.useEmulator === true;

// Get the host for emulator connection
// When running in Expo Go or on a physical device, use your computer's IP
// When running in iOS/Android simulator, use localhost
const getEmulatorHost = () => {
  if (__DEV__) {
    // For development, try to get the debug server host
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];

    // If we have a debugger host (running on physical device), use that
    if (debuggerHost) {
      return debuggerHost;
    }
  }

  // Default to localhost (for simulators/emulators)
  return 'localhost';
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Connect to emulators if in dev mode
if (useEmulator) {
  const host = getEmulatorHost();

  try {
    // Connect to Auth emulator (port 9099)
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });

    // Connect to Firestore emulator (port 8080)
    connectFirestoreEmulator(db, host, 8080);

    // Connect to Functions emulator (port 5001)
    connectFunctionsEmulator(functions, host, 5001);

    console.log(`🔧 Firebase emulators connected at ${host}`);
  } catch (error) {
    // Emulators might already be connected, ignore the error
    console.log('⚠️ Emulator connection note:', error);
  }
}

export { app, auth, db, functions };
export const isUsingEmulator = useEmulator;
export const emulatorHost = useEmulator ? getEmulatorHost() : null;
