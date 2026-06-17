import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Dữ liệu giả định ---
// --- Dữ liệu giả định ---
interface Notification {
  id: string;
  type: 'Thông báo' | 'Đơn hàng' | 'Số Bán Hàng';
  content: string;
  date: string;
  iconName: string;
  iconColor: string;
  isRead: boolean;
  hasNewBadge?: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'Thông báo',
    content: 'Gói dùng sắp hết hạn, nhận ưu đãi dài n...',
    date: '15 giờ trước',
    iconName: 'bell-ring-outline',
    iconColor: '#A78BFA',
    isRead: false,
    hasNewBadge: true,
  },
  {
    id: '2',
    type: 'Đơn hàng',
    content: 'Bạn đã giao đơn SCDQST - 253.000 đ cho...',
    date: '07-12-2025',
    iconName: 'clipboard-text-outline',
    iconColor: '#FBBF24',
    isRead: false,
    hasNewBadge: true,
  },
  {
    id: '3',
    type: 'Số Bán Hàng',
    content: '🎁 Nhận quà đến 3 Triệu đồng, khi Mở TK...',
    date: '02-12-2025',
    iconName: 'sobanhang',
    iconColor: '#10B981',
    isRead: true,
  },
  {
    id: '4',
    type: 'Thông báo',
    content: 'Cập nhật phiên bản mới: Thêm tính năng...',
    date: '01-12-2025',
    iconName: 'bell-ring-outline',
    iconColor: '#A78BFA',
    isRead: true,
  },
  {
    id: '5',
    type: 'Đơn hàng',
    content: 'Đơn hàng #DH1234 đã được khách hàng xác nhận.',
    date: '30-11-2025',
    iconName: 'clipboard-text-outline',
    iconColor: '#FBBF24',
    isRead: true,
  },
];

const TAB_OPTIONS = ['Tất cả', 'Chưa đọc'];
const CATEGORY_ICONS = [
  {
    name: 'Hỗ trợ',
    icon: 'face-agent',
    color: '#10B981',
    bgColor: '#DCFCE7',
    badge: 0,
  }, // Xanh lá cây
  {
    name: 'Trợ lý',
    icon: 'robot-outline',
    color: '#60A5FA',
    bgColor: '#DBEAFE',
    badge: 0,
  }, // Xanh dương
  {
    name: 'Thông báo',
    icon: 'bell-ring-outline',
    color: '#A78BFA',
    bgColor: '#EDE9FE',
    badge: 1,
  }, // Tím
  {
    name: 'Đơn hàng',
    icon: 'clipboard-text-outline',
    color: '#FBBF24',
    bgColor: '#FFFBEB',
    badge: 1,
  }, // Vàng cam
  {
    name: 'Tài chính',
    icon: 'currency-usd',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    badge: 0,
  }, // Đỏ
];

// --- Component Icon Phân loại ---
interface CategoryIconProps {
  name: string;
  icon: string;
  color: string; // Màu icon
  bgColor: string; // Màu nền icon
  badge: number;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  icon,
  color,
  bgColor,
  badge,
}) => (
  <TouchableOpacity style={styles.categoryIcon}>
    {badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
    {/* Cập nhật: Thêm màu nền và màu icon */}
    <View style={[styles.categoryIconCircle, { backgroundColor: bgColor }]}>
      {/* Sử dụng Icon tạm thay cho icon hình ảnh */}
      <Icon source={icon} size={28} color={color} />
    </View>
    <Text style={styles.categoryText}>{name}</Text>
  </TouchableOpacity>
);

// --- Component Item Thông báo ---
const NotificationItem: React.FC<{ item: Notification }> = ({ item }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <View
      style={[
        styles.itemIconWrapper,
        { backgroundColor: item.isRead ? '#F3F4F6' : item.iconColor + '20' },
      ]}
    >
      {/* Sử dụng Icon tạm thay cho icon hình ảnh */}
      <Icon
        source={item.iconName === 'sobanhang' ? 'gift-outline' : item.iconName}
        size={24}
        color={item.iconColor}
      />
    </View>
    <View style={styles.itemContent}>
      <Text style={[styles.itemType, { color: item.iconColor }]}>
        {item.type}
      </Text>
      <Text style={styles.itemText} numberOfLines={2}>
        {item.content}
      </Text>
      {item.type === 'Số Bán Hàng' && (
        <Text style={styles.itemSource}>SoBanHang</Text>
      )}
    </View>
    <View style={styles.itemDateContainer}>
      <Text style={styles.itemDate}>{item.date}</Text>
      {!item.isRead && <View style={styles.unreadDot} />}
    </View>
  </TouchableOpacity>
);

// --- Màn hình chính NotificationScreen ---
const NotificationScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Tất cả');

  // Logic lọc (đơn giản)
  const filteredNotifications =
    activeTab === 'Chưa đọc'
      ? MOCK_NOTIFICATIONS.filter((n) => !n.isRead)
      : MOCK_NOTIFICATIONS;

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Hộp thư</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* 1. CATEGORY ICONS */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORY_ICONS.map((cat) => (
              <CategoryIcon key={cat.name} {...cat} />
            ))}
          </ScrollView>
        </View>
        <View style={styles.container}>
          {/* 2. TABS LỌC & ACTIONS */}
          <View style={styles.tabRow}>
            <View style={styles.tabOptions}>
              {TAB_OPTIONS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    activeTab === tab && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab} (
                    {tab === 'Chưa đọc'
                      ? MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length
                      : MOCK_NOTIFICATIONS.length}
                    )
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => console.tron('Đọc tất cả')}>
              <Text style={styles.markAllRead}>✓ Đọc tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* 3. DANH SÁCH THÔNG BÁO */}
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationItem item={item} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          {/* FLOATING ACTION BUTTON (Giả định) */}
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => console.tron('Soạn tin nhắn')}
          >
            <Icon source="pencil" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NotificationScreen;
