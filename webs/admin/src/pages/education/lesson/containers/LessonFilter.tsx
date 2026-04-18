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
import { ILesson } from "pages/education/lesson/_interface";

const defaultValues: ILesson = {
    code: undefined,
  name: undefined,
  level: undefined,
  status: undefined,
};

interface LessonFilterProps {
  open: boolean;
  initialValue: ILesson & {
    page: number;
    pageSize: number;
  };
  onClose: () => void;
  onFilter: (value: ILesson) => void;
}

const LessonFilter = ({ open, onClose, onFilter, initialValue }: LessonFilterProps) => {
  const { t } = useTranslation();
  const form = useForm<ILesson>();

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
          
          <FormTeraItem label={t("lesson.code")} name="code">
            <Input placeholder={t("lesson.code")} />
          </FormTeraItem>
          <FormTeraItem label={t("lesson.name")} name="name">
            <Input placeholder={t("lesson.name")} />
          </FormTeraItem>
          <FormTeraItem label={t("lesson.level")} name="level">
            <Input placeholder={t("lesson.level")} />
          </FormTeraItem>
          <FormTeraItem label={t("lesson.status")} name="status">
            <Input placeholder={t("lesson.status")} />
          </FormTeraItem>
        </Row>

        <span className="text-red-500 cursor-pointer" onClick={handleReset}>
          {t("button.clear_filter")}
        </span>
      </FormTera>
    </Filter>
  );
};

export default LessonFilter;
