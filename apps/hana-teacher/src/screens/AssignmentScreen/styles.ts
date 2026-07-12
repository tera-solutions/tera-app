import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100, // Tránh bị đè bởi Bottom TabBar
  },

  // Header Component
  headerBg: {
    backgroundColor: '#0066cc',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },

  // Quick Actions
  quickActionsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  actionItem: {
    alignItems: 'center',
    width: '25%',
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#1E293B',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Metrics Summary
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 32) / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  // Filter Tabs
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '700',
  },

  // Search & Filter Bar
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchInputPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#94A3B8',
    marginLeft: 8,
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },

  // Homework Card List
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingLeft: 10,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardClass: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 2,
  },
  cardDates: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },
  moreButton: {
    position: 'absolute',
    top: 6,
    right: 4,
  },

  // Teacher Tip Banner
  bannerContainer: {
    backgroundColor: '#EBF5FF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  bannerIconBg: {
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  bannerDesc: {
    fontSize: 11,
    color: '#334155',
    marginTop: 2,
    lineHeight: 15,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E7FF',
  },
  bannerButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
    marginRight: 4,
  },
});
