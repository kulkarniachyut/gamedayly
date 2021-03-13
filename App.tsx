import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/Auth';
import SnackbarContext from './src/contexts/SnackbarContext';
import useSnackbar from './src/hooks/useSnackbar';
import Navigation from './src/navigation';
import SplashScreen from './src/screens/SplashScreen';

export default function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbarConfig] = useSnackbar();

  return (
    <SafeAreaProvider>
      <StatusBar animated showHideTransition="slide" />
      <SnackbarContext.Provider value={setSnackbarConfig}>
        <AuthProvider>
          {(auth) =>
            isLoading ? (
              <SplashScreen
                onTokenRestoreComplete={() =>
                  setIsLoading((loading) => !loading)
                }
              />
            ) : (
              <Navigation
                isSignedIn={auth.user !== null}
                isProfileComplete={auth.user?.isProfileComplete || false}
              />
            )
          }
        </AuthProvider>
      </SnackbarContext.Provider>
      {snackbar}
    </SafeAreaProvider>
  );
}
