import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import {
  AcademicCapOutlined,
  BuildingOffice2Outlined,
  Button,
  CakeOutlined,
  CalendarDaysOutlined,
  Drawer,
  EnvelopeOutlined,
  IdentificationOutlined,
  MapPinOutlined,
  PhoneOutlined,
  Spin,
  UserGroupOutlined,
  XMarkOutlined,
} from "tera-dls";

import Avatar from "_common/components/Avatar";
import ErrorRetry from "_common/components/ErrorRetry";
import StatusBadge from "_common/components/StatusBadge";
import { useMeta } from "_common/hooks/useMeta";
import { StudentService } from "@tera/modules/education";

interface StudentDetailParent {
  id: number;
  name: string;
  phone: string;
  email: string;
  relation: string;
}

interface StudentDetailView {
  id: number;
  code: string;
  name: string;
  avatar: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  status: string;
  enrollment_date: string;
  business_name: string;
  branch_name: string;
  address: string;
  school: string;
  note: string;
  parents: StudentDetailParent[];
}

interface StudentStatistics {
  total_enrollments: number;
  total_invoices: number;
  total_exam_results: number;
}

const toDetail = (raw: any): StudentDetailView | null => {
  if (!raw) return null;
  const profile = raw.profile ?? {};
  return {
    id: raw.id ?? 0,
    code: raw.code ?? "",
    name: raw.name ?? "",
    avatar: raw.avatar_url ?? raw.avatar ?? "",
    dob: raw.dob ?? "",
    gender: raw.gender ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    status: raw.status ?? "",
    enrollment_date: raw.enrollment_date ?? "",
    business_name: raw.business?.name ?? "",
    branch_name: raw.branch?.name ?? "",
    address: [profile.address, profile.district, profile.province]
      .filter(Boolean)
      .join(", "),
    school: profile.school ?? "",
    note: profile.note ?? "",
    parents: (raw.parents ?? []).map((p: any) => ({
      id: p.id ?? 0,
      name: p.name ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
      relation: p.relation ?? "",
    })),
  };
};

const toStatistics = (raw: any): StudentStatistics => ({
  total_enrollments: raw?.total_enrollments ?? 0,
  total_invoices: raw?.total_invoices ?? 0,
  total_exam_results: raw?.total_exam_results ?? 0,
});

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-center gap-2 py-1.5">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 [&_svg]:h-4 [&_svg]:w-4">
      {icon}
    </span>
    <span className="w-24 shrink-0 text-xs text-slate-400">{label}</span>
    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
      {value}
    </span>
  </div>
);

interface StudentDetailModalProps {
  studentId: number | null;
  open: boolean;
  onClose: () => void;
}

/** Read-only student profile drawer, shared by the Students page and per-class student lists. */
const StudentDetailModal = observer(({ studentId, open, onClose }: StudentDetailModalProps) => {
  const { getLabel } = useMeta();
  const query = StudentService.useStudentDetail({ id: studentId ?? "" });
  const { isLoading, isError, refetch } = query;
  const detail = toDetail(query.data?.data?.student);
  const statistics = toStatistics(query.data?.data?.statistics);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      containerClassName="w-full max-w-[420px] transition-transform duration-300 ease-out"
      maskClassName="bg-black/40 tera-drawer-mask-fade-in"
    >
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-800">
            Hồ sơ học viên
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 [&_svg]:h-5 [&_svg]:w-5"
          >
            <XMarkOutlined />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isError ? (
            <div className="flex h-40 items-center justify-center">
              <ErrorRetry
                onRetry={() => refetch()}
                message="Không tải được hồ sơ học viên"
              />
            </div>
          ) : (
            <Spin spinning={isLoading}>
              {detail ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={detail.avatar}
                      alt={detail.name}
                      sizeClassName="h-16 w-16"
                      iconSizeClassName="[&_svg]:h-7 [&_svg]:w-7"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-bold text-slate-800">
                          {detail.name || "—"}
                        </p>
                        <StatusBadge name="student_status" value={detail.status} />
                      </div>
                      <p className="text-xs text-slate-400">{detail.code || "—"}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <InfoRow
                      icon={<CakeOutlined />}
                      label="Ngày sinh"
                      value={
                        detail.dob
                          ? moment(detail.dob, "YYYY-MM-DD").format("DD/MM/YYYY")
                          : "—"
                      }
                    />
                    <InfoRow
                      icon={<IdentificationOutlined />}
                      label="Giới tính"
                      value={getLabel("gender", detail.gender) || "—"}
                    />
                    <InfoRow
                      icon={<EnvelopeOutlined />}
                      label="Email"
                      value={detail.email || "—"}
                    />
                    <InfoRow
                      icon={<PhoneOutlined />}
                      label="Điện thoại"
                      value={detail.phone || "—"}
                    />
                    <InfoRow
                      icon={<MapPinOutlined />}
                      label="Địa chỉ"
                      value={detail.address || "—"}
                    />
                    <InfoRow
                      icon={<AcademicCapOutlined />}
                      label="Trường học"
                      value={detail.school || "—"}
                    />
                    <InfoRow
                      icon={<BuildingOffice2Outlined />}
                      label="Cơ sở"
                      value={detail.branch_name || detail.business_name || "—"}
                    />
                    <InfoRow
                      icon={<CalendarDaysOutlined />}
                      label="Ngày nhập học"
                      value={
                        detail.enrollment_date
                          ? moment(detail.enrollment_date, "YYYY-MM-DD").format(
                              "DD/MM/YYYY",
                            )
                          : "—"
                      }
                    />
                  </div>

                  {detail.note && (
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-400">Ghi chú</p>
                      <p className="mt-1 text-sm text-slate-600">{detail.note}</p>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-3">
                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      Phụ huynh
                    </p>
                    {detail.parents.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        Chưa có thông tin phụ huynh
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {detail.parents.map((parent) => (
                          <div
                            key={parent.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-brand [&_svg]:h-4 [&_svg]:w-4">
                              <UserGroupOutlined />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {parent.name || "—"}
                                {parent.relation && ` (${parent.relation})`}
                              </p>
                              <p className="truncate text-xs text-slate-400">
                                {[parent.phone, parent.email].filter(Boolean).join(" · ") ||
                                  "—"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-slate-800">
                        {statistics.total_enrollments}
                      </p>
                      <p className="text-xs text-slate-400">Ghi danh</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-800">
                        {statistics.total_invoices}
                      </p>
                      <p className="text-xs text-slate-400">Hóa đơn</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-800">
                        {statistics.total_exam_results}
                      </p>
                      <p className="text-xs text-slate-400">Kết quả thi</p>
                    </div>
                  </div>
                </div>
              ) : (
                !isLoading && (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Không tìm thấy học viên
                  </p>
                )
              )}
            </Spin>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <Button outlined className="w-full" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Drawer>
  );
});

export default StudentDetailModal;
