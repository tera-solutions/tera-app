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
import LessonPlanWizard from "pages/LessonPlan/Wizard";
import Lesson from "pages/Lesson";
import SessionRuntime from "pages/SessionRuntime";
import Attendance from "pages/Attendance";
import Students from "pages/Students";
import StudentDetail from "pages/StudentDetail";
import Room from "pages/Room";
import RoomDetail from "pages/RoomDetail";
import Evaluation from "pages/Evaluation";
import Notifications from "pages/Notifications";
import Assignment from "pages/Assignment";
import AssignmentForm from "pages/Assignment/Form";
import AssignmentDetail from "pages/AssignmentDetail";
import Grading from "pages/Grading";
import ExamSession from "pages/ExamSession";
import ExamDetail from "pages/ExamDetail";
import ExamForm from "pages/ExamDetail/Form";
import Achievement from "pages/Achievement";
import Ranking from "pages/Ranking";
import Messages from "pages/Messages";
import MyInfo from "pages/MyInfo";
import Parents from "pages/Parents";
import ParentDetail from "pages/ParentDetail";
import CourseDetail from "pages/CourseDetail";
import Enrollment from "pages/Enrollment";
import Transfer from "pages/Transfer";
import Wallet from "pages/Wallet";
import Deposit from "pages/Deposit";
import Withdraw from "pages/Withdraw";
import Timesheet from "pages/Timesheet";
import TeacherPage from "pages/Teacher";
import Payroll from "pages/Payroll";
import PayrollDetail from "pages/Payroll/PayrollDetailPage";
import LeaveRequest from "pages/LeaveRequest";
import LeaveRequestList from "pages/LeaveRequest/AllRequestsPage";
import Material from "pages/Material";
import LearningLibrary from "pages/LearningLibrary";
import LearningLibraryDetail from "pages/LearningLibraryDetail";
import LearningLibraryCreate from "pages/LearningLibraryCreate";
import LearningLibraryCreateComic from "pages/LearningLibraryCreateComic";
import LearningLibraryCreateDialogue from "pages/LearningLibraryCreateDialogue";
import LearningLibraryCreateFlashcard from "pages/LearningLibraryCreateFlashcard";
import LearningLibraryCreateAudio from "pages/LearningLibraryCreateAudio";
import LearningLibraryCreateEbook from "pages/LearningLibraryCreateEbook";
import Vocabulary from "pages/Vocabulary";
import QuestionBank from "pages/QuestionBank";
import Invoice from "pages/Invoice";
import Settings from "pages/Settings";
import Report from "pages/Report";
import PlacementTest from "pages/PlacementTest";
import PackageManagement from "pages/PackageManagement";
import Placeholder from "pages/Placeholder";
import More from "pages/More";
import Courses from "pages/Courses";
import Levels from "pages/Levels";
import SuperadminDashboard from "pages/Superadmin/Dashboard";
import SuperadminTenants from "pages/Superadmin/Tenants";
import SuperadminTenantDetail from "pages/Superadmin/TenantDetail";
import SuperadminPackages from "pages/Superadmin/Packages";
import CertificateVerify from "pages/CertificateVerify";

import CheckAuth from "routers/CheckAuth";
import MiddlewareRouter from "routers/MiddlewareRouter";
import SuperadminRoute from "routers/SuperadminRoute";
import FeatureRoute from "routers/FeatureRoute";

import BasicLayout from "_common/components/Layout/BasicLayout";
import { PATHS } from "_common/components/Layout/Menu/menus";
import UnAuthLayout from "_common/components/Layout/UnAuthLayout";

