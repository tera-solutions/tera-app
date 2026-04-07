import FormTera from "@tera/components/dof/FormTera";
import React from "react";
import { useForm } from "react-hook-form";

const EditableRow: React.FC<any> = (props) => {
  const form = useForm({ mode: "onChange" });
  const { record, onSave } = props;

  // const watchedData = useWatch({ control: form.control });
  // const isUpdatedData: boolean = Object.keys(watchedData)?.length > 0;

  const handleSubmitForm = (values: any): void => {
    onSave && onSave({ ...record, ...values });
  };

  // useEffect(() => {
  //   isUpdatedData && form.handleSubmit(handleSubmitForm)();
  // }, [watchedData]);

  return (
    <FormTera
      form={form}
      key={props["data-row-key"]}
      wrapper_type="table"
      isUpdate
      onSubmit={handleSubmitForm}
      {...props}
    />
  );
};

export default React.memo(EditableRow);
