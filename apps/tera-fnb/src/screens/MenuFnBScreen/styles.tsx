import { FONT_FAMILY } from '@tera/common/constants/typography';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = (width - 45) / 2;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.Medium,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerButton: {
    gap: 2,
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.REGULAR,
  },

  // 2. Search Bar Styles
  searchWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    width: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    borderWidth: 0,
    paddingHorizontal: 10,
    height: 50,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  barcodeScanner: {
    //
  },
  // Category Tabs (Horizontal ScrollView)
  categoryTabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryTabsContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryTabActive: {
    backgroundColor: '#3B82F6',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Menu List (FlatList 2 cột)
  menuListContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#F9FAFB', // Nền nhẹ
  },
  menuListRow: {
    justifyContent: 'space-between',
  },
  menuCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 120, // Chiều cao cố định cho ảnh
  },
  itemInfo: {
    padding: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    height: 36, // Đảm bảo chiều cao cố định cho 2 dòng
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#059669', // Màu xanh lá cho giá
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#3B82F6',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cart Bar (Bottom Fixed Bar)
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartInfoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 5,
  },
});
