import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Banknote,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileMinus,
  FileText,
  Gift,
  HandCoins,
  History,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Wallet as WalletIcon,
  WalletCards,
} from 'lucide-react-native';

import { useStates } from '@hooks/useStates';
import { useWalletDetail, useWalletList } from '@tera/modules/wallet';

import { styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDateTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()} • ${hh}:${mi}`;
};

const TX_LABELS: Record<string, string> = {
  deposit: 'Nạp tiền vào ví',
  payment: 'Thanh toán',
  refund: 'Hoàn tiền',
  bonus: 'Thưởng',
  adjustment: 'Điều chỉnh số dư',
  expire: 'Hết hạn số dư',
};

const TX_META: Record<string, { icon: any; bg: string; color: string }> = {
  deposit: { icon: WalletCards, bg: '#DBEAFE', color: '#2563EB' },
  payment: { icon: ShoppingCart, bg: '#DCFCE7', color: '#16A34A' },
  refund: { icon: Gift, bg: '#F3E8FF', color: '#9333EA' },
  bonus: { icon: Gift, bg: '#F3E8FF', color: '#9333EA' },
  adjustment: { icon: Banknote, bg: '#FEF3C7', color: '#D97706' },
  expire: { icon: Banknote, bg: '#FEE2E2', color: '#DC2626' },
};

const QUICK_ACTIONS_ROW1 = [
  { id: 'deposit', label: 'Nạp tiền', icon: WalletCards },
  { id: 'withdraw', label: 'Rút tiền', icon: Banknote },
  { id: 'history', label: 'Lịch sử', icon: History },
  { id: 'setting', label: 'Cài đặt', icon: Settings },
];

const QUICK_ACTIONS_ROW2 = [
  { id: 'receipt', label: 'Phiếu thu', icon: FileText },
  { id: 'expense', label: 'Phiếu Chi', icon: FileMinus },
  { id: 'payroll', label: 'Phiếu Lương', icon: HandCoins },
  { id: 'report', label: 'Học phí', icon: BarChart3 },
];

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const WalletScreen = observer(() => {
  const router = useRouter();
  const {
    authStore: { user },
  } = useStates();
  const [hideBalance, setHideBalance] = useState(false);

  // Chưa xác nhận được chắc chắn field name (owner_id/owner_type) khớp 100%
  // với backend thật — WalletAPI không có route "ví của tôi" riêng, phải lọc
  // theo owner_type=teacher + owner_id=user hiện tại.
  const { data: walletListRes, isLoading: isLoadingList } = useWalletList({
    params: {
      per_page: 1,
      filters: { owner_type: 'teacher', owner_id: user?.id },
    } as any,
  });

  const wallet =
    (walletListRes as any)?.data?.[0] ?? (walletListRes as any)?.[0];

  const { data: detailRes, isLoading: isLoadingDetail } = useWalletDetail(
    { id: wallet?.id },
    { enabled: !!wallet?.id },
  );

  const detail = (detailRes as any)?.data ?? detailRes ?? wallet;

  const balance = detail?.balance ?? wallet?.balance ?? 0;
  const availableBalance =
    detail?.available_balance ?? detail?.balance ?? balance;

  const transactions: any[] = detail?.transactions ?? [];
  const recentTransactions = transactions.slice(0, 5);
  const isLoading = isLoadingList || isLoadingDetail;

  const monthStats = useMemo(() => {
    const now = new Date();
    const inThisMonth = transactions.filter((tx) => {
      const d = new Date(tx?.created_at || tx?.date || 0);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      );
    });

    const income = inThisMonth
      .filter((tx) => Number(tx?.amount) > 0)
      .reduce((sum, tx) => sum + Number(tx?.amount), 0);
    const expense = inThisMonth
      .filter((tx) => Number(tx?.amount) < 0)
      .reduce((sum, tx) => sum + Math.abs(Number(tx?.amount)), 0);

    return { income, expense, count: inThisMonth.length };
  }, [transactions]);

  const handleQuickAction = (id: string) => {
    if (id === 'deposit') {
      router.push({
        pathname: '/setting/wallet-deposit',
        params: { walletId: wallet?.id },
      });
      return;
    }
    if (id === 'withdraw') {
      router.push({
        pathname: '/setting/wallet-withdraw',
        params: { walletId: wallet?.id },
      });
      return;
    }
    if (id === 'receipt') {
      router.push('/setting/receipt-create');
      return;
    }
    if (id === 'expense') {
      router.push('/setting/receipt-expense');
      return;
    }
    if (id === 'payroll') {
      router.push('/setting/payslip');
      return;
    }
    if (id === 'setting') {
      router.push({
        pathname: '/setting/bank-account',
        params: { walletId: wallet?.id },
      });
      return;
    }
    if (id === 'history') {
      router.push({
        pathname: '/setting/wallet-history',
        params: { walletId: wallet?.id },
      });
      return;
    }
    if (id === 'report') {
      router.push('/setting/tuition-management');
      return;
    }
    notImplemented();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require('@tera/assets/app/element_46.png')}
            style={styles.headerBackground}
            resizeMode="cover"
          />

          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.back()}
            >
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ví cá nhân</Text>
            <TouchableOpacity
              style={styles.headerLink}
              onPress={() =>
                router.push({
                  pathname: '/setting/wallet-history',
                  params: { walletId: wallet?.id },
                })
              }
            >
              <History size={14} color="#fff" />
              <Text style={styles.headerLinkText}>Lịch sử giao dịch</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceTopRow}>
              <Text style={styles.balanceLabel}>Số dư ví</Text>
              <TouchableOpacity onPress={() => setHideBalance((prev) => !prev)}>
                {hideBalance ? (
                  <EyeOff size={16} color="rgba(255,255,255,0.85)" />
                ) : (
                  <Eye size={16} color="rgba(255,255,255,0.85)" />
                )}
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator
                color="#fff"
                style={styles.balanceLoading}
              />
            ) : (
              <Text style={styles.balanceValue}>
                {hideBalance ? '••••••••đ' : formatCurrency(balance)}
              </Text>
            )}

            <Text style={styles.availableLabel}>Số dư khả dụng</Text>
            <Text style={styles.availableValue}>
              {hideBalance ? '••••••••đ' : formatCurrency(availableBalance)}
            </Text>

            <WalletIcon
              size={64}
              color="rgba(255,255,255,0.25)"
              style={styles.balanceDecorIcon}
            />
          </View>
        </View>

        <View style={styles.quickActionsCard}>
          <View style={styles.quickActionsRow}>
            {QUICK_ACTIONS_ROW1.map((action) => {
              const ActionIcon = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickAction}
                  onPress={() => handleQuickAction(action.id)}
                >
                  <View style={styles.quickActionIcon}>
                    <ActionIcon size={20} color="#0066cc" />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.quickActionsRow, styles.quickActionsRowSecond]}>
            {QUICK_ACTIONS_ROW2.map((action) => {
              const ActionIcon = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickAction}
                  onPress={() => handleQuickAction(action.id)}
                >
                  <View style={styles.quickActionIcon}>
                    <ActionIcon size={20} color="#0066cc" />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.securityBanner} onPress={notImplemented}>
          <View style={styles.securityIconWrapper}>
            <ShieldCheck size={20} color="#0066cc" />
          </View>
          <View style={styles.securityTextWrapper}>
            <Text style={styles.securityTitle}>Giao dịch bảo mật 100%</Text>
            <Text style={styles.securityDesc}>
              Thông tin và số dư của bạn được bảo mật tuyệt đối.
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Thống kê giao dịch</Text>
          {/* Chỉ hiển thị thống kê tháng hiện tại, chưa hỗ trợ đổi tháng */}
          <View style={styles.filterChip}>
            <Calendar size={14} color="#0F172A" />
            <Text style={styles.filterChipText}>Tháng này</Text>
            <ChevronDown size={14} color="#0F172A" />
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: '#2563EB' }]}>
              Tổng thu
            </Text>
            <Text style={styles.statValue}>
              {formatCurrency(monthStats.income)}
            </Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={[styles.statLabel, { color: '#DC2626' }]}>
              Tổng chi
            </Text>
            <Text style={styles.statValue}>
              {formatCurrency(monthStats.expense)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Giao dịch</Text>
            <Text style={styles.statValue}>{monthStats.count}</Text>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/setting/wallet-history',
                params: { walletId: wallet?.id },
              })
            }
          >
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsCard}>
          {isLoading ? (
            <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
          ) : recentTransactions.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
          ) : (
            recentTransactions.map((tx, index) => {
              const meta = TX_META[tx?.transaction_type] ?? TX_META.deposit;
              const TxIcon = meta.icon;
              const amount = Number(tx?.amount) || 0;
              const isIncome = amount >= 0;

              return (
                <View
                  key={tx?.id ?? index}
                  style={[
                    styles.transactionRow,
                    index === recentTransactions.length - 1 &&
                      styles.transactionRowLast,
                  ]}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: meta.bg },
                    ]}
                  >
                    <TxIcon size={18} color={meta.color} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle} numberOfLines={1}>
                      {tx?.note ||
                        tx?.description ||
                        TX_LABELS[tx?.transaction_type] ||
                        'Giao dịch'}
                    </Text>
                    <Text style={styles.transactionSubtitle} numberOfLines={1}>
                      {tx?.reference_type || tx?.payment_method || ''}
                    </Text>
                  </View>
                  <View style={styles.transactionAmountWrapper}>
                    <Text
                      style={[
                        styles.transactionAmount,
                        { color: isIncome ? '#16A34A' : '#DC2626' },
                      ]}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(Math.abs(amount))}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDateTime(tx?.created_at || tx?.date)}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#CBD5E1" />
                </View>
              );
            })
          )}
        </View>

        <View style={styles.referralBanner}>
          <View style={styles.referralIconWrapper}>
            <Gift size={22} color="#0066cc" />
          </View>
          <View style={styles.referralText}>
            <Text style={styles.referralTitle}>Giới thiệu bạn bè</Text>
            <Text style={styles.referralDesc}>
              Nhận ngay 50.000đ khi bạn bè đăng ký và sử dụng Hana Edu.
            </Text>
          </View>
          <TouchableOpacity style={styles.referralBtn} onPress={notImplemented}>
            <Text style={styles.referralBtnText}>Giới thiệu ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
});

export default WalletScreen;
