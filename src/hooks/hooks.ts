import { useEffect, useState } from 'react';
import { useSubscription } from 'react-stomp-hooks';
import { IMessage } from '@stomp/stompjs';

export const usePageInfiniteLoader = (
  loader: () => any,
  isComplete: boolean
) => {
  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [isComplete]);

  const onScroll = () => {
    if (isComplete) {
      return;
    }

    const isBottomReached =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (isBottomReached) {
      loader();
    }
  };
};

export const useStompSubscription = (url: string | string[]) => {
  const [lastMessage, setLastMessage] = useState<IMessage>();

  useSubscription(url, (message) => setLastMessage(message));

  return { lastMessage };
};
