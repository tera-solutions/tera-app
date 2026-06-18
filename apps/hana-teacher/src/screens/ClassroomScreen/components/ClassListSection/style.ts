import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0066cc',
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  sortText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B84FF',
  },

  list: {
    paddingBottom: 8,
  },

  separator: {
    height: 16,
  },
});