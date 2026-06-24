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

  bannerContent: {
    overflow: 'hidden',
    paddingVertical: 20,
  },

  bannerImage: {
    width: '100%',
    height: 100,
    borderRadius: 20,
  },

  content: {
    flex: 2,
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16213E',
  },

  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 4,
    opacity: 0.9,
  },

  buttonCard: {
    marginTop: 16,
    backgroundColor: '#1E9BFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonCardText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  thumbnail: {
    width: 110,
    height: 110,
    borderRadius: 16,
  },

  description: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 8,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  wordCount: {
    fontSize: 13,
    color: '#F59E0B',
  },

  progressText: {
    fontSize: 13,
    color: '#64748B',
  },

  actionContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  icon: {
    width: 50,
    height: 50,
  },
});
