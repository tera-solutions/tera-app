import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FFF7',
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D8F5E4',
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
    color: '#16A34A',
  },

  totalText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#15803D',
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#16A34A',
  },

  totalLabel: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },

  image: {
    width: 110,
    height: 90,
  },

  growthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8
  },

  growthChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8F5E4',
  },

  growthValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },

  growthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    marginLeft: 4,
  },
});