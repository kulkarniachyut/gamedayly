import { Result } from './utils/Result/Result';

export type HomeStackParamList = {
  Home: undefined;
  Profile: undefined;
};

export type ChatStackParamList = {
  Chat: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  ChatTab: undefined;
  Notifications: undefined;
  Wallet: undefined;
};

export type SignedInStackParamList = {
  Root: BottomTabParamList;
  Profile: undefined;
};

export type SignedOutStackParamList = {
  SignIn: undefined;
  OTPVerification: {
    phoneNumber: string;
    redirectTo?: string;
  };
};

export type LoginResult = Result<boolean, Error>;
