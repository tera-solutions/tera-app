import SelectDataStatus, {
  SelectDataStatusProps,
} from "../../SelectDataStatus";

const SelectStatusContact = (props: SelectDataStatusProps) => {
  return <SelectDataStatus statusType="crm_contact" {...props} />;
};

export default SelectStatusContact;
