import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Dữ liệu giả định các đơn vị liên kết ---
interface EInvoicePartner {
  id: string;
  name: string;
  logoUrl: string; // Trong thực tế là path/URI của logo
  onPress: () => void;
}

// --- Component Item Đơn vị Liên kết ---
const PartnerItem: React.FC<{ partner: EInvoicePartner }> = ({ partner }) => (
  <TouchableOpacity style={styles.partnerContainer} onPress={partner.onPress}>
    {/* Placeholder cho Logo */}
    <View style={styles.logoPlaceholder}>
      <Text style={styles.logoText}>{partner.name.charAt(0)}</Text>
    </View>
    <Text style={styles.partnerName}>{partner.name}</Text>
  </TouchableOpacity>
);

// --- Màn hình chính EInvoiceScreen ---
const EInvoiceScreen: React.FC = () => {
  const router = useRouter();

  const handleConnect = (partnerName: string) => {
    console.tron(`[Action] Đang kết nối với: ${partnerName}`);
    // Giả lập logic chuyển sang màn hình nhập API/Key của đối tác
    // router.push('PartnerConnectDetail', { partner: partnerName });
  };

  const handleSupportContact = () => {
    console.tron('[Action] Liên hệ hỗ trợ tư vấn');
    // Giả lập mở đường link hoặc số điện thoại hỗ trợ
  };

  const E_INVOICE_PARTNERS: EInvoicePartner[] = [
    {
      id: '1',
      name: 'VNPT Invoice',
      logoUrl: 'vnpt.png',
      onPress: () => handleConnect('VNPT Invoice'),
    },
    {
      id: '2',
      name: 'FPT eInvoice',
      logoUrl: 'fpt.png',
      onPress: () => handleConnect('FPT eInvoice'),
    },
    {
      id: '3',
      name: 'M-Invoice',
      logoUrl: 'm-invoice.png',
      onPress: () => handleConnect('M-Invoice'),
    },
    {
      id: '4',
      name: 'Hilo Invoice',
      logoUrl: 'hilo.png',
      onPress: () => handleConnect('Hilo Invoice'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TIÊU ĐỀ CHÍNH */}
        <Text style={styles.mainTitle}>Chọn đơn vị liên kết</Text>

        {/* DANH SÁCH ĐƠN VỊ */}
        {E_INVOICE_PARTNERS.map((partner) => (
          <PartnerItem key={partner.id} partner={partner} />
        ))}

        {/* HỖ TRỢ */}
        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>Bạn cần tư vấn?</Text>
          <TouchableOpacity onPress={handleSupportContact}>
            <Text style={styles.supportLink}>Liên hệ hỗ trợ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EInvoiceScreen;
