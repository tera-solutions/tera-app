import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import CategoryCard from './CategoryCard';
import { styles } from './style';

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
}

interface LessonCategoryTabsProps {
  activeTab: string;
  data: CategoryItem[];
  onChange: (id: string) => void;
}

export default function LessonCategoryTabs({
  activeTab,
  data,
  onChange,
}: LessonCategoryTabsProps) {
  return (
    <FlashList
      horizontal
      data={data}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CategoryCard
          item={item}
          selected={item.id === activeTab}
          onPress={() => onChange(item.id)}
        />
      )}
    />
  );
}
