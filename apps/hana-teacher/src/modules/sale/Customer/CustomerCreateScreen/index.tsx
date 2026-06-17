import Form from '@components/shared/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateOrUpdateCustomer,
  useGetCustomerDetail,
} from '@hana/teacher/services/customer.service';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import z from 'zod';
import { CustomerObjectText, CustomerObjectType } from '../_interface';
import { styles } from './styles';

const CustomerCreateScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params?.id as string;
  const isEditing = !!id;

  const { data: dataDetail, isLoading } = useGetCustomerDetail(id);
  console.tron('dataDetail', dataDetail);

  const { mutate: onCreateOrUpdate, isPending: isCreateLoading } =
    useCreateOrUpdateCustomer();

  const [customerGroup, setCustomerGroup] = useState<CustomerObjectType>(
    Object.keys(CustomerObjectText)[0] as CustomerObjectType,
  );
  const [isNewAddress, setIsNewAddress] = useState(false);

  const fnbSchema = z.object({
    business_name: z.string('Vui lòng nhập tên khách hàng'),
    foreign_name: z.string().nullable(),
    phone: z.string().nullable(),
    code: z.string().nullable(),
    email: z.string().nullable(),
    birthday: z.string().nullable(),
    sex: z.string().nullable(),
    address: z.string().nullable(),
    is_new_address: z.coerce.boolean(),
  });

  const methods = useForm({
    resolver: zodResolver(fnbSchema),
    mode: 'onBlur',
    defaultValues: {
      business_name: '',
      foreign_name: '',
      phone: '',
      code: '',
      email: '',
      birthday: '',
      sex: '',
      address: '',
      is_new_address: true,
    },
  });

  useEffect(() => {
    if (!id) return;
    queryClient.invalidateQueries({
      queryKey: ['customer', 'detail', id],
    });
  }, [id]);

  useEffect(() => {
    if (!dataDetail?._raw) return;
    methods.reset({
      ...methods.getValues(),
      ...dataDetail?._raw,
      is_default: !!dataDetail?.is_default,
    });
  }, [dataDetail?._raw]);

  const handelBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/sale/customer/[id]',
        params: { id: id },
      });
    }
  };

  const handleSave = (data: any) => {
    const requestData = {
      ...data,
      id: id,
      is_new_address: data?.is_new_address ? 1 : 0,
    };
    console.tron('requestData', requestData);
    onCreateOrUpdate({
      params: requestData,
      callback: handelBack,
    });
  };

  const handleOpenPicker = () => {};

  return (
    <View style={styles.containerFull}>
      <SafeAreaView style={styles.safeArea}>
        <Form methods={methods}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon source="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.titleText}>
              {isEditing ? 'Thông tin khách hàng' : 'Thêm khách hàng'}
            </Text>
            <TouchableOpacity
              onPress={methods.handleSubmit(handleSave)}
              style={styles.headerIcon}
            >
              <Icon source="check" size={24} color="#4c5768" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* 1. THÔNG TIN CƠ BẢN */}
            <View style={styles.inputSection}>
              <Form.Input
                name="business_name"
                label="Tên khách hàng"
                placeholder="Nhập tên khách hàng hoặc tên doanh nghiệp"
              />
              <Form.Input
                name="foreign_name"
                label="Tên tiếng Anh"
                placeholder="Nhập tên tiếng Anh"
              />

              <View style={styles.inputGroupRow}>
                <Form.Input
                  name="phone"
                  label="Số điện thoại"
                  placeholder="09xxxxxxxx"
                  style={{ flex: 1 }}
                />
                <Form.Input
                  name="code"
                  label="Mã khách hàng"
                  placeholder="KH001"
                  style={{ flex: 1 }}
                />
              </View>

              <Form.Input
                name="email"
                label="Email"
                placeholder="Nhập địa chỉ mail"
              />
            </View>

            {/* 2. PHÂN LOẠI & THÔNG TIN CÁ NHÂN */}
            <View style={[styles.inputSection, styles.mt10]}>
              {/* Nhóm khách hàng */}
              <TouchableOpacity
                style={styles.pickerRow}
                onPress={() => handleOpenPicker()}
              >
                <View style={{ marginRight: 10 }}>
                  <Icon source="menu" size={20} color="#6B7280" />
                </View>
                <Text style={styles.pickerLabel}>Nhóm khách hàng</Text>
                <Text style={styles.pickerValue}>
                  {CustomerObjectText[customerGroup]}
                </Text>
                <TouchableOpacity onPress={() => console.tron('Tạo mới nhóm')}>
                  <Text style={styles.createNewLabel}>+ Tạo mới</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.inputGroupRow}>
                <Form.Input
                  name="birthday"
                  label="Ngày sinh nhật"
                  placeholder="DD-MM-YYYY"
                  style={{ flex: 1 }}
                />
                <Form.Input
                  name="sex"
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  style={{ flex: 1 }}
                />
              </View>

              <Form.Switch
                name="is_new_address"
                value={isNewAddress}
                onValueChange={setIsNewAddress}
                label="Sử dụng địa chỉ mới sau sắp nhập"
              />

              <Form.Input
                name="address"
                label="Địa chỉ khách hàng"
                placeholder="Nhập đầy đủ địa chỉ khách hàng"
              />
            </View>
          </ScrollView>

          {/* FOOTER ACTIONS */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={methods.handleSubmit(handleSave)}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Cập nhật' : 'Lưu'}
              </Text>
            </TouchableOpacity>
          </View>
        </Form>
      </SafeAreaView>
    </View>
  );
};

export default CustomerCreateScreen;
