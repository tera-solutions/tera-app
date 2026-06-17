import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    overflow: 'scroll',
    height: Platform.OS === 'web' ? height - 10 : '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#1C6DD8',
  },
  titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

  scrollContent: { paddingBottom: 20 },

  // 1. Profile Header
  profileHeader: {
    backgroundColor: '#1C6DD8', // Màu xanh dương đậm như Sapo
    paddingBottom: 25,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1C6DD8',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  storeUrl: {
    fontSize: 13,
    color: '#E5E7EB',
  },

  // 2. Actions
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#f7f7f7ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 5,
  },

  // 3. Info Details
  infoContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIcon: { width: 30 },
  infoTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
    width: 100,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
  },

  // Logout
  logoutButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
