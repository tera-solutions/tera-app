import { useEffect, useMemo, useState } from "react";
import { notification } from "tera-dls";

import { WalletService } from "@tera/modules/wallet";
import { ProfileService } from "@tera/modules/system";

import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

import type { DateRange } from "./_interface";
import {
  presetToRange,
  toChartPoints,
  toLinkedBankAccounts,
  toSummaryStats,
  toTransactions,
  toWalletInfo,
} from "./_utils";
import BalanceCard from "./components/BalanceCard";
import WalletSummary from "./components/WalletSummary";
import DepositMethods from "./components/DepositMethods";
import TransactionChart from "./components/TransactionChart";
import LinkedBankAccounts from "./components/LinkedBankAccounts";
import TransactionTable from "./components/TransactionTable";

/** Số giao dịch tải rộng để tính "Tổng quan ví" + biểu đồ phía client.
 * ⚠️ `fin/wallet/transactions` chỉ nhận per_page = 20 | 50 | 100 → 100 là trần.
 * Khi backend có endpoint wallet-summary riêng thì thay bằng endpoint đó. */
const SUMMARY_FETCH_SIZE = 100;

const Wallet = () => {
  const [chartRange, setChartRange] = useState<DateRange>(() => presetToRange("week"));

  // Bảng lịch sử giao dịch: phân trang + tìm kiếm (debounce) + lọc loại.
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const profileQuery = ProfileService.useProfile();
  /** `wallet.owner_id` là **id bảng `users`** (verify 2026-07-09: ví teacher có `owner_id: 5`,
   * đúng bằng user id 5 role Teacher). */
  const currentUserId = profileQuery.data?.data?.id ?? null;

  /**
   * 🐞 `fin/wallet/list` KHÔNG tự lọc theo user đang đăng nhập (verify 2026-07-09: trả về ví của
   * mọi owner). Không lọc thì `items[0]` là ví người khác → phải tự truyền `owner_type` + `owner_id`.
   *
   * ⚠️ Nếu profile không trả `id`, ta vẫn lọc `owner_type` để không lộ ví phụ huynh, nhưng khi có
   * từ 2 ví giáo viên trở lên sẽ lấy nhầm ví của giáo viên đầu tiên. Xem mục 4a trong
   * `agents/claude/teacher/sprint4-wallet-checklist.md`.
   */
  // ⚠️ `ListParams` chưa có index signature → khai params rời để né TS2353 (lỗi baseline toàn repo).
  const walletParams: Record<string, unknown> = {
    page: 1,
    per_page: 20,
    owner_type: "teacher",
    ...(currentUserId ? { owner_id: currentUserId } : {}),
  };
  // Chờ profile xong rồi mới gọi, tránh nháy 1 lần bằng ví của giáo viên khác.
  const walletQuery = WalletService.useWalletList(
    { params: walletParams },
    { enabled: !profileQuery.isLoading },
  );
  const wallet = useMemo(() => toWalletInfo(walletQuery.data), [walletQuery.data]);

  const bankAccounts = useMemo(
    () => toLinkedBankAccounts(walletQuery.data, profileQuery.data),
    [walletQuery.data, profileQuery.data],
  );

  // Query rộng dùng chung cho tổng quan + biểu đồ (không phân trang theo bảng).
  // ⚠️ `wallet_id` BẮT BUỘC: thiếu nó backend trả giao dịch của MỌI ví (verify 2026-07-09).
  const summaryParams: Record<string, unknown> = {
    page: 1,
    per_page: SUMMARY_FETCH_SIZE,
    wallet_id: wallet.id,
  };
  const summaryQuery = WalletService.useWalletTransactions(
    { params: summaryParams },
    { enabled: !!wallet.id },
  );
  const summaryTxns = useMemo(() => toTransactions(summaryQuery.data), [summaryQuery.data]);
  const summaryStats = useMemo(() => toSummaryStats(summaryTxns), [summaryTxns]);
  const chartPoints = useMemo(
    () => toChartPoints(summaryTxns, chartRange),
    [summaryTxns, chartRange],
  );

  // ⚠️ `search` CHƯA có trong query params của `fin/wallet/transactions` (Postman
  // 2026-07-09 chỉ liệt kê wallet_id/transaction_type/reference_*/date_*/sort_*/per_page).
  // Dùng `search` theo quy ước repo — cần backend xác nhận, nếu không sẽ bị bỏ qua.
  const tableParams: Record<string, unknown> = {
    page,
    per_page: perPage,
    wallet_id: wallet.id,
    ...(search ? { search } : {}),
    ...(typeFilter ? { transaction_type: typeFilter } : {}),
  };
  const tableQuery = WalletService.useWalletTransactions(
    { params: tableParams },
    { enabled: !!wallet.id },
  );
  const transactions = useMemo(() => toTransactions(tableQuery.data), [tableQuery.data]);
  const total = tableQuery.data?.data?.pagination?.total ?? transactions.length;

  // ⚠️ Backend KHÔNG có route export cho ví/giao dịch (Postman 2026-07-09: folder
  // Finance → Wallet chỉ có list/detail/transactions/lock/unlock + 6 action ledger).
  // Giữ nút để hỏi lại BE; khi có route thì nối `WalletAPI.export` vào đây.
  const handleExport = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Ví cá nhân</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Quản lý số dư, nạp tiền và lịch sử giao dịch của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[400px_1fr]">
        <div className="xl:col-start-1 xl:row-start-1">
          <BalanceCard balance={wallet.balance} loading={walletQuery.isLoading} />
        </div>
        <div className="xl:col-start-2 xl:row-start-1">
          <WalletSummary stats={summaryStats} loading={summaryQuery.isLoading} />
        </div>

        <div className="xl:col-start-1 xl:row-start-2">
          <DepositMethods />
        </div>
        <div className="xl:col-start-2 xl:row-start-2">
          <TransactionChart
            points={chartPoints}
            range={chartRange}
            onRangeChange={setChartRange}
            loading={summaryQuery.isLoading}
          />
        </div>

        <div className="xl:col-start-1 xl:row-start-3">
          <LinkedBankAccounts
            accounts={bankAccounts}
            loading={walletQuery.isLoading || profileQuery.isLoading}
          />
        </div>
        <div className="xl:col-start-2 xl:row-start-3">
          <TransactionTable
            transactions={transactions}
            total={total}
            page={page}
            perPage={perPage}
            isLoading={tableQuery.isLoading}
            isError={tableQuery.isError}
            onRetry={() => tableQuery.refetch()}
            onPageChange={(p, size) => {
              setPage(size !== perPage ? 1 : p);
              setPerPage(size);
            }}
            search={searchInput}
            onSearchChange={setSearchInput}
            typeFilter={typeFilter}
            onTypeFilterChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
            onExport={handleExport}
            exporting={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Wallet;
