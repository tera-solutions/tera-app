import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Customer } from '../_interface';
import { styles } from './styles';

// --- 1. Dữ liệu giả định ---
const MOCK_CUSTOMER_INFO = {
  customerCode: 'CUSN00005',
  name: 'Chị Cẩm Nhung',
  phone: '0986190164',
  email: 'demo@gmail.com',
  group: 'Bán lẻ',
  dob: '15/06/1993',
  gender: 'Nữ',
  taxCode: '035251415411',
  discount: '0%',
  defaultPrice: '---', // Giá mặc định
  staff: 'Quốc Trường', // Nhân viên phụ trách
  status: 'Đang giao dịch',
};

// --- 2. Component Render Item Thông tin ---
const InfoItem: React.FC<{
  label: string;
  value?: string;
  isInteractive?: boolean;
  onPress?: () => void;
}> = ({ label, value, isInteractive = false, onPress }) => (
  <TouchableOpacity
    style={styles.infoItem}
    disabled={!isInteractive && !onPress}
    onPress={onPress}
  >
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoValueContainer}>
      <Text style={styles.infoValue}>{value}</Text>
      {isInteractive && (
        <Icon source="chevron-right" size={20} color="#9CA3AF" />
      )}
    </View>
  </TouchableOpacity>
);

// --- 3. Component Tab Thông tin ---
export const InformationTab: React.FC<{ dataDetail: Customer }> = ({
  dataDetail,
}) => {
  // Giả lập trạng thái của khách hàng (Đang giao dịch/Tạm dừng)
  const [isTrading, setIsTrading] = useState(
    MOCK_CUSTOMER_INFO.status === 'Đang giao dịch',
  );

  return (
    <ScrollView style={styles.scrollContent}>
      {/* THÔNG TIN CHUNG */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Thông tin</Text>
        <InfoItem label="Nhóm" value={dataDetail.object_text?.title} />
        {dataDetail?.object === 'crm_customer-object_individual' && (
          <>
            <InfoItem
              label="Tên khách hàng"
              value={dataDetail?.business_name}
            />
            <InfoItem label="Ngày sinh" value={dataDetail?.birthday} />
            <InfoItem label="Giới tính" value={dataDetail.sex} />
            <InfoItem label="Mã số thuế" value={dataDetail.tax} />
          </>
        )}

        {dataDetail?.object === 'crm_customer-object_company' && (
          <>
            <InfoItem
              label="Tên doanh nghiệp"
              value={dataDetail?.business_name}
            />
            <InfoItem label="Tên nước ngoài" value={dataDetail?.foreign_name} />
            <InfoItem label="Ngày thành lập" value={dataDetail.founding} />
            <InfoItem
              label="Quy mô công ty"
              value={dataDetail.company_size_text}
            />
            <InfoItem label="Mã số thuế" value={dataDetail.tax} />
          </>
        )}

        <InfoItem
          label="Nhân viên phụ trách"
          value={dataDetail.staff?.full_name}
        />
      </View>

      {/* ĐỊA CHỈ, LIÊN HỆ, GHI CHÚ */}
      <View style={styles.section}>
        <InfoItem
          label="Số địa chỉ"
          value={dataDetail?.address || '--'}
          isInteractive
          onPress={() => console.tron('Quản lý địa chỉ')}
        />
        <InfoItem
          label="Số liên hệ"
          value={dataDetail?.phone || '--'}
          isInteractive
          onPress={() => console.tron('Quản lý liên hệ')}
        />
        <InfoItem
          label="Ghi chú"
          value={dataDetail?.note || '--'}
          isInteractive
          onPress={() => console.tron('Thêm/Sửa Ghi chú')}
        />
      </View>

      {/* TRẠNG THÁI */}
      <View style={[styles.section, styles.statusSection]}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusIndicator,
              isTrading ? styles.statusActive : styles.statusInactive,
            ]}
          />
          <Text style={styles.statusText}>{MOCK_CUSTOMER_INFO.status}</Text>
        </View>
      </View>

      {/* NÚT XÓA */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => console.tron('Xóa khách hàng')}
      >
        <Text style={styles.deleteButtonText}>Xoá khách hàng</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default InformationTab;
