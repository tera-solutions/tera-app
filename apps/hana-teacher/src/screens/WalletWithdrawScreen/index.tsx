import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  ChevronLeft,
  Eye,
  EyeOff,
  History,
  Info,
  Landmark,
  Pencil,
  ShieldCheck,
  Wallet as WalletIcon,
} from 'lucide-react-native';

import { useWalletAdjustment, useWalletDetail } from '@tera/modules/wallet';

import { MIN_WITHDRAW_AMOUNT, MOCK_BANK_ACCOUNT, QUICK_AMOUNTS } from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const NOTE_MAX_LENGTH = 50;

const WalletWithdrawScreen = observer(() => {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId?: string }>();

  const [hideBalance, setHideBalance] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const { data: detailRes, isLoading } = useWalletDetail(
    { id: walletId ?? '' },
    { enabled: !!walletId },
  );
  const detail = (detailRes as any)?.data ?? detailRes;
  const availableBalance = detail?.available_balance ?? detail?.balance ?? 0;

  const { mutate, isPending } = useWalletAdjustment();

  const amountNumber = Number(amount) || 0;
  const fee = 0;
  const netAmount = amountNumber > 0 ? amountNumber - fee : 0;

  const errorMessage = useMemo(() => {
    if (amountNumber <= 0) return undefined;
    if (amountNumber < MIN_WITHDRAW_AMOUNT) {
      return `Số tiền rút tối thiểu ${formatCurrency(MIN_WITHDRAW_AMOUNT)}`;
    }
    if (amountNumber > availableBalance) {
      return 'Số tiền rút vượt quá số dư khả dụng';
    }
    return undefined;
  }, [amountNumber, availableBalance]);

  const isValid =
    amountNumber >= MIN_WITHDRAW_AMOUNT && amountNumber <= availableBalance;

  const handleAmountChange = (text: string) => {
    setAmount(text.replace(/\D/g, ''));
  };

  const handleSelectAll = () => {
    setAmount(String(availableBalance));
  };

  const handleSelectPreset = (value: number) => {
    setAmount(String(value));
  };

  const handleSubmit = () => {
    if (isPending || !isValid) return;
    if (!walletId) {
      Toast.show({ type: 'error', text1: 'Không tìm thấy ví, vui lòng thử lại' });
      return;
    }

    mutate(
      {
        params: {
          wallet_id: walletId,
          adjustment_type: 'decrease',
          amount: amountNumber,
          reason: note.trim() || 'Yêu cầu rút tiền qua ứng dụng',
        },
      } as any,
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Đã gửi yêu cầu rút tiền!',
            text2: 'Yêu cầu sẽ được xử lý trong 1-24 giờ làm việc',
          });
          router.back();
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: 'Rút tiền thất bại',
            text2: error?.data?.msg?.message || error?.msg || error?.message,
          });
        },
      },
    );
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
          <Text style={styles.headerTitle}>Rút tiền</Text>
          {/* Chưa có màn hình lịch sử giao dịch riêng */}
          <TouchableOpacity
            style={styles.headerLink}
            onPress={() =>
              Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' })
            }
          >
            <History size={14} color="#fff" />
            <Text style={styles.headerLinkText}>Lịch sử</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <Text style={styles.balanceLabel}>Số dư khả dụng</Text>
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
              {hideBalance ? '••••••••đ' : formatCurrency(availableBalance)}
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
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Số tiền rút</Text>
        <View style={styles.amountInputWrapper}>
          <Text style={styles.amountCurrency}>đ</Text>
          <RNTextInput
            style={styles.amountInput}
            placeholder="Nhập số tiền rút"
            placeholderTextColor="#a7a7a7"
            keyboardType="number-pad"
            value={amount ? Number(amount).toLocaleString('vi-VN') : ''}
            onChangeText={handleAmountChange}
          />
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.amountAllText}>Tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountHintRow}>
          <Text style={styles.amountHintText}>
            Số tiền rút tối thiểu: {formatCurrency(MIN_WITHDRAW_AMOUNT)}
          </Text>
          <Text style={styles.amountFeeText}>
            Phí rút tiền: <Text style={styles.amountFeeValue}>Miễn phí</Text>
          </Text>
        </View>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <View style={styles.quickAddRow}>
          {QUICK_AMOUNTS.map((value) => {
            const active = amountNumber === value;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.quickAddChip, active && styles.quickAddChipActive]}
                onPress={() => handleSelectPreset(value)}
              >
                <Text
                  style={[
                    styles.quickAddChipText,
                    active && styles.quickAddChipTextActive,
                  ]}
                >
                  {formatCurrency(value)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Tài khoản nhận tiền
        </Text>
        <View style={styles.bankCard}>
          <View style={styles.bankIcon}>
            <Landmark size={20} color="#fff" />
          </View>
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>{MOCK_BANK_ACCOUNT.bankName}</Text>
            <Text style={styles.bankNumber}>
              {MOCK_BANK_ACCOUNT.maskedNumber}
            </Text>
            <Text style={styles.bankOwner}>{MOCK_BANK_ACCOUNT.ownerName}</Text>
          </View>
          <TouchableOpacity
            style={styles.bankChangeBtn}
            onPress={() =>
              router.push({
                pathname: '/setting/bank-account',
                params: { walletId },
              })
            }
          >
            <Text style={styles.bankChangeBtnText}>Thay đổi</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Nội dung (không bắt buộc)
        </Text>
        <View style={styles.noteInputWrapper}>
          <Pencil size={16} color="#94A3B8" style={{ marginTop: 4 }} />
          <RNTextInput
            style={styles.noteInput}
            placeholder="Nhập nội dung (nếu có)"
            placeholderTextColor="#a7a7a7"
            multiline
            maxLength={NOTE_MAX_LENGTH}
            value={note}
            onChangeText={setNote}
          />
          <Text style={styles.noteCounter}>
            {note.length}/{NOTE_MAX_LENGTH}
          </Text>
        </View>

        <View style={styles.infoBanner}>
          <View style={styles.infoIconWrapper}>
            <Info size={14} color="#fff" />
          </View>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>Lưu ý quan trọng</Text>
            <Text style={styles.infoBullet}>
              • Thời gian xử lý yêu cầu rút tiền: 1-24 giờ (trong giờ hành
              chính).
            </Text>
            <Text style={styles.infoBullet}>
              • Tiền sẽ được chuyển về tài khoản ngân hàng của bạn.
            </Text>
            <Text style={styles.infoBullet}>
              • Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Thông tin giao dịch
        </Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số dư khả dụng</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(availableBalance)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số tiền rút</Text>
            <Text style={styles.summaryValue}>
              {amountNumber > 0 ? formatCurrency(amountNumber) : '--'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí rút tiền</Text>
            <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
              Miễn phí
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryNetLabel}>Số tiền thực nhận</Text>
            <Text style={styles.summaryNetValue}>
              {amountNumber > 0 ? formatCurrency(netAmount) : '--'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isValid || isPending) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isValid || isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ShieldCheck size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                Xác nhận rút tiền
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default WalletWithdrawScreen;
