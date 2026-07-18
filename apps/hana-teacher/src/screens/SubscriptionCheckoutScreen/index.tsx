import { Fragment, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Diamond,
  Gift,
  HelpCircle,
  Lock,
} from 'lucide-react-native';

import { usePackageList } from '@tera/modules/system';

import { STEPS } from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const SubscriptionCheckoutScreen = observer(() => {
  const router = useRouter();
  const { packageId } = useLocalSearchParams<{ packageId?: string }>();

  const [selectedCycle, setSelectedCycle] = useState<'month' | 'year' | null>(
    null,
  );

  const { data: packagesRes, isLoading } = usePackageList({
    params: { per_page: 50 } as any,
  });
  const rawPackages: any[] =
    (packagesRes as any)?.data?.items ?? (packagesRes as any)?.data ?? [];

  const selectedItem = useMemo(
    () => rawPackages.find((item) => String(item?.id) === String(packageId)),
    [rawPackages, packageId],
  );

  const code = selectedItem?.package_code ?? selectedItem?.code;

  const monthItem = useMemo(
    () =>
      rawPackages.find(
        (item) =>
          (item?.package_code ?? item?.code) === code &&
          (item?.billing_cycle ?? 'month') === 'month',
      ),
    [rawPackages, code],
  );
  const yearItem = useMemo(
    () =>
      rawPackages.find(
        (item) =>
          (item?.package_code ?? item?.code) === code &&
          (item?.billing_cycle ?? 'month') === 'year',
      ),
    [rawPackages, code],
  );

  const cycle = selectedCycle ?? selectedItem?.billing_cycle ?? 'month';
  const activeItem = (cycle === 'year' ? yearItem : monthItem) ?? selectedItem;
  const hasBothCycles = !!monthItem && !!yearItem;

  const savingsPercent = useMemo(() => {
    if (!monthItem || !yearItem) return null;
    const monthPrice = Number(monthItem.price ?? 0);
    const yearPrice = Number(yearItem.price ?? 0);
    if (!monthPrice) return null;
    const percent = Math.round((1 - yearPrice / 12 / monthPrice) * 100);
    return percent > 0 ? percent : null;
  }, [monthItem, yearItem]);

  const price = Number(activeItem?.price ?? 0);
  const startDate = useMemo(() => formatDate(new Date()), []);

  const handleSubmit = () => {
    if (!activeItem?.id) return;
    router.push({
      pathname: '/setting/subscription-payment',
      params: { packageId: String(activeItem.id), billingCycle: cycle },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thanh toán gói đăng ký</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerHelpBtn} onPress={notImplemented}>
            <HelpCircle size={16} color="#fff" />
            <Text style={styles.headerHelpText}>Trợ giúp</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepperCard}>
        <View style={styles.stepperRow}>
          {STEPS.map((step, index) => (
            <Fragment key={step.id}>
              <View style={styles.stepCircleWrapper}>
                <View
                  style={[styles.stepCircle, index === 0 && styles.stepCircleActive]}
                >
                  <Text
                    style={[
                      styles.stepCircleText,
                      index === 0 && styles.stepCircleTextActive,
                    ]}
                  >
                    {step.id}
                  </Text>
                </View>
                <Text
                  style={[styles.stepLabel, index === 0 && styles.stepLabelActive]}
                >
                  {step.label}
                </Text>
              </View>
              {index < STEPS.length - 1 && (
                <View
                  style={[styles.stepLine, index === 0 && styles.stepLineActive]}
                />
              )}
            </Fragment>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : !activeItem ? (
          <Text style={{ textAlign: 'center', marginTop: 24, color: '#64748B' }}>
            Không tìm thấy gói đã chọn, vui lòng quay lại chọn gói khác.
          </Text>
        ) : (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Gói đã chọn</Text>

              <View style={styles.packageTopRow}>
                <View style={styles.packageIcon}>
                  <Diamond size={26} color="#0066cc" />
                </View>
                <View style={styles.packageInfo}>
                  <View style={styles.packageNameRow}>
                    <Text style={styles.packageName}>{activeItem?.name}</Text>
                    {!!activeItem?.badge && (
                      <View style={styles.packageBadge}>
                        <Text style={styles.packageBadgeText}>
                          {activeItem.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  {!!activeItem?.description && (
                    <Text style={styles.packageDesc}>
                      {activeItem.description}
                    </Text>
                  )}
                </View>
              </View>

              {Array.isArray(activeItem?.features) &&
                activeItem.features.length > 0 && (
                  <View style={styles.featureChipsRow}>
                    {activeItem.features.slice(0, 4).map((feature: string, index: number) => (
                      <View key={index} style={styles.featureChip}>
                        <View style={styles.featureChipIcon}>
                          <Check size={10} color="#0066cc" />
                        </View>
                        <Text style={styles.featureChipText} numberOfLines={1}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

              <View style={[styles.infoRow, styles.infoRowFirst]}>
                <Text style={styles.infoRowLabel}>Chu kỳ thanh toán</Text>
                <Text style={[styles.infoRowValue, styles.infoRowValuePrimary]}>
                  {cycle === 'year' ? 'Hàng năm' : 'Hàng tháng'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowLabel}>Ngày bắt đầu</Text>
                <Text style={styles.infoRowValue}>{startDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowLabel}>Số tiền</Text>
                <Text style={[styles.infoRowValue, styles.infoRowValuePrimary]}>
                  {formatCurrency(price)} / {cycle === 'year' ? 'năm' : 'tháng'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.changePlanBtn}
                onPress={() => router.back()}
              >
                <ChevronDown size={16} color="#0066cc" />
                <Text style={styles.changePlanBtnText}>Đổi gói</Text>
              </TouchableOpacity>
            </View>

            {hasBothCycles && (
              <View style={styles.savingsBanner}>
                <Gift size={18} color="#0066cc" />
                <View style={styles.savingsTextWrapper}>
                  <Text style={styles.savingsTitle}>
                    Tiết kiệm hơn với gói năm
                  </Text>
                </View>
                <Text style={styles.savingsToggleLabel}>
                  Thanh toán năm
                  {savingsPercent ? ` (tiết kiệm ${savingsPercent}%)` : ''}
                </Text>
                <Switch
                  value={cycle === 'year'}
                  onValueChange={(value) =>
                    setSelectedCycle(value ? 'year' : 'month')
                  }
                  trackColor={{ true: '#0066cc' }}
                />
              </View>
            )}

          </>
        )}
      </ScrollView>

      {!isLoading && activeItem && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Lock size={16} color="#fff" />
            <Text style={styles.submitButtonText}>
              Thanh toán {formatCurrency(price)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

export default SubscriptionCheckoutScreen;
