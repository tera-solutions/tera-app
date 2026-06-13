/* Import: library */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Row } from "tera-dls";

/* Import: packages */
import Filter from "@tera/components/web/Filter";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { Input } from "@tera/components/dof/Control";

/* Import: pages */
import { ITeacher } from "pages/education/hr/teacher/_interface";

const defaultValues: ITeacher = {
  code: undefined,
  name: undefined,
  type: undefined,
  status: undefined,
  salary_per_hour: undefined,
};

interface TeacherFilterProps {
  open: boolean;
  initialValue: ITeacher & {
    page?: number;
    per_page?: number;
  };
  onClose: () => void;
  onFilter: (value: ITeacher) => void;
}

const TeacherFilter = ({ open, onClose, onFilter, initialValue }: TeacherFilterProps) => {
  const { t } = useTranslation();
  const form = useForm<ITeacher>();

  useEffect(() => {
    form.reset(initialValue);
  }, [initialValue, form]);

  const handleSubmit = form.handleSubmit((value) => {
    const data:any = Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, v?.trim() || undefined])
    );

    onFilter(data);
    onClose();
  });

  const handleReset = () => {
    form.reset(defaultValues);
    onFilter(defaultValues);
    onClose();
  };

  return (
    <Filter open={open} onClose={onClose} onFilter={handleSubmit}>
      <FormTera form={form} onSubmit={handleSubmit}>
        <Row className="grid gap-y-0">

          <FormTeraItem label={t("teacher.code")} name="code">
            <Input placeholder={t("teacher.code")} />
          </FormTeraItem>
          <FormTeraItem label={t("teacher.name")} name="name">
            <Input placeholder={t("teacher.name")} />
          </FormTeraItem>
          <FormTeraItem label={t("teacher.type")} name="type">
            <Input placeholder={t("teacher.type")} />
          </FormTeraItem>
          <FormTeraItem label={t("teacher.status")} name="status">
            <Input placeholder={t("teacher.status")} />
          </FormTeraItem>
          <FormTeraItem label={t("teacher.salary_per_hour")} name="salary_per_hour">
            <Input placeholder={t("teacher.salary_per_hour")} />
          </FormTeraItem>
        </Row>

        <span className="text-red-500 cursor-pointer" onClick={handleReset}>
          {t("button.clear_filter")}
        </span>
      </FormTera>
    </Filter>
  );
};

export default TeacherFilter;
