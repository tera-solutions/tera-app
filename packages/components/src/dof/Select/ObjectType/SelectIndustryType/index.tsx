import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectIndustryType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_industry" {...props} />;
};

export default SelectIndustryType;
