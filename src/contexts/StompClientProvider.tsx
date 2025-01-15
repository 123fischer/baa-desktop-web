'use client';
import { WS_DOMAIN } from '@/api/routes';
import { useSession } from 'next-auth/react';
import { StompSessionProvider } from 'react-stomp-hooks';

export default function StompClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const stompHeaders = {
    ...(session ? { Authorization: 'Bearer ' + session.accessToken } : {}),
  };
  return (
    <StompSessionProvider
      url={WS_DOMAIN}
      connectHeaders={stompHeaders}
      disconnectHeaders={stompHeaders}
    >
      {children}
    </StompSessionProvider>
  );
}
