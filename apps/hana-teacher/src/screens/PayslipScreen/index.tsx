import {
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {
  BadgeCheck,
  Banknote,
  Calendar,
  ChevronLeft,
  Download,
  Info,
  Receipt,
  Share2,
  Wallet as WalletIcon,
} from 'lucide-react-native';

import { SEED_PAYSLIP, STATS } from './constants';
import { styles } from './style';

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const notImplemented = () =>
  Toast.show({ type: 'info', text1: 'Tính năng đang được phát triển' });

const PayslipScreen = observer(() => {
  const router = useRouter();
  const payslip = SEED_PAYSLIP;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Phiếu lương kỳ ${payslip.period} - ${payslip.employeeName}\nThực lĩnh: ${formatCurrency(payslip.netPay)}\nNgày thanh toán: ${payslip.paymentDate}`,
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
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.back()}
            >
              <ChevronLeft size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Phiếu lương</Text>
            {/* Chưa có API xuất file phiếu lương */}
            <TouchableOpacity style={styles.headerLinkBtn} onPress={notImplemented}>
              <Download size={14} color="#fff" />
              <Text style={styles.headerLinkText}>Tải phiếu lương</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.employeeCard}>
          <View style={styles.employeeLeft}>
            <Image
              source={require('@tera/assets/app/element_3.png')}
              style={styles.avatar}
            />
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{payslip.employeeName}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{payslip.role}</Text>
              </View>
              <Text style={styles.employeeMeta}>
                Mã nhân viên: {payslip.employeeCode}
              </Text>
              <Text style={styles.employeeMeta}>
                Phòng: {payslip.department}
              </Text>
            </View>
          </View>

          <View style={styles.periodDivider} />

          <View style={styles.periodBlock}>
            <View style={styles.periodLabelRow}>
              <Calendar size={13} color="#64748B" />
              <Text style={styles.periodLabel}>Kỳ lương</Text>
            </View>
            <Text style={styles.periodValue}>{payslip.period}</Text>
            <Text style={styles.periodRange}>{payslip.periodRange}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryCol}>
            <View style={styles.summaryLabelRow}>
              <View style={styles.summaryIconWrapper}>
                <WalletIcon size={14} color="#fff" />
              </View>
              <Text style={styles.summaryLabel}>TỔNG THU NHẬP</Text>
            </View>
            <Text style={styles.summaryValue}>
              {formatCurrency(payslip.totalIncome)}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryCol}>
            <View style={styles.summaryLabelRow}>
              <View style={styles.summaryIconWrapper}>
                <Banknote size={14} color="#fff" />
              </View>
              <Text style={styles.summaryLabel}>THỰC LĨNH</Text>
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(payslip.netPay)}</Text>
            <Text style={styles.summaryHint}>
              Ngày thanh toán: {payslip.paymentDate}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((stat) => {
            const StatIcon = stat.icon;
            const value = (payslip as any)[stat.valueKey];
            const displayValue =
              typeof value === 'number' ? formatCurrency(value) : value;
            const isWorkdays = stat.id === 'workdays';
            return (
              <TouchableOpacity
                key={stat.id}
                style={styles.statCard}
                activeOpacity={isWorkdays ? 0.6 : 1}
                onPress={
                  isWorkdays ? () => router.push('/setting/timesheet') : undefined
                }
              >
                <View style={[styles.statIconWrapper, { backgroundColor: stat.color }]}>
                  <StatIcon size={16} color="#fff" />
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {displayValue}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleIcon}>
              <WalletIcon size={14} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>CHI TIẾT THU NHẬP</Text>
          </View>

          {payslip.incomeItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemValue}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}

          <View style={styles.itemDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TỔNG THU NHẬP</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(payslip.totalIncome)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleIcon}>
              <Receipt size={14} color="#0066cc" />
            </View>
            <Text style={styles.sectionTitle}>CHI TIẾT KHẤU TRỪ</Text>
          </View>

          {payslip.deductionItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemValue}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}

          <View style={styles.itemDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TỔNG KHẤU TRỪ</Text>
            <Text style={[styles.totalValue, styles.totalValueDanger]}>
              {formatCurrency(payslip.totalDeduction)}
            </Text>
          </View>
        </View>

        <View style={styles.netPayBanner}>
          <View style={styles.netPayIconWrapper}>
            <Banknote size={22} color="#0066cc" />
          </View>
          <View style={styles.netPayInfo}>
            <Text style={styles.netPayLabel}>THỰC LĨNH</Text>
            <Text style={styles.netPayValue}>{formatCurrency(payslip.netPay)}</Text>
            <Text style={styles.netPayWords}>
              (Bằng chữ: {payslip.netPayInWords})
            </Text>
          </View>

          {payslip.status === 'approved' && (
            <View style={styles.stampWrapper}>
              <BadgeCheck size={14} color="#2563EB" />
              <Text style={styles.stampTextMain}>HANA EDU</Text>
              <Text style={styles.stampText}>ĐÃ DUYỆT</Text>
            </View>
          )}
        </View>

        {!!payslip.note && (
          <View style={styles.noteBanner}>
            <Info size={16} color="#0066cc" />
            <Text style={styles.noteText}>
              <Text style={styles.noteTextTitle}>Ghi chú{'\n'}</Text>
              {payslip.note}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Share2 size={18} color="#fff" />
          <Text style={styles.shareBtnText}>Chia sẻ phiếu lương</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
});

export default PayslipScreen;
