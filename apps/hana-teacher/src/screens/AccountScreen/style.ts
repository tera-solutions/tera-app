import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#0066cc',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    opacity: 0.2,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },

  badgeText: {
    color: '#0066cc',
    fontWeight: '600',
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },

  contactText: {
    color: '#fff',
  },

  statsCard: {
    marginHorizontal: 20,
    marginTop: -50,
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    paddingVertical: 12,
    elevation: 3,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statBorder: {
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },

  statLabel: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 12,
  },

  menuCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '600',
  },

  supportCard: {
    marginHorizontal: 20,
    backgroundColor: '#EEF7FF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  supportTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0066cc',
  },

  supportDesc: {
    marginTop: 8,
    color: '#64748B',
  },

  supportBtn: {
    marginTop: 16,
    backgroundColor: '#0066cc',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },

  supportBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  logoutBtn: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  logoutText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '700',
  },

  version: {
    textAlign: 'center',
    color: '#94A3B8',
  },
});
