import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { notification } from "tera-dls";

import Card from "_common/components/Card";
import useConfirm from "_common/hooks/useConfirm";
import { toCalendarItems } from "_common/utils/schedule";
import { AuthApi } from "@tera/api/auth/auth";
import { TimetableService } from "@tera/modules/education";
import { ProfileService } from "@tera/modules/system";
import { TeacherService } from "@tera/modules/hr";
import { useStores } from "@tera/stores/useStores";

import { toProfileData, toTeachingProfile } from "./_utils";
import AccountInfoCard from "./components/AccountInfoCard";
import AccountSidebar from "./components/AccountSidebar";
import ChangePasswordForm from "./components/ChangePasswordForm";
import TeachingProfileCard from "./components/TeachingProfileCard";
import UpcomingSessionsCard from "./components/UpcomingSessionsCard";

const MyInfo = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { globalStore } = useStores();
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);

  const profileQuery = ProfileService.useProfile();
  const profile = useMemo(() => toProfileData(profileQuery.data?.data), [profileQuery.data]);

  // The teacher's own HR record — looked up by user_id since there's no
  // dedicated "my teacher profile" endpoint.
  const teacherLookupQuery = TeacherService.useTeacherList(
    { params: { per_page: 1, filters: { user_id: profile.user_id } } },
    { enabled: !!profile.user_id },
  );
  const teacherId = teacherLookupQuery.data?.data?.items?.[0]?.id;
  const teacherDetailQuery = TeacherService.useTeacherDetail(
    { id: teacherId ?? "" },
    { enabled: !!teacherId },
  );
  const teachingProfile = useMemo(
    () => toTeachingProfile(teacherDetailQuery.data?.data),
    [teacherDetailQuery.data],
  );
  const isTeachingProfileLoading =
    profileQuery.isLoading || teacherLookupQuery.isLoading || teacherDetailQuery.isLoading;

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
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Thông tin cá nhân</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Quản lý hồ sơ, lịch dạy và cài đặt tài khoản của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_280px]">
        <AccountInfoCard profile={profile} loading={profileQuery.isLoading} />

        <div className="flex flex-col gap-4">
          <Card>
            <p className="mb-2 text-sm font-semibold text-slate-700">Hồ sơ giảng dạy</p>
            <TeachingProfileCard profile={teachingProfile} loading={isTeachingProfileLoading} />
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

export default MyInfo;
