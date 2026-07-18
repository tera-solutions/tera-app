import { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  ChevronLeft,
  ClipboardList,
  Filter,
  Plus,
  Search,
  Settings2,
  ShoppingCart,
} from 'lucide-react-native';

import { useStates } from '@hooks/useStates';

import {
  CATEGORY_CHIPS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORY_TILES,
  Product,
  PRODUCTS,
  ProductCategory,
} from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const HocLieuScreen = observer(() => {
  const router = useRouter();
  const { cartStore } = useStates();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | ProductCategory>('all');
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  const keyword = search.trim().toLowerCase();

  const visibleProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (!keyword) return true;
      return (
        p.name.toLowerCase().includes(keyword) || p.subtitle.toLowerCase().includes(keyword)
      );
    });
  }, [activeCategory, keyword]);

  const featuredProducts = useMemo(() => {
    const base =
      activeCategory === 'all' && !keyword
        ? PRODUCTS.filter((p) => p.featured)
        : visibleProducts;
    return showAllFeatured ? base : base.slice(0, 6);
  }, [activeCategory, keyword, visibleProducts, showAllFeatured]);

  const bestsellers = useMemo(
    () =>
      PRODUCTS.filter((p) => p.bestsellerRank).sort(
        (a, b) => (a.bestsellerRank ?? 0) - (b.bestsellerRank ?? 0),
      ),
    [],
  );

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + 1;
    });
    return map;
  }, []);

  const addToCart = (id: string) => {
    cartStore.addItem(id);
    Toast.show({ type: 'success', text1: 'Đã thêm vào giỏ hàng' });
  };

  const goToDetail = (id: string) => {
    router.push(`/hoc-lieu/hoc-lieu-detail?productId=${id}`);
  };

  const renderProductCard = (product: Product) => {
    const CategoryIcon = CATEGORY_ICONS[product.category];
    const color = CATEGORY_COLORS[product.category];
    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        activeOpacity={0.85}
        onPress={() => goToDetail(product.id)}
      >
        <View style={[styles.productImageWrapper, { backgroundColor: `${color}12` }]}>
          <CategoryIcon size={30} color={color} />
          {product.badge && (
            <View
              style={[
                styles.productBadge,
                { backgroundColor: product.badge === 'sale' ? '#DC2626' : '#2563EB' },
              ]}
            >
              <Text style={styles.productBadgeText}>
                {product.badge === 'sale'
                  ? `-${Math.round(
                      (1 - product.price / (product.originalPrice ?? product.price)) * 100,
                    )}%`
                  : 'Mới'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.productSubtitle} numberOfLines={1}>
            {product.subtitle}
          </Text>
          <View style={styles.productPriceRow}>
            <View style={styles.productPriceCol}>
              <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
              {!!product.originalPrice && (
                <Text style={styles.productOriginalPrice}>
                  {formatCurrency(product.originalPrice)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}
            >
              <Plus size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Học liệu</Text>
          <View style={styles.headerRightRow}>
            {/* Quản lý học liệu (thêm/sửa/ẩn học liệu của giáo viên, xem HocLieuManageScreen) */}
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/hoc-lieu/quan-ly')}
            >
              <Settings2 size={18} color="#fff" />
            </TouchableOpacity>
            {/* Quản lý đơn hàng học liệu (dữ liệu mẫu, xem HocLieuOrderScreen) */}
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/hoc-lieu/don-hang')}
            >
              <ClipboardList size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push('/hoc-lieu/gio-hang')}
            >
              <ShoppingCart size={20} color="#fff" />
              {cartStore.count > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartStore.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm học liệu..."
              placeholderTextColor="#a7a7a7"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {/* Chưa có màn hình bộ lọc nâng cao riêng */}
          <TouchableOpacity style={styles.filterBtn} onPress={notImplemented}>
            <Filter size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerCard}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerEyebrow}>Kho học liệu phong phú</Text>
            <Text style={styles.bannerTitle}>DẠY HAY - HỌC VUI</Text>
            <View style={styles.bannerPill}>
              <Text style={styles.bannerPillText}>Chất lượng - Tiện lợi - Hiệu quả</Text>
            </View>
          </View>
          <Image source={require('@tera/assets/app/element_73.png')} style={styles.bannerImage} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATEGORY_CHIPS.map((chip) => {
            const active = chip.id === activeCategory;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveCategory(chip.id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
          <TouchableOpacity onPress={() => setShowAllFeatured((prev) => !prev)}>
            <Text style={styles.sectionLinkText}>
              {showAllFeatured ? 'Thu gọn' : 'Xem tất cả'}
            </Text>
          </TouchableOpacity>
        </View>

        {featuredProducts.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Không tìm thấy học liệu phù hợp</Text>
          </View>
        ) : (
          <View style={styles.productGrid}>{featuredProducts.map(renderProductCard)}</View>
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Danh mục học liệu</Text>
        </View>
        <View style={styles.categoryGrid}>
          {CATEGORY_TILES.map((tile) => {
            const TileIcon = tile.icon;
            const color = CATEGORY_COLORS[tile.id];
            return (
              <TouchableOpacity
                key={tile.id}
                style={styles.categoryTile}
                onPress={() => setActiveCategory(tile.id)}
              >
                <View style={[styles.categoryTileIcon, { backgroundColor: `${color}15` }]}>
                  <TileIcon size={20} color={color} />
                </View>
                <View style={styles.categoryTileInfo}>
                  <Text style={styles.categoryTileName}>{CATEGORY_LABELS[tile.id]}</Text>
                  <Text style={styles.categoryTileCount}>
                    {categoryCounts[tile.id] ?? 0} sản phẩm
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
          <TouchableOpacity onPress={notImplemented}>
            <Text style={styles.sectionLinkText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bestsellerList}
        >
          {bestsellers.map((product) => {
            const CategoryIcon = CATEGORY_ICONS[product.category];
            const color = CATEGORY_COLORS[product.category];
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.bestsellerCard}
                activeOpacity={0.85}
                onPress={() => goToDetail(product.id)}
              >
                <View style={[styles.bestsellerImageWrapper, { backgroundColor: `${color}12` }]}>
                  <CategoryIcon size={28} color={color} />
                  <View style={[styles.rankBadge, { backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.rankBadgeText}>Top {product.bestsellerRank}</Text>
                  </View>
                </View>
                <View style={styles.bestsellerInfo}>
                  <Text style={styles.bestsellerName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.bestsellerPriceRow}>
                    <Text style={styles.bestsellerPrice}>{formatCurrency(product.price)}</Text>
                    <TouchableOpacity
                      style={styles.addToCartBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        addToCart(product.id);
                      }}
                    >
                      <Plus size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>
    </View>
  );
});

export default HocLieuScreen;
