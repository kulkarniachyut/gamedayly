// List of consoles supported
export interface IConsole {
  id: string;
  name: string;
  idTextInputLabel: string;
}

export interface IGame {
  game: string;
  rank: string;
}

// List of consoles of a user
export interface IUserConsole {
  consoleId: string;
  userConsoleId: string;
  games: IGame[];
}

export interface IUserProfile {
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  accounts: unknown[];
  consoles: IUserConsole[];
  phoneNumber: string;
  username: string;
  email: string;
  userId: string;
  name: string;
}

export interface IAuthResponse {
  user: IUserProfile;
  tokens: {
    access: {
      token: string;
    };
    refresh: {
      token: string;
    };
  };
}

export interface IAuthTokens {
  access: string;
  refresh: string;
}

export interface IAuthUserInfo extends IUserProfile {
  tokens: IAuthTokens;
}
