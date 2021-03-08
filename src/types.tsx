export type SignedOutStackParamList = {
  SignIn: undefined;
  OTPVerification: {
    phoneNumber: string;
    redirectTo?: string;
  };
};

export type SignedInStackParamList = {
  Home: undefined;
  Profile: undefined;
  OTPVerification: {
    phoneNumber: string;
  };
};
