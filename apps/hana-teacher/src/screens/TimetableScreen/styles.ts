import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const CARD_WIDTH = (width - 48) / 4;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FC',
  },

  contentContainer: {
    paddingBottom: 120,
  },

  // ===== HEADER =====

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#0066cc',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF4D4F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // ===== WEEK FILTER =====

  weekContainer: {
    marginHorizontal: 16,
    marginTop: -26,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  weekToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  dateButton: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#E8EDF3',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  weekButton: {
    height: 46,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E8EDF3',
    borderRadius: 12,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterButton: {
    height: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8EDF3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
  },

  // ===== DAYS =====

  dayList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayItem: {
    width: 44,
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayItemActive: {
    backgroundColor: '#0066cc',
  },

  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  dayDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 6,
  },

  dayNameActive: {
    color: '#FFFFFF',
  },

  dayDateActive: {
    color: '#FFFFFF',
  },

  // ===== NOTICE =====

  noticeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  noticeText: {
    flex: 1,
    marginLeft: 10,
    color: '#475569',
    fontSize: 14,
  },

  noticeLink: {
    color: '#0066cc',
    fontWeight: '600',
  },

  // ===== SUMMARY =====

  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },

  summaryCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,

    elevation: 2,
  },

  summaryIconWrapper: {
    width: 35,
    height: 35,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  summaryLabel: {
    marginTop: 6,
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },

  // ===== SESSION =====

  sessionContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },

  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  sessionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },

  // ===== TIMELINE =====

  scheduleRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  timelineColumn: {
    width: 72,
    alignItems: 'center',
  },

  timelineTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066cc',
    marginVertical: 6,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D6E4F0',
  },

  // ===== CLASS CARD =====

  classCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,

    elevation: 2,
  },

  classIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  classContent: {
    flex: 1,
    marginLeft: 14,
  },

  classTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  className: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },

  subjectBadge: {
    backgroundColor: '#EEF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  subjectText: {
    color: '#0066cc',
    fontSize: 12,
    fontWeight: '600',
  },

  lessonName: {
    fontSize: 15,
    color: '#475569',
    marginTop: 8,
  },

  roomText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 8,
  },

  classRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 80,
  },

  studentCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  studentLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  // ===== STATUS =====

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  completedBadge: {
    backgroundColor: '#E8F8ED',
  },

  completedText: {
    color: '#22C55E',
  },

  upcomingBadge: {
    backgroundColor: '#FFF4E6',
  },

  upcomingText: {
    color: '#F59E0B',
  },

  cancelledBadge: {
    backgroundColor: '#F1F5F9',
  },

  cancelledText: {
    color: '#94A3B8',
  },

  // ===== SYNC CARD =====

  syncCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  syncContent: {
    flex: 1,
    marginLeft: 14,
  },

  syncTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },

  syncDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
  },

  syncButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  syncButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },

  // ===== QUICK ACTION =====

  quickActionContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },

  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickActionItem: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 12,
  },

  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },

  // ===== EMPTY =====

  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },

  // ===== SPACING =====

  divider: {
    height: 1,
    backgroundColor: '#E8EDF3',
    marginVertical: 12,
  },

  bottomSpacing: {
    height: 40,
  },
});
