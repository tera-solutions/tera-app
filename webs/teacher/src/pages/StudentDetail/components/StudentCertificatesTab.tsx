import moment from "moment";

import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import { Spin } from "tera-dls";
import { CertificateService } from "@tera/modules/education";

const STATUS_META: Record<string, { label: string; className: string }> = {
  issued: { label: "Đang hiệu lực", className: "bg-emerald-50 text-emerald-600" },
  revoked: { label: "Đã thu hồi", className: "bg-red-50 text-red-500" },
};

const StudentCertificatesTab = ({ studentId }: { studentId: number | null }) => {
  const query = CertificateService.useCertificateListByStudent(studentId ?? "");
  const rows = query.data?.data ?? [];

  return (
    <Spin spinning={query.isLoading}>
      {rows.length === 0 ? (
        <EmptyState className="py-10" description="Học viên chưa có chứng chỉ nào" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                <th className="px-3 py-2">Mã chứng chỉ</th>
                <th className="px-3 py-2">Lớp</th>
                <th className="px-3 py-2 text-center">Điểm tổng kết</th>
                <th className="px-3 py-2 text-center">Ngày cấp</th>
                <th className="px-3 py-2 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((certificate: any) => {
                const status = STATUS_META[certificate.status];
                return (
                  <tr key={certificate.id}>
                    <td className="px-3 py-2 font-medium text-slate-800">{certificate.certificate_no}</td>
                    <td className="px-3 py-2 text-slate-600">{certificate.classRoom?.name ?? "—"}</td>
                    <td className="px-3 py-2 text-center">{certificate.final_score ?? "—"}</td>
                    <td className="px-3 py-2 text-center text-slate-500">
                      {certificate.issued_at ? moment(certificate.issued_at).format("DD/MM/YYYY") : "—"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {status ? (
                        <Badge className={`px-2 py-0.5 text-[11px] ${status.className}`}>{status.label}</Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Spin>
  );
};

export default StudentCertificatesTab;
