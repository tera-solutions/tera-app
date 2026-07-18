import { useMemo, useState } from 'react';
import { ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  Plus,
  ShoppingCart,
  Share2,
  Star,
} from 'lucide-react-native';

import { useStates } from '@hooks/useStates';

import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  PRODUCTS,
} from '@screens/HocLieuScreen/constants';
import { styles } from './style';

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const DESCRIPTION_COLLAPSED_LENGTH = 120;

const HocLieuDetailScreen = observer(() => {
  const router = useRouter();
  const { cartStore } = useStates();
  const { productId } = useLocalSearchParams<{ productId?: string }>();

  const [isFavorite, setIsFavorite] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === productId),
    [productId],
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(
      0,
      6,
    );
  }, [product]);

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundWrapper}>
          <Text style={styles.notFoundText}>Không tìm thấy học liệu này</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#0066cc', fontWeight: '700' }}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[product.category];
  const categoryColor = CATEGORY_COLORS[product.category];
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const description =
    product.description ?? 'Chưa có mô tả chi tiết cho học liệu này.';
  const isLongDescription = description.length > DESCRIPTION_COLLAPSED_LENGTH;
  const displayedDescription =
    descExpanded || !isLongDescription
      ? description
      : `${description.slice(0, DESCRIPTION_COLLAPSED_LENGTH)}...`;

  const handleAddToCart = () => {
    cartStore.addItem(product.id);
    Toast.show({ type: 'success', text1: 'Đã thêm vào giỏ hàng' });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${product.name}\n${formatCurrency(product.price)}\nXem trên Hana Edu - Học liệu`,
      });
    } catch {
      // Người dùng hủy chia sẻ hoặc thiết bị không hỗ trợ — không cần xử lý thêm.
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết học liệu</Text>
            <View style={styles.headerRightRow}>
              <TouchableOpacity
                style={styles.headerIconBtn}
                onPress={() => router.push('/hoc-lieu/gio-hang')}
              >
                <ShoppingCart size={18} color="#fff" />
                {cartStore.count > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartStore.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleShare}>
                <Share2 size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.imageCard}>
          <View style={[styles.imageWrapper, { backgroundColor: `${categoryColor}12` }]}>
            <CategoryIcon size={72} color={categoryColor} />
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryBadgeText}>{CATEGORY_LABELS[product.category]}</Text>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <TouchableOpacity
              style={styles.favoriteBtn}
              onPress={() => setIsFavorite((prev) => !prev)}
            >
              <Heart
                size={16}
                color={isFavorite ? '#DC2626' : '#94A3B8'}
                fill={isFavorite ? '#DC2626' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.productSubtitle}>{product.subtitle}</Text>

          {!!(product.rating || product.soldCount) && (
            <View style={styles.metaRow}>
              {!!product.rating && (
                <View style={styles.ratingRow}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                  {!!product.reviewCount && (
                    <Text style={styles.reviewCountText}>({product.reviewCount} đánh giá)</Text>
                  )}
                </View>
              )}
              {!!product.rating && !!product.soldCount && <View style={styles.metaDivider} />}
              {!!product.soldCount && (
                <Text style={styles.soldText}>Đã bán {product.soldCount}</Text>
              )}
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            {!!product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>{formatCurrency(product.originalPrice)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {!!product.specs?.length && (
          <View style={styles.specsGrid}>
            {product.specs.map((spec) => {
              const SpecIcon = spec.icon;
              return (
                <View key={spec.label} style={styles.specItem}>
                  <SpecIcon size={18} color="#0066cc" />
                  <View>
                    <Text style={styles.specLabel}>{spec.label}</Text>
                    <Text style={styles.specValue}>{spec.value}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            {isLongDescription && (
              <TouchableOpacity onPress={() => setDescExpanded((prev) => !prev)}>
                <Text style={styles.sectionLinkText}>
                  {descExpanded ? 'Thu gọn' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.descriptionText}>{displayedDescription}</Text>
        </View>

        {!!product.highlights?.length && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
            <View style={styles.highlightsGrid}>
              {product.highlights.map((item) => {
                const HighlightIcon = item.icon;
                return (
                  <View key={item.label} style={styles.highlightCard}>
                    <View
                      style={[styles.highlightIconWrapper, { backgroundColor: `${item.color}15` }]}
                    >
                      <HighlightIcon size={18} color={item.color} />
                    </View>
                    <Text style={styles.highlightLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {relatedProducts.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Sản phẩm liên quan</Text>
              <TouchableOpacity onPress={notImplemented}>
                <Text style={styles.sectionLinkText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
            >
              {relatedProducts.map((item) => {
                const ItemIcon = CATEGORY_ICONS[item.category];
                const color = CATEGORY_COLORS[item.category];
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.relatedCard}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/hoc-lieu/hoc-lieu-detail?productId=${item.id}`)}
                  >
                    <View style={[styles.relatedImageWrapper, { backgroundColor: `${color}12` }]}>
                      <ItemIcon size={26} color={color} />
                    </View>
                    <View style={styles.relatedInfo}>
                      <Text style={styles.relatedName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.relatedSubtitle} numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                      <View style={styles.relatedPriceRow}>
                        <Text style={styles.relatedPrice}>{formatCurrency(item.price)}</Text>
                        <TouchableOpacity
                          style={styles.addToCartBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            cartStore.addItem(item.id);
                            Toast.show({ type: 'success', text1: 'Đã thêm vào giỏ hàng' });
                          }}
                        >
                          <Plus size={14} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.relatedCard} onPress={notImplemented}>
                <View style={[styles.relatedImageWrapper, { backgroundColor: '#EEF7FF' }]}>
                  <ChevronRight size={22} color="#0066cc" />
                </View>
                <View style={styles.relatedInfo}>
                  <Text style={[styles.relatedName, { color: '#0066cc' }]}>Xem thêm</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        {/* Chưa có kênh hỗ trợ tư vấn thật cho học liệu */}
        <TouchableOpacity style={styles.supportBtn} onPress={notImplemented}>
          <Headphones size={16} color="#0066cc" />
          <Text style={styles.supportBtnText}>Hỗ trợ tư vấn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartMainBtn} onPress={handleAddToCart}>
          <ShoppingCart size={18} color="#fff" />
          <Text style={styles.addToCartMainBtnText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default HocLieuDetailScreen;
