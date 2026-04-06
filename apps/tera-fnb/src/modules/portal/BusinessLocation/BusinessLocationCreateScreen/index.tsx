import Form from '@components/shared/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Loading } from '@components/ui/Loading';
import {
  useCreateOrUpdateBusinessLocation,
  useGetBusinessLocationDetail,
} from '@services/business_location.service';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { styles } from './styles';

const BusinessLocationCreateScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params?.id as string;

  const { data: dataDetail, isLoading } = useGetBusinessLocationDetail(id);
  const [is_new_address, setIsNewAddress] = useState(true);
  console.tron('dataDetail', dataDetail);

  const { mutate: onCreateOrUpdate, isPending: isCreateLoading } =
    useCreateOrUpdateBusinessLocation();

  const fnbSchema = z.object({
    name: z
      .string('Vui lòng nhập họ và tên')
      .min(6, 'Họ tên phải có ít nhất 6 ký tự'),
    mobile: z
      .string('Vui lòng nhập số điện thoại')
      .regex(/^[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
    landmark: z.string().nullable(),
    state: z.string().nullable(),
    city: z.string().nullable(),
    ward: z.string().nullable(),
    is_new_address: z.coerce.boolean(),
    is_default: z.coerce.boolean(),
  });

  const methods = useForm({
    resolver: zodResolver(fnbSchema),
    mode: 'onBlur',
    defaultValues: {
      landmark: '',
      state: '',
      city: '',
      ward: '',
      is_new_address: true,
      is_default: false,
    },
  });

  useEffect(() => {
    if (!id) return;
    queryClient.invalidateQueries({
      queryKey: ['business_location', 'detail', id],
    });
  }, [id]);

  useEffect(() => {
    if (!dataDetail?._raw) return;
    methods.reset({
      ...methods.getValues(),
      ...dataDetail?._raw,
      is_default: !!dataDetail?.is_default,
    });
    setIsNewAddress(!!dataDetail?._raw?.is_new_address);
  }, [dataDetail?._raw]);

  const handelBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/portal/business-location/[id]',
        params: { id: id },
      });
    }
  };

  const handleSave = (data: any) => {
    const requestData = {
      ...data,
      id: id,
      is_new_address: data?.is_new_address ? 1 : 0,
      is_default: data?.is_default ? 1 : 0,
    };
    console.tron('requestData', requestData);
    onCreateOrUpdate({
      params: requestData,
      callback: handelBack,
    });
  };

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <Loading isLoading={isLoading || isCreateLoading}>
          <Form methods={methods}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handelBack} style={styles.headerIcon}>
                <Icon source="arrow-left" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.titleText}>
                {id ? dataDetail?.name : 'Thêm mới chi nhánh'}
              </Text>
              <TouchableOpacity
                onPress={methods.handleSubmit(handleSave)}
                style={styles.headerIcon}
              >
                <Icon source="check" size={24} color="#4c5768" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Form.Input
                name="name"
                label="Tên chi nhánh"
                placeholder="Nhập tên chi nhánh"
              />
              <Form.Input
                name="mobile"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại cửa hàng"
                keyboardType="phone-pad"
              />
              <Form.Switch
                name="is_new_address"
                value={is_new_address}
                onValueChange={setIsNewAddress}
                label="Địa chỉ mới"
              />
              <Form.Input
                name="landmark"
                label="Địa chỉ lấy hàng (Số nhà, ngõ ngách)"
                placeholder="Nhập địa chỉ lấy hàng"
              />
              {is_new_address ? (
                <>
                  <Form.Input
                    name="state"
                    label="Tỉnh/Thành phố"
                    placeholder="Chọn Tỉnh/Thành phố"
                  />
                  <Form.Input
                    name="city"
                    label="Phường/xã"
                    placeholder="Chọn Phường/xã"
                  />
                </>
              ) : (
                <>
                  <Form.Input
                    name="state"
                    label="Tỉnh/Thành phố"
                    placeholder="Chọn Tỉnh/Thành phố"
                  />
                  <Form.Input
                    name="city"
                    label="Quận/Huyện"
                    placeholder="Chọn Quận/Huyện"
                  />
                  <Form.Input
                    name="ward"
                    label="Phường/xã"
                    placeholder="Chọn Phường/xã"
                  />
                </>
              )}
              <Form.Switch name="is_default" label="Địa chỉ mặc định" />
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
        </Loading>
      </SafeAreaView>
    </View>
  );
};
export default BusinessLocationCreateScreen;
