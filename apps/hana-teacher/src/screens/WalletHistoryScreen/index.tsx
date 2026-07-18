import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Filter,
  ShieldCheck,
  Wallet as WalletIcon,
} from 'lucide-react-native';

import { useStates } from '@hooks/useStates';
import {
  useWalletDetail,
  useWalletList,
  useWalletTransactions,
} from '@tera/modules/wallet';

import { FILTER_TABS, PER_PAGE, TX_LABELS, TX_META } from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
};

const formatTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mi}`;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getDateGroupLabel = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return `Hôm nay, ${formatDate(date)}`;
  if (isSameDay(date, yesterday)) return `Hôm qua, ${formatDate(date)}`;
  return formatDate(date);
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const WalletHistoryScreen = observer(() => {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId?: string }>();
  const {
    authStore: { user },
  } = useStates();

  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Nếu vào thẳng màn này không qua Ví cá nhân (không có walletId), tự tra ví
  // của giáo viên đang đăng nhập — cùng cách WalletScreen đang làm.
  const { data: walletListRes } = useWalletList(
    {
      params: {
        per_page: 1,
        filters: { owner_type: 'teacher', owner_id: user?.id },
      } as any,
    },
    { enabled: !walletId },
  );
  const fallbackWallet =
    (walletListRes as any)?.data?.[0] ?? (walletListRes as any)?.[0];
  const effectiveWalletId = walletId ?? fallbackWallet?.id;

  const { data: detailRes, isLoading: isLoadingDetail } = useWalletDetail(
    { id: effectiveWalletId ?? '' },
    { enabled: !!effectiveWalletId },
  );
  const detail = (detailRes as any)?.data ?? detailRes;
  const balance = detail?.balance ?? 0;

  const activeFilter = FILTER_TABS.find((tab) => tab.id === activeTab);

  const { data: transactionsRes, isLoading: isLoadingTx } =
    useWalletTransactions(
      {
        params: {
          wallet_id: effectiveWalletId,
          transaction_type: activeFilter?.transactionType,
          sort_by: 'created_at',
          sort_dir: 'desc',
          per_page: PER_PAGE,
        } as any,
      },
      { enabled: !!effectiveWalletId },
    );

  const allTransactions: any[] =
    (transactionsRes as any)?.data ?? (transactionsRes as any) ?? [];

  // "Rút tiền" dùng chung transaction_type=adjustment với các điều chỉnh cộng
  // tiền khác (chưa có type riêng ở BE) — lọc thêm theo amount < 0 ở client.
  const transactions =
    activeTab === 'withdraw'
      ? allTransactions.filter((tx) => Number(tx?.amount) < 0)
      : allTransactions;

  const isLoading = isLoadingDetail || isLoadingTx;

  const groups = useMemo(() => {
    const map = new Map<string, any[]>();
    transactions.forEach((tx) => {
      const label = getDateGroupLabel(tx?.created_at || tx?.date);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(tx);
    });
    return Array.from(map.entries()).map(([label, items]) => ({
      label,
      items,
    }));
  }, [transactions]);

  const dateRangeLabel = useMemo(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return `${formatDate(from)} - ${formatDate(now)}`;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarIconBtn}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Lịch sử giao dịch</Text>
        {/* Chưa có màn hình bộ lọc nâng cao riêng */}
        <TouchableOpacity style={styles.topBarIconBtn} onPress={notImplemented}>
          <Filter size={18} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <Text style={styles.balanceLabel}>Số dư ví cá nhân</Text>
            <TouchableOpacity onPress={() => setHideBalance((prev) => !prev)}>
              {hideBalance ? (
                <EyeOff size={16} color="rgba(255,255,255,0.85)" />
              ) : (
                <Eye size={16} color="rgba(255,255,255,0.85)" />
              )}
            </TouchableOpacity>
          </View>

          {isLoadingDetail ? (
            <ActivityIndicator color="#fff" style={styles.balanceLoading} />
          ) : (
            <Text style={styles.balanceValue}>
              {hideBalance ? '••••••••đ' : formatCurrency(balance)}
            </Text>
          )}

          <View style={styles.safeBadge}>
            <ShieldCheck size={14} color="#fff" />
            <Text style={styles.safeBadgeText}>
              Tài khoản của bạn đang an toàn
            </Text>
          </View>

          <WalletIcon
            size={64}
            color="rgba(255,255,255,0.25)"
            style={styles.balanceDecorIcon}
          />
        </View>

        <View style={styles.filterTabsRow}>
          {FILTER_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterTab, active && styles.filterTabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <View
                  style={[
                    styles.filterTabIcon,
                    { backgroundColor: tab.color },
                  ]}
                >
                  <TabIcon size={18} color="#fff" />
                </View>
                <Text
                  style={[
                    styles.filterTabLabel,
                    active && styles.filterTabLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.toolbarRow}>
          {/* Chưa có component chọn khoảng ngày — tạm khóa, mặc định tháng này */}
          <TouchableOpacity style={styles.dateRangeChip} onPress={notImplemented}>
            <Calendar size={14} color="#0F172A" />
            <Text style={styles.dateRangeText}>{dateRangeLabel}</Text>
            <ChevronRight size={14} color="#0F172A" />
          </TouchableOpacity>

          {/* Chưa có API xuất sao kê */}
          <TouchableOpacity style={styles.exportBtn} onPress={notImplemented}>
            <Download size={14} color="#0066cc" />
            <Text style={styles.exportBtnText}>Xuất sao kê</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : groups.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIconWrapper}>
              <WalletIcon size={28} color="#0066cc" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có giao dịch nào</Text>
            <Text style={styles.emptyDesc}>
              Giao dịch của bạn sẽ hiển thị tại đây
            </Text>
          </View>
        ) : (
          <>
            {groups.map((group) => (
              <View key={group.label}>
                <Text style={styles.dateSectionTitle}>{group.label}</Text>
                <View style={styles.transactionsCard}>
                  {group.items.map((tx, index) => {
                    const meta = TX_META[tx?.transaction_type] ?? TX_META.deposit;
                    const TxIcon = meta.icon;
                    const amount = Number(tx?.amount) || 0;
                    const isIncome = amount >= 0;
                    const balanceAfter =
                      tx?.balance_after ?? tx?.wallet_balance ?? undefined;

                    return (
                      <View
                        key={tx?.id ?? index}
                        style={[
                          styles.transactionRow,
                          index === group.items.length - 1 &&
                            styles.transactionRowLast,
                        ]}
                      >
                        <View
                          style={[
                            styles.transactionIcon,
                            { backgroundColor: meta.bg },
                          ]}
                        >
                          <TxIcon size={18} color="#fff" />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={styles.transactionTitle} numberOfLines={1}>
                            {tx?.note ||
                              tx?.description ||
                              TX_LABELS[tx?.transaction_type] ||
                              'Giao dịch'}
                          </Text>
                          <Text style={styles.transactionSubtitle} numberOfLines={1}>
                            {TX_LABELS[tx?.transaction_type] || 'Giao dịch'}
                          </Text>
                          <Text style={styles.transactionTime}>
                            {formatTime(tx?.created_at || tx?.date)}
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
                          {balanceAfter !== undefined && (
                            <Text style={styles.transactionBalance}>
                              Số dư: {formatCurrency(balanceAfter)}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}

            <Text style={styles.footerNote}>Không còn giao dịch nào khác</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
});

export default WalletHistoryScreen;
