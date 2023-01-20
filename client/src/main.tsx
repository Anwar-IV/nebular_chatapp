import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./globals.css";
import { ErrorPage } from "./components/error/ErrorPage";
import { Register } from "./components/register/Register";
import { Login } from "./components/login/Login";
import { Navbar } from "./components/navbar/Navbar";
import { AuthContextProvider } from "./context/AuthContext";
import { DashboardWrap } from "./components/dashboardWrap/DashboardWrap";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/user/:id",
        element: <DashboardWrap />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
