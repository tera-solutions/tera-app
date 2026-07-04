/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import { CLASSIFICATIONS, EVALUATION_TYPES } from "../_interface";

interface IProps {
  typeFilter: string;
  onChangeType: (value: string) => void;
  classificationFilter: string;
  onChangeClassification: (value: string) => void;
}

/** Bộ lọc đánh giá: Loại đánh giá (evaluation_type) + Xếp loại (classification). */
const EvaluationFilter = ({
  typeFilter,
  onChangeType,
  classificationFilter,
  onChangeClassification,
}: IProps) => {
  const { t } = useTranslation();

  return (
    <>
      <FilterSelect
        allowClear
        className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[160px]"
        value={typeFilter}
        placeholder={t("evaluation.all_types")}
        options={EVALUATION_TYPES.map((v) => ({
          value: v,
          label: t(`evaluation.type_${v}`),
        }))}
        onChange={onChangeType}
      />
      <FilterSelect
        allowClear
        className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[150px]"
        value={classificationFilter}
        placeholder={t("evaluation.all_classifications")}
        options={CLASSIFICATIONS.map((v) => ({
          value: v,
          label: t(`evaluation.class_${v}`),
        }))}
        onChange={onChangeClassification}
      />
    </>
  );
};

export default EvaluationFilter;
