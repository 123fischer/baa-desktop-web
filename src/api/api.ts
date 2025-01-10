import baseAxios from '@/utils/axios';
import * as routes from './routes';

export const getUserWebToken = () =>
  baseAxios
    .post(routes.GET_AUTH_TOKEN, {
      username: 'testMAA',
      language: 'en',
    })
    .then((res) => res.data)
    .catch((e) => console.log(e));
