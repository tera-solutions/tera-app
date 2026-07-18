import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  Calendar,
  ChevronLeft,
  Download,
  FileText,
  Filter,
  Headphones,
  HelpCircle,
  Search,
  ShieldCheck,
} from 'lucide-react-native';

import { useSubscriptionInvoiceList } from '@tera/modules/system';

import { PER_PAGE, STATUS_LABELS, STATUS_META, STAT_TABS } from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mi}`;
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
};

const getMonthLabel = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return 'Khác';
  return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const InvoiceReceiptScreen = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const { data: invoicesRes, isLoading } = useSubscriptionInvoiceList({
    params: { page: 1, per_page: PER_PAGE } as any,
  });

  const allInvoices: any[] =
    (invoicesRes as any)?.data?.items ?? (invoicesRes as any)?.data ?? [];

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: allInvoices.length };
    STAT_TABS.forEach((tab) => {
      if (!tab.status) return;
      map[tab.id] = allInvoices.filter(
        (item) => item?.status === tab.status,
      ).length;
    });
    return map;
  }, [allInvoices]);

  const filteredInvoices = useMemo(() => {
    const activeStatus = STAT_TABS.find((tab) => tab.id === activeTab)?.status;
    const keyword = search.trim().toLowerCase();
    return allInvoices.filter((item) => {
      if (activeStatus && item?.status !== activeStatus) return false;
      if (!keyword) return true;
      const haystack = `${item?.package_name ?? ''} ${item?.code ?? ''}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [allInvoices, activeTab, search]);

  const groups = useMemo(() => {
    const map = new Map<string, any[]>();
    filteredInvoices.forEach((item) => {
      const label = getMonthLabel(item?.paid_at || item?.created_at);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(item);
    });
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [filteredInvoices]);

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
          <Text style={styles.headerTitle}>Hóa đơn & Biên lai</Text>
          {/* Chưa có màn hình trợ giúp riêng */}
          <TouchableOpacity style={styles.headerIconBtn} onPress={notImplemented}>
            <HelpCircle size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Quản lý hóa đơn, biên lai một cách dễ dàng
          </Text>
          <Text style={styles.heroDesc}>
            Tải về, xem lại và quản lý tất cả hóa đơn, biên lai thanh toán của
            bạn.
          </Text>

          <FileText
            size={64}
            color="rgba(255,255,255,0.25)"
            style={styles.heroDecorIcon}
          />
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsCard}>
          {STAT_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.statItem}
                onPress={() => setActiveTab(tab.id)}
              >
                <View style={[styles.statIcon, { backgroundColor: tab.color }]}>
                  <TabIcon size={16} color="#fff" />
                </View>
                <Text
                  style={[styles.statLabel, active && styles.statLabelActive]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                <Text style={styles.statValue}>{counts[tab.id] ?? 0}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.toolbarRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm hóa đơn..."
              placeholderTextColor="#a7a7a7"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {/* Chưa có màn hình bộ lọc nâng cao riêng */}
          <TouchableOpacity style={styles.filterBtn} onPress={notImplemented}>
            <Filter size={14} color="#0066cc" />
            <Text style={styles.filterBtnText}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : groups.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIconWrapper}>
              <FileText size={28} color="#0066cc" />
            </View>
            <Text style={styles.emptyTitle}>Không có hóa đơn nào</Text>
            <Text style={styles.emptyDesc}>
              Hóa đơn và biên lai của bạn sẽ hiển thị tại đây
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.label}>
              <Text style={styles.monthTitle}>{group.label}</Text>
              {group.items.map((item) => {
                const meta = STATUS_META[item?.status] ?? STATUS_META.pending;
                return (
                  <View key={item?.id} style={styles.invoiceCard}>
                    <View style={styles.invoiceIcon}>
                      <FileText size={18} color="#0066cc" />
                    </View>
                    <View style={styles.invoiceInfo}>
                      <Text style={styles.invoiceTitle} numberOfLines={1}>
                        {item?.package_name || 'Gói dịch vụ'} -{' '}
                        {item?.billing_cycle === 'year' ? '1 năm' : '1 tháng'}
                      </Text>
                      <Text style={styles.invoiceCode} numberOfLines={1}>
                        Hóa đơn: #{item?.code || '—'}
                      </Text>
                      <View style={styles.invoiceDateRow}>
                        <Calendar size={11} color="#64748B" />
                        <Text style={styles.invoiceDate}>
                          {formatDate(item?.paid_at)} • {formatTime(item?.paid_at)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.invoiceRightCol}>
                      <Text style={[styles.invoiceStatus, { color: meta.color }]}>
                        {STATUS_LABELS[item?.status] || item?.status || 'Không rõ'}
                      </Text>
                      <Text style={styles.invoiceAmount}>
                        {formatCurrency(item?.amount)}
                      </Text>
                      {/* Chưa có API tải hóa đơn/biên lai dạng file */}
                      <TouchableOpacity
                        style={styles.downloadBtn}
                        onPress={notImplemented}
                      >
                        <Download size={15} color="#0066cc" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}

        <View style={styles.supportBanner}>
          <View style={styles.supportIconWrapper}>
            <ShieldCheck size={18} color="#0066cc" />
          </View>
          <View style={styles.supportTextWrapper}>
            <Text style={styles.supportTitle}>Cần hỗ trợ?</Text>
            <Text style={styles.supportDesc}>
              Nếu bạn cần hóa đơn cho giao dịch cũ hơn hoặc có bất kỳ thắc mắc
              nào, vui lòng liên hệ với bộ phận hỗ trợ.
            </Text>
            <TouchableOpacity style={styles.supportBtn} onPress={notImplemented}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  justifyContent: 'center',
                }}
              >
                <Headphones size={14} color="#0066cc" />
                <Text style={styles.supportBtnText}>Liên hệ hỗ trợ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export default InvoiceReceiptScreen;
