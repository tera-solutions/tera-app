import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
  },
  mainContent: {
    paddingHorizontal: 16,
  },
  // Week Calendar Card
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginTop: -24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  btnToday: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateSelectorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: 4,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    width: (width - 100 - 24) / 7,
    paddingVertical: 8,
    borderRadius: 24,
  },
  activeDayItem: {
    backgroundColor: '#007AFF',
  },
  dayLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  activeDayLabel: {
    color: '#FFF',
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  activeDayNumber: {
    color: '#FFF',
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
    marginTop: 4,
  },
  // Stats Section
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
  },
  statPeriod: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  // Section Title
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  btnSort: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 13,
    color: '#007AFF',
    marginRight: 4,
    fontWeight: '500',
  },
  // Render Item Zone
  renderItemContainer: {
    paddingHorizontal: 16,
  },
  // Schedule Item Card
  scheduleRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeColumn: {
    width: 65,
    alignItems: 'center',
    paddingTop: 4,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeDivider: {
    fontSize: 11,
    color: '#94A3B8',
    marginVertical: 1,
  },
  timeDividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: '#e6e6e6',
    marginHorizontal: 12,
  },
  durationText: {
    fontSize: 11,
    color: '#64748B',
  },
  mainCardColumn: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 6,
    borderColor: '#F1F5F9',
    position: 'relative',
  },
  statusIndicatorBar: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  classAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignSelf: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 4,
  },
  classBadgeWrapper: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  classBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lessonName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  roomText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  unitText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 2,
  },
  rightMetaColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  studentCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentCountText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  // Weekly Banner
  bannerContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
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
    color: '#64748B',
    marginTop: 4,
  },
  btnViewWeekly: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
});
