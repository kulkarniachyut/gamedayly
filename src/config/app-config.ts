import Constants from 'expo-constants';

export interface IAppConfig {
  baseServerUri: string;
}

const appConfig: IAppConfig = {
  baseServerUri: Constants.manifest?.extra?.BASE_SERVER_URI as string,
};

export default appConfig;
