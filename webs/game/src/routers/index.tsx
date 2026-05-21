import { Navigate, Route, Routes } from "react-router-dom";

import PageNotfound from "@tera/components/web/PageNotfound";
import PageNotPermission from "@tera/components/web/PageNotPermission";
import PageUnauthorized from "@tera/components/web/PageUnauthorized";

import ForgotPasswordPage from "@tera/game/pages/Auth/ForgotPassword";
import RegisterPage from "@tera/game/pages/Auth/Register";
import LoginPage from "@tera/game/pages/Auth/Login";

import Dashboard from "@tera/game/pages/Dashboard";

import CheckAuth from "@tera/game/routers/CheckAuth";
import MiddlewareRouter from "@tera/game/routers/MiddlewareRouter";

import BasicLayout from "@tera/game/_common/components/Layout/BasicLayout";
import UnAuthLayout from "@tera/game/_common/components/Layout/UnAuthLayout";
import { LobbyScreen } from "../screen/lobby/LobbyScreen";

export const Routers = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MiddlewareRouter>
            <BasicLayout />
          </MiddlewareRouter>
        }
      >
        <Route index element={<LobbyScreen  />} />
      </Route>

      <Route
        path="auth"
        element={
          <CheckAuth>
            <UnAuthLayout />
          </CheckAuth>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<PageNotfound />} />
      <Route path="/403" element={<PageNotPermission />} />
      <Route path="/401" element={<PageUnauthorized />} />
    </Routes>
  );
};
