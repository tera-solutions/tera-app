import { Outlet } from "react-router-dom";

import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

/**
 * Khung màn hình web học viên: desktop có sidebar trái + topbar,
 * mobile bỏ sidebar và thay bằng thanh điều hướng đáy.
 * Mốc đổi giao diện 1280px (`xl:`) — trùng breakpoint `xmd` của repo.
 */
const StudentLayout = () => (
  <div className="min-h-screen bg-hana-sky text-hana-navy">
    <div className="flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-24 xl:px-6 xl:pb-8">
        <TopBar />
        <Outlet />
      </main>
    </div>
    <BottomNav />
  </div>
);

export default StudentLayout;
