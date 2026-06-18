import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0094D9',
    padding: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  title: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: '700',
  },

  subtitle: {
    color: '#FFF',
    marginTop: 8,
    opacity: 0.9,
  },

  addButton: {
    position: 'absolute',
    right: 0,
    top: 70,
    width: 40,
    height: 40,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },

  searchBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    marginLeft: 10,
  },

  filterBtn: {
    width: 110,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  filterText: {
    color: '#0B84FF',
    fontWeight: '600',
  },
});