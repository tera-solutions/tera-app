import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Icon, IconButton, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { RoomService } from '@tera/modules/education';
import { useStates } from '@hooks/useStates';

import { styles } from './styles';
import { DEFAULT_FORM_VALUES } from './constants';
import type { RoomFormValues } from './types';
import RoomInfoSection from './components/RoomInfoSection';
import RoomDescriptionSection from './components/RoomDescriptionSection';
import RoomStatusSection from './components/RoomStatusSection';

export default function RoomCreateScreen() {
  const router = useRouter();
  const { authStore } = useStates();
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const isEdit = !!roomId;

  const form = useForm<RoomFormValues>({ defaultValues: DEFAULT_FORM_VALUES });

  const detailQuery = RoomService.useRoomDetail({ id: roomId ?? '' });
  const editingRoom = isEdit ? detailQuery.data?.data?.room ?? detailQuery.data?.data : null;

  useEffect(() => {
    if (!isEdit || !editingRoom?.id) return;
    form.reset({
      room_name: editingRoom.room_name ?? '',
      room_code: editingRoom.room_code ?? '',
      room_type: editingRoom.room_type ?? 'classroom',
      floor: editingRoom.floor ?? '',
      capacity: editingRoom.capacity != null ? String(editingRoom.capacity) : '',
      description: editingRoom.description ?? '',
      status: editingRoom.status ?? 'active',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingRoom?.id]);

  const { mutate: upsertRoom, isPending: isSubmitting } = RoomService.useUpsertRoom();

  const handleSubmit = form.handleSubmit(
    (values) => {
      const params: Record<string, unknown> = {
        room_name: values.room_name,
        room_code: values.room_code || undefined,
        room_type: values.room_type,
        floor: values.floor || undefined,
        capacity: Number(values.capacity),
        description: values.description || undefined,
        status: values.status,
      };

      if (!isEdit) {
        params.branch_id = Number((authStore.user as any)?.branch_id);
      }

      upsertRoom(
        { id: isEdit ? Number(roomId) : undefined, params } as any,
        {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: isEdit ? 'Cập nhật phòng học thành công' : 'Thêm phòng học thành công',
            });
            router.back();
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: error?.msg ?? error?.message ?? (isEdit ? 'Không thể cập nhật phòng học' : 'Không thể thêm phòng học'),
            });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại thông tin phòng học' });
    },
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <IconButton
            icon={({ size, color }) => <Icon source="chevron-left" size={size} color={color} />}
            iconColor="#FFF"
            size={28}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>{isEdit ? 'Sửa phòng học' : 'Thêm phòng học'}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {isEdit && detailQuery.isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <RoomInfoSection form={form} />
            <RoomDescriptionSection form={form} />
            {isEdit && <RoomStatusSection form={form} />}
          </ScrollView>

          <View style={styles.bottomBar}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.bottomBarBtn}
              textColor="#64748B"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={[styles.bottomBarBtn, styles.btnSubmit]}
            >
              Lưu
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
