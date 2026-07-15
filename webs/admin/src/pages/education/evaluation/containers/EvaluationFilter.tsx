/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: packages */
import FilterButton from "@tera/components/dof/FilterButton";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import { CLASSIFICATIONS, EVALUATION_TYPES } from "../_interface";

interface IProps {
  typeFilter: string;
  onChangeType: (value: string) => void;
  classificationFilter: string;
  onChangeClassification: (value: string) => void;
  filterCount: number;
  onOpenFilter: () => void;
}

const EvaluationFilter = ({
  typeFilter,
  onChangeType,
  classificationFilter,
  onChangeClassification,
  filterCount,
  onOpenFilter,
}: IProps) => {
  const { t } = useTranslation();

  return (
    <>
      <FilterButton onClick={onOpenFilter} count={filterCount} />

      {/* 2 select — CHỈ desktop (mobile đưa vào modal "Lọc") */}
      <div className='hidden xmd:contents'>
        <FilterSelect
          allowClear
          className='w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[160px]'
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
          className='w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[150px]'
          value={classificationFilter}
          placeholder={t("evaluation.all_classifications")}
          options={CLASSIFICATIONS.map((v) => ({
            value: v,
            label: t(`evaluation.class_${v}`),
          }))}
          onChange={onChangeClassification}
        />
      </div>
    </>
  );
};

export default EvaluationFilter;
