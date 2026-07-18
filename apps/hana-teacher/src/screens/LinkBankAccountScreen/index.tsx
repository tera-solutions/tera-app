import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Search,
  ShieldCheck,
  Wallet as WalletIcon,
} from 'lucide-react-native';

import { TextInput } from '@components/ui';

import {
  BANK_OPTIONS,
  DEMO_OTP_CODE,
  FEATURES,
  OTHER_BANK_ID,
  OTP_LENGTH,
} from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const LinkBankAccountScreen = observer(() => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedBankId, setSelectedBankId] = useState<string>(
    BANK_OPTIONS[0].id,
  );

  const [accountNumber, setAccountNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [branch, setBranch] = useState('');
  const [errors, setErrors] = useState<{
    accountNumber?: string;
    ownerName?: string;
  }>({});

  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredBanks = useMemo(() => {
    if (!search.trim()) return BANK_OPTIONS;
    const keyword = search.trim().toLowerCase();
    return BANK_OPTIONS.filter(
      (bank) =>
        bank.name.toLowerCase().includes(keyword) ||
        bank.shortName.toLowerCase().includes(keyword),
    );
  }, [search]);

  const selectedBankName =
    selectedBankId === OTHER_BANK_ID
      ? 'Ngân hàng khác'
      : BANK_OPTIONS.find((bank) => bank.id === selectedBankId)?.name;

  const handleContinue = () => {
    const nextErrors: typeof errors = {};
    if (!accountNumber.trim()) {
      nextErrors.accountNumber = 'Vui lòng nhập số tài khoản';
    }
    if (!ownerName.trim()) {
      nextErrors.ownerName = 'Vui lòng nhập tên chủ tài khoản';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setOtp('');
    setOtpVisible(true);
  };

  const handleConfirmOtp = () => {
    if (otp.length !== OTP_LENGTH) return;

    setIsSubmitting(true);
    // Chưa có API gửi/xác thực OTP liên kết ngân hàng thật — dùng mã demo cố định.
    setTimeout(() => {
      setIsSubmitting(false);
      if (otp !== DEMO_OTP_CODE) {
        Toast.show({ type: 'error', text1: 'Mã xác nhận không đúng' });
        return;
      }
      setOtpVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Liên kết tài khoản thành công!',
        text2: `${selectedBankName} • ${accountNumber}`,
      });
      router.back();
    }, 400);
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
          <Text style={styles.headerTitle}>Liên kết tài khoản mới</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerIconBtn} onPress={notImplemented}>
            <HelpCircle size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Liên kết tài khoản ngân hàng</Text>
          <Text style={styles.heroTitle}>
            Nhận tiền nhanh chóng, an toàn, bảo mật
          </Text>

          <View style={styles.featureRow}>
            {FEATURES.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <View key={feature.id} style={styles.featureItem}>
                  <View style={styles.featureIconWrapper}>
                    <FeatureIcon size={18} color="#fff" />
                  </View>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                </View>
              );
            })}
          </View>

          <WalletIcon
            size={64}
            color="rgba(255,255,255,0.25)"
            style={styles.heroDecorIcon}
          />
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>1. Chọn ngân hàng</Text>
        <View style={styles.searchInputWrapper}>
          <Search size={18} color="#94A3B8" />
          <RNTextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm ngân hàng"
            placeholderTextColor="#a7a7a7"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.bankGrid}>
          {filteredBanks.map((bank) => {
            const active = selectedBankId === bank.id;
            return (
              <TouchableOpacity
                key={bank.id}
                style={[styles.bankCard, active && styles.bankCardActive]}
                onPress={() => setSelectedBankId(bank.id)}
              >
                <View style={[styles.bankLogo, { backgroundColor: bank.color }]}>
                  <Text style={styles.bankLogoText}>{bank.shortName}</Text>
                </View>
                <Text style={styles.bankCardLabel} numberOfLines={1}>
                  {bank.name}
                </Text>
                {active && (
                  <View style={styles.bankCheckBadge}>
                    <Check size={11} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.bankCard,
              selectedBankId === OTHER_BANK_ID && styles.bankCardActive,
            ]}
            onPress={() => setSelectedBankId(OTHER_BANK_ID)}
          >
            <View style={[styles.bankLogo, { backgroundColor: '#64748B' }]}>
              <Building2 size={20} color="#fff" />
            </View>
            <Text style={styles.bankCardLabel}>Khác</Text>
            {selectedBankId === OTHER_BANK_ID && (
              <View style={styles.bankCheckBadge}>
                <Check size={11} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.hintRow}>
          <View style={styles.hintIconWrapper}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
              i
            </Text>
          </View>
          <Text style={styles.hintText}>
            Chưa tìm thấy ngân hàng của bạn? Chọn "Khác" để liên kết.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          2. Nhập thông tin tài khoản
        </Text>
        <View style={styles.form}>
          <View>
            <Text style={styles.fieldLabel}>Số tài khoản</Text>
            <TextInput
              leftIcon="credit-card-outline"
              placeholder="Nhập số tài khoản"
              keyboardType="number-pad"
              value={accountNumber}
              onChangeText={(text) => {
                setAccountNumber(text.replace(/\D/g, ''));
                setErrors((prev) => ({ ...prev, accountNumber: undefined }));
              }}
            />
            {errors.accountNumber && (
              <Text style={styles.error}>{errors.accountNumber}</Text>
            )}
          </View>

          <View>
            <Text style={styles.fieldLabel}>Họ và tên chủ tài khoản</Text>
            <TextInput
              leftIcon="account-outline"
              placeholder="Nhập đúng tên chủ tài khoản"
              autoCapitalize="characters"
              value={ownerName}
              onChangeText={(text) => {
                setOwnerName(text);
                setErrors((prev) => ({ ...prev, ownerName: undefined }));
              }}
            />
            {errors.ownerName && (
              <Text style={styles.error}>{errors.ownerName}</Text>
            )}
          </View>

          <View>
            <Text style={styles.fieldLabel}>Chi nhánh (không bắt buộc)</Text>
            <TextInput
              leftIcon="map-marker-outline"
              placeholder="Nhập chi nhánh ngân hàng"
              value={branch}
              onChangeText={setBranch}
            />
          </View>
        </View>

        <View style={styles.securityNote}>
          <ShieldCheck size={18} color="#0066cc" />
          <Text style={styles.securityNoteText}>
            Thông tin tài khoản của bạn được mã hóa và bảo vệ tuyệt đối. Hana
            Edu cam kết không lưu trữ thông tin đăng nhập ngân hàng.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          3. Xác nhận liên kết
        </Text>
        <View style={styles.confirmCard}>
          <View style={styles.confirmIconWrapper}>
            <ShieldCheck size={20} color="#0066cc" />
          </View>
          <View style={styles.confirmInfo}>
            <Text style={styles.confirmTitle}>Xác thực tài khoản</Text>
            <Text style={styles.confirmDesc}>
              Hệ thống sẽ gửi 1.000đ đến tài khoản của bạn và bạn cần nhập mã
              xác nhận để hoàn tất liên kết.
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitButton} onPress={handleContinue}>
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
              Tiếp tục
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={otpVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOtpVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalIconWrapper}>
              <ShieldCheck size={26} color="#0066cc" />
            </View>
            <Text style={styles.modalTitle}>Xác thực tài khoản</Text>
            <Text style={styles.modalDesc}>
              Nhập mã xác nhận đã được gửi kèm khoản tiền 1.000đ đến tài
              khoản {selectedBankName} • {accountNumber}
            </Text>

            <RNTextInput
              style={styles.otpInput}
              placeholder="------"
              placeholderTextColor="#CBD5E1"
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/\D/g, ''))}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setOtpVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSubmitBtn,
                  (otp.length !== OTP_LENGTH || isSubmitting) &&
                    styles.modalSubmitBtnDisabled,
                ]}
                onPress={handleConfirmOtp}
                disabled={otp.length !== OTP_LENGTH || isSubmitting}
              >
                <Text style={styles.modalSubmitBtnText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
});

export default LinkBankAccountScreen;
