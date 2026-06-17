import { TextInput } from '@components/ui';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductItem, { Product } from './ProductItem';
import { styles } from './styles';

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Áo khoác Chino thời thượng SID56708 - Trắng',
    sku: 'PVN05',
    price: 500000,
    stock: 96,
    image: 'https://cdnv2.tgdd.vn/pim/cdn/images/202512/NUOC%20GIAT154159.jpg',
  },
  {
    id: 'p2',
    name: 'Áo khoác đầm dáng xòe nút bọc 2in1 SID55675 - Hồng',
    sku: 'PVN04',
    price: 520000,
    stock: 96,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/14/bannerbrandpromo/sis280x440_202506010909536791.jpg',
  },
  {
    id: 'p3',
    name: 'Áo vest nữ viền túi sang trọng SID6373 - Đen',
    sku: 'PVN03',
    price: 375000,
    stock: 95,
    image: 'https://cdnv2.tgdd.vn/pim/cdn/images/202511/Dovex163919.png',
  },
  {
    id: 'p4',
    name: 'Áo khoác cổ tim phong cách tripal SID50074 - Freesize',
    sku: 'PVN02',
    price: 277000,
    stock: 94,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2286/211349/bhx/211349-thumb-moi_202411071437209912.jpg',
  },
  {
    id: 'p5',
    name: 'Áo khoác phối sọc cá tính SID62366 - Freesize',
    sku: 'PVN01',
    price: 135000,
    stock: 95,
    image:
      'https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2944/86162/bhx/scu-yomost-cam-170ml-thung_202510301416454571.jpg',
  },
];
// --- 3. Dialog Chính ---
interface SelectProductDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectProducts: (products: Product[]) => void;
}

export const SelectProductDialog: React.FC<SelectProductDialogProps> = ({
  isVisible,
  onClose,
  onSelectProducts,
}) => {
  const [searchText, setSearchText] = useState('');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);

  const filteredProducts = DUMMY_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSearch = (e: any) => {
    console.tron(e.target.metricValue);
  };

  const handleToggleSelect = (product: Product) => {
    if (!isMultiSelect) {
      // Chế độ chọn 1: đóng dialog và chọn ngay
      onSelectProducts([product]);
      onClose();
      return;
    }

    // Chế độ chọn nhiều
    setSelectedItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleConfirmSelection = () => {
    onSelectProducts(selectedItems);
    onClose();
  };

  // Tái tạo Toggle Chọn nhiều (như trong a17.jpg)
  const renderToggle = () => (
    <View style={styles.selectMultipleContainer}>
      <Text style={styles.selectMultipleText}>Chọn nhiều</Text>
      <TouchableOpacity
        onPress={() => {
          setIsMultiSelect(!isMultiSelect);
          setSelectedItems([]);
        }}
        style={[
          styles.toggleSwitch,
          isMultiSelect && styles.toggleSwitchActive,
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            isMultiSelect && styles.toggleThumbActive,
          ]}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon source="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <View style={styles.searchBarContainer}>
                <Icon source="magnify" size={20} color="#888" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm theo tên, barcode, SKU"
                  onChangeText={handleSearch}
                  placeholderTextColor="#999"
                />
              </View>
              <TouchableOpacity style={styles.barcodeScanner}>
                <Icon source="barcode-scan" size={30} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => console.tron('Thêm sản phẩm mới')}
              >
                <Icon source="plus" size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* FILTER & TOGGLE */}
          <View style={styles.filterBar}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => console.tron('Mở bộ lọc')}
            >
              <Text style={styles.filterText}>Tất cả loại sản phẩm</Text>
              <Icon source="menu-down" size={20} color="#1F2937" />
            </TouchableOpacity>

            {renderToggle()}
          </View>

          {/* DANH SÁCH SẢN PHẨM */}
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductItem
                product={item}
                isMultiSelect={isMultiSelect}
                isSelected={!!selectedItems.find((i) => i.id === item.id)}
                onToggleSelect={handleToggleSelect}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />

          {/* FOOTER (CHỈ HIỂN THỊ KHI CHỌN NHIỀU) */}
          {isMultiSelect && (
            <View style={styles.bottomBar}>
              <Text style={styles.selectedCountText}>
                Đã chọn {selectedItems.length} sản phẩm
              </Text>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  selectedItems.length === 0 && { opacity: 0.5 },
                ]}
                onPress={handleConfirmSelection}
                disabled={selectedItems.length === 0}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default SelectProductDialog;
