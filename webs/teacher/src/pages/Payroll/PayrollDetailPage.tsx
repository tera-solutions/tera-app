import { useNavigate, useParams } from "react-router-dom";
import ChartDoughnut from "@tera/components/dof/Chart/ChartDoughnut";
import {
  ArrowLeftOutlined,
  Button,
  DocumentArrowDownOutlined,
  EnvelopeOutlined,
  PhoneOutlined,
  PrinterOutlined,
  BuildingOfficeOutlined,
  notification,
} from "tera-dls";

import Card from "_common/components/Card";
import { PATHS } from "_common/components/Layout/Menu/menus";

import ClassIncomeTable from "./components/ClassIncomeTable";
import DeductionInfo from "./components/DeductionInfo";
import PaymentTimeline from "./components/PaymentTimeline";
import PayrollStatusBadge from "./components/PayrollStatusBadge";
import SalaryBreakdown from "./components/SalaryBreakdown";
import { getPayrollDetail } from "./_mock";
import { amountToWords, formatVnd } from "./_utils";

// [055] Chi tiết bảng lương — UI-only theo design `chi tiet bang luong.png`. Data suy từ `_mock.ts` theo id kỳ.
const PayrollDetailPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const detail = getPayrollDetail(id);

  const demo = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  if (!detail) {
    return (
      <div className="p-4 xmd:p-6">
        <button
          type="button"
          onClick={() => navigate(PATHS.payroll)}
          className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand"
        >
          <ArrowLeftOutlined className="h-4 w-4" />
          Quay lại bảng lương
        </button>
        <Card animated={false} className="text-center text-sm text-slate-400 xmd:p-8">
          Không tìm thấy kỳ lương.
        </Card>
      </div>
    );
  }

  const infoRows: { label: string; value: React.ReactNode }[] = [
    { label: "Kỳ lương", value: <span className="font-semibold text-slate-700">{detail.period}</span> },
    { label: "Thời gian thanh toán", value: detail.payDate },
    { label: "Ngày thanh toán", value: detail.paidDate },
    { label: "Trạng thái", value: <PayrollStatusBadge status={detail.status} /> },
    { label: "Phương thức nhận", value: detail.paymentMethod },
  ];

  return (
    <div className="p-4 xmd:p-6">
      <button
        type="button"
        onClick={() => navigate(PATHS.payroll)}
        className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand"
      >
        <ArrowLeftOutlined className="h-4 w-4" />
        Quay lại bảng lương
      </button>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Chi tiết bảng lương</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Xem chi tiết thu nhập và các khoản khấu trừ trong kỳ lương tháng {detail.period}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            icon={<DocumentArrowDownOutlined />}
            onClick={demo}
            className="whitespace-nowrap border border-slate-200! bg-white! text-slate-600! hover:border-brand! hover:text-brand!"
          >
            Tải bảng lương (PDF)
          </Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={demo}
            className="whitespace-nowrap bg-brand hover:bg-brand/80"
          >
            In bảng lương
          </Button>
        </div>
      </div>

      <Card animated={false} className="mb-4 xmd:p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="flex gap-4">
            {detail.avatarUrl ? (
              <img src={detail.avatarUrl} alt={detail.teacherName} className="h-16 w-16 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-brand">
                {(detail.teacherName.trim().split(/\s+/).pop() ?? detail.teacherName)
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-slate-800">{detail.teacherName}</p>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-brand">
                  {detail.teacherRole}
                </span>
              </div>
              <p className="text-sm text-slate-400">{detail.teacherCode}</p>
              <div className="mt-1.5 flex flex-col gap-0.5 text-xs text-slate-500">
                <span>{detail.teacherTitle}</span>
                <span>Phòng ban: {detail.department}</span>
                <span>Ngày vào làm: {detail.joinDate}</span>
                <span>Tài khoản ngân hàng: {detail.bankAccount}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2 text-sm lg:border-l lg:border-slate-100 lg:pl-5">
            {infoRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3">
                <span className="text-slate-400">{r.label}</span>
                <span className="text-right text-slate-600">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-brand to-blue-500 p-5 text-white">
            <p className="text-sm text-white/80">Thực nhận</p>
            <p className="mt-1 text-3xl font-bold">{formatVnd(detail.netIncome)}</p>
            <p className="mt-1 text-xs italic text-white/80">({amountToWords(detail.netIncome)})</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start [&>*]:min-w-0">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SalaryBreakdown
              salaryItems={detail.salaryItems}
              bonusItems={detail.bonusItems}
              total={detail.grossIncome}
            />
            <DeductionInfo items={detail.deductionItems} total={detail.totalDeduction} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] [&>*]:min-w-0">
            <ClassIncomeTable rows={detail.classIncome} total={detail.classIncomeTotal} />

            <Card className="xmd:p-5" animated={false}>
              <p className="mb-3 text-base font-semibold text-slate-800">4. Thông tin ghi chú</p>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="mb-1 text-xs font-semibold text-slate-500">Ghi chú từ bộ phận kế toán</p>
                <p className="text-sm text-slate-600">{detail.accountantNote}</p>
              </div>
              <div className="mt-3">
                <p className="mb-1.5 text-xs font-semibold text-slate-500">Thông tin bổ sung</p>
                <ul className="flex flex-col gap-1.5">
                  {detail.extraNotes.map((note, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="xmd:p-5" animated={false}>
            <p className="mb-3 text-base font-semibold text-slate-800">Tổng quan kỳ lương</p>
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 shrink-0">
                <ChartDoughnut
                  data={{
                    labels: ["Tổng thu nhập", "Tổng khấu trừ"],
                    datasets: [
                      {
                        data: [detail.grossIncome, detail.totalDeduction],
                        backgroundColor: ["#22c55e", "#ef4444"],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    cutout: "68%",
                    plugins: { legend: { display: false }, datalabels: { display: false } },
                  }}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                    Tổng thu nhập
                  </span>
                  <span className="font-semibold text-slate-700">{formatVnd(detail.grossIncome)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                    Tổng khấu trừ
                  </span>
                  <span className="font-semibold text-rose-500">{formatVnd(detail.totalDeduction)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-0.5 w-2.5 shrink-0 rounded-full bg-brand" />
                    Thực nhận
                  </span>
                  <span className="font-bold text-brand">{formatVnd(detail.netIncome)}</span>
                </div>
              </div>
            </div>
          </Card>

          <PaymentTimeline items={detail.timeline} />

          <Card className="xmd:p-5" animated={false}>
            <p className="mb-2 text-base font-semibold text-slate-800">Bạn cần hỗ trợ?</p>
            <p className="mb-3 text-sm text-slate-500">
              Nếu có bất kỳ thắc mắc nào về bảng lương, vui lòng liên hệ:
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <BuildingOfficeOutlined className="h-4 w-4 text-brand" />
                Phòng Kế toán
              </span>
              <span className="flex items-center gap-2">
                <PhoneOutlined className="h-4 w-4 text-brand" />
                0901 234 567
              </span>
              <span className="flex items-center gap-2">
                <EnvelopeOutlined className="h-4 w-4 text-brand" />
                ketoan@hanaedu.vn
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailPage;
