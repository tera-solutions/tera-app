import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectCountryType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_country" {...props} />;
};

export default SelectCountryType;
