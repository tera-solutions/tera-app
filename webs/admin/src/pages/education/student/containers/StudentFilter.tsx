import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Row } from "tera-dls";

import Filter from "@tera/components/web/Filter";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { Input } from "@tera/components/dof/Control";

interface UserFilterProps {
  open: boolean;
  initialValue: any;
  onClose: () => void;
  onFilter: (value) => void;
}

function StudentFilter({
  open,
  onClose,
  onFilter,
  initialValue,
}: UserFilterProps) {
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      ...initialValue,
    },
  });

  const handleSubmitForm = (value) => {
    const data = {
      ...value,
    };

    onFilter(data);
    onClose();
  };

  const handleReset = () => {
    const values = {
      type: null,
      is_active: null,
      business_id: null,
    };
    onFilter(values);
    onClose();
  };

  return (
    <Filter
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onFilter={() => form?.handleSubmit(handleSubmitForm)()}
    >
      <FormTera form={form} onSubmit={form?.handleSubmit(handleSubmitForm)}>
        <Row className="grid gap-y-0">
          <FormTeraItem label={t("student.code")} name="code">
            <Input placeholder={t("student.code")} />
          </FormTeraItem>
           <FormTeraItem label={t("student.name")} name="name">
            <Input placeholder={t("student.name")} />
          </FormTeraItem>
        </Row>
        <a
          className="text-red-500 text-sm font-normal cursor-pointer"
          onClick={() => handleReset()}
        >
          {t("button.clear_filter")}
        </a>
      </FormTera>
    </Filter>
  );
}

export default StudentFilter;
