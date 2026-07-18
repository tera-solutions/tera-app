import { useMemo, useRef, useState } from 'react';
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
  Award,
  Check,
  ChevronLeft,
  Crown,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react-native';

import { usePackageList, useSubscriptionCurrent } from '@tera/modules/system';

import { CYCLE_OPTIONS, TERMS, TIER_COLORS, TIER_ICONS } from './constants';
import { CARD_SPACING, CARD_WIDTH, styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
};

interface TierVariant {
  id: number;
  price: number;
  cycle: string;
  badge: string | null;
  features: string[];
}

interface Tier {
  code: string;
  name: string;
  description: string | null;
  variants: Record<string, TierVariant>;
}

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const SubscriptionScreen = observer(() => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [selectedCycle, setSelectedCycle] = useState<'month' | 'year'>(
    'month',
  );
  const [activeTierIndex, setActiveTierIndex] = useState(0);

  const { data: currentRes, isLoading: isLoadingCurrent } =
    useSubscriptionCurrent();
  const current = (currentRes as any)?.data ?? currentRes;

  const { data: packagesRes, isLoading: isLoadingPackages } = usePackageList({
    params: { per_page: 50 } as any,
  });
  const rawPackages: any[] =
    (packagesRes as any)?.data?.items ?? (packagesRes as any)?.data ?? [];

  const isLoading = isLoadingCurrent || isLoadingPackages;

  // BE trả mỗi gói (tier + chu kỳ) là 1 item riêng, cùng chung `package_code`
  // — gom nhóm lại theo code để có thể chọn chu kỳ tháng/năm cho cùng 1 tier.
  const tiers: Tier[] = useMemo(() => {
    const map = new Map<string, Tier>();
    rawPackages.forEach((item) => {
      const code = item?.package_code ?? item?.code ?? String(item?.id);
      const cycle = item?.billing_cycle ?? 'month';
      if (!map.has(code)) {
        map.set(code, {
          code,
          name: item?.name ?? 'Gói dịch vụ',
          description: item?.description ?? null,
          variants: {},
        });
      }
      map.get(code)!.variants[cycle] = {
        id: item?.id,
        price: Number(item?.price ?? 0),
        cycle,
        badge: item?.badge ?? null,
        features: item?.features ?? [],
      };
    });
    return Array.from(map.values()).sort((a, b) => {
      const priceOf = (t: Tier) =>
        t.variants.month?.price ?? (t.variants.year?.price ?? 0) / 12;
      return priceOf(a) - priceOf(b);
    });
  }, [rawPackages]);

  const currentPackageId = current?.package_id;

  const getVariant = (tier: Tier) =>
    tier.variants[selectedCycle] ?? tier.variants.month ?? tier.variants.year;

  const handleSelectTier = (index: number) => {
    setActiveTierIndex(index);
    scrollRef.current?.scrollTo({
      x: index * (CARD_WIDTH + CARD_SPACING),
      animated: true,
    });
  };

  const handleScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    setActiveTierIndex(Math.max(0, Math.min(index, tiers.length - 1)));
  };

  const activeTier = tiers[activeTierIndex];
  const activeVariant = activeTier ? getVariant(activeTier) : undefined;
  const isActiveTierCurrent =
    !!activeVariant && activeVariant.id === currentPackageId;

  const handleCheckout = () => {
    if (!activeVariant || isActiveTierCurrent) return;
    router.push({
      pathname: '/setting/subscription-checkout',
      params: { packageId: String(activeVariant.id) },
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
          <Text style={styles.headerTitle}>Gói đăng ký</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerIconBtn} onPress={notImplemented}>
            <HelpCircle size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoIconWrapper}>
            <Crown size={20} color="#fff" />
          </View>
          <View style={styles.promoTextWrapper}>
            <Text style={styles.promoTitle}>
              Nâng cấp gói để trải nghiệm đầy đủ
            </Text>
            <Text style={styles.promoDesc}>
              Các tính năng nâng cao hỗ trợ tốt hơn cho công việc giảng dạy
              của bạn.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingCurrent ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : (
          <View style={[styles.section]}>
            <View style={styles.currentCard}>
              <Text style={styles.currentLabel}>Gói hiện tại của bạn</Text>
              <View style={styles.currentTopRow}>
                <View style={styles.currentBadgeIcon}>
                  <Award size={22} color="#0066cc" />
                </View>
                <View style={styles.currentInfo}>
                  <Text style={styles.currentName}>
                    {current?.package?.name ?? 'Gói Miễn phí'}
                  </Text>
                  {current?.expires_at && (
                    <View style={styles.currentExpiryChip}>
                      <Text style={styles.currentExpiryText}>
                        Hết hạn: {formatDate(current.expires_at)}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.currentUpgradeBtn}
                  onPress={() => handleSelectTier(tiers.length - 1)}
                >
                  <Text style={styles.currentUpgradeBtnText}>Nâng cấp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {isLoadingPackages ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : (
          <>
            <View style={styles.carouselWrapper}>
              <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
                onMomentumScrollEnd={handleScrollEnd}
              >
                {tiers.map((tier, index) => {
                  const variant = getVariant(tier);
                  if (!variant) return null;
                  const TierIcon = TIER_ICONS[index % TIER_ICONS.length];
                  const tierColor = TIER_COLORS[index % TIER_COLORS.length];
                  const isCurrent = variant.id === currentPackageId;
                  const isActive = index === activeTierIndex;

                  return (
                    <View
                      key={tier.code}
                      style={[styles.tierCard, isActive && styles.tierCardActive]}
                    >
                      {variant.badge && (
                        <View style={styles.tierBadgeRow}>
                          <View style={styles.tierBadge}>
                            <Text style={styles.tierBadgeText}>
                              {variant.badge}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View style={styles.tierHeader}>
                        <View
                          style={[
                            styles.tierIconWrapper,
                            { backgroundColor: tierColor },
                          ]}
                        >
                          <TierIcon size={26} color="#fff" />
                        </View>
                        <Text style={styles.tierName}>{tier.name}</Text>
                        {!!tier.description && (
                          <Text style={styles.tierDesc}>
                            {tier.description}
                          </Text>
                        )}
                        <Text style={styles.tierPrice}>
                          {formatCurrency(variant.price)}{' '}
                          <Text style={styles.tierPriceSuffix}>
                            /{variant.cycle === 'year' ? 'năm' : 'tháng'}
                          </Text>
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.tierCtaBtn,
                          isCurrent && styles.tierCtaBtnDisabled,
                        ]}
                        disabled={isCurrent}
                        onPress={() => handleSelectTier(index)}
                      >
                        <Text
                          style={[
                            styles.tierCtaBtnText,
                            isCurrent && styles.tierCtaBtnTextDisabled,
                          ]}
                        >
                          {isCurrent ? 'Gói hiện tại' : 'Chọn gói'}
                        </Text>
                      </TouchableOpacity>

                      {variant.features.length > 0 && (
                        <View style={styles.tierFeatureList}>
                          {variant.features.map((feature, featureIndex) => (
                            <View
                              key={featureIndex}
                              style={styles.tierFeatureRow}
                            >
                              <View style={styles.tierFeatureIconWrapper}>
                                <Check size={11} color="#16A34A" />
                              </View>
                              <Text style={styles.tierFeatureText}>
                                {feature}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              {tiers.length > 1 && (
                <View style={styles.dotsRow}>
                  {tiers.map((tier, index) => (
                    <View
                      key={tier.code}
                      style={[
                        styles.dot,
                        index === activeTierIndex && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                Chọn chu kỳ thanh toán
              </Text>
              <View style={styles.cycleRow}>
                {CYCLE_OPTIONS.map((option) => {
                  const active = selectedCycle === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.cycleOption,
                        active && styles.cycleOptionActive,
                      ]}
                      onPress={() => setSelectedCycle(option.id as 'month' | 'year')}
                    >
                      <Text style={styles.cycleOptionLabel}>
                        {option.label}
                      </Text>
                      {!!option.badge && (
                        <Text style={styles.cycleOptionBadge}>
                          {option.badge}
                        </Text>
                      )}
                      {active && (
                        <View style={styles.cycleCheckBadge}>
                          <Check size={11} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.infoBanner}>
                <View style={styles.infoIconWrapper}>
                  <ShieldCheck size={20} color="#0066cc" />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoTitle}>
                    Cam kết bảo mật & an toàn
                  </Text>
                  <Text style={styles.infoDesc}>
                    Thông tin thanh toán của bạn được mã hóa và bảo vệ tuyệt
                    đối. Bạn có thể hủy gói bất kỳ lúc nào.
                  </Text>
                </View>
              </View>

              <View style={styles.termsSection}>
                <Text style={styles.sectionTitle}>Điều khoản sử dụng</Text>
                {TERMS.map((term, index) => (
                  <View key={index} style={styles.termRow}>
                    <Check size={14} color="#0066cc" />
                    <Text style={styles.termText}>{term}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (isActiveTierCurrent || !activeVariant) &&
              styles.submitButtonDisabled,
          ]}
          disabled={isActiveTierCurrent || !activeVariant}
          onPress={handleCheckout}
        >
          <Text style={styles.submitButtonText}>
            {isActiveTierCurrent ? 'Đang sử dụng gói này' : 'Tiếp tục thanh toán'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default SubscriptionScreen;
