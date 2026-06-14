import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header (Tìm kiếm)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
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
    borderRadius: 20,
    borderWidth: 0,
    paddingHorizontal: 10,
    height: 40,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  barcodeScanner: {
    //
  },

  // Filter Bar
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    marginRight: 5,
  },
  selectMultipleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectMultipleText: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 8,
  },
  toggleSwitch: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1D5DB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#3B82F6',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },

  // Product List
  listContainer: {
    paddingHorizontal: 15,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  imageProduct: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  selectionCountBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#3B82F6',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  selectionCountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  productSku: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  productPricing: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  productStock: {
    fontSize: 13,
    color: '#888888ff',
    marginTop: 2,
  },
  multiSelectIcon: {
    marginLeft: 10,
  },

  // Bottom Bar (Chọn nhiều)
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  selectedCountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  confirmButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
