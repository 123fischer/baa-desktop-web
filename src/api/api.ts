import { JWT } from 'next-auth/jwt';
import Error from 'next/error';
import baseAxios from '@/utils/axios';
import * as routes from './routes';
import { RunningAuctionBody } from '@/types/types';

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
export const getRunningAuctions = (body: RunningAuctionBody, token: JWT) =>
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

export const toggleFavorites = async (
  body: {
    lotId: string;
  },
  token: JWT
) => {
  await baseAxios
    .post(routes.TOGGLE_FAVORITES, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((res) => res.data as { success: boolean })
    .catch((e) => new Error(e.message));
};

// place bid
export const onPlaceBid = async (
  body: {
    lotId: string;
    manual: boolean;
    bid: number;
  },
  token: JWT
): Promise<{ success: boolean; outbid?: boolean }> => {
  return baseAxios
    .post(routes.PLACE_BID, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((res) => res.data as { success: boolean; outbid?: boolean })
    .catch((e) => {
      throw new Error(e.message);
    });
};
