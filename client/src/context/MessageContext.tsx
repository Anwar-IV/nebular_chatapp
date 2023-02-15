import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  MessageContextProps,
  MessageContextProviderProps,
  NebulonMessageType,
  RoomType,
} from "../types/messageTypes";
import { io, Socket } from "socket.io-client";

const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps
);

export const useMessageCtx = () => {
  return useContext(MessageContext);
};

export function MessageContextProvider({
  children,
  user,
}: MessageContextProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [nebulonMessages, setNebulonMessages] = useState<NebulonMessageType[]>(
    [] as NebulonMessageType[]
  );

  useEffect(() => {
    const socket = io("https://nebular-api.herokuapp.com/");
    if (socket) {
      setSocket(socket);
      socket.emit("message-state", "initial messages");
    }
    return () => socket.close() as any;
  }, [user]);

  const addMessages = useCallback((input: any) => {
    setNebulonMessages(() => input);
  }, []);

  useEffect(() => {
    socket?.on("nebulon-payload", addMessages);
  }, [socket, addMessages]);

  function sendMessage(id: string, room: RoomType, message: string) {
    if (socket == null) return console.log("Socket is null");
    socket?.emit("send-message", { id, room, message });
  }

  return (
    <MessageContext.Provider value={{ socket, sendMessage, nebulonMessages }}>
      {children}
    </MessageContext.Provider>
  );
}