const PLACEHOLDER_PATHS: string[] = [];

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
        <Route index element={<Navigate to={PATHS.dashboard} />} />
        <Route path={PATHS.dashboard} element={<Dashboard />} />
        <Route path={PATHS.schedule} element={<Schedule />} />
        <Route path={PATHS.classroom} element={<Classroom />} />
        <Route path={PATHS.lessonPlans} element={<LessonPlan />} />
        <Route
          path={`${PATHS.lessonPlans}/new`}
          element={<LessonPlanWizard />}
        />
        <Route
          path={`${PATHS.lessonPlans}/:id/edit`}
          element={<LessonPlanWizard />}
        />
        <Route path={`${PATHS.lessonPlans}/:id`} element={<PlanLessons />} />
        <Route path={`${PATHS.lesson}/:id`} element={<Lesson />} />
        <Route path={`${PATHS.session}/:id`} element={<SessionRuntime />} />
        <Route path={`${PATHS.classroom}/:id`} element={<ClassroomDetail />} />
        <Route path={PATHS.courses} element={<Courses />} />
        <Route path={PATHS.levels} element={<Levels />} />
        <Route path={`${PATHS.courseDetail}/:id`} element={<CourseDetail />} />
        <Route path={PATHS.attendance} element={<Attendance />} />
        <Route path={PATHS.students} element={<Students />} />
        <Route
          path={`${PATHS.studentDetail}/:id`}
          element={<StudentDetail />}
        />
        <Route path={PATHS.rooms} element={<Room />} />
        <Route path={`${PATHS.roomDetail}/:id`} element={<RoomDetail />} />
        <Route path={PATHS.evaluation} element={<Evaluation />} />
        <Route path={PATHS.notifications} element={<Notifications />} />
        <Route
          path={PATHS.assignment}
          element={
            <FeatureRoute feature="assignments">
              <Assignment />
            </FeatureRoute>
          }
        />
        <Route
          path={`${PATHS.assignment}/new`}
          element={
            <FeatureRoute feature="assignments">
              <AssignmentForm />
            </FeatureRoute>
          }
        />
        <Route
          path={`${PATHS.assignment}/:id/edit`}
          element={
            <FeatureRoute feature="assignments">
              <AssignmentForm />
            </FeatureRoute>
          }
        />
        <Route
          path={`${PATHS.assignmentDetail}/:id`}
          element={
            <FeatureRoute feature="assignments">
              <AssignmentDetail />
            </FeatureRoute>
          }
        />
        <Route
          path={`${PATHS.grading}/:id`}
          element={
            <FeatureRoute feature="assignments">
              <Grading />
            </FeatureRoute>
          }
        />
        <Route path={PATHS.exam} element={<ExamSession />} />
        <Route path={`${PATHS.exam}/new`} element={<ExamForm />} />
        <Route path={`${PATHS.exam}/:id/edit`} element={<ExamForm />} />
        <Route path={`${PATHS.exam}/session/:id`} element={<ExamSession />} />
        <Route path={`${PATHS.exam}/:id`} element={<ExamDetail />} />
        <Route path={PATHS.achievement} element={<Achievement />} />
        <Route path={PATHS.ranking} element={<Ranking />} />
        <Route path={PATHS.parents} element={<Parents />} />
        <Route path={`${PATHS.parentDetail}/:id`} element={<ParentDetail />} />
        <Route path={PATHS.enrollmentNew} element={<Enrollment />} />
        <Route path={PATHS.transfer} element={<Transfer />} />
        <Route
          path={PATHS.messages}
          element={
            <FeatureRoute feature="messaging">
              <Messages />
            </FeatureRoute>
          }
        />
        <Route path={PATHS.wallet} element={<Wallet />} />
        <Route path={PATHS.walletDeposit} element={<Deposit />} />
        <Route path={PATHS.walletWithdraw} element={<Withdraw />} />
        <Route path={PATHS.timesheet} element={<Timesheet />} />
        <Route path={PATHS.teachers} element={<TeacherPage />} />
        <Route path={PATHS.payroll} element={<Payroll />} />
        <Route path={`${PATHS.payroll}/:id`} element={<PayrollDetail />} />
        <Route path={PATHS.leaveRequest} element={<LeaveRequest />} />
        <Route path={PATHS.leaveRequestAll} element={<LeaveRequestList />} />
        <Route path={PATHS.materials} element={<Material />} />
        <Route path={PATHS.learningLibrary} element={<LearningLibrary />} />
        <Route path={`${PATHS.learningLibrary}/create`} element={<LearningLibraryCreate />} />
        <Route path={`${PATHS.learningLibrary}/create-comic`} element={<LearningLibraryCreateComic />} />
        <Route path={`${PATHS.learningLibrary}/create-dialogue`} element={<LearningLibraryCreateDialogue />} />
        <Route path={`${PATHS.learningLibrary}/create-flashcard`} element={<LearningLibraryCreateFlashcard />} />
        <Route path={`${PATHS.learningLibrary}/create-audio`} element={<LearningLibraryCreateAudio />} />
        <Route path={`${PATHS.learningLibrary}/create-ebook`} element={<LearningLibraryCreateEbook />} />
        <Route path={PATHS.vocabulary} element={<Vocabulary />} />
        <Route path={`${PATHS.learningLibrary}/:id`} element={<LearningLibraryDetail />} />
        <Route path={PATHS.questionBank} element={<QuestionBank />} />
        <Route path={PATHS.invoices} element={<Invoice />} />
        <Route path={PATHS.settings} element={<Settings />} />
        <Route
          path={PATHS.reports}
          element={
            <FeatureRoute feature="advanced_reports">
              <Report />
            </FeatureRoute>
          }
        />
        <Route path={PATHS.placementTest} element={<PlacementTest />} />
        <Route path={PATHS.packageManagement} element={<PackageManagement />} />

        {/* Platform superadmin panel — gated to is_superadmin accounts. */}
        <Route
          path={PATHS.superadmin}
          element={
            <SuperadminRoute>
              <SuperadminDashboard />
            </SuperadminRoute>
          }
        />
        <Route
          path={PATHS.superadminTenants}
          element={
            <SuperadminRoute>
              <SuperadminTenants />
            </SuperadminRoute>
          }
        />
        <Route
          path={`${PATHS.superadminTenantDetail}/:id`}
          element={
            <SuperadminRoute>
              <SuperadminTenantDetail />
            </SuperadminRoute>
          }
        />
        <Route
          path={PATHS.superadminPackages}
          element={
            <SuperadminRoute>
              <SuperadminPackages />
            </SuperadminRoute>
          }
        />

        {/* "Gói đăng ký" trùng chức năng với "Quản lý gói" (PackageManagement, dữ liệu
            thật) — giữ route cũ chuyển hướng cho link/bookmark cũ, gỡ trang mock. */}
        <Route path={PATHS.subscription} element={<Navigate to={PATHS.packageManagement} replace />} />
        <Route path={PATHS.profile} element={<MyInfo />} />
        <Route path={PATHS.more} element={<More />} />
        {PLACEHOLDER_PATHS.map((path) => (
          <Route key={path} path={path} element={<Placeholder />} />
        ))}
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

      {/* Public QR verification — no auth, standalone page (BRD EDU-18). */}
      <Route path='certificate/verify/:token' element={<CertificateVerify />} />

      <Route path='*' element={<PageNotfound />} />
      <Route path='/403' element={<PageNotPermission />} />
      <Route path='/401' element={<PageUnauthorized />} />
    </Routes>
  );
};
