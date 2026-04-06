import { FONT_FAMILY } from '@tera/common/constants/typography';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const OrderStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    height: '100%',
    backgroundColor: '#F5F5F5', // Nền nhẹ
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
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
    height: 35,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 35,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  barcodeScanner: {
    //
  },

  // 2. Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF', // Màu xanh dương làm tab active
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  // Số lượng đơn hàng
  orderCountContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  orderCountText: {
    fontSize: 14,
    color: '#666',
  },

  // 3. List
  orderListContainer: {
    backgroundColor: '#F5F5F5',
    overflowY: 'scroll',
    height: Platform.OS === 'web' ? 600 : "auto",
    minHeight: height,
  },

  // Item Styles (cho OrderListItem) - Cập nhật theo ảnh 04.jpg
  orderItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 10,
  },
  itemContent: {
    padding: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  orderInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  actionBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionButtonSeparator: {
    width: 1,
    backgroundColor: '#EEE',
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },

  // Floating Action Button
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
