import { Image, Text, TouchableOpacity } from 'react-native';

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
}

interface CategoryCardProps {
  item: CategoryItem;
  selected?: boolean;
  onPress?: () => void;
}

export default function CategoryCard({
  item,
  selected,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 90,
        height: 100,
        marginRight: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: selected ? '#FFFFFF' : '#008BE8',
      }}
    >
      <Image
        source={item.icon}
        style={{
          width: 40,
          height: 40,
          marginBottom: 8,
        }}
      />

      <Text
        style={{
          color: selected ? '#0066cc' : '#FFFFFF',
          fontWeight: '600',
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}