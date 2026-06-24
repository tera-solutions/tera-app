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
  content: {
    paddingBottom: 40,
    backgroundColor: '#F3F8FD',
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  subtitle: {
    color: '#FFF',
    marginTop: 4,
  },

  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: -20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    elevation: 3,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0094D9',
  },

  statLabel: {
    marginTop: 4,
    color: '#64748B',
  },

  homeworkCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  homeworkTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  lesson: {
    color: '#64748B',
    marginTop: 4,
  },

  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

  progressBar: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 16,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#0094D9',
  },

  progressText: {
    marginTop: 8,
    color: '#64748B',
  },

  rewardCard: {
    margin: 20,
    backgroundColor: '#0094D9',
    borderRadius: 24,
    padding: 20,
  },

  rewardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },

  rewardDesc: {
    color: '#FFF',
    marginTop: 8,
  },

  button: {
    marginTop: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 12,
  },

  buttonText: {
    textAlign: 'center',
    color: '#0094D9',
    fontWeight: '700',
  },
});
