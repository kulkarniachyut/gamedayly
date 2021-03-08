import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserInfo, useAuth } from '../Auth';

export interface ISplashScreenProps {
  onTokenRestoreComplete: () => void;
}

function SplashScreen({
  onTokenRestoreComplete,
}: ISplashScreenProps): JSX.Element {
  const auth = useAuth();

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userInfo: IUserInfo | null = null;

      try {
        const info = await AsyncStorage.getItem('userInfo');
        if (info) {
          userInfo = JSON.parse(info);
        }
      } catch (e) {
        // Restoring token failed
      }

      return userInfo;
    };

    bootstrapAsync().then((userInfo) => {
      onTokenRestoreComplete();
      auth?.setSession(userInfo);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
