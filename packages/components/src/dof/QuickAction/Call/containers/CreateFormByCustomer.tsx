import { useQuery } from "@tanstack/react-query";
import CustomerApi from "../../_api/customer";
import CreateCallModal from "@tera/components/shared/Activity/containers/Call/Containers/Modal/CreateCallModal";

const CreateFormByCustomer = ({ object_id, open, onClose, type }) => {
  const { data: customerDetail } = useQuery({
    queryKey: ["get-quick-action-customer-detail", object_id],
    queryFn: () => CustomerApi.getDetail({ id: object_id }),
    staleTime: 300000,
    gcTime: 300000,
    enabled: !!object_id,
  });

  return (
    <>
      {open && (
        <CreateCallModal
          isOpen={open}
          handleClose={onClose}
          disabledFields={["object", "object_type"]}
          initialValues={{
            object_type: type,
            object: customerDetail?.business_name,
            selectedObject: customerDetail,
          }}
        />
      )}
    </>
  );
};

export default CreateFormByCustomer;
