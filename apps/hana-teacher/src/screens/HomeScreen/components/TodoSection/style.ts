import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,

    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 12,

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
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 16,
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

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,
  },

  iconContainer: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '600',

    color: '#0F172A',
  },

  itemSubtitle: {
    marginTop: 4,

    fontSize: 13,

    color: '#64748B',
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countBadge: {
    minWidth: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: '#FF4D4F',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});