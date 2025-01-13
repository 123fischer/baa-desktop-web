import baseAxios from '@/utils/axios';
import * as routes from './routes';
import Error from 'next/error';
import { Auction, AuctionList } from '@/types/types';

export const getUserWebToken = () =>
  baseAxios
    .post(routes.GET_AUTH_TOKEN, {
      username: 'testMAA',
      language: 'en',
    })
    .then((res) => res.data)
    .catch((e) => {
      return new Error(e.message);
    });

// running auctions list
export const getRunningAuctions = (body: any, token: any) =>
  baseAxios
    .post(routes.GET_RUNNING_AUCTIONS, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((res) => res.data)
    .catch((e) => {
      return new Error(e.message);
    });

export const onPlaceBid = (body: any, token: any) => {
  baseAxios
    .post(routes.PLACE_BID, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((res) => res.data)
    .catch((e) => {
      return new Error(e.message);
    });
};
