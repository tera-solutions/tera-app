import React, { useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Dữ liệu giả định nội dung chi tiết ---
const NEWS_DETAILS = [
  {
    title: '1. Chi tiết chương trình',
    sections: [
      {
        subTitle: '1.1 Ưu đãi dành cho toàn bộ khách hàng',
        content:
          'Chương trình 1: Giảm đến 50k khi tạo đơn qua Ahamove trên Tera',
        details: [
          {
            label: 'Chi tiết',
            value: 'Giảm 10% tối đa 50K cho toàn bộ dịch vụ xe máy',
          },
          { label: 'Mã', value: 'TERA10' },
          { label: 'Áp dụng', value: 'Tất cả gói dịch vụ hỗ trợ' },
          { label: 'Thời gian', value: '1/12/2025 - 31/12/2025' },
        ],
      },
      {
        subTitle: 'Chương trình 2: Ưu đãi đồng giá dịch vụ InDay',
        content: 'Chi tiết: Đồng giá 20K x 100 đơn đầu tiên dịch vụ InDay',
        details: [
          { label: 'Mã', value: 'TERA20' },
          { label: 'Thời gian', value: 'Từ ngày 2/12/2025 - 31/12/2025' },
        ],
      },
      {
        subTitle: 'Chương trình 3: Giảm 15% Tối đa 20K',
        content:
          'Chi tiết: Giảm 15% tối đa 20K cho 10 đơn dịch vụ 4h (Sameday)',
        details: [
          { label: 'Mã', value: 'TERA30' },
          { label: 'Thời gian', value: 'Từ ngày 2/12/2025 - 31/12/2025' },
        ],
      },
      {
        subTitle: 'Chương trình 2: Ưu đãi đồng giá dịch vụ InDay',
        content: 'Chi tiết: Đồng giá 20K x 100 đơn đầu tiên dịch vụ InDay',
        details: [
          { label: 'Mã', value: 'TERA20' },
          { label: 'Thời gian', value: 'Từ ngày 2/12/2025 - 31/12/2025' },
        ],
      },
      {
        subTitle: 'Chương trình 3: Giảm 15% Tối đa 20K',
        content:
          'Chi tiết: Giảm 15% tối đa 20K cho 10 đơn dịch vụ 4h (Sameday)',
        details: [
          { label: 'Mã', value: 'TERA30' },
          { label: 'Thời gian', value: 'Từ ngày 2/12/2025 - 31/12/2025' },
        ],
      },
      {
        subTitle: 'Chương trình 2: Ưu đãi đồng giá dịch vụ InDay',
        content: 'Chi tiết: Đồng giá 20K x 100 đơn đầu tiên dịch vụ InDay',
        details: [
          { label: 'Mã', value: 'TERA20' },
          { label: 'Thời gian', value: 'Từ ngày 2/12/2025 - 31/12/2025' },
        ],
      },
      {
        subTitle: 'Chương trình 3: Giảm 15% Tối đa 20K',
        content:
          'Chi tiết: Giảm 15% tối đa 20K cho 10 đơn dịch vụ 4h (Sameday)',
        details: [
          { label: 'Mã', value: 'TERA30' },
          { label: 'Thời gian', value: 'Từ ngày 2/12/2025 - 31/12/2025' },
        ],
      },
    ],
  },
];

// --- Component Chi tiết (Bulleted List) ---
interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailBullet}>•</Text>
    <View style={styles.detailText}>
      <Text style={styles.detailLabel}>{label}: </Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

// --- Component Section (Phần 1, 1.1,...) ---
interface NewsSectionProps {
  sectionData: (typeof NEWS_DETAILS)[0];
}

const NewsSection: React.FC<NewsSectionProps> = ({ sectionData }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.mainTitle}>{sectionData.title}</Text>
    {sectionData.sections.map((sub, index) => (
      <View key={index} style={styles.subSection}>
        <Text style={styles.subTitle}>{sub.subTitle}</Text>
        <Text style={styles.contentText}>{sub.content}</Text>
        {sub.details.map((detail, detailIndex) => (
          <DetailItem key={detailIndex} {...detail} />
        ))}
      </View>
    ))}
  </View>
);

// --- Màn hình chính NewsDetailScreen ---
const NewsDetailScreen: React.FC = () => {
  const scrollViewRef = useRef<any>(null);
  const router = useRouter();

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText} numberOfLines={1}>
            4 cách tra cứu, kiểm tra số dư tài khoản ACB nhanh chóng
          </Text>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Icon source="home" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
        >
          {/* RENDER NỘI DUNG */}
          {NEWS_DETAILS.map((section, index) => (
            <NewsSection key={index} sectionData={section} />
          ))}
        </ScrollView>

        {/* FLOATING ACTION BUTTON (Icon Home) */}
        <TouchableOpacity style={styles.fabButton} onPress={scrollToTop}>
          <Icon source="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default NewsDetailScreen;
