import SelectDataType, { SelectDataTypeProps } from "../../SelectDataType";

const SelectCampaignType = (props: SelectDataTypeProps) => {
  return <SelectDataType objectType="crm_campaign-type" {...props} />;
};

export default SelectCampaignType;
