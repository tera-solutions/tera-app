import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginHorizontal: 16,
    marginBottom: 12,
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
    paddingHorizontal: 16,
    gap: 12,
  },

  card: {
    width: 128,

    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  imageWrapper: {
    height: 64,
    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 8,
  },

  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 1,
    fontSize: 10,
    color: '#64748B',
  },

  priceRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0066cc',
  },

  originalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
});
