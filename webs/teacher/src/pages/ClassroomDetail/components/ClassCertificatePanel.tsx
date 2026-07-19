import { useState } from "react";
import moment from "moment";
import { AcademicCapOutlined, Button, Spin, notification } from "tera-dls";

import Badge from "_common/components/Badge";
import EmptyState from "_common/components/EmptyState";
import { CertificateService } from "@tera/modules/education";

interface ClassCertificatePanelProps {
  classId: number | null;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  issued: { label: "Đang hiệu lực", className: "bg-emerald-50 text-emerald-600" },
  revoked: { label: "Đã thu hồi", className: "bg-red-50 text-red-500" },
};

const ClassCertificatePanel = ({ classId }: ClassCertificatePanelProps) => {
  const [issuingId, setIssuingId] = useState<number | null>(null);

  const eligibilityQuery = CertificateService.useCertificateEligibility(classId ?? "");
  const { mutate: issueCertificate } = CertificateService.useCertificateIssue(classId ?? "");
  const { mutate: revokeCertificate } = CertificateService.useCertificateRevoke(classId ?? "");

  const rows = eligibilityQuery.data?.data ?? [];

  if (!classId) return null;

  const handleIssue = (studentId: number) => {
    setIssuingId(studentId);
    issueCertificate(studentId, {
      onSuccess: () => notification.success({ message: "Đã phát hành chứng chỉ" }),
      onError: (error: any) =>
        notification.error({ message: error?.data?.msg ?? "Không thể phát hành chứng chỉ" }),
      onSettled: () => setIssuingId(null),
    });
  };

  const handleRevoke = (certificateId: number) => {
    revokeCertificate(
      { id: certificateId },
      {
        onSuccess: () => notification.success({ message: "Đã thu hồi chứng chỉ" }),
        onError: (error: any) =>
          notification.error({ message: error?.data?.msg ?? "Không thể thu hồi chứng chỉ" }),
      },
    );
  };

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-700">Chứng chỉ hoàn thành</p>

      <Spin spinning={eligibilityQuery.isLoading}>
        {rows.length === 0 ? (
          <EmptyState className="py-10" description="Lớp chưa có học viên đang học" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                  <th className="px-3 py-2">Học viên</th>
                  <th className="px-3 py-2 text-center">Điểm tổng kết</th>
                  <th className="px-3 py-2 text-center">Chuyên cần</th>
                  <th className="px-3 py-2 text-center">Công nợ</th>
                  <th className="px-3 py-2 text-center">Trạng thái</th>
                  <th className="px-3 py-2 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row: any) => {
                  const certificate = row.certificate;
                  const status = certificate ? STATUS_META[certificate.status] : null;

                  return (
                    <tr key={row.student_id}>
                      <td className="px-3 py-2 font-medium text-slate-800">
                        {row.student?.full_name ?? `#${row.student_id}`}
                      </td>
                      <td className="px-3 py-2 text-center">{row.final_score ?? "—"}</td>
                      <td className="px-3 py-2 text-center">
                        {row.attendance_rate != null ? `${row.attendance_rate}%` : "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {row.debt_amount > 0 ? (
                          <span className="text-red-500">{row.debt_amount.toLocaleString("vi-VN")}đ</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {status ? (
                          <Badge className={`px-2 py-0.5 text-[11px] ${status.className}`}>
                            {status.label}
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Chưa cấp</span>
                        )}
                        {certificate && (
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {certificate.certificate_no} · {moment(certificate.issued_at).format("DD/MM/YYYY")}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {!certificate || certificate.status === "revoked" ? (
                          <Button
                            outlined
                            icon={<AcademicCapOutlined />}
                            loading={issuingId === row.student_id}
                            disabled={row.final_score == null}
                            onClick={() => handleIssue(row.student_id)}
                            className="text-brand border-brand hover:bg-brand"
                          >
                            Phát hành
                          </Button>
                        ) : (
                          <Button
                            outlined
                            onClick={() => handleRevoke(certificate.id)}
                            className="text-red-500 border-red-300 hover:bg-red-50"
                          >
                            Thu hồi
                          </Button>
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
    </div>
  );
};

export default ClassCertificatePanel;
