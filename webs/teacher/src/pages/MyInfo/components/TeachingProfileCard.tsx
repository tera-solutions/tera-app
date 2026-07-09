import moment from "moment";
import { AcademicCapOutlined, Spin } from "tera-dls";

import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import { useMeta } from "_common/hooks/useMeta";

import type { TeachingProfileData } from "../_interface";

const TEACHER_TYPE_META = "teacher_type";
const EMPLOYMENT_TYPE_META = "employment_type";

interface TeachingProfileCardProps {
  profile?: TeachingProfileData;
  loading?: boolean;
}

const TeachingProfileCard = ({ profile, loading }: TeachingProfileCardProps) => {
  const { getLabel } = useMeta();

  if (loading) {
    return (
      <Spin spinning>
        <div className="h-40" />
      </Spin>
    );
  }

  if (!profile) {
    return (
      <EmptyState
        description="Chưa có hồ sơ giảng dạy cho tài khoản này"
        className="py-8"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-400">Loại giáo viên</p>
          <p className="mt-0.5 text-sm font-medium text-slate-700">
            {getLabel(TEACHER_TYPE_META, profile.teacher_type) || profile.teacher_type || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Hình thức làm việc</p>
          <p className="mt-0.5 text-sm font-medium text-slate-700">
            {getLabel(EMPLOYMENT_TYPE_META, profile.employment_type) || profile.employment_type || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Kinh nghiệm</p>
          <p className="mt-0.5 text-sm font-medium text-slate-700">
            {profile.joined_at
              ? `${profile.years_experience} năm (từ ${moment(profile.joined_at).format("MM/YYYY")})`
              : "—"}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Chuyên môn</p>
        {profile.skills.length === 0 ? (
          <p className="text-xs text-slate-400">Chưa cập nhật chuyên môn</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <Badge
                key={skill.id}
                className="bg-sky-50 px-2.5 py-1 text-[11px] text-brand"
              >
                {skill.name}
                {skill.level ? ` · ${skill.level}` : ""}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Chứng chỉ</p>
        {profile.certificates.length === 0 ? (
          <p className="text-xs text-slate-400">Chưa có chứng chỉ nào</p>
        ) : (
          <div className="flex flex-col gap-2">
            {profile.certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-2.5 py-2"
              >
                <AcademicCapOutlined className="h-4 w-4 shrink-0 text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-700">{cert.name}</p>
                  <p className="truncate text-[11px] text-slate-400">
                    {cert.issuer}
                    {cert.issued_date ? ` · ${moment(cert.issued_date).format("DD/MM/YYYY")}` : ""}
                  </p>
                </div>
                {cert.is_expired && (
                  <Badge className="shrink-0 bg-red-50 px-2 py-0.5 text-[10px] text-red-500">
                    Hết hạn
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingProfileCard;
