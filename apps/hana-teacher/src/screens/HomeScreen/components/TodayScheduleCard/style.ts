import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: -30,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 24,

    backgroundColor: '#FFFFFF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 4,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 16,
  },

  headerLeft: {
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

  list: {
    gap: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',

    minHeight: 55,

    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6EDF5',

    backgroundColor: '#FFF',
  },

  timeContainer: {
    width: 90,
    alignItems: 'center',
  },

  startTime: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  endTime: {
    marginTop: 4,

    fontSize: 11,
    color: '#6B7280',
  },

  divider: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'stretch',

    borderLeftWidth: 1,
    borderColor: '#E5E7EB',
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginLeft: -20,

    backgroundColor: '#2196F3',
  },

  completedDot: {
    backgroundColor: '#D1D5DB',
  },

  infoContainer: {
    flex: 1,
  },

  className: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  location: {
    marginTop: 6,

    fontSize: 12,
    color: '#6B7280',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,

    borderRadius: 14,

    marginRight: 12,
  },

  upcomingBadge: {
    backgroundColor: '#EEF4FF',
  },

  completedBadge: {
    backgroundColor: '#EAF9EE',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  upcomingText: {
    color: '#3559E0',
  },

  completedText: {
    color: '#1F9D55',
  },
});