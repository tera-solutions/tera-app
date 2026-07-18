import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  ArrowDownUp,
  Bell,
  Ban,
  CheckCircle2,
  ChevronLeft,
  Filter,
  MapPin,
  MoreVertical,
  Package,
  Search,
} from 'lucide-react-native';

import { CATEGORY_COLORS, CATEGORY_ICONS } from '@screens/HocLieuScreen/constants';

import {
  FILTER_TABS,
  OrderStatus,
  PAYMENT_LABELS,
  SEED_ORDERS,
  SeedOrder,
  STAT_TILES,
  STATUS_LABELS,
  STATUS_META,
} from './constants';
import { styles } from './style';

const AVATAR_COLORS = ['#2563EB', '#16A34A', '#F97316', '#8B5CF6', '#DB2777', '#0891B2'];

const colorFor = (id: string) => {
  const sum = String(id)
    .split('')
    .reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const initialsOf = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 1]?.[0] ?? '?').toUpperCase();
};

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()} ${hh}:${mi}`;
};

const formatShortTime = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${mi}`;
};

const orderTotal = (order: SeedOrder) =>
  order.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const HocLieuOrderScreen = observer(() => {
  const router = useRouter();

  const [orders, setOrders] = useState<SeedOrder[]>(SEED_ORDERS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [sortDesc, setSortDesc] = useState(true);

  const keyword = search.trim().toLowerCase();

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (activeTab !== 'all' && o.status !== activeTab) return false;
        if (!keyword) return true;
        return (
          o.code.toLowerCase().includes(keyword) ||
          o.customerName.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => {
        const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortDesc ? -diff : diff;
      });
  }, [orders, activeTab, keyword, sortDesc]);

  const handleConfirm = (order: SeedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'processing' } : o)),
    );
    Toast.show({ type: 'success', text1: `Đã xác nhận đơn ${order.code}` });
  };

  const handleCancel = (order: SeedOrder) => {
    Alert.alert('Huỷ đơn hàng?', `Bạn có chắc muốn huỷ đơn ${order.code}?`, [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Huỷ đơn',
        style: 'destructive',
        onPress: () => {
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, status: 'cancelled' } : o)),
          );
          Toast.show({ type: 'info', text1: `Đã huỷ đơn ${order.code}` });
        },
      },
    ]);
  };

  const handlePack = (order: SeedOrder) => {
    const now = new Date();
    const created = new Date(order.createdAt);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: 'shipping',
              trackingSteps: [
                { label: 'Đã xác nhận', time: formatShortTime(created), done: true },
                { label: 'Đang xử lý', time: formatShortTime(created), done: true },
                { label: 'Đang giao', time: formatShortTime(now), done: true },
                { label: 'Giao thành công', time: null, done: false },
              ],
            }
          : o,
      ),
    );
    Toast.show({ type: 'success', text1: `Đơn ${order.code} đang được giao` });
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
            <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
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
              {/* Chưa có màn hình bộ lọc nâng cao riêng */}
              <TouchableOpacity style={styles.headerFilterBtn} onPress={notImplemented}>
                <Filter size={16} color="#fff" />
                <Text style={styles.headerFilterText}>Bộ lọc</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          {STAT_TILES.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <TouchableOpacity
                key={stat.id}
                style={styles.statItem}
                onPress={() => setActiveTab(stat.id)}
              >
                <View style={[styles.statIconWrapper, { backgroundColor: stat.color }]}>
                  <StatIcon size={16} color="#fff" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.toolbarRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm theo mã đơn, khách hàng..."
              placeholderTextColor="#a7a7a7"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setSortDesc((prev) => !prev)}>
            <ArrowDownUp size={14} color="#0066cc" />
            <Text style={styles.sortBtnText}>Sắp xếp</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {FILTER_TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredOrders.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Không tìm thấy đơn hàng phù hợp</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const meta = STATUS_META[order.status];
            const total = orderTotal(order);
            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeaderRow}>
                  <Text style={styles.orderCode}>{order.code}</Text>
                  <View style={[styles.orderStatusBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.orderStatusText, { color: meta.color }]}>
                      {STATUS_LABELS[order.status]}
                    </Text>
                  </View>
                  <Text style={styles.orderDate}>{formatDateTime(order.createdAt)}</Text>
                  <TouchableOpacity style={styles.moreBtn} onPress={notImplemented}>
                    <MoreVertical size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.customerRow}>
                  <View
                    style={[styles.avatarCircle, { backgroundColor: colorFor(order.id) }]}
                  >
                    <Text style={styles.avatarText}>{initialsOf(order.customerName)}</Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                    <Text style={styles.customerPhone}>{order.customerPhone}</Text>
                    <View style={styles.customerAddressRow}>
                      <MapPin size={11} color="#94A3B8" />
                      <Text style={styles.customerAddress} numberOfLines={1}>
                        {order.customerAddress}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderMetaCol}>
                    <Text style={styles.itemCountText}>{order.items.length} sản phẩm</Text>
                    <Text style={styles.orderTotal}>{formatCurrency(total)}</Text>
                    <View style={styles.paymentBadge}>
                      <Text style={styles.paymentBadgeText}>
                        {PAYMENT_LABELS[order.paymentMethod]}
                      </Text>
                    </View>
                  </View>
                </View>

                {order.status === 'shipping' && order.trackingSteps ? (
                  <View style={styles.trackingRow}>
                    {order.trackingSteps.map((step, index) => (
                      <View key={step.label} style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={styles.trackingStepCol}>
                          <View
                            style={[
                              styles.trackingDot,
                              { backgroundColor: step.done ? '#2563EB' : '#E2E8F0' },
                            ]}
                          >
                            {step.done ? (
                              <CheckCircle2 size={14} color="#fff" />
                            ) : (
                              <Package size={13} color="#94A3B8" />
                            )}
                          </View>
                          <Text style={styles.trackingLabel}>{step.label}</Text>
                          <Text style={styles.trackingTime}>{step.time ?? '--/-- --:--'}</Text>
                        </View>
                        {index < order.trackingSteps!.length - 1 && (
                          <View
                            style={[
                              styles.trackingLine,
                              { borderTopColor: step.done ? '#2563EB' : '#E2E8F0' },
                            ]}
                          />
                        )}
                      </View>
                    ))}
                  </View>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.itemsRow}
                  >
                    {order.items.map((item, index) => {
                      const ItemIcon = CATEGORY_ICONS[item.category];
                      const color = CATEGORY_COLORS[item.category];
                      return (
                        <View key={`${item.name}-${index}`} style={styles.itemThumb}>
                          <View
                            style={[
                              styles.itemThumbIconWrapper,
                              { backgroundColor: `${color}15` },
                            ]}
                          >
                            <ItemIcon size={16} color={color} />
                          </View>
                          <View style={styles.itemThumbInfo}>
                            <Text style={styles.itemThumbName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.itemThumbSubtitle} numberOfLines={1}>
                              {item.subtitle} x{item.qty}
                            </Text>
                            <Text style={styles.itemThumbPrice}>
                              {formatCurrency(item.unitPrice)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}

                {order.status === 'pending' && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnOutline]}
                      onPress={notImplemented}
                    >
                      <Text style={[styles.actionBtnText, { color: '#0066cc' }]}>
                        Xem chi tiết
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnDanger]}
                      onPress={() => handleCancel(order)}
                    >
                      <Ban size={14} color="#DC2626" />
                      <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Huỷ đơn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnPrimary]}
                      onPress={() => handleConfirm(order)}
                    >
                      <CheckCircle2 size={14} color="#fff" />
                      <Text style={[styles.actionBtnText, { color: '#fff' }]}>Xác nhận đơn</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {order.status === 'processing' && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnOutline]}
                      onPress={notImplemented}
                    >
                      <Text style={[styles.actionBtnText, { color: '#0066cc' }]}>
                        Xem chi tiết
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnOutline]}
                      onPress={() => handlePack(order)}
                    >
                      <Package size={14} color="#0066cc" />
                      <Text style={[styles.actionBtnText, { color: '#0066cc' }]}>
                        Đóng gói hàng
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {(order.status === 'shipping' ||
                  order.status === 'completed' ||
                  order.status === 'cancelled') && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnOutline]}
                      onPress={notImplemented}
                    >
                      <Text style={[styles.actionBtnText, { color: '#0066cc' }]}>
                        Xem chi tiết
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
});

export default HocLieuOrderScreen;
