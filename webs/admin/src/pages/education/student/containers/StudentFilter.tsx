/* Import: library */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Row } from "tera-dls";

/* Import: packages */
import Filter from "@tera/components/web/Filter";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { Input } from "@tera/components/dof/Control";
import { ListParams } from "@tera/commons/interfaces";

/* Import: pages */
import { IStudent } from "pages/education/student/_interface";

interface StudentFilterProps {
  open: boolean;
  initialValue: ListParams<IStudent>;
  onClose: () => void;
  onFilter: (value: IStudent) => void;
}

function StudentFilter({
  open,
  onClose,
  onFilter,
  initialValue,
}: StudentFilterProps) {
  const { t } = useTranslation();

  const form = useForm<IStudent>();

  useEffect(() => {
    form.reset(initialValue.filters);
  }, [initialValue, form]);

  const handleSubmitForm = (value: IStudent) => {
    onFilter(value);
    onClose();
  };

  const handleReset = () => {
    const defaultValues: IStudent = {
      code: undefined,
      name: undefined,
    };
    form.reset(defaultValues);
    onFilter(defaultValues);
    onClose();
  };

  return (
    <Filter
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onFilter={() => form.handleSubmit(handleSubmitForm)()}
    >
      <FormTera form={form} onSubmit={form.handleSubmit(handleSubmitForm)}>
        <Row className="grid gap-y-0">
          <FormTeraItem label={t("student.code")} name="code">
            <Input placeholder={t("student.code")} />
          </FormTeraItem>
          <FormTeraItem label={t("student.name")} name="name">
            <Input placeholder={t("student.name")} />
          </FormTeraItem>
        </Row>
        <span
          className="text-red-500 text-sm font-normal cursor-pointer"
          onClick={handleReset}
        >
          {t("button.clear_filter")}
        </span>
      </FormTera>
    </Filter>
  );
}

export default StudentFilter;
