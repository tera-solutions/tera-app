import { Navigate, Route, Routes } from "react-router-dom";

import PageNotfound from "@tera/components/web/PageNotfound";
import PageNotPermission from "@tera/components/web/PageNotPermission";
import PageUnauthorized from "@tera/components/web/PageUnauthorized";

import LoginPage from "pages/Auth/Login";

import Dashboard from "pages/Dashboard";

import CheckAuth from "routers/CheckAuth";
import MiddlewareRouter from "routers/MiddlewareRouter";

import BasicLayout from "_common/components/Layout/BasicLayout";
import UnAuthLayout from "_common/components/Layout/UnAuthLayout";

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
      </Route>

      <Route path="*" element={<PageNotfound />} />
      <Route path="/403" element={<PageNotPermission />} />
      <Route path="/401" element={<PageUnauthorized />} />
    </Routes>
  );
};
