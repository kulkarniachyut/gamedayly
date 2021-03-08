import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { OTP_RESEND_TIMEOUT } from '../config/constants';

export interface IOTPVerificationProps {
  onSubmit: (otp: string) => void;
  onResendPress: () => Promise<boolean>;
  phoneNumber: string;
}

function OTPVerification({
  onSubmit,
  onResendPress,
  phoneNumber,
}: IOTPVerificationProps): JSX.Element {
  const [otp, setOTP] = useState('');
  const [resendCounter, setResendCounter] = useState<number>(
    OTP_RESEND_TIMEOUT,
  );

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (resendCounter > 0) {
      timerId = setTimeout(
        () => setResendCounter((counter) => counter - 1),
        1000,
      );
    }

    return () => clearTimeout(timerId);
  }, [resendCounter]);

  function handleSubmit() {
    onSubmit(otp);
  }

  function handleOTPChange(text: string) {
    setOTP(text);
  }

  async function handleResendPress() {
    const response = await onResendPress();

    if (response) {
      setResendCounter(OTP_RESEND_TIMEOUT);
    }
  }

  return (
    <View style={styles.container}>
      <Text>OTP sent to {phoneNumber}</Text>
      <TextInput label="OTP" value={otp} onChangeText={handleOTPChange} />
      <Button
        mode="text"
        onPress={handleResendPress}
        disabled={resendCounter > 0}
      >
        <Text>
          {resendCounter > 0 ? `Resend in ${resendCounter}` : 'Resend OTP'}
        </Text>
      </Button>
      <Button mode="contained" onPress={handleSubmit}>
        <Text>Verify</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default OTPVerification;
