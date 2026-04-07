import { useQuery } from "@tanstack/react-query";
import TaskCreateModal from "@tera/components/shared/Activity/containers/Task/Containers/Modal/CreateTaskModal";
import CustomerApi from "../../_api/customer";

type CreateFormByCustomerProps = {
  object_id: number;
  open: boolean;
  onClose: () => void;
  type: "customer" | "supplier";
};
const CreateFormByCustomer = ({
  object_id,
  open,
  onClose,
  type,
}: CreateFormByCustomerProps) => {
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
        <TaskCreateModal
          isOpen={open}
          handleClose={onClose}
          hiddenFields={["object", "object_type"]}
          initialValues={{
            object_type: type,
            object: customerDetail?.business_name,
            selectedObject: { ...customerDetail },
          }}
        />
      )}
    </>
  );
};

export default CreateFormByCustomer;
