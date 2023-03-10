import { createContext, ReactNode, useContext, useState } from "react";
import {
  AuthContextProviderType,
  AuthContextType,
  ErrorType,
  UserType,
} from "../types/authTypes";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export function AuthContextProvider({ children }: AuthContextProviderType) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loginError, setLoginError] = useState<ErrorType | null>(null);
  const [registerError, setRegisterError] = useState<ErrorType | null>(null);

  async function loginUser(username: string, password: string) {
    try {
      const payload = JSON.stringify({ username, password });
      // const response = await fetch("http://localhost:5500/login", {
      const response = await fetch("https://nebular-api.herokuapp.com/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: payload,
      });
      if (response.status === 200) {
        const user: UserType = await response.json();
        setUser(user);
      } else {
        const error = await response.json();
        setLoginError({ status: response.status, message: error.msg });
      }
    } catch (error: any) {
      if (error?.message) {
        console.error(error.message);
        return setLoginError({ status: 500, message: error.message });
      }
      console.error({ error });
      return setLoginError({ status: 504, error });
    }
  }

  async function registerUser(username: string, password: string) {
    try {
      const payload = JSON.stringify({ username, password });
      // const response = await fetch("http://localhost:5500/register", {
      const response = await fetch(
        "https://nebular-api.herokuapp.com/register",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: payload,
        }
      );
      console.log({ response });
      if (response.status === 201) {
        const user: UserType = await response.json();
        setUser(user);
      } else {
        const error = await response.json();
        setRegisterError({ status: response.status, message: error.msg });
      }
    } catch (error: any) {
      if (error.message) {
        console.error(error.message);
        return setRegisterError({ status: 500, message: error.message });
      }
      console.error({ error });
      setRegisterError({ status: 504, error });
    }
  }
  // getUser function only useful when cookies are used.

  // async function getUser() {
  //   try {
  //     const response = await fetch(
  //       "https://nebular-api.herokuapp.com/getuser",
  //       {
  //         credentials: "include",
  //       }
  //     );

  //     if (response.status === 200) {
  //       const data: UserType = await response.json();
  //       setUser(data);
  //     } else if (response.status >= 400 && response.status < 500) {
  //       //User not authorised error
  //       setUser(null);
  //       setLoginError({
  //         status: 403,
  //         message: "Unauthorised access. Please login to proceed",
  //       });
  //     } else {
  //       setUser(null);
  //       setLoginError({
  //         status: 500,
  //         message: "Sorry, an unexpected error has occured",
  //       });
  //     }
  //   } catch (error: any) {
  //     if (error.message) {
  //       console.error(error.message);
  //       setUser(null);
  //       setLoginError({ status: 500, message: error.message });
  //       return;
  //     }
  //     console.error({ error });
  //     setUser(null);
  //     setLoginError({
  //       status: 504,
  //       message: "Sorry, an unexpected error has occured",
  //     });
  //     return;
  //   }
  // }

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        user,
        loginError,
        setLoginError,
        registerUser,
        registerError,
        setRegisterError,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
