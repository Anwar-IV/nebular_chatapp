import { ReactNode } from "react";

export type ErrorType = {
  status: number;
  message?: string;
  error?: unknown;
};

export type UserType = {
  _id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  access: string;
  refresh: string;
};

export type AuthContextProviderType = {
  children: ReactNode;
};

export type AuthContextType = {
  loginUser: (username: string, password: string) => void;
  user: UserType | null;
  loginError: ErrorType | null;
  setLoginError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  registerUser: (username: string, password: string) => void;
  registerError: ErrorType | null;
  setRegisterError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};
