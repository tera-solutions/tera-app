import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import { WalletService } from "@tera/modules/wallet";

import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

import type { DateRange } from "./_interface";
import {
  toChartPoints,
  toLinkedBankAccounts,
  toSummaryStats,
  toTransactions,
} from "./_utils";
import useTeacherWallet from "./useTeacherWallet";
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
  const navigate = useNavigate();
  // `null` = chưa chọn khoảng ngày. Cố ý KHÔNG điền sẵn preset nào — người dùng tự chọn,
  // biểu đồ chờ tới lúc đó.
  const [chartRange, setChartRange] = useState<DateRange | null>(null);

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

  const { wallet, profileQuery, walletQuery } = useTeacherWallet();

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
  // Chưa chọn khoảng ngày thì không tính điểm nào — `TransactionChart` hiện lời mời chọn ngày.
  const chartPoints = useMemo(
    () => (chartRange ? toChartPoints(summaryTxns, chartRange) : []),
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

      {/* 2 cột bật từ 1024px: dưới mốc đó sidebar vẫn ẩn nhưng chưa đủ chỗ cho cột 400px.
          `[&>*]:min-w-0` bắt buộc: mặc định grid item có min-width:auto → cột `1fr` không co
          được dưới min-content của bảng giao dịch (820px) và đẩy trang tràn ngang ở 1280px. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[400px_1fr] [&>*]:min-w-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <BalanceCard
            balance={wallet.balance}
            loading={walletQuery.isLoading}
            onDeposit={() => navigate(PATHS.walletDeposit)}
          />
        </div>
        <div className="lg:col-start-2 lg:row-start-1">
          <WalletSummary stats={summaryStats} loading={summaryQuery.isLoading} />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <DepositMethods
            onSelect={(method) =>
              navigate(PATHS.walletDeposit, { state: { method } })
            }
          />
        </div>
        <div className="lg:col-start-2 lg:row-start-2">
          <TransactionChart
            points={chartPoints}
            range={chartRange}
            onRangeChange={setChartRange}
            loading={summaryQuery.isLoading}
          />
        </div>

        <div className="lg:col-start-1 lg:row-start-3">
          <LinkedBankAccounts
            accounts={bankAccounts}
            loading={walletQuery.isLoading || profileQuery.isLoading}
          />
        </div>
        <div className="lg:col-start-2 lg:row-start-3">
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
