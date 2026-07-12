import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ─── SCREEN ──────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 110,
  },

  // ─── DETAIL HEADER ───────────────────────────────────────────────────────────
  headerOuter: {
    backgroundColor: '#0066CC',
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.15,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCenter: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerProfileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#DBEAFE',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
    paddingTop: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  starBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
  },
  studentCode: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  profileTagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  profileTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  profileTagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  classTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  classTagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // ─── DETAIL TABS ─────────────────────────────────────────────────────────────
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabsScroll: {
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#0066CC',
    fontWeight: '700',
  },

  // ─── SECTION CARD ────────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  // ─── OVERVIEW STATS ──────────────────────────────────────────────────────────
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  overviewStatBox: {
    width: '47.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  overviewStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  overviewStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  overviewStatLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  overviewStatSublabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // ─── RECENT ACTIVITIES ───────────────────────────────────────────────────────
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  activitySeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 52,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityBody: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  activityDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  activityRight: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  activityDate: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'right',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── SKILLS PROGRESS ─────────────────────────────────────────────────────────
  skillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  skillItem: {
    alignItems: 'center',
    gap: 8,
  },
  skillCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillCircleInner: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  skillLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  // ─── ABSENCE SECTION ─────────────────────────────────────────────────────────
  absenceCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 6,
  },
  absenceDates: {
    fontSize: 13,
    color: '#64748B',
  },

  // ─── ACTION BAR ──────────────────────────────────────────────────────────────
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    elevation: 8,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0066CC',
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066CC',
  },
  actionBtnFilled: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#0066CC',
  },
  actionBtnFilledText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ─── GENERIC LIST ROW (attendance/scores/comments/homework tabs) ────────────
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  listRowBody: {
    flex: 1,
  },
  listRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  listRowSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  listRowRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  listRowValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0066CC',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ─── EMPTY / ERROR STATE ─────────────────────────────────────────────────────
  emptyWrapper: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066CC',
  },

  // ─── INFO TAB ────────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  parentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    gap: 3,
  },
  parentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  parentMeta: {
    fontSize: 12,
    color: '#64748B',
  },
});
