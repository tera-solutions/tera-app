"use client";

import Input from "@tera/components/dof/Control/Input";
import { FormTeraItem } from "@tera/components/dof/FormTera";
import SelectCountryType from "@tera/components/dof/Select/ObjectType/SelectCountryType";
import SelectDistrictType from "@tera/components/dof/Select/ObjectType/SelectDistrictType";
import SelectProvinceType from "@tera/components/dof/Select/ObjectType/SelectProvinceType";
import SelectWardType from "@tera/components/dof/Select/ObjectType/SelectWardType";
import { useEffect, useState } from "react";

interface FormAddressProps {
  form: any;
  dataDetail?: any;
}

function FormAddress({ form, dataDetail }: FormAddressProps) {
  const [province, setProvince] = useState<string>(null);
  const [district, setDistrict] = useState<string>(null);
  const [ward, setWard] = useState<string>(null);
  const watch = form?.watch();
  // const codeCountry = 'crm_country_vn';

  const handleReset = (type: "province" | "district" | "ward") => {
    switch (type) {
      case "province": {
        form.setValue("province", null);
        form.setValue("district", null);
        form.setValue("ward", null);

        setProvince(null);
        setDistrict(null);
        setWard(null);
        break;
      }
      case "district": {
        form.setValue("district", null);
        form.setValue("ward", null);

        setDistrict(null);
        setWard(null);
        break;
      }
      case "ward": {
        form.setValue("ward", null);

        setWard(null);
        break;
      }
    }
  };

  useEffect(() => {
    // fix bug 877
    // if (form?.formState?.isDirty) {
    const address = [];
    if (watch?.house_number) address.push(watch?.house_number);
    if (ward) address.push(ward);
    if (district) address.push(district);
    if (province) address.push(province);

    form.setValue("address", address.join(", "));
    // }
  }, [watch?.house_number, province, district, ward]);

  useEffect(() => {
    if (dataDetail?.province_text)
      setProvince(dataDetail?.province_text?.title);
    if (dataDetail?.district_text)
      setDistrict(dataDetail?.district_text?.title);
    if (dataDetail?.ward_text) setWard(dataDetail?.ward_text?.title);
  }, [dataDetail]);

  return (
    <>
      <FormTeraItem label="Quốc gia" name="country">
        <SelectCountryType
          onClear={() => handleReset("province")}
          onChangeCustom={() => handleReset("province")}
        />
      </FormTeraItem>
      <FormTeraItem label="Tỉnh/thành phố" name="province">
        <SelectProvinceType
          onClear={() => {
            handleReset("district");
            setProvince(null);
          }}
          onChangeCustom={() => handleReset("district")}
          onSelect={(selected: any) => setProvince(selected?.label)}
          paramsApi={{ parent_key: form.watch("country") }}
          // disabled={watch?.country !== codeCountry || !watch?.country}
          disabled={!watch?.country}
        />
      </FormTeraItem>
      <FormTeraItem label="Quận, huyện" name="district">
        <SelectDistrictType
          onClear={() => {
            handleReset("ward");
            setDistrict(null);
          }}
          onChangeCustom={() => handleReset("ward")}
          onSelect={(selected: any) => setDistrict(selected?.label)}
          paramsApi={{ parent_key: form.watch("province") }}
          // disabled={watch?.country !== codeCountry || !form.watch('province')}
          disabled={!form.watch("province")}
        />
      </FormTeraItem>
      <FormTeraItem label="Phường, xã" name="ward">
        <SelectWardType
          onClear={() => {
            setWard(null);
          }}
          onSelect={(selected: any) => setWard(selected?.label)}
          paramsApi={{ parent_key: form.watch("district") }}
          // disabled={watch?.country !== codeCountry || !form.watch('district')}
          disabled={!form.watch("district")}
        />
      </FormTeraItem>
      <FormTeraItem label="Số nhà, đường phố" name="house_number">
        <Input maxLength={255} />
      </FormTeraItem>
      <FormTeraItem label="Địa chỉ" name="address">
        <Input placeholder="Vui lòng nhập" />
      </FormTeraItem>
    </>
  );
}

export default FormAddress;
