import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  ExclamationTriangleOutlined,
  Modal,
  ModalProps,
  notification,
} from "tera-dls";
import ErrorToast from "../ToastCustom/ErrorsToast";
import WorkflowApi from "./_api";

interface ModalWorkflowDefaultProps extends ModalProps {
  onClose?: () => void;
}

function ModalWorkflowDefault({
  onClose,
  ...props
}: ModalWorkflowDefaultProps) {
  const queryClient = useQueryClient();
  const { mutate: mutateSetWorkflow } = useMutationLegacy({
    mutationFn: (params: any) => WorkflowApi.setWorkflowDefault({ params }),

    onSuccess: (res) => {
      if (res?.code === 200) {
        notification.success({
          message: res?.msg,
        });
        queryClient.invalidateQueries({
          queryKey: ["get-status-workflow-list"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-workflow-detail"],
        });
        onClose && onClose();
      }
    },
  });

  const { mutate: mutateWorkflow } = useMutationLegacy({
    mutationFn: () => WorkflowApi.workflowDefault(),
  });

  const handleReject = () => {
    mutateSetWorkflow({ is_workflow_default: 0 });
  };

  const handleOk = () => {
    mutateWorkflow();
    mutateSetWorkflow({ is_workflow_default: 1 });
  };

  return (
    <Modal
      closable
      title="Cập nhật phiên bản mới cho quy trình"
      footer={
        <div className="flex gap-x-2.5 items-center">
          <Button type="danger" onClick={handleReject}>
            Từ chối
          </Button>
          <Button type="success" onClick={handleOk}>
            Đồng ý
          </Button>
        </div>
      }
      onCancel={onClose}
      {...props}
    >
      <div className="text-center text-base">
        <ExclamationTriangleOutlined className="text-yellow-400 w-20 h-20 m-auto" />
        <p>Hệ thống CRM đã cập nhật phiên bản mới cho quy trình đơn hàng!</p>
        <p>
          Bạn có muốn cập nhật quy trình mặc định mới cho đơn hàng của bạn
          không?
        </p>
      </div>
    </Modal>
  );
}

export default ModalWorkflowDefault;
