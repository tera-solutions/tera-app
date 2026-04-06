import { FONT_FAMILY } from '@tera/common/constants/typography';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'translate',
    borderWidth: 0,
    height: 40,
  },

  // Tab and Filter
  tabFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBar: {
    flexGrow: 0,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginRight: 20,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#3B82F6', // Màu xanh chủ đạo
  },
  tabText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  filterIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },

  // List Header
  listHeader: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Customer Item
  listContent: {
    paddingBottom: 80,
    overflowY: 'scroll',
    height: Platform.OS === 'web' ? height * 0.75 : 'auto',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.REGULAR,
    color: '#3e4a5cff',
  },
  locationPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationAddress: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
    width: '60%',
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444', // Đỏ cho nợ (Phải thu)
  },
  transactionStatus: {
    fontSize: 13,
    textAlign: 'left',
    width: '100%',
  },

  // Floating Action Button (FAB)
  fabButton: {
    position: 'absolute',
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 60,
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    flexDirection: 'row',
  },

  fabText: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.Medium,
  },

  rightAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
});
