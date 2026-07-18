import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, ImageIcon, LayoutGrid, LucideIcon } from 'lucide-react-native';

import { styles } from './style';

// Dữ liệu mẫu trùng với 3 sản phẩm "nổi bật" đầu tiên của HocLieuScreen —
// chưa có API thương mại điện tử thật (xem constants.ts của HocLieuScreen).
interface FeaturedMaterial {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  icon: LucideIcon;
  color: string;
}

const FEATURED_MATERIALS: FeaturedMaterial[] = [
  {
    id: 'p1',
    name: 'Sách Smart Kids 1',
    subtitle: 'Student Book',
    price: 180000,
    originalPrice: 200000,
    icon: BookOpen,
    color: '#2563EB',
  },
  {
    id: 'p2',
    name: 'Flashcard At School',
    subtitle: 'Bộ 45 thẻ hình',
    price: 120000,
    icon: LayoutGrid,
    color: '#16A34A',
  },
  {
    id: 'p3',
    name: 'Poster Classroom Rules',
    subtitle: 'Khổ A2, ép plastic',
    price: 85000,
    originalPrice: 100000,
    icon: ImageIcon,
    color: '#8B5CF6',
  },
];

const formatCurrency = (value = 0) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

export default function FeaturedMaterialsSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Học liệu nổi bật</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/hoc-lieu')}>
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {FEATURED_MATERIALS.map((item) => {
          const ItemIcon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/hoc-lieu')}
            >
              <View style={[styles.imageWrapper, { backgroundColor: `${item.color}15` }]}>
                <ItemIcon size={28} color={item.color} />
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                {!!item.originalPrice && (
                  <Text style={styles.originalPrice}>{formatCurrency(item.originalPrice)}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
