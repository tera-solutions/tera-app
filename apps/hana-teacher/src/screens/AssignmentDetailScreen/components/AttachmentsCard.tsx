import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import type { AttachmentItem } from '../types';

interface Props {
  attachments: AttachmentItem[];
  isLoading: boolean;
}

export const AttachmentsCard = ({ attachments, isLoading }: Props) => (
  <View style={styles.card}>
    <View style={styles.sectionTitleRow}>
      <Icon source="paperclip" size={18} color="#007AFF" />
      <Text style={styles.sectionTitle}>Tài liệu đính kèm</Text>
    </View>

    {isLoading ? (
      <ActivityIndicator />
    ) : attachments.length === 0 ? (
      <Text style={styles.emptyText}>Chưa có tài liệu đính kèm</Text>
    ) : (
      attachments.map((item) => (
        <View key={item.id} style={styles.attachmentRow}>
          <View style={styles.attachmentIconBg}>
            <Icon source="file-document-outline" size={18} color="#007AFF" />
          </View>
          <View style={styles.attachmentMeta}>
            <Text style={styles.attachmentName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.attachmentSub}>
              {item.type} • {item.size} {item.date ? `• ${item.date}` : ''}
            </Text>
          </View>
        </View>
      ))
    )}
  </View>
);
