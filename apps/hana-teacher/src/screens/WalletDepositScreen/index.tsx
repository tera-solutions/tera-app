import { useRef, useState } from 'react';
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
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  History,
  Pencil,
  ShieldCheck,
  Wallet as WalletIcon,
  X,
} from 'lucide-react-native';

import { useWalletDeposit, useWalletDetail } from '@tera/modules/wallet';

import { PAYMENT_METHODS, PRESET_AMOUNTS, QUICK_ADD_AMOUNTS } from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const WalletDepositScreen = observer(() => {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId?: string }>();
  const amountInputRef = useRef<RNTextInput>(null);

  const [hideBalance, setHideBalance] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | 'other' | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);

  const { data: detailRes, isLoading } = useWalletDetail(
    { id: walletId ?? '' },
    { enabled: !!walletId },
  );
  const detail = (detailRes as any)?.data ?? detailRes;
  const balance = detail?.balance ?? 0;

  const { mutate, isPending } = useWalletDeposit();

  const amountNumber = Number(amount) || 0;

  const handleAmountChange = (text: string) => {
    setAmount(text.replace(/\D/g, ''));
    setSelectedPreset(null);
  };

  const handleQuickAdd = (delta: number) => {
    setAmount((prev) => String((Number(prev) || 0) + delta));
    setSelectedPreset(null);
  };

  const handleSelectPreset = (value: number) => {
    setAmount(String(value));
    setSelectedPreset(value);
  };

  const handleSelectOther = () => {
    setSelectedPreset('other');
    setAmount('');
    amountInputRef.current?.focus();
  };

  const handleClearAmount = () => {
    setAmount('');
    setSelectedPreset(null);
  };

  const handleSubmit = () => {
    if (isPending || amountNumber <= 0) return;
    if (!walletId) {
      Toast.show({ type: 'error', text1: 'Không tìm thấy ví, vui lòng thử lại' });
      return;
    }

    mutate(
      {
        params: {
          wallet_id: walletId,
          amount: amountNumber,
          payment_method: paymentMethod,
          note: 'Nạp tiền từ app Hana Edu Teacher',
        },
      } as any,
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Nạp tiền thành công!' });
          router.back();
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: 'Nạp tiền thất bại',
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
          <Text style={styles.headerTitle}>Nạp tiền</Text>
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
            <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
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
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Nhập số tiền nạp</Text>
        <View style={styles.amountInputWrapper}>
          <Text style={styles.amountCurrency}>đ</Text>
          <RNTextInput
            ref={amountInputRef}
            style={styles.amountInput}
            placeholder="Nhập số tiền"
            placeholderTextColor="#a7a7a7"
            keyboardType="number-pad"
            value={amount ? Number(amount).toLocaleString('vi-VN') : ''}
            onChangeText={handleAmountChange}
          />
          {!!amount && (
            <TouchableOpacity onPress={handleClearAmount}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.quickAddRow}>
          {QUICK_ADD_AMOUNTS.map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.quickAddChip}
              onPress={() => handleQuickAdd(value)}
            >
              <Text style={styles.quickAddChipText}>
                +{formatCurrency(value)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Hoặc chọn số tiền nạp
        </Text>
        <View style={styles.presetGrid}>
          {PRESET_AMOUNTS.map((value) => {
            const active = selectedPreset === value;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.presetCard, active && styles.presetCardActive]}
                onPress={() => handleSelectPreset(value)}
              >
                <Text
                  style={[
                    styles.presetCardValue,
                    active && styles.presetCardValueActive,
                  ]}
                >
                  {formatCurrency(value)}
                </Text>
                {active && (
                  <View style={styles.presetCheckBadge}>
                    <Check size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.presetCard,
              selectedPreset === 'other' && styles.presetCardActive,
            ]}
            onPress={handleSelectOther}
          >
            <View style={styles.presetCardOther}>
              <Text
                style={[
                  styles.presetCardValue,
                  selectedPreset === 'other' && styles.presetCardValueActive,
                ]}
              >
                Khác
              </Text>
              <Pencil
                size={14}
                color={selectedPreset === 'other' ? '#0066cc' : '#64748B'}
              />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Phương thức thanh toán
        </Text>
        <View style={styles.paymentList}>
          {PAYMENT_METHODS.map((method) => {
            const MethodIcon = method.icon;
            const active = paymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentItem, active && styles.paymentItemActive]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <View
                  style={[styles.paymentIcon, { backgroundColor: method.color }]}
                >
                  <MethodIcon size={20} color="#fff" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  <Text style={styles.paymentDesc}>{method.desc}</Text>
                </View>
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.securityBanner}>
          <View style={styles.securityIconWrapper}>
            <ShieldCheck size={20} color="#0066cc" />
          </View>
          <View style={styles.securityTextWrapper}>
            <Text style={styles.securityTitle}>Giao dịch bảo mật 100%</Text>
            <Text style={styles.securityDesc}>
              Thông tin của bạn được mã hóa và bảo vệ tuyệt đối.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (amountNumber <= 0 || isPending) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={amountNumber <= 0 || isPending}
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
                {amountNumber > 0
                  ? `Nạp tiền ${formatCurrency(amountNumber)}`
                  : 'Nạp tiền'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default WalletDepositScreen;
