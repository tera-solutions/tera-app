import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Form, FormItem, Input, getQueryParams } from "tera-dls";
import * as yup from "yup";

const schema = yup.object().shape({
  keyword: yup.string().nullable(),
});

const Searching = ({ onSearch }) => {
  const { search } = useLocation();
  const queryParams = getQueryParams(search) as any;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      keyword: queryParams?.keyword,
    },
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
        <Input
          placeholder="Tìm theo tên mã, tên nhân viên"
          className="rounded-xsm w-full"
          {...register("keyword")}
        />
      </FormItem>
    </Form>
  );
};

export default Searching;
