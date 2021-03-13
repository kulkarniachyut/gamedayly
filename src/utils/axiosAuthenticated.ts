import axios, { AxiosInstance } from 'axios';

import { IAuth } from '../Auth';
import appConfig from '../config/app-config';
import { IAuthTokens } from '../interfaces';

const createInstance = (auth: IAuth) => {
  const instance = axios.create({
    baseURL: appConfig.baseServerUri,
  });

  instance.defaults.headers.token = auth.user?.tokens.access;

  const interceptor = instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status !== 401) {
        return Promise.reject(error);
      }

      axios.interceptors.response.eject(interceptor);

      return axios
        .post('/auth/refresh_token', {
          refresh_token: auth.user?.tokens.refresh,
        })
        .then((response) => {
          auth.updateTokens(response.data as IAuthTokens);
          instance.defaults.headers.token = auth.user?.tokens.access;
        })
        .catch((err) => {
          auth.logout();
          return Promise.reject(err);
        });
    },
  );

  return instance;
};

let instance: AxiosInstance;
let old_auth: IAuth;

const Axios = (auth: IAuth): AxiosInstance => {
  if (!auth) return axios;

  if (!instance || auth !== old_auth) {
    instance = createInstance(auth);
    old_auth = auth;
  }

  return instance;
};

export default Axios;
