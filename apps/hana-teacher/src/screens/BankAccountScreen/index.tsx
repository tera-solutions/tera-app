import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import { Menu } from 'react-native-paper';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  Info,
  Landmark,
  MoreVertical,
  Plus,
  ShieldCheck,
  Wallet as WalletIcon,
} from 'lucide-react-native';

import { useWalletDetail } from '@tera/modules/wallet';

import {
  BankAccountType,
  DEFAULT_BANK_COLOR,
  MAX_LINKED_ACCOUNTS,
  SEED_ACCOUNTS,
  SEED_WITHDRAW_HISTORY,
} from './constants';
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

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const BankAccountScreen = observer(() => {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId?: string }>();

  const [hideBalance, setHideBalance] = useState(false);
  const [accounts, setAccounts] = useState<BankAccountType[]>(SEED_ACCOUNTS);
  const [defaultAccountId, setDefaultAccountId] = useState(SEED_ACCOUNTS[0].id);
  const [menuAccountId, setMenuAccountId] = useState<string | null>(null);

  const { data: detailRes, isLoading } = useWalletDetail(
    { id: walletId ?? '' },
    { enabled: !!walletId },
  );
  const detail = (detailRes as any)?.data ?? detailRes;
  const balance = detail?.balance ?? 0;

  const handleSetDefault = (id: string) => {
    setDefaultAccountId(id);
    setMenuAccountId(null);
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setMenuAccountId(null);
    if (defaultAccountId === id) {
      setDefaultAccountId((prevDefault) => {
        const remaining = accounts.filter((acc) => acc.id !== id);
        return remaining[0]?.id ?? prevDefault;
      });
    }
    Toast.show({ type: 'success', text1: 'Đã xóa liên kết tài khoản' });
  };

  const handleAddAccount = () => {
    if (accounts.length >= MAX_LINKED_ACCOUNTS) {
      Toast.show({
        type: 'info',
        text1: `Bạn chỉ có thể liên kết tối đa ${MAX_LINKED_ACCOUNTS} tài khoản`,
      });
      return;
    }
    router.push({
      pathname: '/setting/bank-account-link',
      params: { walletId },
    });
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Quản lý tài khoản liên kết</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerIconBtn} onPress={notImplemented}>
            <HelpCircle size={20} color="#fff" />
          </TouchableOpacity>
        </View>

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

          {isLoading ? (
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
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Tài khoản đã liên kết</Text>
        <View style={styles.accountList}>
          {accounts.map((account) => {
            const isDefault = account.id === defaultAccountId;
            return (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountTopRow}>
                  <View
                    style={[
                      styles.accountIcon,
                      { backgroundColor: account.color },
                    ]}
                  >
                    <Landmark size={20} color="#fff" />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountBankName}>
                      {account.bankName}
                    </Text>
                    <Text style={styles.accountNumber}>
                      {account.maskedNumber}
                    </Text>
                    <Text style={styles.accountOwner}>
                      {account.ownerName}
                    </Text>
                  </View>

                  <Menu
                    visible={menuAccountId === account.id}
                    onDismiss={() => setMenuAccountId(null)}
                    anchor={
                      <TouchableOpacity
                        style={styles.accountMenuBtn}
                        onPress={() => setMenuAccountId(account.id)}
                      >
                        <MoreVertical size={18} color="#64748B" />
                      </TouchableOpacity>
                    }
                  >
                    {!isDefault && (
                      <Menu.Item
                        onPress={() => handleSetDefault(account.id)}
                        title="Đặt làm tài khoản nhận tiền"
                      />
                    )}
                    <Menu.Item
                      onPress={() => handleRemoveAccount(account.id)}
                      title="Xóa liên kết"
                    />
                  </Menu>
                </View>

                <View style={styles.accountActionRow}>
                  {isDefault ? (
                    <View style={styles.defaultBadge}>
                      <Check size={14} color="#0066cc" />
                      <Text style={styles.defaultBadgeText}>
                        Tài khoản nhận tiền
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.setDefaultBtn}
                      onPress={() => handleSetDefault(account.id)}
                    >
                      <Text style={styles.setDefaultBtnText}>
                        Đặt làm tài khoản nhận tiền
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.addAccountCard} onPress={handleAddAccount}>
          <View style={styles.addAccountIcon}>
            <Plus size={20} color="#0066cc" />
          </View>
          <View style={styles.addAccountInfo}>
            <Text style={styles.addAccountTitle}>Liên kết tài khoản mới</Text>
            <Text style={styles.addAccountDesc}>
              Thêm tài khoản ngân hàng để giao dịch nhận tiền nhanh chóng, an
              toàn.
            </Text>
          </View>
          <ChevronRight size={18} color="#0066cc" />
        </TouchableOpacity>

        <View style={styles.infoBanner}>
          <View style={styles.infoIconWrapper}>
            <ShieldCheck size={20} color="#0066cc" />
          </View>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>Bảo mật tuyệt đối</Text>
            <Text style={styles.infoBullet}>
              ✓ Thông tin tài khoản được mã hóa và bảo vệ tuyệt đối
            </Text>
            <Text style={styles.infoBullet}>
              ✓ Chỉ sử dụng để rút tiền về tài khoản của bạn
            </Text>
            <Text style={styles.infoBullet}>
              ✓ Hỗ trợ hầu hết các ngân hàng tại Việt Nam
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Lịch sử giao dịch rút tiền</Text>
          {/* Chưa có màn hình danh sách đầy đủ giao dịch */}
          <TouchableOpacity onPress={notImplemented}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsCard}>
          {SEED_WITHDRAW_HISTORY.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có giao dịch rút tiền nào</Text>
          ) : (
            SEED_WITHDRAW_HISTORY.map((tx, index) => {
              const account = accounts.find((acc) => acc.id === tx.accountId);
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.transactionRow,
                    index === SEED_WITHDRAW_HISTORY.length - 1 &&
                      styles.transactionRowLast,
                  ]}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: account?.color ?? DEFAULT_BANK_COLOR },
                    ]}
                  >
                    <Landmark size={18} color="#fff" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle} numberOfLines={1}>
                      {tx.label}
                    </Text>
                    <Text style={styles.transactionSubtitle}>
                      Rút tiền thành công
                    </Text>
                  </View>
                  <View style={styles.transactionAmountWrapper}>
                    <Text style={styles.transactionAmount}>
                      +{formatCurrency(tx.amount)}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDateTime(tx.date)}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#CBD5E1" />
                </View>
              );
            })
          )}
        </View>

        <View style={styles.footerNote}>
          <View style={styles.footerNoteIcon}>
            <Info size={12} color="#fff" />
          </View>
          <Text style={styles.footerNoteText}>
            Bạn có thể liên kết tối đa {MAX_LINKED_ACCOUNTS} tài khoản ngân
            hàng.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
});

export default BankAccountScreen;
