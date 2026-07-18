import { Fragment } from 'react';
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
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Headphones,
  HelpCircle,
  Home,
} from 'lucide-react-native';

import { useSubscriptionCurrent } from '@tera/modules/system';

import { FEATURE_ICON_POOL, STEPS } from './constants';
import { styles } from './style';

const CONFETTI = [
  { top: 10, left: 20, color: '#F59E0B' },
  { top: 30, left: 260, color: '#22C55E' },
  { top: 100, left: -6, color: '#EC4899' },
  { top: 120, left: 285, color: '#0EA5E9' },
  { top: 0, left: 150, color: '#A855F7' },
];

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const SubscriptionCompleteScreen = observer(() => {
  const router = useRouter();
  const { paymentMethodLabel } = useLocalSearchParams<{
    paymentMethodLabel?: string;
  }>();

  const { data: currentRes, isLoading } = useSubscriptionCurrent();
  const current = (currentRes as any)?.data ?? currentRes;
  const features: string[] = current?.package?.features ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.dismissTo('/')}
          >
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hoàn tất</Text>
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
                <View style={styles.stepCircle}>
                  <Check size={14} color="#fff" />
                </View>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
              {index < STEPS.length - 1 && <View style={styles.stepLine} />}
            </Fragment>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successWrapper}>
          <View style={styles.successIconOuter}>
            {CONFETTI.map((dot, index) => (
              <View
                key={index}
                style={[
                  styles.confettiDot,
                  { top: dot.top, left: dot.left, backgroundColor: dot.color },
                ]}
              />
            ))}
            <View style={styles.successIconInner}>
              <Check size={44} color="#fff" />
            </View>
          </View>

          <Text style={styles.successTitle}>Thanh toán thành công!</Text>
          <Text style={styles.successDesc}>
            Cảm ơn bạn đã nâng cấp gói {current?.package?.name ?? ''}. Tài
            khoản của bạn đã được kích hoạt.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>

              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Gói đăng ký</Text>
                <Text style={styles.orderValue}>
                  {current?.package?.name ?? '—'}
                </Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Chu kỳ thanh toán</Text>
                <Text style={styles.orderValue}>
                  {current?.billing_cycle === 'year' ? 'Hàng năm' : 'Hàng tháng'}
                </Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Ngày bắt đầu</Text>
                <Text style={styles.orderValue}>
                  {formatDate(current?.started_at)}
                </Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Ngày hết hạn</Text>
                <Text style={styles.orderValue}>
                  {formatDate(current?.expires_at)}
                </Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Phương thức thanh toán</Text>
                <View style={styles.orderMethodRow}>
                  <CreditCard size={14} color="#0066cc" />
                  <Text style={styles.orderValue}>
                    {paymentMethodLabel || 'Chưa cập nhật'}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDivider} />

              <View style={[styles.orderRow, { marginBottom: 0 }]}>
                <Text style={styles.orderAmountLabel}>Số tiền</Text>
                <Text style={styles.orderAmountValue}>
                  {formatCurrency(current?.price)}
                </Text>
              </View>
            </View>

            {features.length > 0 && (
              <View style={styles.featuresBanner}>
                <Text style={styles.featuresTitle}>
                  Bạn đã có thể sử dụng ngay các tính năng
                </Text>
                <View style={styles.featuresRow}>
                  {features.slice(0, 5).map((feature, index) => {
                    const FeatureIcon =
                      FEATURE_ICON_POOL[index % FEATURE_ICON_POOL.length];
                    return (
                      <View key={index} style={styles.featureItem}>
                        <View style={styles.featureIconWrapper}>
                          <FeatureIcon size={20} color="#0066cc" />
                        </View>
                        <Text style={styles.featureLabel} numberOfLines={2}>
                          {feature}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.supportBanner} onPress={notImplemented}>
              <View style={styles.supportIconWrapper}>
                <Headphones size={18} color="#16A34A" />
              </View>
              <View style={styles.supportTextWrapper}>
                <Text style={styles.supportTitle}>Cần hỗ trợ?</Text>
                <Text style={styles.supportDesc}>
                  Đội ngũ Hana Edu luôn sẵn sàng hỗ trợ bạn 24/7
                </Text>
              </View>
              <ChevronRight size={18} color="#16A34A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.dismissTo('/')}
            >
              <Home size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Về trang chủ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => router.push('/setting/invoice-receipt')}
            >
              <FileText size={18} color="#0066cc" />
              <Text style={styles.outlineBtnText}>Xem hóa đơn</Text>
            </TouchableOpacity>

            <View style={styles.guaranteeRow}>
              <Text style={styles.guaranteeText}>
                Thanh toán của bạn được bảo mật tuyệt đối bởi Hana Edu
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
});

export default SubscriptionCompleteScreen;
