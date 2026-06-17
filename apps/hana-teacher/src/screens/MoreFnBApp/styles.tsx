import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const NUM_COLUMNS = 4;
const ITEM_WIDTH = width / NUM_COLUMNS;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  scrollViewContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#3B82F6', // Vòng tròn màu xanh
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  email: {
    fontSize: 13,
    color: '#6B7280',
  },
  upgradeButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  upgradeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },

  // Grid Styles
  sectionContainer: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  newTag: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  gridText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#1F2937',
  },
  supportButton: {
    position: 'absolute',
    bottom: 120, // Đặt trên Tab Bar
    right: 20,
    backgroundColor: '#3B82F6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    paddingBottom: 20, // Khoảng trống dưới cùng
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  spacer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.1,
  },
  logoutButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 9,
    alignItems: 'center',
  },
});
