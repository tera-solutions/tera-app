import Form from '@components/shared/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useStores } from '@common/hooks/useStores';
import { useUpdateBusiness } from '@services/business.service';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { styles } from './styles';

console.log(">>> FILE ShopInfoScreen ĐÃ ĐƯỢC LOAD VÀO BỘ NHỚ");

const ShopInfoScreen: React.FC = () => {
  const {
    uiStore: { business_info },
  } = useStores();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: onUpdateBusiness, isPending } = useUpdateBusiness();

  const fnbSchema = z.object({
    name: z
      .string('Vui lòng nhập họ và tên')
      .min(6, 'Họ tên phải có ít nhất 6 ký tự'),
    owner_phone: z
      .string('Vui lòng nhập số điện thoại')
      .regex(/^[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
    address: z.string().nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(fnbSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['get_business'] });
  }, []);

  useEffect(() => {
    if (!business_info) return;
    methods.reset({ ...methods.getValues(), ...business_info });
  }, [business_info]);

  const handleSave = (data: any) => {
    onUpdateBusiness({ ...data });
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerIcon}
          >
            <Icon source="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Thông tin cửa hàng</Text>
          <TouchableOpacity
            onPress={() => router.replace('/')}
            style={styles.headerIcon}
          >
            <Icon source="home" size={24} color="#4c5768" />
          </TouchableOpacity>
        </View>
        <Form methods={methods}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Form.Input
              name="name"
              label="Tên cửa hàng"
              placeholder="Nhập tên cửa hàng"
            />
            <Form.Input
              name="owner_phone"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại cửa hàng"
              keyboardType="phone-pad"
            />
            <Form.Input
              name="address"
              label="Địa chỉ cửa hàng"
              placeholder="Nhập địa chỉ"
            />
            <View style={[styles.footer]}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={methods.handleSubmit(handleSave)}
              >
                <Text style={styles.saveButtonText}>XÁC NHẬN</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Form>
      </SafeAreaView>
    </View>
  );
};
export default ShopInfoScreen;
