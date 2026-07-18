import { Fragment, useMemo, useState } from 'react';
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
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Diamond,
  HelpCircle,
  Lock,
  ShieldCheck,
} from 'lucide-react-native';

import { usePackageList, useSubscriptionUpgrade } from '@tera/modules/system';

import { PAYMENT_METHODS, STEPS } from './constants';
import { styles } from './style';

const ACTIVE_STEP_INDEX = 1;

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const SubscriptionPaymentScreen = observer(() => {
  const router = useRouter();
  const { packageId, billingCycle } = useLocalSearchParams<{
    packageId?: string;
    billingCycle?: string;
  }>();
  const cycle = billingCycle === 'year' ? 'year' : 'month';

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const { data: packagesRes, isLoading } = usePackageList({
    params: { per_page: 50 } as any,
  });
  const rawPackages: any[] =
    (packagesRes as any)?.data?.items ?? (packagesRes as any)?.data ?? [];

  const activeItem = useMemo(
    () => rawPackages.find((item) => String(item?.id) === String(packageId)),
    [rawPackages, packageId],
  );

  const price = Number(activeItem?.price ?? 0);

  const { mutate: upgrade, isPending } = useSubscriptionUpgrade();

  const handlePaymentPress = (methodId: string, expandable?: boolean) => {
    setSelectedMethod(methodId);
    if (expandable) {
      setExpandedMethod((prev) => (prev === methodId ? null : methodId));
    }
  };

  const handleSubmit = () => {
    if (!activeItem?.id || isPending) return;
    upgrade(
      {
        params: {
          package_id: activeItem.id,
          billing_cycle: cycle,
          payment_method: selectedMethod,
        },
      },
      {
        onSuccess: () => {
          const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
          router.replace({
            pathname: '/setting/subscription-complete',
            params: { paymentMethodLabel: method?.title ?? '' },
          });
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: error?.data?.msg ?? 'Thanh toán thất bại, vui lòng thử lại',
          });
        },
      },
    );
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
          <Text style={styles.headerTitle}>Thanh toán</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerHelpBtn} onPress={notImplemented}>
            <HelpCircle size={16} color="#fff" />
            <Text style={styles.headerHelpText}>Trợ giúp</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepperCard}>
        <View style={styles.stepperRow}>
          {STEPS.map((step, index) => {
            const done = index < ACTIVE_STEP_INDEX;
            const active = index === ACTIVE_STEP_INDEX;
            return (
              <Fragment key={step.id}>
                <View style={styles.stepCircleWrapper}>
                  <View
                    style={[
                      styles.stepCircle,
                      (done || active) && styles.stepCircleActive,
                    ]}
                  >
                    {done ? (
                      <Check size={14} color="#fff" />
                    ) : (
                      <Text
                        style={[
                          styles.stepCircleText,
                          active && styles.stepCircleTextActive,
                        ]}
                      >
                        {step.id}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      (done || active) && styles.stepLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
                {index < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      index < ACTIVE_STEP_INDEX && styles.stepLineActive,
                    ]}
                  />
                )}
              </Fragment>
            );
          })}
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
              <Text style={styles.sectionTitle}>Thông tin gói đăng ký</Text>

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
                <Text style={styles.infoRowLabel}>Số tiền</Text>
                <Text style={[styles.infoRowValue, styles.infoRowValuePrimary]}>
                  {formatCurrency(price)} / {cycle === 'year' ? 'năm' : 'tháng'}
                </Text>
              </View>
            </View>

            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
              <View style={styles.paymentList}>
                {PAYMENT_METHODS.map((method) => {
                  const MethodIcon = method.icon;
                  const active = selectedMethod === method.id;
                  const expanded = expandedMethod === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[styles.paymentRow, active && styles.paymentRowActive]}
                      onPress={() =>
                        handlePaymentPress(method.id, method.expandable)
                      }
                    >
                      <View style={styles.paymentRowTop}>
                        <View
                          style={[styles.paymentIcon, { backgroundColor: method.bg }]}
                        >
                          <MethodIcon size={18} color={method.color} />
                        </View>
                        <View style={styles.paymentInfo}>
                          <Text style={styles.paymentTitle}>{method.title}</Text>
                          <Text style={styles.paymentDesc}>{method.desc}</Text>
                        </View>

                        {method.brands.length > 0 && (
                          <View style={styles.paymentBrandsRow}>
                            {method.brands.map((brand) => (
                              <View key={brand} style={styles.paymentBrandChip}>
                                <Text style={styles.paymentBrandChipText}>
                                  {brand}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {method.expandable ? (
                          expanded ? (
                            <ChevronUp size={18} color="#0066cc" />
                          ) : (
                            <ChevronDown size={18} color="#0066cc" />
                          )
                        ) : (
                          <View
                            style={[
                              styles.radioOuter,
                              active && styles.radioOuterActive,
                            ]}
                          >
                            {active && <View style={styles.radioInner} />}
                          </View>
                        )}
                      </View>

                      {method.expandable && expanded && (
                        <Text style={styles.paymentExpandNote}>
                          Thông tin tài khoản nhận chuyển khoản sẽ được gửi cho
                          bạn ngay sau khi xác nhận thanh toán.
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>
                  Tạm tính ({cycle === 'year' ? '1 năm' : '1 tháng'})
                </Text>
                <Text style={styles.receiptValue}>{formatCurrency(price)}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Giảm giá</Text>
                <Text style={styles.receiptDiscountValue}>- 0đ</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={[styles.receiptRow, { marginBottom: 0 }]}>
                <Text style={styles.receiptTotalLabel}>Tổng thanh toán</Text>
                <Text style={styles.receiptTotalValue}>
                  {formatCurrency(price)}
                </Text>
              </View>
            </View>

            <View style={styles.securityBanner}>
              <ShieldCheck size={16} color="#16A34A" />
              <Text style={styles.securityBannerText}>
                Thông tin thanh toán của bạn được bảo mật tuyệt đối.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {!isLoading && activeItem && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
            disabled={isPending}
            onPress={handleSubmit}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Lock size={16} color="#fff" />
                <Text style={styles.submitButtonText}>
                  Thanh toán {formatCurrency(price)}
                </Text>
              </>
            )}
          </TouchableOpacity>
          <View style={styles.guaranteeRow}>
            <ShieldCheck size={12} color="#64748B" />
            <Text style={styles.guaranteeText}>
              Cam kết hoàn tiền 100% nếu bạn không hài lòng trong 7 ngày đầu sử
              dụng.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
});

export default SubscriptionPaymentScreen;
