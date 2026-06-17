import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
// --- 1. Dữ liệu giả định ---
interface BankLink {
  name: string;
  subName?: string;
  logoUrl: string; // Sử dụng placeholder hoặc require logo thực tế
  description?: string;
  status: 'Liên kết' | 'Đã liên kết';
  iconName?: string; // Dùng cho các icon đặc trưng (ví dụ: Icon Heart, Lock)
}

const CONNECTED_BANKS: BankLink[] = [
  {
    name: 'Vietcombank',
    logoUrl:
      'https://tailieuvanphong.com/wp-content/uploads/2024/08/logo-vietcombank-4.png',
    description: 'Ngân hàng TPCP Ngoại Thương',
    status: 'Liên kết',
  },
];

const NOTIFY_BANKS: BankLink[] = [
  {
    name: 'Vietcombank',
    subName: 'Ngân hàng TPCP Ngoại Thương',
    logoUrl:
      'https://tailieuvanphong.com/wp-content/uploads/2024/08/logo-vietcombank-4.png',
    status: 'Liên kết',
    iconName: 'heart-outline',
  },
  {
    name: 'BIDV',
    subName: 'Ngân hàng TMCP Đầu Tư và Phát Triển',
    logoUrl:
      'https://media.licdn.com/dms/image/v2/D560BAQHGuA4jTxqeKg/company-logo_200_200/B56ZaolN1KHgAM-/0/1746585050963/bidvbank_logo?e=2147483647&v=beta&t=NqU6URMETkQqcuk0FhpXxDMbixrvZjXybdq01sUsl5g',
    status: 'Liên kết',
    iconName: 'lock-outline',
  },
  {
    name: 'OCB',
    subName: 'Ngân hàng Phương Đông',
    logoUrl:
      'https://dcdesign.vn/image/data/DC%20Design/BAI%20VIET%20CHUYEN%20NGANH/Logo%20dep/logo-ngan-hang%206_resize.png',
    status: 'Liên kết',
    iconName: 'heart-outline',
  },
  {
    name: 'MBBank',
    subName: 'Ngân hàng Quân đội',
    logoUrl: 'https://ibrand.vn/wp-content/uploads/2024/07/mbbank-logo-5.png',
    status: 'Liên kết',
    iconName: 'heart-outline',
  },
];

// Hàm giả định để render logo ngân hàng (thay bằng Image thực tế)
const getBankLogo = (uri: string) => {
  return <Image source={{ uri }} style={styles.bankLogoPlaceholder} />;
};

// --- 2. Component Item Ngân hàng ---
const BankItem: React.FC<{ item: BankLink; isConnected?: boolean }> = ({
  item,
  isConnected = false,
}) => (
  <TouchableOpacity
    style={[styles.bankItem, isConnected && styles.connectedBankItem]}
    onPress={() => console.tron(`Chọn/Liên kết với ${item.name}`)}
  >
    <View style={styles.bankInfo}>
      {/* Thay thế bằng component Image thực tế */}
      {getBankLogo(item.logoUrl)}
      <View>
        <Text style={styles.bankName}>{item.name}</Text>
        {item.subName && (
          <Text style={styles.bankDescription}>{item.subName}</Text>
        )}
        {item.description && (
          <Text style={styles.bankDescription}>{item.description}</Text>
        )}
      </View>
    </View>

    {/* Actions/Status */}
    {isConnected ? (
      <Icon source="chevron-right" size={24} color="#9CA3AF" />
    ) : (
      <View style={styles.notifyStatus}>
        {item.iconName && (
          <View style={{ marginRight: 5 }}>
            <Icon source={item.iconName} size={16} color="#9CA3AF" />
          </View>
        )}
        <Text style={styles.linkText}>{item.status}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// --- 3. Màn hình chính ---
const PaymentMethodScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Phương thức thanh toán</Text>
          <TouchableOpacity onPress={() => console.tron('Settings')}>
            <Icon source="cog-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* BANNER QC (Hong Leong Bank) */}
          <Image
            style={styles.bannerContainer}
            source={{
              uri: 'https://media-vnpt.vnptvas.vn/Media/Images/26072021/lien-ket-vnpt-pay-voi-agribank.jpg',
            }}
          />

          {/* NGÂN HÀNG ĐÃ LIÊN KẾT (Hong Leong Bank) */}
          <View style={styles.section}>
            {CONNECTED_BANKS.map((bank, index) => (
              <BankItem key={index} item={bank} isConnected={true} />
            ))}
          </View>

          {/* NGÂN HÀNG THÔNG BÁO TIỀN VỀ */}
          <Text style={styles.sectionTitle}>NGÂN HÀNG THÔNG BÁO TIỀN VỀ</Text>
          <View style={styles.section}>
            {NOTIFY_BANKS.map((bank, index) => (
              <BankItem key={index} item={bank} isConnected={false} />
            ))}
          </View>

          {/* NGÂN HÀNG KHÁC */}
          <Text style={styles.sectionTitle}>NGÂN HÀNG KHÁC</Text>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.addMethodButton}
              onPress={() => console.tron('Thêm ngân hàng/Ví điện tử')}
            >
              <Icon source="plus-circle-outline" size={24} color="#3B82F6" />
              <Text style={styles.addMethodText}>
                Thêm ngân hàng / Ví điện tử
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PaymentMethodScreen;
