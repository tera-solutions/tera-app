import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    overflow: Platform.OS === 'web' ? 'scroll' : 'visible',
    height: Platform.OS === 'web' ? height - 10 : 'auto',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

  // Category Icons
  categoryRow: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryIcon: {
    flex: 1,
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  categoryIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  categoryText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 5,
    textAlign: 'center',
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabOptions: { flexDirection: 'row' },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: { backgroundColor: '#E5E7EB' },
  tabText: { fontSize: 14, color: '#4B5563' },
  activeTabText: { fontWeight: '600', color: '#1F2937' },
  markAllRead: { fontSize: 14, color: '#3B82F6', fontWeight: '500' },

  // Notification Item
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  itemIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemContent: { flex: 1, marginRight: 10 },
  itemType: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  itemText: { fontSize: 15, color: '#1F2937' },
  itemSource: { fontSize: 12, color: '#10B981', marginTop: 2 },
  itemDateContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: 80, // Giữ độ rộng cố định cho ngày
  },
  itemDate: { fontSize: 12, color: '#9CA3AF' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginTop: 5,
  },

  // FAB
  fabButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    elevation: 8,
  },
});
