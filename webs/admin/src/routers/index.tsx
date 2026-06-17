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

/* IMPORT:Teacher */
import TeacherListPage from "pages/Hr/teacher/TeacherListPage";
import TeacherCreatePage from "pages/Hr/teacher/TeacherCreatePage";
import TeacherUpdatePage from "pages/Hr/teacher/TeacherUpdatePage";
import TeacherDetailPage from "pages/Hr/teacher/TeacherDetailPage";
import TeacherCertificateFormPage from "pages/Hr/teacher/TeacherCertificateFormPage";

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

/* IMPORT:Branch */
import BranchListPage from "pages/System/branch/BranchListPage";
import BranchCreatePage from "pages/System/branch/BranchCreatePage";
import BranchUpdatePage from "pages/System/branch/BranchUpdatePage";
import BranchDetailPage from "pages/System/branch/BranchDetailPage";

/* IMPORT:Business */
import BusinessListPage from "pages/System/business/BusinessListPage";
import BusinessCreatePage from "pages/System/business/BusinessCreatePage";
import BusinessUpdatePage from "pages/System/business/BusinessUpdatePage";
import BusinessDetailPage from "pages/System/business/BusinessDetailPage";

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

        {/* BLOCK:Teacher */}
        <Route path="/teacher/list" element={<TeacherListPage />} />
        <Route path="/teacher/create" element={<TeacherCreatePage />} />
        <Route path="/teacher/update/:id" element={<TeacherUpdatePage />} />
        <Route path="/teacher/detail/:id" element={<TeacherDetailPage />} />
        <Route path="/teacher/:id/certificate/create" element={<TeacherCertificateFormPage />} />
        <Route path="/teacher/:id/certificate/update/:certificateId" element={<TeacherCertificateFormPage />} />

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

        {/* BLOCK:Branch */}
        <Route path="/system/branch/list" element={<BranchListPage />} />
        <Route path="/system/branch/create" element={<BranchCreatePage />} />
        <Route path="/system/branch/update/:id" element={<BranchUpdatePage />} />
        <Route path="/system/branch/detail/:id" element={<BranchDetailPage />} />

        {/* BLOCK:Business */}
        <Route path="/system/business/list" element={<BusinessListPage />} />
        <Route path="/system/business/create" element={<BusinessCreatePage />} />
        <Route path="/system/business/update/:id" element={<BusinessUpdatePage />} />
        <Route path="/system/business/detail/:id" element={<BusinessDetailPage />} />
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
