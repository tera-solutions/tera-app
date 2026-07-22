import { useQuery } from "@tanstack/react-query";

import { StudentHomeAPI } from "./home.api";

/** Dữ liệu tổng hợp màn Trang chủ ([086] mục 6.1) */
export const useStudentHome = () =>
  useQuery({
    queryKey: ["student", "home"],
    queryFn: StudentHomeAPI.getHome,
    staleTime: 60_000,
  });

/** Số thông báo chưa đọc cho chuông ở topbar ([086] mục 6.2) */
export const useUnreadNotificationCount = () =>
  useQuery({
    queryKey: ["student", "notification", "unread-count"],
    queryFn: StudentHomeAPI.getUnreadNotificationCount,
    staleTime: 60_000,
  });
