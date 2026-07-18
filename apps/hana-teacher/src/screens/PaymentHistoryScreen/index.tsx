import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import { ChevronLeft, Filter, Receipt } from 'lucide-react-native';

import { useSubscriptionInvoiceList } from '@tera/modules/system';

import { PER_PAGE, STATUS_LABELS, STATUS_META } from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) =>
  `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()} • ${hh}:${mi}`;
};

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const PaymentHistoryScreen = observer(() => {
  const router = useRouter();

  const { data: invoicesRes, isLoading } = useSubscriptionInvoiceList({
    params: { page: 1, per_page: PER_PAGE } as any,
  });

  const invoices: any[] =
    (invoicesRes as any)?.data?.items ?? (invoicesRes as any)?.data ?? [];

  const totalPaid = useMemo(
    () =>
      invoices
        .filter((item) => item?.status === 'paid')
        .reduce((sum, item) => sum + Number(item?.amount ?? 0), 0),
    [invoices],
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarIconBtn}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Lịch sử thanh toán</Text>
        {/* Chưa có màn hình bộ lọc riêng (theo trạng thái/khoảng ngày) */}
        <TouchableOpacity style={styles.topBarIconBtn} onPress={notImplemented}>
          <Filter size={18} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng đã thanh toán</Text>
          {isLoading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 8, alignSelf: 'flex-start' }} />
          ) : (
            <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loadingWrapper} color="#0066cc" />
        ) : invoices.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIconWrapper}>
              <Receipt size={28} color="#0066cc" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có giao dịch nào</Text>
            <Text style={styles.emptyDesc}>
              Lịch sử thanh toán và gia hạn gói sẽ hiển thị tại đây
            </Text>
          </View>
        ) : (
          invoices.map((item) => {
            const meta = STATUS_META[item?.status] ?? STATUS_META.pending;
            const StatusIcon = meta.icon;

            return (
              <View key={item?.id} style={styles.invoiceCard}>
                <View style={styles.invoiceTopRow}>
                  <View style={[styles.invoiceIcon, { backgroundColor: meta.bg }]}>
                    <StatusIcon size={18} color={meta.color} />
                  </View>
                  <View style={styles.invoiceInfo}>
                    <Text style={styles.invoicePackageName} numberOfLines={1}>
                      {item?.package_name || 'Gói dịch vụ'}
                      {item?.billing_cycle
                        ? ` • ${item.billing_cycle === 'year' ? '1 năm' : '1 tháng'}`
                        : ''}
                    </Text>
                    <Text style={styles.invoiceCode}>
                      Mã hóa đơn: {item?.code || '—'}
                    </Text>
                    <Text style={styles.invoiceDate}>
                      {formatDateTime(item?.paid_at)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: meta.color }]}>
                      {STATUS_LABELS[item?.status] || item?.status || 'Không rõ'}
                    </Text>
                  </View>
                </View>

                <View style={styles.invoiceDivider} />

                <View style={styles.invoiceBottomRow}>
                  <View style={styles.invoiceAmountWrapper}>
                    <Text style={styles.invoiceAmountLabel}>Số tiền</Text>
                    <Text style={styles.invoiceAmount}>
                      {formatCurrency(item?.amount)}
                    </Text>
                  </View>
                  <View style={styles.invoiceMethodWrapper}>
                    <Text style={styles.invoiceMethodLabel}>
                      Phương thức thanh toán
                    </Text>
                    <Text style={styles.invoiceMethodValue}>
                      {item?.payment_method || '—'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
});

export default PaymentHistoryScreen;
