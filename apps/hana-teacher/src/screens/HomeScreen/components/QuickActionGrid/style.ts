import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    paddingHorizontal: 16,
    marginTop: 16,

    justifyContent: 'space-between',
    rowGap: 12,
  },

  item: {
    width: '23%',

    height: 75,

    backgroundColor: '#FFFFFF',

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 3,
  },

  icon: {
    fontSize: 32,
  },

  label: {
    marginTop: 5,

    fontSize: 12,
    fontWeight: '600',

    textAlign: 'center',

    color: '#1F2937',
  },

  badge: {
    position: 'absolute',

    top: 8,
    right: 18,
    zIndex: 10,

    minWidth: 18,
    height: 18,

    borderRadius: 999,

    backgroundColor: '#FF3B30',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});