import { Navigate, Route, Routes } from "react-router-dom";

import PageNotfound from "@tera/components/web/PageNotfound";
import PageNotPermission from "@tera/components/web/PageNotPermission";
import PageUnauthorized from "@tera/components/web/PageUnauthorized";

import ForgotPasswordPage from "pages/Auth/ForgotPassword";
import RegisterPage from "pages/Auth/Register";
import LoginPage from "pages/Auth/Login";

import Dashboard from "pages/Dashboard";

import CheckAuth from "routers/CheckAuth";
import MiddlewareRouter from "routers/MiddlewareRouter";

import BasicLayout from "_common/components/Layout/BasicLayout";
import UnAuthLayout from "_common/components/Layout/UnAuthLayout";

/* IMPORT:router */

/* IMPORT:Course */
import CourseListPage from "pages/education/course/CourseListPage";

/* IMPORT:Lesson */
import LessonListPage from "pages/education/lesson/LessonListPage";
import LessonCreatePage from "pages/education/lesson/LessonCreatePage";
import LessonUpdatePage from "pages/education/lesson/LessonUpdatePage";
import LessonDetailPage from "pages/education/lesson/LessonDetailPage";

/* IMPORT:student */
import StudentListPage from "pages/education/student/StudentListPage";
import StudentCreatePage from "pages/education/student/StudentCreatePage";
import StudentUpdatePage from "pages/education/student/StudentUpdatePage";
import StudentDetailPage from "pages/education/student/StudentDetailPage";

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

        {/* BLOCK:router */}

        {/* BLOCK:Course */}
        <Route path="/course/list" element={<CourseListPage />} />

        {/* BLOCK:Lesson */}
        <Route path="/student/lesson/list" element={<LessonListPage />} />
        <Route path="/student/lesson/create" element={<LessonCreatePage />} />
        <Route
          path="/student/lesson/update/:id"
          element={<LessonUpdatePage />}
        />
        <Route
          path="/student/lesson/detail/:id"
          element={<LessonDetailPage />}
        />

        {/* BLOCK:student */}
        <Route path="/student/list" element={<StudentListPage />} />
        <Route path="/student/create" element={<StudentCreatePage />} />
        <Route path="/student/update/:id" element={<StudentUpdatePage />} />
        <Route path="/student/detail/:id" element={<StudentDetailPage />} />

        {/* BLOCK:hr */}
        <Route path="/teacher/list" element={<Dashboard />} />

        {/* BLOCK:course */}
        <Route path="/course/list" element={<Dashboard />} />
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
