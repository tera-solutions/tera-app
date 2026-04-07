import SelectDataStatus, {
  SelectDataStatusProps,
} from "../../SelectDataStatus";

const SelectStatusLead = (props: SelectDataStatusProps) => {
  return <SelectDataStatus statusType="crm_lead" {...props} />;
};

export default SelectStatusLead;
