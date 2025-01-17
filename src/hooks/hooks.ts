import { useEffect } from 'react';

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
