import { useEffect, useMemo, useRef, useState } from "react";

import { Modal } from "tera-dls";

import ImportContent from "./Content";
import TableTera from "@tera/components/dof/TableTera";
import { ItemCode, ImportFile } from "./interface";
import useDownloadImportTemplate from "./hooks/useDownloadImportTemplate";

interface ModalImportProps {
  open: boolean;
  title?: string;
  onOk: (values: ImportFile) => void;
  onCancel: () => void;
  onDownloadTemplate?: () => void;
  errorValue?: any;
  type?: ItemCode;
}

function ModalImport({
  open,
  title = "Import dữ liệu",
  onOk,
  onCancel,
  onDownloadTemplate,
  errorValue,
  type,
}: ModalImportProps) {
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const actionRef = useRef<any>(null);
  const { onDownload } = useDownloadImportTemplate({
    itemCode: type,
  });

  const handleSubmitForm = (values: ImportFile) => {
    onOk(values);
  };

  useEffect(() => {
    errorValue?.data?.length > 0 && setOpenErrorModal(true);
  }, [errorValue]);

  const columns: any = [
    {
      title: "Dòng",
      dataIndex: "line",
      width: "20%",
    },
    {
      title: "Tình trạng",
      dataIndex: "message",
      width: "80%",
      render: (val) => {
        return (
          <div className={`flex flex-col gap-1 text-red-500 `}>
            {val?.map((item) => (
              <div>{item}</div>
            ))}
          </div>
        );
      },
    },
  ];

  const dataSource = useMemo(() => {
    return errorValue?.data;
  }, [errorValue]);

  return (
    <>
      <Modal
        open={open}
        title={title}
        closeIcon={false}
        okText="Đồng ý"
        cancelText="Hủy"
        className="modal-confirm md:w-[700px] w-full"
        onOk={() => {
          actionRef?.current?.submit(handleSubmitForm)();
        }}
        onCancel={onCancel}
      >
        <ImportContent
          ref={actionRef}
          onDownloadTemplate={type ? onDownload : onDownloadTemplate}
        />
      </Modal>
      <Modal
        open={openErrorModal}
        title={"Chi tiết lỗi import"}
        closeIcon={false}
        cancelText="Đóng"
        okButtonProps={{ className: "hidden" }}
        width={800}
        onCancel={() => setOpenErrorModal(false)}
      >
        <div className="font-semibold mb-2">
          Số lượng dòng import: {errorValue?.total}
        </div>
        <TableTera
          rowKey={"line"}
          data={dataSource ?? []}
          columns={columns}
          className="rounded-xl overflow-hidden"
          pagination={{}}
        />
      </Modal>
    </>
  );
}

export default ModalImport;
