import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    backgroundColor: '#0066cc',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
  },
  headerBackgroundMask: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Tránh đè lên bottom navigation
  },
  // Class Header Card
  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
  },
  classInfo: {
    flex: 1,
    marginLeft: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  classTagline: {
    fontSize: 13,
    color: '#64748B',
    marginVertical: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
  },
  btnChangeClass: {
    borderRadius: 10,
    borderColor: '#E2E8F0',
    backgroundColor: '#e6f2ff',
  },
  // Stats Section
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 32 - 12) / 4, // Chia đều 4 cột trừ khoảng cách
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  // Search Bar
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 44,
    marginRight: 8,
    elevation: 0,
  },
  btnFilter: {
    height: 44,
    borderRadius: 12,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  renderItemContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
  },
  lessonRowContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  leftTimelineColumn: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  indexWrapper: {
    width: 36,
    height: 36,
    borderRadius: 20,
    borderColor: '#cce6ff',
    borderWidth: 1,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005ce6',
  },
  rightCardColumn: {
    flex: 1,
  },
  lessonCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  lessonThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  lessonMeta: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 4,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  lessonUnit: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  rightMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    marginRight: 2,
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Banner Create
  bannerContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerTexts: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#60A5FA',
    marginTop: 2,
  },
  btnCreate: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  tabsScroll: {
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 4,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    position: 'relative',
    alignItems: 'center',
  },
  activeTabButton: {
    // Cần indicator dưới chân tab active
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -5,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});
