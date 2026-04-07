import SelectDataStatus, {
  SelectDataStatusProps,
} from "../../SelectDataStatus";

const SelectStatusEmployee = (props: SelectDataStatusProps) => {
  return <SelectDataStatus statusType="crm_employee" {...props} />;
};

export default SelectStatusEmployee;
