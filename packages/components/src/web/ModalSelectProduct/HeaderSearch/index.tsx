import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { tw } from "tailwind-merge.config";
import { Form, FormItem, MagnifyingGlassOutlined, Search } from "tera-dls";
import * as yup from "yup";
const schema = yup.object().shape({
  keyword: yup.string().nullable(),
});

interface IHeader {
  onSearch: (value: any) => void;
  placeholderProp?: string;
}

function SelectContactModalHeader({
  onSearch,
  placeholderProp = "Tìm kiếm theo mã đơn hàng, tên khách hàng, tên nhân viên",
}: IHeader) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSearch = (value) => {
    if (isDirty) {
      onSearch(value);
      reset({ ...value }, { keepValues: true });
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleSearch)}>
      <FormItem className="!mb-0">
        <Search
          placeholder={placeholderProp}
          icon={<MagnifyingGlassOutlined />}
          {...register("keyword")}
          className={classNames(
            tw("sm:w-[300px] xmd:w-[400px]"),
            "rounded-full",
          )}
        />
      </FormItem>
    </Form>
  );
}

export default SelectContactModalHeader;
