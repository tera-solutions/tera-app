import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { endpointSocket } from '@tera/commons/constants/common';

// src/types/socket.types.ts
export interface ServerToClientEvents {
  NEW_ORDER_CREATED: (order: any) => void;
  PRICE_UPDATED: (data: { productId: string; newPrice: number }) => void;
  NOTIFICATION: (message: string) => void;
}

export interface ClientToServerEvents {
  join_room: (roomName: string) => void;
  leave_room: (roomName: string) => void;
  create_order: (orderData: any) => void;
}

export interface SocketContextType {
  socket: any; // Hoặc Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean;
  sendMessage: (event: keyof ClientToServerEvents, data: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  userId: number;
  businessId: number;
}

export const SocketProvider: React.FC<Props> = ({
  children,
  userId,
  businessId,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    if (userId !== 2) return;
    const socket = io(endpointSocket, {
      transports: ['websocket'],
      auth: { token: 'JWT_TOKEN', userId, businessId },
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId, businessId]);

  const sendMessage = (event: keyof ClientToServerEvents, data: any) => {
    socketRef.current?.emit(event, data);
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected, sendMessage }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
