import SelectDataStatus, {
  SelectDataStatusProps,
} from "../../SelectDataStatus";

const SelectStatusQuotation = (props: SelectDataStatusProps) => {
  return <SelectDataStatus statusType="crm_quotation" {...props} />;
};

export default SelectStatusQuotation;
