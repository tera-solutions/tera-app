import { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  Gift,
  HelpCircle,
  RefreshCcw,
  ShieldCheck,
  Wallet as WalletIcon,
} from 'lucide-react-native';

import { usePackageList, useSubscriptionCurrent } from '@tera/modules/system';

import { MANAGE_MENUS } from './constants';
import { styles } from './style';

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

const SubscriptionManageScreen = observer(() => {
  const router = useRouter();

  const { data: currentRes, isLoading } = useSubscriptionCurrent();
  const current = (currentRes as any)?.data ?? currentRes;

  const { data: packagesRes } = usePackageList({
    params: { per_page: 50 } as any,
  });
  const rawPackages: any[] =
    (packagesRes as any)?.data?.items ?? (packagesRes as any)?.data ?? [];

  const cycle = current?.billing_cycle ?? 'month';
  const price = Number(current?.price ?? 0);

  // Tìm bản ghi cùng gói (package_code) nhưng khác chu kỳ để hiển thị giá quy
  // đổi — BE lưu mỗi chu kỳ là 1 package riêng, cùng chung package_code.
  const altVariant = useMemo(() => {
    const code = current?.package?.package_code ?? current?.package_code;
    if (!code) return null;
    const altCycle = cycle === 'year' ? 'month' : 'year';
    const found = rawPackages.find(
      (item) =>
        (item?.package_code ?? item?.code) === code &&
        (item?.billing_cycle ?? 'month') === altCycle,
    );
    if (!found) return null;
    return { price: Number(found.price ?? 0), cycle: altCycle };
  }, [rawPackages, current, cycle]);

  const savingsPercent = useMemo(() => {
    if (!altVariant || cycle !== 'month' || !price) return null;
    const monthlyEquivalent = altVariant.price / 12;
    const percent = Math.round((1 - monthlyEquivalent / price) * 100);
    return percent > 0 ? percent : null;
  }, [altVariant, cycle, price]);

  const handleMenuPress = (action: string) => {
    if (action === 'change-plan') {
      router.push('/setting/subscription');
      return;
    }
    if (action === 'payment-history') {
      router.push('/setting/payment-history');
      return;
    }
    if (action === 'invoices') {
      router.push('/setting/invoice-receipt');
      return;
    }
    notImplemented();
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
          <Text style={styles.headerTitle}>Quản lý gói đăng ký</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerIconBtn} onPress={notImplemented}>
            <HelpCircle size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#fff" />
        ) : (
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Crown size={14} color="#FBBF24" />
              <Text style={styles.heroBadgeText}>Gói đang sử dụng</Text>
            </View>

            <Text style={styles.heroName}>
              {current?.package?.name ?? 'Gói Miễn phí'}
            </Text>
            <Text style={styles.heroPriceRow}>
              <Text style={styles.heroPriceValue}>{formatCurrency(price)}</Text>{' '}
              / {cycle === 'year' ? 'năm' : 'tháng'}
            </Text>
            {altVariant && (
              <Text style={styles.heroAltPrice}>
                Hoặc {formatCurrency(altVariant.price)}/
                {altVariant.cycle === 'year' ? 'năm' : 'tháng'}
                {savingsPercent ? ` (Tiết kiệm ${savingsPercent}%)` : ''}
              </Text>
            )}

            <TouchableOpacity
              style={styles.heroDetailBtn}
              onPress={() => router.push('/setting/subscription')}
            >
              <Text style={styles.heroDetailBtnText}>Xem chi tiết gói</Text>
              <ChevronRight size={16} color="#0066cc" />
            </TouchableOpacity>

            <WalletIcon
              size={64}
              color="rgba(255,255,255,0.25)"
              style={styles.heroDecorIcon}
            />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Thông tin gói hiện tại</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCell}>
              <View style={styles.infoCellIcon}>
                <Calendar size={16} color="#0066cc" />
              </View>
              <View>
                <Text style={styles.infoCellLabel}>Ngày bắt đầu</Text>
                <Text style={styles.infoCellValue}>
                  {formatDate(current?.started_at)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCell}>
              <View style={styles.infoCellIcon}>
                <CalendarCheck size={16} color="#0066cc" />
              </View>
              <View>
                <Text style={styles.infoCellLabel}>Ngày hết hạn</Text>
                <Text style={styles.infoCellValue}>
                  {formatDate(current?.expires_at)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCell}>
              <View style={styles.infoCellIcon}>
                <RefreshCcw size={16} color="#0066cc" />
              </View>
              <View>
                <Text style={styles.infoCellLabel}>Chu kỳ thanh toán</Text>
                <Text style={styles.infoCellValue}>
                  {cycle === 'year' ? 'Hàng năm' : 'Hàng tháng'}
                </Text>
              </View>
            </View>

            <View style={styles.infoCell}>
              <View style={styles.infoCellIcon}>
                <CreditCard size={16} color="#0066cc" />
              </View>
              <View>
                <Text style={styles.infoCellLabel}>Phương thức thanh toán</Text>
                {/* Chưa có API quản lý phương thức thanh toán đã lưu */}
                <Text style={styles.infoCellValue}>
                  {current?.payment_method ?? 'Chưa cập nhật'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.renewBanner}>
            <View style={styles.renewIconWrapper}>
              <ShieldCheck size={16} color="#0066cc" />
            </View>
            <View style={styles.renewTextWrapper}>
              <Text style={styles.renewTitle}>
                Gói của bạn sẽ tự động gia hạn
              </Text>
              <Text style={styles.renewDesc}>
                Hệ thống sẽ tự động gia hạn gói vào ngày{' '}
                {formatDate(current?.expires_at)}. Bạn có thể hủy gói bất kỳ
                lúc nào.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quản lý gói đăng ký</Text>

          {MANAGE_MENUS.map((menu, index) => {
            const MenuIcon = menu.icon;
            return (
              <TouchableOpacity
                key={menu.id}
                style={[
                  styles.menuRow,
                  index === MANAGE_MENUS.length - 1 && styles.menuRowLast,
                ]}
                onPress={() => handleMenuPress(menu.action)}
              >
                <View
                  style={[styles.menuIcon, { backgroundColor: menu.color }]}
                >
                  <MenuIcon size={18} color="#fff" />
                </View>
                <View style={styles.menuInfo}>
                  <Text
                    style={[
                      styles.menuTitle,
                      menu.danger && styles.menuTitleDanger,
                    ]}
                  >
                    {menu.title}
                  </Text>
                  <Text style={styles.menuDesc}>{menu.desc}</Text>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>
            Nâng cấp để trải nghiệm nhiều tính năng hơn!
          </Text>
          <Text style={styles.promoDesc}>
            Khám phá gói Nâng cao với nhiều công cụ mạnh mẽ hỗ trợ giảng dạy
            hiệu quả.
          </Text>
          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() => router.push('/setting/subscription')}
          >
            <Text style={styles.promoBtnText}>Nâng cấp ngay</Text>
            <ChevronRight size={16} color="#fff" />
          </TouchableOpacity>

          <Gift
            size={56}
            color="rgba(0,102,204,0.15)"
            style={styles.promoDecorIcon}
          />
        </View>
      </ScrollView>
    </View>
  );
});

export default SubscriptionManageScreen;
