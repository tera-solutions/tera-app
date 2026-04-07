import { useQuery } from "@tanstack/react-query";
import ConsultingTicketApi from "../../_api/consultingTicket";
import TaskCreateModal from "@tera/components/shared/Activity/containers/Task/Containers/Modal/CreateTaskModal";

type CreateFormByConsultingTicketProps = {
  object_id: number;
  open: boolean;
  onClose: () => void;
};
const CreateFormByConsultingTicket = ({
  object_id,
  open,
  onClose,
}: CreateFormByConsultingTicketProps) => {
  const { data: dataDetail } = useQuery({
    queryKey: ["get-detail-consulting-ticket", object_id],
    queryFn: () => ConsultingTicketApi.getDetail(object_id),
    enabled: !!object_id,
    staleTime: 300000,
    gcTime: 300000,
  });

  return (
    <>
      {open && (
        <TaskCreateModal
          isOpen={open}
          handleClose={onClose}
          hiddenFields={["object", "object_type", "relate_to", "relate_type"]}
          initialValues={{
            relate_to: object_id,
            relate_type: "consulting_ticket",
            object_type: "customer",
            object: dataDetail?.customer?.name,
            selectedObject: { ...dataDetail?.customer, type: "customer" },
          }}
        />
      )}
    </>
  );
};

export default CreateFormByConsultingTicket;
