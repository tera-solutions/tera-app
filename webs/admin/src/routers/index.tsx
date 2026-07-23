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

/* IMPORT:Enrollment */
import EnrollmentListPage from "pages/education/enrollment/EnrollmentListPage";
import EnrollmentCreatePage from "pages/education/enrollment/EnrollmentCreatePage";
import EnrollmentUpdatePage from "pages/education/enrollment/EnrollmentUpdatePage";
import EnrollmentDetailPage from "pages/education/enrollment/EnrollmentDetailPage";

/* IMPORT:Attendance */
import AttendanceListPage from "pages/education/attendance/AttendanceListPage";

/* IMPORT:Evaluation */
import EvaluationListPage from "pages/education/evaluation/EvaluationListPage";

/* IMPORT:Level */
import LevelListPage from "pages/education/level/LevelListPage";

/* IMPORT:Room */
import RoomListPage from "pages/education/room/RoomListPage";
import RoomCreatePage from "pages/education/room/RoomCreatePage";
import RoomUpdatePage from "pages/education/room/RoomUpdatePage";
import RoomDetailPage from "pages/education/room/RoomDetailPage";

/* IMPORT:ClassRoom */
import ClassRoomListPage from "pages/education/class-room/ClassRoomListPage";
import ClassRoomCreatePage from "pages/education/class-room/ClassRoomCreatePage";
import ClassRoomUpdatePage from "pages/education/class-room/ClassRoomUpdatePage";
import ClassRoomDetailPage from "pages/education/class-room/ClassRoomDetailPage";

/* IMPORT:Lesson */
import LessonListPage from "pages/education/lesson/LessonListPage";
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

/* IMPORT:Lead */
import LeadListPage from "pages/CRM/lead/LeadListPage";
import LeadCreatePage from "pages/CRM/lead/LeadCreatePage";
import LeadUpdatePage from "pages/CRM/lead/LeadUpdatePage";
import LeadDetailPage from "pages/CRM/lead/LeadDetailPage";

/* IMPORT:ParentStudent */
import ParentStudentListPage from "pages/CRM/parent-student/ParentStudentListPage";
import ParentStudentCreatePage from "pages/CRM/parent-student/ParentStudentCreatePage";
import ParentStudentUpdatePage from "pages/CRM/parent-student/ParentStudentUpdatePage";
import ParentStudentDetailPage from "pages/CRM/parent-student/ParentStudentDetailPage";

/* IMPORT:User */
import UserListPage from "pages/System/user/UserListPage";
import UserCreatePage from "pages/System/user/UserCreatePage";
import UserUpdatePage from "pages/System/user/UserUpdatePage";
import UserDetailPage from "pages/System/user/UserDetailPage";

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

        {/* BLOCK:Level */}
        <Route path='/course/level/list' element={<LevelListPage />} />

        {/* BLOCK:Room */}
        <Route path='/course/room/list' element={<RoomListPage />} />
        <Route path='/course/room/create' element={<RoomCreatePage />} />
        <Route path='/course/room/update/:id' element={<RoomUpdatePage />} />
        <Route path='/course/room/detail/:id' element={<RoomDetailPage />} />

        {/* BLOCK:Attendance */}
        <Route path="/student/attendance/list" element={<AttendanceListPage />} />

        {/* BLOCK:Evaluation */}
        <Route path="/student/evaluation/list" element={<EvaluationListPage />} />

        {/* BLOCK:Enrollment */}
        <Route path="/student/enrollment/list" element={<EnrollmentListPage />} />
        <Route
          path="/student/enrollment/create"
          element={<EnrollmentCreatePage />}
        />
        <Route
          path="/student/enrollment/update/:id"
          element={<EnrollmentUpdatePage />}
        />
        <Route
          path="/student/enrollment/detail/:id"
          element={<EnrollmentDetailPage />}
        />

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

        {/* BLOCK:Lead */}
        <Route path='/student/lead/list' element={<LeadListPage />} />
        <Route path='/student/lead/create' element={<LeadCreatePage />} />
        <Route path='/student/lead/update/:id' element={<LeadUpdatePage />} />
        <Route path='/student/lead/detail/:id' element={<LeadDetailPage />} />

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

        {/* BLOCK:User */}
        <Route path='/system/user/list' element={<UserListPage />} />
        <Route path='/system/user/create' element={<UserCreatePage />} />
        <Route path='/system/user/update/:id' element={<UserUpdatePage />} />
        <Route path='/system/user/detail/:id' element={<UserDetailPage />} />

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
