import { useMemo } from "react";

import { WalletService } from "@tera/modules/wallet";
import { ProfileService } from "@tera/modules/system";

import { toWalletInfo } from "./_utils";

/**
 * Ví của giáo viên đang đăng nhập. Dùng chung cho màn Ví lẫn màn Nạp tiền.
 *
 * ⚠️ `fin/wallet/list` KHÔNG tự lọc theo token → phải truyền `owner_type` + `owner_id`, nếu không
 * sẽ hiện ví người khác. `wallet.owner_id` là id bảng **`users`** (không phải `teachers`),
 * lấy từ `/api/auth/profile` → `data.id`.
 */
export const useTeacherWallet = () => {
  const profileQuery = ProfileService.useProfile();
  const currentUserId = profileQuery.data?.data?.id ?? null;

  // ⚠️ `ListParams` chưa có index signature → khai params rời để né TS2353 (lỗi baseline toàn repo).
  const walletParams: Record<string, unknown> = {
    page: 1,
    per_page: 20,
    owner_type: "teacher",
    ...(currentUserId ? { owner_id: currentUserId } : {}),
  };

  // ⚠️ Chỉ gọi khi ĐÃ có `currentUserId`. Nếu gate bằng `!profileQuery.isLoading` thì lúc profile
  // LỖI (isLoading=false, data undefined) query vẫn chạy mà thiếu `owner_id` → trả ví giáo viên
  // khác (route không tự scope theo token) và lộ luôn giao dịch của họ.
  const walletQuery = WalletService.useWalletList(
    { params: walletParams },
    { enabled: !!currentUserId },
  );

  const wallet = useMemo(() => toWalletInfo(walletQuery.data), [walletQuery.data]);

  return {
    wallet,
    profileQuery,
    walletQuery,
    /** ⚠️ Dùng cái này thay `walletQuery.isLoading`: khi query bị `enabled: false` (đang chờ
     * profile), react-query v5 cho `isLoading = false` → UI sẽ nháy "0đ" thay vì skeleton. */
    isLoading: profileQuery.isLoading || walletQuery.isLoading,
  };
};

export default useTeacherWallet;
