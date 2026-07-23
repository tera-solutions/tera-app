import { useParams } from "react-router-dom";
import moment from "moment";
import { CheckBadgeSolid, ExclamationTriangleOutlined, Spin } from "tera-dls";

import { CertificateService } from "@tera/modules/education";

/** Public QR verification page — no auth, no BasicLayout (accessible to anyone
 * who scans the QR code on a printed certificate, logged in or not). */
const CertificateVerify = () => {
  const { token } = useParams<{ token: string }>();
  const query = CertificateService.useCertificateVerify(token ?? "");

  const result = query.data?.data;
  const notFound = !query.isLoading && (query.isError || !result);
  const isRevoked = result?.status === "revoked";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <Spin spinning={query.isLoading}>
          {notFound ? (
            <>
              <ExclamationTriangleOutlined className="mx-auto h-12 w-12 text-slate-300" />
              <h1 className="mt-4 text-lg font-bold text-slate-800">Không tìm thấy chứng chỉ</h1>
              <p className="mt-1 text-sm text-slate-400">
                Mã xác thực không hợp lệ hoặc chứng chỉ không tồn tại.
              </p>
            </>
          ) : result ? (
            <>
              {isRevoked ? (
                <ExclamationTriangleOutlined className="mx-auto h-12 w-12 text-red-400" />
              ) : (
                <CheckBadgeSolid className="mx-auto h-12 w-12 text-emerald-500" />
              )}
              <h1 className="mt-4 text-lg font-bold text-slate-800">
                {isRevoked ? "Chứng chỉ đã bị thu hồi" : "Chứng chỉ hợp lệ"}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{result.certificate_no}</p>

              <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Học viên</span>
                  <span className="font-medium text-slate-800">{result.student_name ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lớp học</span>
                  <span className="font-medium text-slate-800">{result.class_name ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Điểm tổng kết</span>
                  <span className="font-medium text-slate-800">{result.final_score ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày cấp</span>
                  <span className="font-medium text-slate-800">
                    {result.issued_at ? moment(result.issued_at).format("DD/MM/YYYY") : "—"}
                  </span>
                </div>
                {isRevoked && result.revoked_at && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày thu hồi</span>
                    <span className="font-medium text-red-500">
                      {moment(result.revoked_at).format("DD/MM/YYYY")}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </Spin>
      </div>
    </div>
  );
};

export default CertificateVerify;
