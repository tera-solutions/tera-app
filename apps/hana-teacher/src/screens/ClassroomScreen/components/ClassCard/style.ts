import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,

    borderLeftWidth: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,

    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    padding: 16,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  level: {
    marginTop: 10,

    fontSize: 12,
    color: '#667085',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 8,
  },

  location: {
    marginLeft: 6,

    fontSize: 12,
    color: '#667085',
  },

  scheduleCard: {
    paddingHorizontal: 8,
    paddingVertical: 8,

    borderRadius: 14,

    minWidth: 120,
  },

  scheduleTime: {
    fontSize: 13,
    fontWeight: '700',
  },

  scheduleText: {
    marginTop: 4,

    fontSize: 10,
    color: '#667085',
  },

  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 16,
  },

  studentText: {
    marginLeft: 4,

    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F6',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  actionItem: {
    flex: 1,
    alignItems: 'center',
  },

  buttonMore: {
    position: 'absolute',
    right: 15,
    top: 0
  },

  actionLabel: {
    marginTop: 6,

    fontSize: 11,
    fontWeight: '500',

    color: '#344054',
    textAlign: 'center',
  },
});