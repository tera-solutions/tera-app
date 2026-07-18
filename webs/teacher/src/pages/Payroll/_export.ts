import { downloadCsv } from "_common/utils/csv";

import type { PayrollRow } from "./_interface";
import { periodLabel } from "./_utils";

export const exportPayrollCsv = (rows: PayrollRow[]) => {
  const header = ["Kỳ lương", "Giờ dạy", "Lương cơ bản", "Thưởng", "Phạt", "Thực lãnh"];
  const body = rows.map((r) => [
    periodLabel(r.month, r.year),
    r.totalHours,
    r.baseSalary,
    r.bonus,
    r.penalty,
    r.totalSalary,
  ]);

  downloadCsv(`bang-luong-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...body]);
};
