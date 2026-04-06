import { FONT_FAMILY } from '@common/constants/typography';
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

  // 2. Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 15,
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusTabBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 5,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },

  // ScrollView Content
  scrollView: {
      flex: 1,
  },
  scrollContent: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#F9FAFB'
  },
  
  // Quick Actions (Mang về, Giao hàng)
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  quickActionCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },

  // Area Filter (Tất cả, Khu vực 1)
  areaFilterContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  areaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  areaButtonActive: {
    backgroundColor: '#3B82F6',
  },
  areaButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  areaButtonTextActive: {
    color: '#FFFFFF',
  },

  // Table List Area
  areaTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  areaStatusText: {
    fontSize: 14,
    color: '#ff0000ff',
    fontFamily: FONT_FAMILY.BOLD
  },
  tableListRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  // Table Cards
  tableCard: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.5, // Tỷ lệ 4:3
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
  },
  tableCardUsing: {
    backgroundColor: '#EBF8FF', // Nền xanh nhạt
    borderColor: '#3B82F6',
    borderWidth: 1,
  },
  tableCardAvailable: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableInfo: {
    // Chỉ hiển thị khi đang dùng
  },
  tableTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  tableTotal: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.Medium,
    color: '#3B82F6',
  },
  customerCountBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  customerCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginRight: 2,
  },

  // Icon Bàn ăn (Placeholder)
  tableIconWrapper: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },

  // Add New Table Card
  tableCardAdd: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableAddText: {
    marginTop: 5,
    fontSize: 14,
    color: '#6B7280',
  },
});
