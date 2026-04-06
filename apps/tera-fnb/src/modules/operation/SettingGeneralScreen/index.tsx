import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Switch } from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Component Item Cài đặt có Chevron (Navigation/Dropdown) ---
interface NavItemProps {
  title: string;
  value: string;
  onPress: () => void;
}

const NavSettingItem: React.FC<NavItemProps> = ({ title, value, onPress }) => (
  <TouchableOpacity style={styles.navItemContainer} onPress={onPress}>
    <Text style={styles.navItemTitle}>{title}</Text>
    <View style={styles.navItemValueContainer}>
      <Text style={styles.navItemValue}>{value}</Text>
      <Icon source="chevron-right" size={20} color="#9CA3AF" />
    </View>
  </TouchableOpacity>
);

// --- Component Item Cài đặt có Switch (Toggle) ---
interface ToggleItemProps {
  title: string;
  value: boolean;
  onToggle: (val: boolean) => void;
  isLast?: boolean;
}

const ToggleSettingItem: React.FC<ToggleItemProps> = ({
  title,
  value,
  onToggle,
  isLast = false,
}) => (
  <View style={[styles.toggleItemContainer, !isLast && styles.itemBorder]}>
    <Text style={styles.toggleItemTitle}>{title}</Text>
    <Switch
      onValueChange={onToggle}
      value={value}
      trackColor={{ false: '#E5E7EB', true: '#10B981' }}
      thumbColor={'#FFFFFF'}
    />
  </View>
);

