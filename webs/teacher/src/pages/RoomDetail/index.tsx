import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpenOutlined,
  CalendarDaysOutlined,
  ClockOutlined,
  HomeModernOutlined,
  UserOutlined,
  UsersOutlined,
  notification,
  Spin,
} from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import { PATHS } from "_common/components/Layout/Menu/menus";
import RoomStatusBadge from "_common/components/RoomStatusBadge";
import { useMeta } from "_common/hooks/useMeta";
import { toDate, toTime } from "_common/utils/schedule";
import useConfirm from "_common/hooks/useConfirm";
import { AttendanceService, ClassSessionService, RoomService } from "@tera/modules/education";
import moment from "moment";

import { scheduleDaysLabel, toClassesInUse, toCurrentSession, toRoomDetailInfo, toRoomStudents } from "./_utils";
import SessionTimer from "./components/SessionTimer";
import StudentAvatarGrid from "./components/StudentAvatarGrid";
import RoomMaterialList from "./components/RoomMaterialList";

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 py-1.5 text-sm">
    <span className="text-slate-400 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-700">{value}</span>
  </div>
);

const toDisplayDate = (value: string) => (value ? moment(toDate(value)).format("DD/MM/YYYY") : "—");

const RoomDetail = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { getLabel } = useMeta();
  const { id } = useParams<{ id: string }>();
  const roomId = id ? Number(id) : null;

  const detailQuery = RoomService.useRoomDetail({ id: roomId ?? "" });
  const { isLoading, isError, refetch } = detailQuery;
  const room = useMemo(() => toRoomDetailInfo(detailQuery.data?.data?.room), [detailQuery.data]);
  const session = useMemo(
    () => toCurrentSession(detailQuery.data?.data?.current_session),
    [detailQuery.data],
  );
  const classesInUse = useMemo(
    () => toClassesInUse(detailQuery.data?.data?.classes_in_use),
    [detailQuery.data],
  );

  const attendanceQuery = AttendanceService.useAttendanceList(
    { params: { per_page: 100, filters: { session_id: session?.session_id } } },
    { enabled: !!session?.session_id },
  );
  const students = useMemo(
    () => toRoomStudents(attendanceQuery.data?.data?.items),
    [attendanceQuery.data],
  );

  const { mutate: endSession, isPending: ending } = ClassSessionService.useClassSessionEnd();

  const handleStop = () => {
    if (!session) return;
    confirm.warning({
      title: "Kết thúc buổi học",
      content: <p>Bạn có chắc chắn muốn kết thúc sớm buổi học này?</p>,
      onOk: () => {
        endSession(
          { id: session.session_id, params: {} },
          {
            onSuccess: () => {
              notification.success({ message: "Kết thúc buổi học thành công" });
              refetch();
            },
            onError: (error: any) => {
              notification.error({ message: error?.msg ?? "Không thể kết thúc buổi học" });
            },
          },
        );
      },
    });
  };

  const notFound = !isLoading && (isError || !room);
  const sessionStart = session
    ? moment(`${toDate(session.session_date)} ${toTime(session.start_time)}`, "YYYY-MM-DD HH:mm")
    : null;
  const durationMinutes = session
    ? moment(toTime(session.end_time), "HH:mm").diff(moment(toTime(session.start_time), "HH:mm"), "minutes")
    : null;

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: "Phòng học", onClick: () => navigate(PATHS.rooms) },
            { label: "Chi tiết phòng học" },
          ]}
        />
      </div>

      {notFound ? (
        <div className="flex h-[50vh] items-center justify-center">
          <ErrorRetry
            onRetry={() => refetch()}
            message="Không tìm thấy phòng học"
            iconClassName="h-8 w-8"
            messageClassName="text-sm text-slate-500"
            secondaryAction={{ label: "Về danh sách phòng học", onClick: () => navigate(PATHS.rooms) }}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          {room ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
              <div className="flex flex-col gap-4">
                <Card>
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="flex h-28 w-full shrink-0 items-end rounded-xl bg-gradient-to-br from-sky-500 to-indigo-700 p-3 text-white lg:w-36">
                      <div className="flex items-center gap-2">
                        <BookOpenOutlined className="h-6 w-6 shrink-0" />
                        <p className="text-sm font-bold leading-tight">
                          {session ? session.class_name : room.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={!session}
                          onClick={() => session && navigate(`${PATHS.classroom}/${session.class_id}`)}
                          className={`text-lg font-bold text-slate-800 ${session ? "hover:underline" : ""}`}
                        >
                          {session ? session.class_name : room.name}
                        </button>
                        <RoomStatusBadge
                          room={{ status: room.status, active_classes_count: classesInUse.length }}
                          className="px-2.5 py-1 text-xs"
                        />
                      </div>

                      {session ? (
                        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                          <InfoItem icon={<BookOpenOutlined />} label="Mã lớp" value={session.class_code || "—"} />
                          <InfoItem
                            icon={<HomeModernOutlined />}
                            label="Loại phòng"
                            value={getLabel("room_type", room.type) || "—"}
                          />
                          <InfoItem
                            icon={<UsersOutlined />}
                            label="Sỹ số"
                            value={`${session.student_count}/${session.max_students}`}
                          />
                          <InfoItem icon={<HomeModernOutlined />} label="Phòng học" value={room.name} />
                          <InfoItem
                            icon={<CalendarDaysOutlined />}
                            label="Thời gian"
                            value={`${scheduleDaysLabel(session.schedules)} (${toTime(session.start_time)} - ${toTime(session.end_time)})`}
                          />
                          <InfoItem
                            icon={<ClockOutlined />}
                            label="Thời lượng"
                            value={durationMinutes != null ? `${durationMinutes} phút` : "—"}
                          />
                          <InfoItem icon={<UserOutlined />} label="Giáo viên" value={session.teacher_name || "—"} />
                          <InfoItem
                            icon={<CalendarDaysOutlined />}
                            label="Ngày học"
                            value={`${toDisplayDate(session.class_start_date)} - ${toDisplayDate(session.class_end_date)}`}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">
                          {room.name} · {getLabel("room_type", room.type) || "—"}
                        </p>
                      )}
                    </div>

                    {session && sessionStart && (
                      <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-slate-100 p-3 lg:w-52">
                        <p className="text-xs font-medium text-slate-400">Thời gian buổi học</p>
                        <SessionTimer startAt={sessionStart} onStop={handleStop} stopping={ending} />
                      </div>
                    )}
                  </div>

                  {!session && (
                    <>
                      <p className="py-6 text-center text-sm text-slate-400">
                        {classesInUse.length > 0
                          ? "Phòng học hiện không có buổi học nào đang diễn ra"
                          : "Phòng học hiện không có lớp học nào sử dụng"}
                      </p>

                      {classesInUse.length > 0 && (
                        <div className="border-t border-slate-100 pt-3">
                          <p className="mb-2 text-sm font-semibold text-slate-700">
                            Lớp học đang sử dụng phòng
                          </p>
                          <div className="flex flex-col gap-3">
                            {classesInUse.map((c) => (
                              <div key={c.id} className="rounded-lg bg-slate-50 p-2.5">
                                <button
                                  type="button"
                                  onClick={() => navigate(`${PATHS.classroom}/${c.id}`)}
                                  className="font-medium text-brand hover:underline"
                                >
                                  {c.name || "—"}
                                </button>
                                <div className="mt-1 flex items-center justify-between text-sm text-slate-500">
                                  <span>{c.teacher_name || "—"}</span>
                                  <span>
                                    {c.student_count}/{c.max_students}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Card>

                {session && (
                  <Card>
                    <p className="mb-3 text-sm font-semibold text-slate-700">
                      Danh sách học viên ({students.length})
                    </p>
                    <Spin spinning={attendanceQuery.isLoading}>
                      <StudentAvatarGrid students={students} />
                    </Spin>
                  </Card>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Card>
                  <p className="mb-3 text-sm font-semibold text-slate-700">Tài liệu</p>
                  <RoomMaterialList courseId={session?.course_id} />
                </Card>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-[50vh]" />
          ) : (
            <p className="py-20 text-center text-sm text-slate-400">Không tải được chi tiết phòng học</p>
          )}
        </Spin>
      )}
    </div>
  );
};

export default RoomDetail;
