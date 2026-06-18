import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,

    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 16,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',

    color: '#0066cc',
  },

  viewAll: {
    fontSize: 14,
    fontWeight: '600',

    color: '#0066cc',
  },

  separator: {
    height: 12,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 18,

    backgroundColor: '#F8FAFC',
  },

  unreadItem: {
    backgroundColor: '#F0F9FF',
  },

  leftSection: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  unreadIconContainer: {
    backgroundColor: '#E0F2FE',
  },

  content: {
    flex: 1,
  },

  message: {
    fontSize: 14,
    lineHeight: 20,

    color: '#334155',
  },

  unreadMessage: {
    fontWeight: '600',
    color: '#0F172A',
  },

  time: {
    marginTop: 6,

    fontSize: 12,

    color: '#94A3B8',
  },
});
