import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F2F8FF',

    borderRadius: 24,

    padding: 10,

    borderWidth: 1,
    borderColor: '#D9EFFF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976D2',
  },

  viewAll: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2196F3',
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1976D2',
  },

  totalLabel: {
    marginTop: 2,

    fontSize: 14,
    fontWeight: 600,
    color: '#0066cc',
  },

  image: {
    width: 110,
    height: 90,
  },

  classList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },

  classChip: {
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: '#DCEBFA',
  },

  classChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#23408E',
  },
});