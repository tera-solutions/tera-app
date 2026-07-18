const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** Triggers a browser download of `rows` as a UTF-8 CSV (BOM included for Excel). */
export const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows.map((row) => row.map((cell) => csvCell(String(cell))).join(",")).join("\r\n");

  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
