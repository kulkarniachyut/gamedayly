import React, { useContext, useState } from 'react';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Result, failure, success } from '../utils/Result';
import appConfig from '../config/app-config';
import { GENERIC_ERROR_MESSAGE } from '../config/constants';

export type LoginResult = Result<boolean, Error>;

export interface IAuthResponse {
  user: {
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    accounts: unknown[];
    consoles: unknown[];
    phoneNumber: string;
    userId: string;
    id: string;
  };
  tokens: {
    access: {
      token: string;
    };
    refresh: {
      token: string;
    };
  };
}

export interface IUserInfo {
  id: string;
  userId: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface IAuth {
  user: IUserInfo | null;
  authenticate: (phoneNumber: string, otp: string) => Promise<LoginResult>;
  setSession: (userInfo: IUserInfo | null) => void;
  sendOTP: (phoneNumber: string) => Promise<Result<string, Error>>;
  logout: () => void;
}

const AuthContext = React.createContext<IAuth | null>(null);

function useAuthProvider(): IAuth {
  const [user, setUser] = useState<IUserInfo | null>(null);

  async function authenticate(
    phoneNumber: string,
    otp: string,
  ): Promise<LoginResult> {
    try {
      const response = await Axios.post<IAuthResponse>(
        `${appConfig.baseServerUri}/auth/phone/verify`,
        { phoneNumber, code: otp },
      );

      if (response.data) {
        const { user: usr, tokens } = response.data;
        const data = {
          id: usr.id,
          userId: usr.userId,
          phoneNumber: usr.phoneNumber,
          isEmailVerified: usr.isEmailVerified,
          isPhoneVerified: usr.isPhoneVerified,
          tokens: {
            access: tokens.access.token,
            refresh: tokens.refresh.token,
          },
        };

        setUser(data);
        AsyncStorage.setItem('userInfo', JSON.stringify(data));

        return success(true);
      }

      return failure(new Error(GENERIC_ERROR_MESSAGE));
    } catch (error) {
      return failure(new Error(error?.response?.data || GENERIC_ERROR_MESSAGE));
    }
  }

  async function sendOTP(phoneNumber: string): Promise<Result<string, Error>> {
    try {
      const response = await Axios.post<string>(
        `${appConfig.baseServerUri}/auth/phone`,
        {
          phoneNumber,
        },
      );

      if (response.data) {
        return success(response.data);
      }

      return failure(new Error(GENERIC_ERROR_MESSAGE));
    } catch (error) {
      return failure(new Error(error?.response?.data || GENERIC_ERROR_MESSAGE));
    }
  }

  function setSession(userInfo: IUserInfo | null) {
    setUser(userInfo);
  }

  function logout() {
    setUser(null);
  }

  return {
    user,
    authenticate,
    sendOTP,
    setSession,
    logout,
  };
}

export function useAuth(): IAuth | null {
  return useContext(AuthContext);
}

export function AuthProvider({
  children,
}: {
  children: (auth: IAuth) => React.ReactNode;
}): JSX.Element {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>{children(auth)}</AuthContext.Provider>
  );
}