// --- Màn hình chính Cấu hình chung ---
const SettingGeneralScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // States cho Thuế
  const [taxOut, setTaxOut] = useState('Không áp dụng thuế');
  const [taxIn, setTaxIn] = useState('Không áp dụng thuế');
  const [isTaxIncluded, setIsTaxIncluded] = useState(false);

  // States cho Quản lý Kho
  const [inventoryDisplay, setInventoryDisplay] = useState('Theo tổng tồn kho');
  const [allowNegativeStock, setAllowNegativeStock] = useState(false);
  const [manageBySerial, setManageBySerial] = useState(false);
  const [manageByLot, setManageByLot] = useState(true); // Quan trọng với cà phê
  const [allowShippingPriceAdjustment, setAllowShippingPriceAdjustment] =
    useState(false);
  const [showStockOnCheck, setShowStockOnCheck] = useState(false);

  // States cho Quản lý Bán hàng
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('Tiền mặt');
  const [suggestMoney, setSuggestMoney] = useState(
    'Gợi ý tiền khi thanh toán tại quầy',
  );
  const [allowTempPrint, setAllowTempPrint] = useState(true);
  const [useIndependentPacking, setUseIndependentPacking] = useState(false);
  const [applyOrderStatus, setApplyOrderStatus] = useState(false);
  const [defaultSellingPrice, setDefaultSellingPrice] = useState('Giá bán lẻ');
  const [defaultImportPrice, setDefaultImportPrice] = useState('Giá nhập');
  const [allowPriceEditAllChannel, setAllowPriceEditAllChannel] =
    useState(false);

  // States cho Kênh bán
  const [enableFacebookChannel, setEnableFacebookChannel] = useState(true);
  const [enableSocialLogin, setEnableSocialLogin] = useState(true);

  const handleNavigation = (setting: string) => {
    console.tron(`Open setting detail/dropdown for: ${setting}`);
    // Giả lập router.push('SettingDetailScreen', { setting });
  };

  const handleSave = () => {
    console.tron('--- API POST /api/settings/general ---');
    console.tron('Configuration saved.');
    // router.back();
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Cấu hình chung</Text>
          <TouchableOpacity onPress={handleSave}>
            <Icon source="check" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. THIẾT LẬP THUẾ SẢN PHẨM (a49.jpg) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Thiết lập thuế sản phẩm</Text>
            </View>
            <NavSettingItem
              title="Thuế đầu ra mặc định"
              value={taxOut}
              onPress={() => handleNavigation('Thuế đầu ra')}
            />
            <NavSettingItem
              title="Thuế đầu vào mặc định"
              value={taxIn}
              onPress={() => handleNavigation('Thuế đầu vào')}
            />
            <ToggleSettingItem
              title="Giá đã bao gồm thuế"
              value={isTaxIncluded}
              onToggle={setIsTaxIncluded}
              isLast={true}
            />
          </View>

          {/* 2. QUẢN LÝ KHO (a49.jpg) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quản lý kho</Text>
              <TouchableOpacity onPress={() => console.tron('Info Quản lý kho')}>
                <Icon source="information-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <NavSettingItem
              title="Hiển thị tồn kho trên các trang danh sách"
              value={inventoryDisplay}
              onPress={() => handleNavigation('Hiển thị tồn kho')}
            />
            <ToggleSettingItem
              title="Cho phép xuất kho âm"
              value={allowNegativeStock}
              onToggle={setAllowNegativeStock}
            />
            <ToggleSettingItem
              title="Quản lý tồn kho theo Serial/IMei"
              value={manageBySerial}
              onToggle={setManageBySerial}
            />
            <ToggleSettingItem
              title="Quản lý tồn kho theo Lô - hạn sử dụng"
              value={manageByLot}
              onToggle={setManageByLot}
            />
            <ToggleSettingItem
              title="Cho phép điều chỉnh giá trị chuyển hàng"
              value={allowShippingPriceAdjustment}
              onToggle={setAllowShippingPriceAdjustment}
            />
            <ToggleSettingItem
              title="Cho phép hiển thị tồn kho khi kiểm"
              value={showStockOnCheck}
              onToggle={setShowStockOnCheck}
              isLast={true}
            />
          </View>

          {/* 3. THIẾT LẬP QUẢN LÝ BÁN HÀNG (a48.jpg) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Thiết lập quản lý bán hàng
              </Text>
              <TouchableOpacity
                onPress={() => console.tron('Info Quản lý bán hàng')}
              >
                <Icon source="information-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <NavSettingItem
              title="Phương thức thanh toán mặc định"
              value={defaultPaymentMethod}
              onPress={() => handleNavigation('PTTT mặc định')}
            />
            <NavSettingItem
              title="Gợi ý tiền khi thanh toán tại quầy"
              value={suggestMoney}
              onPress={() => handleNavigation('Gợi ý tiền')}
            />
            <ToggleSettingItem
              title="Cho phép in tạm tính"
              value={allowTempPrint}
              onToggle={setAllowTempPrint}
            />
            <ToggleSettingItem
              title="Sử dụng quy trình đóng gói độc lập"
              value={useIndependentPacking}
              onToggle={setUseIndependentPacking}
            />
            <ToggleSettingItem
              title="Áp dụng trạng thái xử lý đơn hàng"
              value={applyOrderStatus}
              onToggle={setApplyOrderStatus}
              isLast={true}
            />
          </View>

          {/* 4. THIẾT LẬP CHÍNH SÁCH GIÁ (a48.jpg) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Thiết lập chính sách giá</Text>
            </View>
            <NavSettingItem
              title="Giá bán hàng mặc định"
              value={defaultSellingPrice}
              onPress={() => handleNavigation('Giá bán mặc định')}
            />
            <NavSettingItem
              title="Giá nhập hàng mặc định"
              value={defaultImportPrice}
              onPress={() => handleNavigation('Giá nhập mặc định')}
            />
            <NavSettingItem
              title="Sửa giá khi bán hàng"
              value={
                allowPriceEditAllChannel
                  ? 'Áp dụng toàn kênh bán hàng - Sửa giá và chiết khấu'
                  : 'Không áp dụng'
              }
              onPress={() => handleNavigation('Sửa giá')}
            />
            {/* Switch này có thể được chuyển thành NavItem vì nó phức tạp, nhưng giữ Toggle để minh họa */}
            <ToggleSettingItem
              title="Áp dụng toàn kênh bán hàng - Sửa giá và chiết khấu"
              value={allowPriceEditAllChannel}
              onToggle={setAllowPriceEditAllChannel}
              isLast={true}
            />
          </View>

          {/* 5. KÊNH FACEBOOK & ĐĂNG NHẬP (a48.jpg) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kênh Facebook</Text>
            </View>
            <ToggleSettingItem
              title="Tạo đơn và quản lý đơn hàng từ trang Facebook"
              value={enableFacebookChannel}
              onToggle={setEnableFacebookChannel}
              isLast={true}
            />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Đăng nhập Facebook/Google</Text>
            </View>
            <ToggleSettingItem
              title="Cho phép nhân viên đăng nhập quản trị bằng"
              value={enableSocialLogin}
              onToggle={setEnableSocialLogin}
              isLast={true}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
        {/* FOOTER - Nút Lưu cố định */}
        <View style={[styles.footer, { bottom: insets.bottom }]}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SettingGeneralScreen;
