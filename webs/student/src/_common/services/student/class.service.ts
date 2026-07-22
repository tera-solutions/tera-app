import { useQuery } from "@tanstack/react-query";

import { StudentClassAPI } from "./class.api";

/** Danh sách lớp học của học viên ([087] mục 6.1) */
export const useStudentClasses = (params?: {
  filter?: string;
  search?: string;
}) =>
  useQuery({
    queryKey: ["student", "classes", params],
    queryFn: () => StudentClassAPI.getClasses(params),
    staleTime: 60_000,
  });

/** Các ngày có lịch học trong tháng đang xem ([087] mục 6.2) */
export const useStudentSchedule = (year: number, month: number) =>
  useQuery({
    queryKey: ["student", "schedule", year, month],
    queryFn: () => StudentClassAPI.getSchedule(year, month),
    staleTime: 60_000,
  });

/** Thống kê học tập tổng quan ([087] mục 6.3) */
export const useStudyStats = () =>
  useQuery({
    queryKey: ["student", "stats", "summary"],
    queryFn: StudentClassAPI.getStudyStats,
    staleTime: 60_000,
  });
