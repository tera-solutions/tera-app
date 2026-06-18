import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // SECTION
  container: {
    marginTop: -40,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: 'space-between',
    gap: 4

  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  // CARD
  card: {
    width: "24%",
    backgroundColor: '#FFFFFF',
    borderRadius: 20,

    paddingHorizontal: 0,
    paddingVertical: 8,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#EEF2F6',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  iconContainer: {
    width: 45,
    height: 45,

    borderRadius: 26,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 6,
  },

  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1F5C',

    lineHeight: 28,
  },

  title: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '600',

    color: '#1E293B',

    textAlign: 'center',
  },

  subtitle: {
    marginTop: 4,

    fontSize: 8,
    fontWeight: '400',

    color: '#94A3B8',

    textAlign: 'center',
  },
});