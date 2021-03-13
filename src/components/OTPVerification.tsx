import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { OTP_RESEND_TIMEOUT } from '../config/constants';

export interface IOTPVerificationProps {
  onSubmit: (otp: string) => void;
  onResendPress: () => Promise<boolean>;
  phoneNumber: string;
  isVerificationInProgress: boolean;
  isResendingOTP: boolean;
}

function OTPVerification({
  onSubmit,
  onResendPress,
  phoneNumber,
  isVerificationInProgress,
  isResendingOTP,
}: IOTPVerificationProps): JSX.Element {
  const [otp, setOTP] = useState('');
  const [resendTimeCounter, setResendTimeCounter] = useState<number>(
    OTP_RESEND_TIMEOUT,
  );

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (resendTimeCounter > 0) {
      timerId = setTimeout(
        () => setResendTimeCounter((counter) => counter - 1),
        1000,
      );
    }

    return () => {
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [resendTimeCounter]);

  function handleSubmit() {
    onSubmit(otp);
  }

  function handleOTPChange(text: string) {
    setOTP(text);
  }

  async function handleResendPress() {
    const response = await onResendPress();

    if (response) {
      setResendTimeCounter(OTP_RESEND_TIMEOUT);
    }
  }

  return (
    <View style={styles.container}>
      <Text>OTP sent to {phoneNumber}</Text>
      <TextInput label="OTP" value={otp} onChangeText={handleOTPChange} />
      <Button
        mode="text"
        onPress={handleResendPress}
        disabled={resendTimeCounter > 0}
        loading={isResendingOTP}
      >
        <Text>
          {resendTimeCounter > 0
            ? `Resend in ${resendTimeCounter}`
            : 'Resend OTP'}
        </Text>
      </Button>
      <Button
        mode="contained"
        loading={isVerificationInProgress}
        onPress={handleSubmit}
      >
        <Text>Verify</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default OTPVerification;
