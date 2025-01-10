import baseAxios from '@/utils/axios';
import * as routes from './routes';
import Error from 'next/error';

export const getUserWebToken = () =>
  baseAxios
    .post(routes.GET_AUTH_TOKEN, {
      username: 'testMAA',
      language: 'en',
    })
    .then((res) => res.data)
    .catch((e) => console.log(e));

// auction list
export const getRunningAuctions = (token: any) =>
  baseAxios
    .get(routes.GET_RUNNING_AUCTIONS, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      params: {
        size: 20,
        category: 'running',
      },
    })
    .then((res) => res.data)
    .catch((e) => {
      return new Error(e.message);
    });
