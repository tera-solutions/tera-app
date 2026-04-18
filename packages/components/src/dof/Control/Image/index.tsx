import ImageBackground from "@tera/components/web/ImageBackground";
import MultiImageBackground from "@tera/components/web/ImageBackground/MultiImage";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import { Controller } from "react-hook-form";

interface ImageProps {
  folder: string;
  object_key: string;
  multiple?: boolean;
  width?: number;
  [key: string]: any;
}

const Image = ({
  folder,
  object_key,
  multiple,
  width = 100,
  ...rest
}: ImageProps) => {
  const { form } = useTeraForm();
  const { item, rules } = useTeraFormItem();
  const { control } = form;

  return (
    <Controller
      {...item}
      control={control}
      rules={rules}
      render={({ field }) => {
        return multiple ? (
          <MultiImageBackground
            value={field?.value}
            onChange={(val) => {
              field?.onChange?.(val);
            }}
            isShowBtnDelete
            object_key={object_key}
            folder={folder}
            error={!!form.formState.errors?.[item.name]}
            width={width}
            {...rest}
          />
        ) : (
          <ImageBackground
            value={{ url: field?.value }}
            onChange={(val) => {
              field?.onChange?.(val ? val?.url : null);
            }}
            isShowBtnDelete
            object_key={object_key}
            folder={folder}
            error={!!form.formState.errors?.[item.name]}
            {...rest}
          />
        );
      }}
    />
  );
};

export default Image;
