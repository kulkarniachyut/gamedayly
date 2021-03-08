import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { useAuth } from '../Auth';
import { SignedOutStackParamList } from '../types';
import SnackbarContext from '../contexts/SnackbarContext';

export interface ISignUpScreenProps {
  navigation: StackNavigationProp<SignedOutStackParamList, 'SignIn'>;
}

function SignUpScreen({ navigation }: ISignUpScreenProps): JSX.Element {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const auth = useAuth();
  const setSnackbarConfig = React.useContext(SnackbarContext);

  async function handlePhoneSignInPress() {
    if (!phoneNumber || isSendingOTP) {
      return;
    }

    setIsSendingOTP(true);

    const response = await auth?.sendOTP(phoneNumber);

    setIsSendingOTP(false);

    if (response?.isSuccess()) {
      navigation.navigate('OTPVerification', { phoneNumber });
    } else {
      let message = 'Something went wrong.';

      if (response && response.isFailure()) {
        message = response.error().message;
      }

      setSnackbarConfig?.({ visible: true, message });
    }
  }

  function handlePhoneNumberChange(text: string) {
    setPhoneNumber(text);
  }

  return (
    <View style={styles.container}>
      <Text>Login/Sign Up</Text>
      <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
      />
      <Button
        mode="contained"
        onPress={handlePhoneSignInPress}
        loading={isSendingOTP}
      >
        <Text>Get Started</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SignUpScreen;
