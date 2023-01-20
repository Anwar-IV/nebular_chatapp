import { ReactNode } from "react";
import { Socket } from "socket.io-client";
import { UserType } from "./authTypes";

export type RoomType = "Nebulon" | "Codex Corner";

export type NebulonMessageType = {
  id: string;
  username: string;
  message: string;
  sentAt: Date;
};

export type MessageContextProviderProps = {
  children: ReactNode;
  user: UserType | null;
};

export type MessageContextProps = {
  socket: Socket | null;
  sendMessage: (id: string, room: RoomType, message: string) => void;
  nebulonMessages: NebulonMessageType[];
};
