import { useQuery } from "@tanstack/react-query";
import { messageError } from "@tera/commons/constants/message";
import PreviewContent from "@tera/commons/system/ConfigTemplateMail/containers/Preview/PreviewContent";
import { useEffect } from "react";
import { Modal, ModalProps, Row, Spin, Tag, notification } from "tera-dls";
import { AdministratorApi } from "../_api";

interface ModalPreviewProps extends ModalProps {
  id: number;
  onClose: () => void;
}

export const TEMPLATE_STATUS = {
  all: "Tất cả",
  enable: "Kích hoạt",
  disable: "Chưa kích hoạt",
};

export const TEMPLATE_STATUS_COLOR = {
  enable: "green01",
  disable: "gray01",
};

function ModalPreview({ id, onClose, ...props }: ModalPreviewProps) {
  const {
    data: dataDetail,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["get-lead-detail", id],
    queryFn: () => AdministratorApi.getTemplateEmailDetail(id),
    enabled: !!id,
    gcTime: 300000,
    staleTime: 300000,
  });

  const renderDetail = () => {
    const details = [
      {
        title: "Tên mẫu email",
        value: dataDetail?.name,
      },
      {
        title: "Loại biểu mẫu",
        value: dataDetail?.type_text,
      },
      {
        title: "Kích hoạt",
        value: (
          <Tag color={TEMPLATE_STATUS_COLOR[dataDetail?.status]}>
            {TEMPLATE_STATUS[dataDetail?.status]}
          </Tag>
        ),
      },
    ];
    return details;
  };

  useEffect(() => {
    if (id) refetch();
  }, [id]);

  if (isError) {
    notification.error({ message: messageError.DATA_NOT_FOUND });
    onClose();
  }

  return (
    <Modal
      title="CHI TIẾT MẪU EMAIL"
      destroyOnClose
      cancelText="Đóng"
      closeIcon={false}
      width={1200}
      onCancel={onClose}
      okButtonProps={{ className: "hidden" }}
      {...props}
    >
      <Spin spinning={isLoading}>
        <Row className="flex flex-col gap-y-2.5">
          <div className="grid grid-cols-2 gap-y-0">
            {renderDetail().map((item) => (
              <div className="flex mb-2.5">
                <h6 className="detail-key">{item?.title}</h6>
                <span className="detail-value">{item?.value}</span>
              </div>
            ))}
          </div>
          <p>Nội dung email</p>
          <PreviewContent
            content={dataDetail?.content}
            files={[{ url: dataDetail?.file_url }]}
            type={dataDetail?.type}
          />
        </Row>
      </Spin>
    </Modal>
  );
}

export default ModalPreview;
