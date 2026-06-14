import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    overflow: Platform.OS === 'web' ? 'scroll' : 'visible',
    height: Platform.OS === 'web' ? height - 10 : 'auto',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700', // Màu vàng Sổ Bán Hàng
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  titleText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  subtitleText: { fontSize: 12, color: '#6B7280' },

  // Chat Bubbles
  chatContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
    minHeight: height * 0.7, // Đảm bảo scrollable
  },
  bubbleWrapper: {
    maxWidth: '75%',
    marginVertical: 5,
  },
  userWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
    elevation: 1,
    marginBottom: 3,
  },
  userBubble: {
    backgroundColor: '#D1E6FF', // Màu xanh nhạt (user)
    borderBottomRightRadius: 2,
  },
  botBubble: {
    backgroundColor: '#F3F4F6', // Màu xám nhạt (bot)
    borderBottomLeftRadius: 2,
  },
  bubbleText: { fontSize: 15 },
  userText: { color: '#1F2937' },
  botText: { color: '#1F2937' },
  timeText: { fontSize: 10, color: '#9CA3AF' },

  // Suggested Actions
  suggestedActionsContainer: {
    marginVertical: 5,
    maxHeight: 40,
    marginHorizontal: 10,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  actionButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 14,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  moreActionButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // Input Area
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    fontSize: 15,
    height: 'auto',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: { backgroundColor: '#3B82F6' },
  sendButtonInactive: { backgroundColor: '#9CA3AF' },
});
