import { useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./socketContext";

export const SocketProvider = ({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) => {

  const socket: Socket | null = useMemo(() => {
    if (!token) return null;

    return io("http://localhost:3000", {
      auth: { token },
    });
  }, [token]);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};