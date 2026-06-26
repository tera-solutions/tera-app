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
    paddingBottom: 100,
  },

  // ─── HEADER ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#0066CC',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── ROOM INFO CARD ──────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: 'row',
    gap: 14,
  },
  roomPhoto: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: '#EEF5FF',
    flexShrink: 0,
  },
  infoBody: {
    flex: 1,
  },
  infoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066CC',
  },
  classTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF5FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  classTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066CC',
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoMetaText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },

  // ─── STATS ROW ───────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  statBoxBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },

  // ─── SECTION ─────────────────────────────────────────────────────────────────
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },

  // ─── TODAY SCHEDULE ──────────────────────────────────────────────────────────
  scheduleCard: {
    backgroundColor: '#F4F7FB',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleTime: {
    alignItems: 'center',
    minWidth: 48,
  },
  scheduleTimeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0066CC',
    lineHeight: 22,
  },
  scheduleTimeDash: {
    fontSize: 13,
    color: '#94A3B8',
  },
  scheduleLesson: {
    flex: 1,
    gap: 2,
  },
  scheduleLessonImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#EEF5FF',
  },
  scheduleLessonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  scheduleLessonSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  scheduleActions: {
    gap: 8,
    minWidth: 115,
  },
  startClassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#0066CC',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  startClassBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lessonPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  lessonPlanBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    backgroundColor: '#0066CC',
  },

  // ─── STUDENTS IN ROOM ────────────────────────────────────────────────────────
  studentsScroll: {
    marginHorizontal: -4,
  },
  studentsScrollContent: {
    paddingHorizontal: 4,
    gap: 10,
  },
  studentCard: {
    alignItems: 'center',
    width: 72,
    gap: 6,
  },
  studentAvatarWrapper: {
    position: 'relative',
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF5FF',
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  studentName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  studentStatus: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ─── IN CLASS TOOLS ──────────────────────────────────────────────────────────
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  toolItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
  },

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
  notifItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  notifBody: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  notifDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  notifTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
  },

  // ─── ENTER ROOM BUTTON ───────────────────────────────────────────────────────
  enterRoomBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0066CC',
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#0066CC',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  enterRoomBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
