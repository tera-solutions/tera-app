import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react-native';

import { useStates } from '@hooks/useStates';

import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS, Product, PRODUCTS } from '@screens/HocLieuScreen/constants';
import { styles } from './style';

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

// Chưa có API mã giảm giá thật (finance/coupon, finance/discount,
// finance/promotion-campaign trong services/api chỉ là scaffold CRUD, chưa
// xác nhận field/route thật) — mô phỏng 1 mã cố định ở client để dựng đúng
// giao diện, không gọi API nào.
const DEMO_COUPON_CODE = 'HANA10';
const DEMO_COUPON_DISCOUNT = 35000;

const HocLieuCartScreen = observer(() => {
  const router = useRouter();
  const { cartStore } = useStates();

  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const cartItems = Object.entries(cartStore.items)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id), qty }))
    .filter((item): item is { product: Product; qty: number } => !!item.product && item.qty > 0);

  // null nghĩa là "chưa đụng vào" -> mặc định chọn tất cả sản phẩm hiện có.
  const effectiveSelectedIds = selectedIds ?? new Set(cartItems.map((i) => i.product.id));
  const isAllSelected =
    cartItems.length > 0 && cartItems.every((i) => effectiveSelectedIds.has(i.product.id));

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? new Set() : new Set(cartItems.map((i) => i.product.id)));
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(effectiveSelectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const subtotal = useMemo(
    () =>
      cartItems
        .filter((i) => effectiveSelectedIds.has(i.product.id))
        .reduce((sum, i) => sum + i.product.price * i.qty, 0),
    [cartItems, effectiveSelectedIds],
  );

  const couponDiscount = appliedCoupon ? Math.min(DEMO_COUPON_DISCOUNT, subtotal) : 0;
  const total = Math.max(0, subtotal - couponDiscount);
  const selectedCount = cartItems.filter((i) => effectiveSelectedIds.has(i.product.id)).length;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === DEMO_COUPON_CODE) {
      setAppliedCoupon(code);
      Toast.show({ type: 'success', text1: `Áp dụng mã ${code} thành công` });
    } else {
      Toast.show({ type: 'error', text1: 'Mã giảm giá không hợp lệ' });
    }
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    Alert.alert('Xoá toàn bộ giỏ hàng?', 'Tất cả sản phẩm trong giỏ hàng sẽ bị xoá.', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          cartStore.clear();
          setSelectedIds(null);
        },
      },
    ]);
  };

  const handleCheckout = () => {
    if (selectedCount === 0) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn ít nhất 1 sản phẩm' });
      return;
    }
    notImplemented();
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Giỏ hàng</Text>
            <View style={{ width: 36 }} />
          </View>
        </View>
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyIconWrapper}>
            <ShoppingCart size={30} color="#0066cc" />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptyDesc}>
            Hãy khám phá kho học liệu và thêm sản phẩm vào giỏ hàng nhé.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/hoc-lieu')}
          >
            <Text style={styles.emptyBtnText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Giỏ hàng</Text>
            <View style={styles.headerRightRow}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/(tabs)/hoc-lieu')}>
                <ShoppingCart size={18} color="#fff" />
                {cartStore.count > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartStore.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleClearCart}>
                <Trash2 size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.trustBanner}>
            <View style={styles.trustTitleRow}>
              <ShieldCheck size={14} color="#fff" />
              <Text style={styles.trustTitleText}>Mua sắm an tâm cùng Hana Edu</Text>
            </View>
            <View style={styles.trustItemsRow}>
              <View style={styles.trustItem}>
                <Check size={12} color="#fff" />
                <Text style={styles.trustItemText}>Sản phẩm chính hãng</Text>
              </View>
              <View style={styles.trustItem}>
                <RefreshCw size={12} color="#fff" />
                <Text style={styles.trustItemText}>Đổi trả dễ dàng</Text>
              </View>
              <View style={styles.trustItem}>
                <Clock size={12} color="#fff" />
                <Text style={styles.trustItemText}>Hỗ trợ 24/7</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{cartItems.length} sản phẩm</Text>
          <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
            <View style={[styles.checkbox, isAllSelected && styles.checkboxChecked]}>
              {isAllSelected && <Check size={13} color="#fff" />}
            </View>
            <Text style={styles.selectAllText}>Chọn tất cả</Text>
          </TouchableOpacity>
        </View>

        {cartItems.map(({ product, qty }) => {
          const CategoryIcon = CATEGORY_ICONS[product.category];
          const color = CATEGORY_COLORS[product.category];
          const checked = effectiveSelectedIds.has(product.id);
          const discountPercent = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : 0;

          return (
            <View key={product.id} style={styles.itemCard}>
              <TouchableOpacity
                style={[styles.checkbox, checked && styles.checkboxChecked, { marginTop: 22 }]}
                onPress={() => toggleSelectItem(product.id)}
              >
                {checked && <Check size={13} color="#fff" />}
              </TouchableOpacity>

              <View style={[styles.itemImageWrapper, { backgroundColor: `${color}12` }]}>
                <CategoryIcon size={26} color={color} />
              </View>

              <View style={styles.itemInfo}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.itemDeleteBtn}
                    onPress={() => cartStore.changeQty(product.id, -qty)}
                  >
                    <Trash2 size={14} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemSubtitle}>{CATEGORY_LABELS[product.category]}</Text>

                {!!product.ageRange && (
                  <View style={styles.itemBadgeRow}>
                    <View style={styles.itemBadge}>
                      <Text style={styles.itemBadgeText}>{product.ageRange}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.itemBottomRow}>
                  <View style={styles.itemPriceCol}>
                    <Text style={styles.itemPrice}>{formatCurrency(product.price)}</Text>
                    {!!product.originalPrice && (
                      <>
                        <Text style={styles.itemOriginalPrice}>
                          {formatCurrency(product.originalPrice)}
                        </Text>
                        <View style={styles.itemDiscountBadge}>
                          <Text style={styles.itemDiscountText}>-{discountPercent}%</Text>
                        </View>
                      </>
                    )}
                  </View>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => cartStore.changeQty(product.id, -1)}
                    >
                      <Minus size={13} color="#0066cc" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => cartStore.changeQty(product.id, 1)}
                    >
                      <Plus size={13} color="#0066cc" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.couponRow}>
          <View style={styles.couponIconWrapper}>
            <Tag size={16} color="#0066cc" />
          </View>
          <TextInput
            style={styles.couponInput}
            placeholder="Nhập mã giảm giá"
            placeholderTextColor="#a7a7a7"
            autoCapitalize="characters"
            value={couponInput}
            onChangeText={setCouponInput}
          />
          <TouchableOpacity style={styles.couponApplyBtn} onPress={handleApplyCoupon}>
            <Text style={styles.couponApplyBtnText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
        {!!appliedCoupon && (
          <Text style={styles.couponAppliedText}>
            Đã áp dụng mã {appliedCoupon} (-{formatCurrency(couponDiscount)})
          </Text>
        )}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính ({selectedCount} sản phẩm)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giảm giá</Text>
            <Text style={[styles.summaryValue, styles.summaryValueDanger]}>
              -{formatCurrency(couponDiscount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              {/* Chưa có logic tính phí vận chuyển thật */}
              <TouchableOpacity onPress={notImplemented}>
                <Clock size={12} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.summaryValueGreen}>Miễn phí</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <View style={styles.freeShipBanner}>
          <Truck size={16} color="#16A34A" />
          <Text style={styles.freeShipText}>Bạn được miễn phí vận chuyển!</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomTopRow}>
          <View style={styles.bottomSecureRow}>
            <ShieldCheck size={13} color="#94A3B8" />
            <Text style={styles.bottomSecureText}>Thanh toán an toàn</Text>
          </View>
          <View style={styles.bottomTotalCol}>
            <Text style={styles.bottomTotalLabel}>Tổng thanh toán</Text>
            <Text style={styles.bottomTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Chưa có API đặt hàng/thanh toán thật cho giỏ hàng học liệu */}
        <TouchableOpacity
          style={[styles.checkoutBtn, selectedCount === 0 && styles.checkoutBtnDisabled]}
          disabled={selectedCount === 0}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutBtnText}>Tiến hành thanh toán</Text>
          <ChevronRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default HocLieuCartScreen;
