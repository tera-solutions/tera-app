import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /*
   * HEADER
   */

  header: {
    height: 185,
    backgroundColor: '#0066cc',
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },

  /*
   * CLASS CARD
   */

  classCard: {
    width: '95%',
    marginHorizontal: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -80,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 3,
  },

  classCode: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  classCodeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },

  classInfo: {
    flex: 1,
  },

  className: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 6,
  },

  classText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },

  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },

  activeText: {
    color: '#16A34A',
    fontWeight: '600',
    fontSize: 12,
  },

  dateText: {
    marginTop: 10,
    textAlign: 'right',
    color: '#64748B',
    fontSize: 12,
  },

  /*
   * STATS
   */

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 2,
  },

  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
    color: '#0F172A',
  },

  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  /*
   * TABS
   */

  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  tabWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  tabActive: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 3,
  },

  tabActiveLine: {
    height: 3,
    width: '100%',
    backgroundColor: '#0066cc',
    borderRadius: 100,
  },

  tab: {
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },

  activeTabText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  /*
   * SEARCH
   */

  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  searchBox: {
    flex: 1,
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0F172A',
  },

  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /*
   * STUDENT CARD
   */

  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
  },

  no: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D6E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '700',
    overflow: 'hidden',
  },

  noText: {
    color: '#0066cc',
    fontWeight: 700,
    fontSize: 16,
  },

  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 26,
    marginHorizontal: 12,
  },

  studentName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  time: {
    width: 40,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
  },

  /*
   * STATUS
   */

  presentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },

  presentText: {
    color: '#16A34A',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 11,
  },

  lateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },

  lateText: {
    color: '#D97706',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 11,
  },

  absentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },

  absentText: {
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 11,
  },

  /*
   * ACTION BAR
   */

  actionBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  summaryBox: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },

  actionText: {
    color: '#FFFFFF',
    marginTop: 6,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },

  presentBtn: {
    flex: 1,
    height: 70,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lateBtn: {
    flex: 1,
    height: 70,
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  absentBtn: {
    flex: 1,
    height: 70,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /*
   * REFRESH
   */

  refresh: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },

  refreshText: {
    marginLeft: 8,
    color: '#94A3B8',
    fontSize: 14,
  },

  /*
   * SELECT / UNMARKED STATE
   */

  studentCardSelected: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    backgroundColor: '#F0F7FF',
  },

  unmarkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },

  unmarkedText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 11,
  },

  actionBtnDisabled: {
    opacity: 0.4,
  },

  selectHint: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },

  /*
   * SAVE ROW
   */

  saveRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },

  markAllBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  markAllText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },

  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  /*
   * REPORT TAB
   */

  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  reportRow: {
    marginBottom: 12,
  },

  reportRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  reportRowLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },

  reportRowValue: {
    fontSize: 13,
    color: '#64748B',
  },

  reportBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },

  reportBarFill: {
    height: 8,
    borderRadius: 4,
  },

  absentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  absentItemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
  },

  absentItemName: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
});
