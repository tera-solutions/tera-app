import SearchTera from "@tera/components/web/UIV2/Search";
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import customTwMerge from "tailwind-merge.config";
import { SearchProps } from "tera-dls";

const Search = forwardRef<HTMLDivElement, SearchProps>(({ ...props }, ref) => {
  const { form } = useTeraForm();
  const { item, config, rules } = useTeraFormItem();
  const { control } = form;

  return (
    <Controller
      control={control}
      defaultValue=""
      {...item}
      rules={rules}
      render={({ field }) => (
        <SearchTera
          data-object_type={item?.object_type}
          data-object_id={item?.object_id}
          placeholder="Vui lòng nhập"
          {...field}
          {...props}
          {...config?.field}
          className={customTwMerge(
            "sm:w-full md:w-full lg:w-[400px] rounded-[39px]",
            props.className,
            config.class_name,
          )}
        />
      )}
    />
  );
});

export default Search;
