import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { notification, Select } from "tera-dls";

import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import FormScaff from "@tera/components/dof/FormScaff";
import Input from "@tera/components/dof/Control/Input";
import TextArea from "@tera/components/dof/Control/TextArea";
import UploadFiles from "@tera/components/dof/UploadFiles";
import { MaterialService } from "@tera/modules/education";

import { ACCESS_TYPE_OPTIONS, MATERIAL_TYPE_OPTIONS } from "../constants";

interface UploadMaterialFormValues {
  material_name: string;
  material_type: string;
  access_type: string;
  description?: string;
}

interface UploadMaterialModalProps {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_VALUES: UploadMaterialFormValues = {
  material_name: "",
  material_type: "document",
  access_type: "student",
  description: "",
};

const UploadMaterialModal = ({ open, onClose }: UploadMaterialModalProps) => {
  const form = useForm<UploadMaterialFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });
  const [file, setFile] = useState<{ id: number; name: string } | null>(null);

  const { mutate: createMaterial, isPending } = MaterialService.useMaterialCreate();

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    setFile(null);
    onClose();
  };

  const handleSubmit = (values: UploadMaterialFormValues) => {
    createMaterial(
      {
        params: {
          material_name: values.material_name,
          material_type: values.material_type,
          access_type: values.access_type,
          description: values.description || undefined,
          ...(file
            ? { file_id: file.id, file_name: file.name }
            : {}),
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: "Tải tài liệu lên thành công" });
          handleClose();
        },
        onError: (error: any) => {
          notification.error({
            message: error?.data?.msg ?? error?.message ?? "Không thể tải tài liệu lên",
          });
        },
      },
    );
  };

  return (
    <FormScaff
      open={open}
      onClose={handleClose}
      isEdit={false}
      titleCreate="Tải tài liệu lên"
      titleEdit="Tải tài liệu lên"
      className="!w-[95%] xmd:!w-[520px]"
      okText="Tải lên"
      onOk={() => form.handleSubmit(handleSubmit)()}
      confirmLoading={isPending}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTeraItem
          label="Tên tài liệu"
          name="material_name"
          rules={[{ required: "Vui lòng nhập tên tài liệu" }]}
        >
          <Input placeholder="VD: Giáo án Unit 5 - Family & Friends" />
        </FormTeraItem>

        <FormTeraItem label="Loại tài liệu" name="material_type">
          <Controller
            control={form.control}
            name="material_type"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={MATERIAL_TYPE_OPTIONS.filter((o) => o.value)}
              />
            )}
          />
        </FormTeraItem>

        <FormTeraItem label="Đối tượng truy cập" name="access_type">
          <Controller
            control={form.control}
            name="access_type"
            render={({ field }) => (
              <Select value={field.value} onChange={field.onChange} options={ACCESS_TYPE_OPTIONS} />
            )}
          />
        </FormTeraItem>

        <FormTeraItem label="Mô tả" name="description">
          <TextArea placeholder="Mô tả ngắn về tài liệu..." rows={3} />
        </FormTeraItem>

        <div>
          <p className="mb-1.5 text-sm font-semibold text-slate-700">Tệp đính kèm</p>
          <UploadFiles
            isSingle
            object_key="edu_material"
            folder="materials"
            onReceiveFiles={(f) => setFile({ id: Number(f.id), name: f.name })}
            onRemove={() => setFile(null)}
          />
        </div>
      </FormTera>
    </FormScaff>
  );
};

export default UploadMaterialModal;
