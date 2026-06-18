import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,

    backgroundColor: '#F1F7FF',

    borderRadius: 24,

    flexDirection: 'row',

    paddingHorizontal: 20,
    paddingVertical: 20,

    overflow: 'hidden',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16A34A',
  },

  description: {
    fontSize: 15,
    color: '#667085',
    marginTop: 8,
    lineHeight: 22,
  },

  button: {
    marginTop: 16,
    alignSelf: 'flex-start',

    backgroundColor: '#0B84FF',

    borderRadius: 14,

    paddingHorizontal: 18,
    paddingVertical: 12,

    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  illustration: {
    width: 120,
    height: 120,
    marginLeft: 12,
  },
});