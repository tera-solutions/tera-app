import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { notification } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import useConfirm from "_common/hooks/useConfirm";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { toCalendarItems } from "_common/utils/schedule";
import { AuthApi } from "@tera/api/auth/auth";
import { TimetableService } from "@tera/modules/education";
import { ProfileService } from "@tera/modules/system";
import { useStores } from "@tera/stores/useStores";

import { toProfileData } from "./_utils";
import AccountInfoCard from "./components/AccountInfoCard";
import AccountSidebar from "./components/AccountSidebar";
import ChangePasswordForm from "./components/ChangePasswordForm";
import UpcomingSessionsCard from "./components/UpcomingSessionsCard";

const Profile = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { globalStore } = useStores();
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);

  const profileQuery = ProfileService.useProfile();
  const profile = useMemo(() => toProfileData(profileQuery.data?.data), [profileQuery.data]);

  const weekRange = {
    date_from: moment().startOf("week").format("YYYY-MM-DD"),
    date_to: moment().add(1, "month").format("YYYY-MM-DD"),
  };
  const scheduleQuery = TimetableService.useTimetableCalendar(weekRange);
  const sessions = useMemo(
    () => toCalendarItems(scheduleQuery.data?.data),
    [scheduleQuery.data],
  );

  const handleLogout = () => {
    confirm.warning({
      title: "Đăng xuất",
      content: <p>Bạn có chắc muốn đăng xuất khỏi tài khoản?</p>,
      onOk: async () => {
        try {
          await AuthApi.logout();
        } finally {
          globalStore.clear?.();
          navigate(`/auth/login`);
        }
      },
    });
  };

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Trang chủ", onClick: () => navigate(PATHS.dashboard) },
          { label: "Cá nhân" },
          { label: "Thông tin cá nhân" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_280px]">
        <AccountInfoCard profile={profile} loading={profileQuery.isLoading} />

        <div className="flex flex-col gap-4">
          <Card>
            <p className="mb-2 text-sm font-semibold text-slate-700">Hồ sơ giảng dạy</p>
            <EmptyState
              description="Hồ sơ giảng dạy chi tiết (chuyên môn, kinh nghiệm, chứng chỉ) chưa khả dụng cho tài khoản giáo viên"
              className="py-8"
            />
          </Card>
          <UpcomingSessionsCard
            title="Lịch dạy học"
            sessions={sessions}
            isLoading={scheduleQuery.isLoading}
            isError={scheduleQuery.isError}
            onRetry={() => scheduleQuery.refetch()}
          />
        </div>

        <AccountSidebar onChangePassword={() => setPasswordFormOpen(true)} onLogout={handleLogout} />
      </div>

      <ChangePasswordForm open={passwordFormOpen} onClose={() => setPasswordFormOpen(false)} />
    </div>
  );
};

export default Profile;
