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
import CourseCreatePage from "pages/education/course/CourseCreatePage";
import CourseUpdatePage from "pages/education/course/CourseUpdatePage";
import CourseDetailPage from "pages/education/course/CourseDetailPage";

/* IMPORT:ClassRoom */
import ClassRoomListPage from "pages/education/class-room/ClassRoomListPage";
import ClassRoomCreatePage from "pages/education/class-room/ClassRoomCreatePage";
import ClassRoomUpdatePage from "pages/education/class-room/ClassRoomUpdatePage";
import ClassRoomDetailPage from "pages/education/class-room/ClassRoomDetailPage";

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

/* IMPORT:Parent */
import ParentListPage from "pages/CRM/parent/ParentListPage";
import ParentCreatePage from "pages/CRM/parent/ParentCreatePage";
import ParentUpdatePage from "pages/CRM/parent/ParentUpdatePage";
import ParentDetailPage from "pages/CRM/parent/ParentDetailPage";

/* IMPORT:ParentStudent */
import ParentStudentListPage from "pages/CRM/parent-student/ParentStudentListPage";
import ParentStudentCreatePage from "pages/CRM/parent-student/ParentStudentCreatePage";
import ParentStudentUpdatePage from "pages/CRM/parent-student/ParentStudentUpdatePage";
import ParentStudentDetailPage from "pages/CRM/parent-student/ParentStudentDetailPage";

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
        path='/'
        element={
          <MiddlewareRouter>
            <BasicLayout />
          </MiddlewareRouter>
        }
      >
        <Route index element={<Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={<Dashboard />} />

        {/* BLOCK:router */}

        {/* BLOCK:Teacher */}
        <Route path='/teacher/list' element={<TeacherListPage />} />
        <Route path='/teacher/create' element={<TeacherCreatePage />} />
        <Route path='/teacher/update/:id' element={<TeacherUpdatePage />} />
        <Route path='/teacher/detail/:id' element={<TeacherDetailPage />} />
        <Route
          path='/teacher/:id/certificate/create'
          element={<TeacherCertificateFormPage />}
        />
        <Route
          path='/teacher/:id/certificate/update/:certificateId'
          element={<TeacherCertificateFormPage />}
        />

        {/* BLOCK:Course */}
        <Route path='/course/list' element={<CourseListPage />} />
        <Route path='/course/create' element={<CourseCreatePage />} />
        <Route path='/course/update/:id' element={<CourseUpdatePage />} />
        <Route path='/course/detail/:id' element={<CourseDetailPage />} />

        {/* BLOCK:ClassRoom */}
        <Route path="/course/class/list" element={<ClassRoomListPage />} />
        <Route path="/course/class/create" element={<ClassRoomCreatePage />} />
        <Route
          path="/course/class/update/:id"
          element={<ClassRoomUpdatePage />}
        />
        <Route
          path="/course/class/detail/:id"
          element={<ClassRoomDetailPage />}
        />

        {/* BLOCK:Lesson */}
        <Route path='/course/lesson/list' element={<LessonListPage />} />
        <Route path='/course/lesson/create' element={<LessonCreatePage />} />
        <Route
          path='/course/lesson/update/:id'
          element={<LessonUpdatePage />}
        />
        <Route
          path='/course/lesson/detail/:id'
          element={<LessonDetailPage />}
        />

        {/* BLOCK:student */}
        <Route path='/student/list' element={<StudentListPage />} />
        <Route path='/student/create' element={<StudentCreatePage />} />
        <Route path='/student/update/:id' element={<StudentUpdatePage />} />
        <Route path='/student/detail/:id' element={<StudentDetailPage />} />

        {/* BLOCK:Parent */}
        <Route path='/student/parent/list' element={<ParentListPage />} />
        <Route path='/student/parent/create' element={<ParentCreatePage />} />
        <Route
          path='/student/parent/update/:id'
          element={<ParentUpdatePage />}
        />
        <Route
          path='/student/parent/detail/:id'
          element={<ParentDetailPage />}
        />

        {/* BLOCK:ParentStudent */}
        <Route
          path='/student/parent-student/list'
          element={<ParentStudentListPage />}
        />
        <Route
          path='/student/parent-student/create'
          element={<ParentStudentCreatePage />}
        />
        <Route
          path='/student/parent-student/update/:id'
          element={<ParentStudentUpdatePage />}
        />
        <Route
          path='/student/parent-student/detail/:id'
          element={<ParentStudentDetailPage />}
        />

        {/* BLOCK:Branch */}
        <Route path='/system/branch/list' element={<BranchListPage />} />
        <Route path='/system/branch/create' element={<BranchCreatePage />} />
        <Route
          path='/system/branch/update/:id'
          element={<BranchUpdatePage />}
        />
        <Route
          path='/system/branch/detail/:id'
          element={<BranchDetailPage />}
        />

        {/* BLOCK:Business */}
        <Route path='/system/business/list' element={<BusinessListPage />} />
        <Route
          path='/system/business/create'
          element={<BusinessCreatePage />}
        />
        <Route
          path='/system/business/update/:id'
          element={<BusinessUpdatePage />}
        />
        <Route
          path='/system/business/detail/:id'
          element={<BusinessDetailPage />}
        />
      </Route>

      <Route
        path='auth'
        element={
          <CheckAuth>
            <UnAuthLayout />
          </CheckAuth>
        }
      >
        <Route path='login' element={<LoginPage />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
        <Route path='register' element={<RegisterPage />} />
      </Route>

      <Route path='*' element={<PageNotfound />} />
      <Route path='/403' element={<PageNotPermission />} />
      <Route path='/401' element={<PageUnauthorized />} />
    </Routes>
  );
};
