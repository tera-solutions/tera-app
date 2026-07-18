import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  ArrowDownUp,
  Bell,
  ChevronLeft,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react-native';

import {
  CATEGORY_CHIPS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  Product,
  PRODUCTS,
  ProductCategory,
} from '@screens/HocLieuScreen/constants';

import { SORT_LABELS, SORT_ORDER, SortOption, STAT_TILES } from './constants';
import { styles } from './style';

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const visibilityMeta = (visibility: Product['manageVisibility']) =>
  visibility === 'hidden'
    ? { label: 'Đã ẩn', color: '#DC2626', bg: '#FEE2E2' }
    : { label: 'Đang sử dụng', color: '#16A34A', bg: '#DCFCE7' };

const subtitleLine = (product: Product) => {
  const parts = [product.manageAgeLabel, product.publisher ? `NXB: ${product.publisher}` : null];
  return parts.filter(Boolean).join(' • ');
};

const HocLieuManageScreen = () => {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | ProductCategory>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const keyword = search.trim().toLowerCase();

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (!keyword) return true;
      return p.name.toLowerCase().includes(keyword) || p.subtitle.toLowerCase().includes(keyword);
    });
    if (sortOption === 'price_asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sortOption === 'price_desc') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, activeCategory, keyword, sortOption]);

  const toggleSort = () => {
    const nextIndex = (SORT_ORDER.indexOf(sortOption) + 1) % SORT_ORDER.length;
    setSortOption(SORT_ORDER[nextIndex]);
  };

  const toggleVisibility = (product: Product) => {
    const nextVisibility = product.manageVisibility === 'hidden' ? 'active' : 'hidden';
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, manageVisibility: nextVisibility } : p)),
    );
    Toast.show({
      type: 'success',
      text1: nextVisibility === 'hidden' ? `Đã ẩn "${product.name}"` : `Đã hiện "${product.name}"`,
    });
  };

  const openActions = (product: Product) => {
    const isHidden = product.manageVisibility === 'hidden';
    Alert.alert(product.name, undefined, [
      { text: isHidden ? 'Hiện học liệu' : 'Ẩn học liệu', onPress: () => toggleVisibility(product) },
      { text: 'Xoá học liệu', style: 'destructive', onPress: notImplemented },
      { text: 'Đóng', style: 'cancel' },
    ]);
  };

  const goToViewer = (id: string) => router.push(`/hoc-lieu/xem?productId=${id}`);

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
            <Text style={styles.headerTitle}>Quản lý học liệu</Text>
            <View style={styles.headerRightRow}>
              <TouchableOpacity
                style={styles.headerIconBtn}
                onPress={() => router.push('/setting/notification')}
              >
                <Bell size={18} color="#fff" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
              {/* Chưa có màn hình thêm học liệu mới riêng */}
              <TouchableOpacity style={styles.headerIconBtn} onPress={notImplemented}>
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          {STAT_TILES.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <View
                key={stat.id}
                style={[styles.statItem, index > 0 && styles.statItemDivider]}
              >
                <View style={[styles.statIconWrapper, { backgroundColor: `${stat.color}18` }]}>
                  <StatIcon size={16} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.toolbarRow}>
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
            <Filter size={15} color="#0066cc" />
            <Text style={styles.filterBtnText}>Bộ lọc</Text>
          </TouchableOpacity>
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

        <View style={styles.countSortRow}>
          <Text style={styles.countText}>{visibleProducts.length} học liệu</Text>
          <TouchableOpacity style={styles.sortBtn} onPress={toggleSort}>
            <ArrowDownUp size={14} color="#0066cc" />
            <Text style={styles.sortBtnText}>{SORT_LABELS[sortOption]}</Text>
          </TouchableOpacity>
        </View>

        {visibleProducts.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Không tìm thấy học liệu phù hợp</Text>
          </View>
        ) : (
          visibleProducts.map((product) => {
            const CategoryIcon = CATEGORY_ICONS[product.category];
            const color = CATEGORY_COLORS[product.category];
            const visibility = visibilityMeta(product.manageVisibility);
            return (
              <View key={product.id} style={styles.productCard}>
                <View style={[styles.productImageWrapper, { backgroundColor: `${color}12` }]}>
                  <CategoryIcon size={30} color={color} />
                </View>
                <View style={styles.productInfo}>
                  <View style={styles.productTopRow}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: visibility.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: visibility.color }]}>
                        {visibility.label}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.moreBtn} onPress={() => openActions(product)}>
                      <MoreVertical size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.categoryTagPill, { backgroundColor: `${color}15` }]}>
                    <Text style={[styles.categoryTagText, { color }]}>
                      {CATEGORY_LABELS[product.category]}
                    </Text>
                  </View>

                  <Text style={styles.productSubtitle} numberOfLines={1}>
                    {subtitleLine(product)}
                  </Text>

                  <View style={styles.productActionsRow}>
                    {/* Chưa có kho file học liệu thật phía sau nên "Tải xuống" là stub */}
                    <TouchableOpacity style={styles.productActionBtn} onPress={notImplemented}>
                      <Download size={13} color="#64748B" />
                      <Text style={styles.productActionBtnText}>Tải xuống</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.productActionBtn}
                      onPress={() => goToViewer(product.id)}
                    >
                      <Eye size={13} color="#64748B" />
                      <Text style={styles.productActionBtnText}>Xem</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View style={styles.bannerCard}>
          <View style={styles.bannerIconWrapper}>
            <Sparkles size={22} color="#2563EB" />
          </View>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>Thêm học liệu mới</Text>
            <Text style={styles.bannerSubtitle}>
              Đăng tải học liệu của bạn để chia sẻ với đồng nghiệp và học sinh!
            </Text>
            <TouchableOpacity style={styles.bannerBtn} onPress={notImplemented}>
              <Plus size={14} color="#fff" />
              <Text style={styles.bannerBtnText}>Thêm học liệu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HocLieuManageScreen;
