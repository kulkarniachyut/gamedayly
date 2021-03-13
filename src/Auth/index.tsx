import React, { useContext, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Result, failure, success } from '../utils/Result';
import appConfig from '../config/app-config';
import { GENERIC_ERROR_MESSAGE } from '../config/constants';
import { IAuthResponse, IAuthTokens, IAuthUserInfo } from '../interfaces';
import { LoginResult } from '../types';

export interface IAuth {
  user: IAuthUserInfo | null;
  authenticate: (phoneNumber: string, otp: string) => Promise<LoginResult>;
  setSession: (userInfo: IAuthUserInfo | null) => void;
  sendOTP: (phoneNumber: string) => Promise<Result<string, Error>>;
  updateTokens: (tokens: IAuthTokens) => void;
  logout: () => void;
}

const AuthContext = React.createContext<IAuth | null>(null);

function useAuthProvider(): IAuth {
  const [user, setUser] = useState<IAuthUserInfo | null>(null);

  async function authenticate(
    phoneNumber: string,
    otp: string,
  ): Promise<LoginResult> {
    try {
      const response = await axios.post<IAuthResponse>(
        `${appConfig.baseServerUri}/auth/phone/verify`,
        { phoneNumber, code: otp },
      );

      if (response.data) {
        const { user: usr, tokens } = response.data;
        const data = {
          userId: usr.userId,
          accounts: usr.accounts,
          consoles: usr.consoles,
          phoneNumber: usr.phoneNumber,
          isEmailVerified: usr.isEmailVerified,
          isPhoneVerified: usr.isPhoneVerified,
          isProfileComplete: usr.isProfileComplete,
          username: usr.username,
          email: usr.email,
          name: usr.name,
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
      if (error.response) {
        return failure(new Error(error.response.data || GENERIC_ERROR_MESSAGE));
      }
      if (error.request) {
        return failure(new Error(error.request || GENERIC_ERROR_MESSAGE));
      }
      return failure(new Error(error.message || GENERIC_ERROR_MESSAGE));
    }
  }

  async function sendOTP(phoneNumber: string): Promise<Result<string, Error>> {
    try {
      const response = await axios.post<string>(
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
      if (error.response) {
        return failure(new Error(error.response.data || GENERIC_ERROR_MESSAGE));
      }
      if (error.request) {
        return failure(new Error(error.request || GENERIC_ERROR_MESSAGE));
      }
      return failure(new Error(error.message || GENERIC_ERROR_MESSAGE));
    }
  }

  function setSession(userInfo: IAuthUserInfo | null) {
    setUser(userInfo);
  }

  function updateTokens(tokens: IAuthTokens) {
    if (!user || !tokens) return;

    const updatedUserInfo: IAuthUserInfo = {
      ...user,
      tokens,
    };

    setSession(updatedUserInfo);
  }

  function logout() {
    setUser(null);
    AsyncStorage.removeItem('userInfo');
  }

  return {
    user,
    authenticate,
    sendOTP,
    setSession,
    updateTokens,
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
