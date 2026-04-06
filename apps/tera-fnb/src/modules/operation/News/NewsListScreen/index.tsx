import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Dữ liệu giả định ---
interface Notification {
  id: string;
  name: string;
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
    name: 'Tera Admin - Hệ thống',
    content: '🎁 Nhận quà đến 3 Triệu đồng, khi Mở TK...',
    date: '02-12-2025',
    iconName: 'account',
    iconColor: '#10B981',
    isRead: true,
  },
  {
    id: '2',
    name: 'Ngọc - Thu ngân',
    content: 'Đơn hàng đã được duyệt rồi mà anh.',
    date: '02-11-2025',
    iconName: 'account',
    iconColor: '#a70082ff',
    isRead: true,
  },
  {
    id: '3',
    name: 'Phước - Shipper',
    content: 'Đơn hàng IC12 đã giao thành công',
    date: '02-11-2025',
    iconName: 'account',
    iconColor: '#003aa7ff',
    isRead: false,
  },
  {
    id: '4',
    name: 'Hoàng - Thủ kho',
    content: 'Đơn hàng IC12 đã trả lại',
    date: '02-11-2025',
    iconName: 'account',
    iconColor: '#008ea7ff',
    isRead: false,
  },
  {
    id: '5',
    name: 'Chị Hoa - Khách hàng',
    content: 'Em ơi sao đơn chị chưa giao vậy',
    date: '02-11-2025',
    iconName: 'account',
    iconColor: '#197585ff',
    isRead: false,
  },
    {
    id: '6',
    name: 'Anh Tùng - Khách hàng',
    content: 'Kiểm tra đơn IC21454 hộ anh',
    date: '02-11-2025',
    iconName: 'account',
    iconColor: '#197585ff',
    isRead: true,
  },
];

const TAB_OPTIONS = ['Tất cả', 'Chưa đọc'];

// --- Component Icon Phân loại ---
interface CategoryIconProps {
  name: string;
  icon: string;
  color: string; // Màu icon
  bgColor: string; // Màu nền icon
  badge: number;
}

// --- Component Item Thông báo ---
const NotificationItem: React.FC<{ item: Notification }> = ({ item }) => (
  <TouchableOpacity
    style={[
      styles.itemContainer,
      { backgroundColor: item.isRead ? '#FFFFFF' : '#f0f6fcff' },
    ]}
  >
    <View style={[styles.itemIconWrapper]}>
      {/* Sử dụng Icon tạm thay cho icon hình ảnh */}
      <Icon
        source={item.iconName}
        size={24}
        color={item.iconColor}
      />
    </View>
    <View style={styles.itemContent}>
      <Text style={[styles.itemType, { color: item.iconColor }]}>
        {item.name}
      </Text>
      <Text style={styles.itemText} numberOfLines={2}>
        {item.content}
      </Text>
    </View>
    <View style={styles.itemDateContainer}>
      <Text style={styles.itemDate}>{item.date}</Text>
      {!item.isRead && <View style={styles.unreadDot} />}
    </View>
  </TouchableOpacity>
);

// --- Màn hình chính ChatListScreen ---
const ChatListScreen: React.FC = () => {
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
          <Text style={styles.titleText}>Hội thoại</Text>
          <View style={{ width: 24 }} />
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
            onPress={() => router.push("/operation/chat")}
          >
            <Icon source="pencil" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ChatListScreen;
