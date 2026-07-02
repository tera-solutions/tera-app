import { Navigate, Route, Routes } from "react-router-dom";

import PageNotfound from "@tera/components/web/PageNotfound";
import PageNotPermission from "@tera/components/web/PageNotPermission";
import PageUnauthorized from "@tera/components/web/PageUnauthorized";

import ForgotPasswordPage from "pages/Auth/ForgotPassword";
import RegisterPage from "pages/Auth/Register";
import LoginPage from "pages/Auth/Login";

import Dashboard from "pages/Dashboard";
import Schedule from "pages/Schedule";
import Classroom from "pages/Classroom";
import ClassroomDetail from "pages/ClassroomDetail";
import LessonPlan from "pages/LessonPlan";
import PlanLessons from "pages/LessonPlan/PlanLessons";
import Lesson from "pages/Lesson";
import Placeholder from "pages/Placeholder";

import CheckAuth from "routers/CheckAuth";
import MiddlewareRouter from "routers/MiddlewareRouter";

import BasicLayout from "_common/components/Layout/BasicLayout";
import { PATHS } from "_common/components/Layout/Menu/menus";
import UnAuthLayout from "_common/components/Layout/UnAuthLayout";

const PLACEHOLDER_PATHS = [
  PATHS.homework,
  PATHS.grading,
  PATHS.attendance,
  PATHS.students,
  PATHS.reports,
  PATHS.comments,
  PATHS.notifications,
  PATHS.messages,
  PATHS.more,
  PATHS.profile,
];

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
        <Route index element={<Navigate to={PATHS.dashboard} />} />
        <Route path={PATHS.dashboard} element={<Dashboard />} />
        <Route path={PATHS.schedule} element={<Schedule />} />
        <Route path={PATHS.classroom} element={<Classroom />} />
        <Route path={PATHS.lessonPlans} element={<LessonPlan />} />
        <Route path={`${PATHS.lessonPlans}/:id`} element={<PlanLessons />} />
        <Route path={`${PATHS.lesson}/:id`} element={<Lesson />} />
        <Route path={`${PATHS.classroom}/:id`} element={<ClassroomDetail />} />
        {PLACEHOLDER_PATHS.map((path) => (
          <Route key={path} path={path} element={<Placeholder />} />
        ))}
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
