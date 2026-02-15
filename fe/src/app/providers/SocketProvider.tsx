import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;

  error: string | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  error: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

let socketInstance: Socket | null = null;

const getSocketInstance = () => {
  if (!socketInstance) {
    socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
      {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      }
    );
  }
  return socketInstance;
};

type Props = {
  children: React.ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const instance = getSocketInstance();

    const onConnect = () => {
      console.log("✅ Connected:", instance.id);
      setIsConnected(true);
      setError(null);
    };

    const onDisconnect = (reason: string) => {
      console.log("❌ Disconnected:", reason);
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error("❌ Connection error:", err.message);
      setError(err.message);
      setIsConnected(false);
    };

    const onError = (err: Error) => {
      console.error("❌ Socket error:", err);
      setError(err.message || "Socket error occurred");
    };

    // Attach listeners
    instance.on("connect", onConnect);
    instance.on("disconnect", onDisconnect);
    instance.on("connect_error", onConnectError);
    instance.on("error", onError);

    setSocket(instance);

    // Check if already connected
    if (instance.connected) {
      setIsConnected(true);
    }

    return () => {
      // Remove listeners but DON'T disconnect
      instance.off("connect", onConnect);
      instance.off("disconnect", onDisconnect);
      instance.off("connect_error", onConnectError);
      instance.off("error", onError);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
