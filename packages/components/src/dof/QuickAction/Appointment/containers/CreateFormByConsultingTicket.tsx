import { useQuery } from "@tanstack/react-query";
import ConsultingTicketApi from "../../_api/consultingTicket";
import CreateAppointmentModal from "@tera/components/shared/Activity/containers/Appointment/Containers/Modal/CreateAppointmentModal";

const CreateFormByConsultingTicket = ({ object_id, open, onClose }) => {
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
        <CreateAppointmentModal
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
