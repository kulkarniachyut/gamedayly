import React, { useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import OTPVerification from '../components/OTPVerification';
import { useAuth } from '../Auth';
import { SignedOutStackParamList } from '../types';
import SnackbarContext from '../contexts/SnackbarContext';

export interface IOTPVerificationScreenProps {
  route: RouteProp<SignedOutStackParamList, 'OTPVerification'>;
  navigation: StackNavigationProp<SignedOutStackParamList, 'OTPVerification'>;
}

const OTPVerificationScreen: React.FC<IOTPVerificationScreenProps> = ({
  route,
}) => {
  const [isVerificationInProgress, setIsVerificationInProgress] = useState(
    false,
  );
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const auth = useAuth();
  const setSnackbarConfig = React.useContext(SnackbarContext);

  async function handleVerfication(otp: string) {
    if (isVerificationInProgress || !route.params.phoneNumber) return;

    setIsVerificationInProgress(true);
    const response = await auth?.authenticate(route.params.phoneNumber, otp);

    if (response && response?.isFailure()) {
      setIsVerificationInProgress(false);
      setSnackbarConfig?.({ visible: true, message: response.error().message });
    } else {
      // Not setting "isVerificationInProgress" to false in "else case" as
      // currently the component will unmount on setting of auth data
    }
  }

  async function handleResendPress() {
    if (
      !route.params.phoneNumber ||
      isVerificationInProgress ||
      isResendingOTP
    ) {
      return false;
    }

    setIsResendingOTP(true);
    const response = await auth?.sendOTP(route.params.phoneNumber);
    setIsResendingOTP(false);

    if (response && response.isSuccess()) {
      setSnackbarConfig?.({ visible: true, message: 'OTP sent successfully' });
      return true;
    }
    if (response && response.isFailure()) {
      setSnackbarConfig?.({ visible: true, message: response.error().message });
      return false;
    }

    return false;
  }

  return (
    <OTPVerification
      onSubmit={handleVerfication}
      onResendPress={handleResendPress}
      phoneNumber={route.params.phoneNumber}
      isVerificationInProgress={isVerificationInProgress}
      isResendingOTP={isResendingOTP}
    />
  );
};

export default OTPVerificationScreen;
