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
import { ICourse } from "pages/education/course/_interface";

const defaultValues: ICourse = {
    code: undefined,
  name: undefined,
  level_id: undefined,
  program_id: undefined,
  duration: undefined,
  price: undefined,
};

interface CourseFilterProps {
  open: boolean;
  initialValue: ICourse & {
    page: number;
    pageSize: number;
  };
  onClose: () => void;
  onFilter: (value: ICourse) => void;
}

const CourseFilter = ({ open, onClose, onFilter, initialValue }: CourseFilterProps) => {
  const { t } = useTranslation();
  const form = useForm<ICourse>();

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
          
          <FormTeraItem label={t("course.code")} name="code">
            <Input placeholder={t("course.code")} />
          </FormTeraItem>
          <FormTeraItem label={t("course.name")} name="name">
            <Input placeholder={t("course.name")} />
          </FormTeraItem>
          <FormTeraItem label={t("course.level_id")} name="level_id">
            <Input placeholder={t("course.level_id")} />
          </FormTeraItem>
          <FormTeraItem label={t("course.program_id")} name="program_id">
            <Input placeholder={t("course.program_id")} />
          </FormTeraItem>
          <FormTeraItem label={t("course.duration")} name="duration">
            <Input placeholder={t("course.duration")} />
          </FormTeraItem>
          <FormTeraItem label={t("course.price")} name="price">
            <Input placeholder={t("course.price")} />
          </FormTeraItem>
        </Row>

        <span className="text-red-500 cursor-pointer" onClick={handleReset}>
          {t("button.clear_filter")}
        </span>
      </FormTera>
    </Filter>
  );
};

export default CourseFilter;
