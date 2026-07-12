import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { RoomService } from '@tera/modules/education';

import DetailHeader from './components/DetailHeader';
import SummaryCard from './components/SummaryCard';
import InfoSection from './components/InfoSection';
import DescriptionSection from './components/DescriptionSection';

import { toRoomDetailInfo } from './_utils';
import { styles } from './styles';

export default function RoomDetailScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();

  const detailQuery = RoomService.useRoomDetail({ id: roomId ?? '' });
  const room = detailQuery.data?.data?.room ?? detailQuery.data?.data;
  const info = useMemo(() => toRoomDetailInfo(room), [room]);

  const notFound = !roomId || (!detailQuery.isLoading && (detailQuery.isError || !info));

  return (
    <View style={styles.container}>
      {notFound ? (
        <>
          <DetailHeader />
          <View style={styles.emptyWrapper}>
            <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>Không tìm thấy phòng học</Text>
          </View>
        </>
      ) : detailQuery.isLoading || !info ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 80 }} />
      ) : (
        <>
          <DetailHeader onEdit={() => router.push(`/edu/room-create?roomId=${info.id}` as any)} />

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <SummaryCard info={info} />
            <InfoSection info={info} />
            <DescriptionSection info={info} />
          </ScrollView>
        </>
      )}
    </View>
  );
}
