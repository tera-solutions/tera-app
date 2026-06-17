import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================
  // SCREEN
  // ==========================

  container: {
    flex: 1,
    backgroundColor: '#F4F8FC',
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // ==========================
  // HEADER
  // ==========================

  header: {
    backgroundColor: '#0094D9',

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,

    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,

    position: 'relative',
    overflow: 'hidden',
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

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  headerLeft: {
    flex: 1,
  },

  headerRight: {
    alignItems: 'center',
  },

  logo: {
    position: 'relative',
    fontSize: 38,
    fontWeight: '800',
    color: '#FFF',
  },

  greeting: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },

  subGreeting: {
    marginTop: 4,
    fontSize: 16,
    color: '#EAF7FF',
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#FFF',
  },

  onlineBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,

    width: 16,
    height: 16,

    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  coinBadge: {
    marginTop: 12,

    paddingHorizontal: 10,
    paddingVertical: 5,

    backgroundColor: '#0077B6',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  coinText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },

  notificationButton: {
    width: 44,
    height: 44,

    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,

    width: 18,
    height: 18,

    borderRadius: 9,
    backgroundColor: '#FF5252',

    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // ==========================
  // COMMON CARD
  // ==========================

  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 4,
  },

  // ==========================
  // TODAY ACTIVITY
  // ==========================

  activityCard: {
    marginHorizontal: 20,
    marginTop: -46,

    padding: 20,
  },

  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  activityTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  activitySubTitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },

  activityContent: {
    marginTop: 20,
    flexDirection: 'row',
  },

  activityImage: {
    width: 120,
    height: 120,
  },

  activityInfo: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  activityItemText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#334155',
  },

  // ==========================
  // SECTION
  // ==========================

  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#94A3B8',
  },

  sectionAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0094D9',
  },

  // ==========================
  // SUBJECTS
  // ==========================

  subjectGrid: {
    paddingHorizontal: 20,

    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  subjectCard: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subjectCardActive: {
    borderWidth: 3,
    borderColor: '#FFF',
  },

  subjectIconWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subjectBadge: {
    position: 'absolute',
    top: 8,
    right: 8,

    minWidth: 20,
    height: 20,

    paddingHorizontal: 4,

    borderRadius: 10,

    backgroundColor: '#FF5252',

    alignItems: 'center',
    justifyContent: 'center',
  },

  subjectBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  subjectImage: {
    width: '100%',
    height: '100%',
  },

  subjectLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },

  // ==========================
  // LESSON
  // ==========================

  lessonList: {
    paddingLeft: 20,
  },

  lessonCard: {
    width: 200,

    marginRight: 16,

    backgroundColor: '#FFF',
    borderRadius: 20,

    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  lessonImage: {
    width: '100%',
    height: 120,
  },

  lessonBody: {
    padding: 12,
  },

  lessonTag: {
    alignSelf: 'flex-start',

    paddingHorizontal: 10,
    paddingVertical: 4,

    backgroundColor: '#E0F2FE',
    borderRadius: 999,
  },

  lessonTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
  },

  lessonTitle: {
    marginTop: 10,

    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  lessonFooter: {
    marginTop: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  lessonDuration: {
    fontSize: 13,
    color: '#64748B',
  },

  lessonRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },

  // ==========================
  // CHALLENGE
  // ==========================

  challengeCard: {
    marginHorizontal: 20,
    padding: 20,
  },

  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  challengeIcon: {
    fontSize: 48,
  },

  challengeInfo: {
    flex: 1,
    marginHorizontal: 16,
  },

  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  challengeReward: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },

  progressContainer: {
    height: 10,
    marginTop: 12,

    borderRadius: 999,
    backgroundColor: '#E2E8F0',

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#0094D9',
  },

  progressText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  // ==========================
  // ACHIEVEMENT
  // ==========================

  achievementCard: {
    marginHorizontal: 20,
    padding: 20,
    marginTop: 16,
  },

  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  achievementDescription: {
    marginTop: 6,
    color: '#64748B',
  },

  // ==========================
  // STREAK
  // ==========================

  streakCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
  },

  streakNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FF9800',
  },

  streakLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  // ==========================
  // EMPTY
  // ==========================

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#94A3B8',
  },

  // ==========================
  // SKELETON
  // ==========================

  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },

  // ==========================
  // FAB
  // ==========================

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 100,

    width: 60,
    height: 60,

    borderRadius: 30,

    backgroundColor: '#0094D9',

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 8,
  },

  // ==========================
  // BOTTOM TAB
  // ==========================

  bottomTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: '#FFF',

    paddingTop: 12,
    paddingBottom: 28,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  tabItem: {
    alignItems: 'center',
  },

  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#94A3B8',
  },

  tabLabelActive: {
    color: '#0094D9',
    fontWeight: '700',
  },

  lessonLevel: {
    fontSize: 12,
    color: '#64748B',
  },

  lessonRatingContainer: {
    marginTop: 10,

    flexDirection: 'row',
    alignItems: 'center',
  },
});
