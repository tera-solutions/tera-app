import { Navigate, Route, Routes } from "react-router-dom";

import PageNotfound from "@tera/components/web/PageNotfound";
import PageNotPermission from "@tera/components/web/PageNotPermission";
import PageUnauthorized from "@tera/components/web/PageUnauthorized";

import ForgotPasswordPage from "pages/Auth/ForgotPassword";
import LoginPage from "pages/Auth/Login";
import RegisterPage from "pages/Auth/Register";

import ClassesPage from "pages/Classes";
import ComingSoon from "pages/ComingSoon";
import HomePage from "pages/Home";

import CheckAuth from "routers/CheckAuth";
import MiddlewareRouter from "routers/MiddlewareRouter";

import StudentLayout from "_common/components/Layout/StudentLayout";
import UnAuthLayout from "_common/components/Layout/UnAuthLayout";

/**
 * Route theo mục "3. Điều kiện truy cập" của agents/claude/student/tasks/086..104.
 * Màn nào chưa dựng UI thì tạm trỏ vào <ComingSoon /> để điều hướng trong app
 * không bị gãy — thay dần bằng page thật khi làm tới task tương ứng.
 */
export const Routers = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MiddlewareRouter>
            <StudentLayout />
          </MiddlewareRouter>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />

        <Route path="classes" element={<ClassesPage />} />
        <Route
          path="class/:id"
          element={<ComingSoon titleKey="screens.class_detail" />}
        />
        <Route
          path="lessons"
          element={<ComingSoon titleKey="screens.lessons" />}
        />
        <Route
          path="lesson/:id"
          element={<ComingSoon titleKey="screens.lesson_detail" />}
        />
        <Route
          path="exercises"
          element={<ComingSoon titleKey="screens.exercises" />}
        />
        <Route
          path="practice"
          element={<ComingSoon titleKey="screens.practice" />}
        />
        <Route
          path="companion"
          element={<ComingSoon titleKey="screens.companion" />}
        />
        <Route
          path="rewards"
          element={<ComingSoon titleKey="screens.rewards" />}
        />
        <Route
          path="library"
          element={<ComingSoon titleKey="screens.library" />}
        />
        <Route
          path="library/:id"
          element={<ComingSoon titleKey="screens.library_detail" />}
        />
        <Route
          path="profile"
          element={<ComingSoon titleKey="screens.profile" />}
        />
        <Route
          path="achievements"
          element={<ComingSoon titleKey="screens.achievements" />}
        />
        <Route
          path="friends"
          element={<ComingSoon titleKey="screens.friends" />}
        />
        <Route
          path="parent-dashboard"
          element={<ComingSoon titleKey="screens.parent_dashboard" />}
        />
        <Route
          path="schedule"
          element={<ComingSoon titleKey="screens.schedule" />}
        />
        <Route
          path="settings"
          element={<ComingSoon titleKey="screens.settings" />}
        />
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
