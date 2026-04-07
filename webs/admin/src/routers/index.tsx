import { Navigate, Route, Routes } from "react-router-dom";

import BasicLayout from "@tera/components/web/Layout/BasicLayout";
import UnAuthLayout from "@tera/components/web/Layout/UnAuthLayout";
import PageNotfound from "@tera/components/web/PageNotfound";
import PageNotPermission from "@tera/components/web/PageNotPermission";
import PageUnauthorized from "@tera/components/web/PageUnauthorized";

import ForgotPasswordPage from "@tera/components/shared/Auth/ForgotPassword";
import RegisterPage from "@tera/components/shared/Auth/Register";

import Dashboard from "pages/Dashboard";

import CheckAuth from "routers/CheckAuth";
import MiddlewareRouter from "routers/MiddlewareRouter";

import LoginPage from "@tera/components/shared/Auth/Login";

export const Routers = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MiddlewareRouter>
            <BasicLayout module="eshop" />
          </MiddlewareRouter>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
