import { FONT_FAMILY } from '@common/constants/typography';
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SaleStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#F5F5F5',
    flex: 1
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

  // 1. Khu vực tạo đơn hàng (Card)
  createOrderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 180, // Chiều cao tối thiểu như trong ảnh
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  createOrderButton: {
    backgroundColor: '#007AFF', // Màu xanh dương cho nút
    borderRadius: 50,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  addButtonIcon: {
    color: '#fff',
  },
  createOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // 2. Danh sách Menu (List)
  menuList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5', // Đường kẻ mờ
  },
  menuIcon: {
    color: '#007AFF', // Màu xanh cho icon
    width: 30,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});
