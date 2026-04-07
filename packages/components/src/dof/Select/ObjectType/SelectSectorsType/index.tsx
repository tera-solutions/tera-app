import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectSectorsType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_sectors" {...props} />;
};

export default SelectSectorsType;
