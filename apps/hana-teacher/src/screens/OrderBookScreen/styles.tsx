import { FONT_FAMILY } from '@tera/commons/constants/typography';
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
  tabsWrapper: {
    paddingBottom: 0,
    height: 45,
    borderBottomWidth: 2,
    borderBottomColor: '#F3F4F6',
  },
  tabsContent: {
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
    backgroundColor: '#F9FAFB',
  },
  // List & Card
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
    // Đảm bảo không bị che bởi status badge
    paddingRight: 80,
  },
  customerCode: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  bookingTime: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 15,
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  arrivedButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  arrivedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6B7280',
  },

  // Floating Button Style
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3B82F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
