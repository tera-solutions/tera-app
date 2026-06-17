import { TextInput } from '@components/ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

// --- Dữ liệu giả định tin nhắn ---
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
  suggestedActions?: string[]; // Các nút gợi ý
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Tặng 2 tháng Sổ Bán Hàng - Giảm 35% khi nâng cấp gói năm (tối đa 600.000đ). Hãy bấm "Nhận ưu đãi!" để nhận ưu đãi ngay nhé!',
    sender: 'bot',
    time: '22:47',
    suggestedActions: ['Nhận ưu đãi!', 'Hỗ trợ giải đáp'],
  },
  {
    id: '2',
    text: 'Tôi muốn gia hạn cửa hàng, có ưu đãi gì không?',
    sender: 'user',
    time: '22:48',
  },
  {
    id: '3',
    text: 'Dạ vâng, em sẽ chuyển thông tin cho bộ phận tư vấn sẽ liên lạc lại cho anh/chị trong vòng 30p trong khung giờ làm việc. Anh/chị vui lòng chú ý đề nhận cuộc gọi tư vấn giúp em nha, em cảm ơn ạ.',
    sender: 'bot',
    time: '22:49',
  },
  {
    id: '4',
    text: 'Tôi muốn gia hạn cửa hàng, có ưu đãi gì không?',
    sender: 'user',
    time: '22:49',
  }, // Tin nhắn bị lặp trong a58.jpg
];

// --- Component Bubble Tin nhắn ---
const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <View
      style={[
        styles.bubbleWrapper,
        isUser ? styles.userWrapper : styles.botWrapper,
      ]}
    >
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        <Text
          style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}
        >
          {message.text}
        </Text>
      </View>
      <Text style={styles.timeText}>{message.time} - 13-12-2025</Text>
    </View>
  );
};

// --- Component Nút gợi ý (Suggested Actions) ---
const SuggestedActions: React.FC<{
  actions: string[];
  onActionPress: (action: string) => void;
}> = ({ actions, onActionPress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.suggestedActionsContainer}
  >
    {actions.map((action, index) => (
      <TouchableOpacity
        key={index}
        style={styles.actionButton}
        onPress={() => onActionPress(action)}
      >
        <Text style={styles.actionButtonText}>{action}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// --- Màn hình chính ChatScreen ---
const ChatScreen: React.FC = () => {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (messageInput.trim()) {
      console.tron('Sending message:', messageInput.trim());
      // Logic thêm tin nhắn vào state/API
      setMessageInput('');
    }
  };

  const handleSuggestedAction = (action: string) => {
    console.tron('Suggested action selected:', action);
    // Có thể điền vào input hoặc gọi API tùy hành động
    setMessageInput(action);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          {/* Giả lập avatar Sổ Bán Hàng */}
          <View style={styles.botAvatar}>
            <Icon source="account" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.titleText}>Tera Admin</Text>
            <Text style={styles.subtitleText}>Online vài phút trước</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => console.tron('Thao tác khác')}>
          <Icon source="plus" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        {/* BODY: Lịch sử tin nhắn */}
        <ScrollView contentContainerStyle={styles.chatContainer}>
          {MOCK_MESSAGES.map((msg) => (
            <View key={msg.id}>
              <ChatBubble message={msg} />
              {/* Hiển thị nút gợi ý ngay sau tin nhắn bot */}
              {msg.sender === 'bot' && msg.suggestedActions && (
                <SuggestedActions
                  actions={msg.suggestedActions}
                  onActionPress={handleSuggestedAction}
                />
              )}
            </View>
          ))}

          {/* Các nút chức năng dưới cùng (a58.jpg) */}
          <View style={styles.bottomActions}>
            <SuggestedActions
              actions={['Nhận tư vấn Thuế/DVKT', 'Mở TK Hong Leong']}
              onActionPress={handleSuggestedAction}
            />
            <TouchableOpacity style={styles.moreActionButton}>
              <Icon source="menu" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* FOOTER: Input nhập liệu */}
        <View style={styles.inputArea}>
          <TouchableOpacity
            onPress={() => console.tron('Tệp đính kèm/Thư viện')}
          >
            <Icon source="file-image-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.tron('Tệp đính kèm/Thư viện')}
          >
            <Icon source="camera-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Nhập tin nhắn"
            value={messageInput}
            onChangeText={setMessageInput}
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              messageInput.trim()
                ? styles.sendButtonActive
                : styles.sendButtonInactive,
            ]}
            onPress={handleSend}
            disabled={!messageInput.trim()}
          >
            <Icon source="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
