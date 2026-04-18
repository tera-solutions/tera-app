import {
  useQueryLegacy,
  useMutationLegacy,
} from "@tera/commons/hooks/tanstack";

import PaginationCustom from "@tera/components/web/PaginationCustom";
import ActionCUD from "@tera/components/web/TableColumnCustom/ActionCUD";
import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import { messageError } from "@tera/commons/constants/message";
import { IPagination } from "@tera/commons/interfaces";
import moment from "moment";
import { Key, useState } from "react";
import {
  Modal,
  ModalProps,
  PaginationProps,
  Spin,
  downloadFile,
  notification,
} from "tera-dls";
import TableTera from "../TableTera";
import { AdministratorApi } from "../_api";
import ModalPreview from "./ModalPreview";
import TemplateMailApi from "./_api/templateMail";
import { CAMPAIGN_PERMISSION_KEY } from "@tera/commons/constants/permission";

interface ModalTemplateEmailProps extends ModalProps {
  selectedTemplate: Key[];
  onClose: () => void;
  onOk: (data) => void;
}

function ModalTemplateEmail({
  selectedTemplate,
  onOk,
  onClose,
  ...props
}: ModalTemplateEmailProps) {
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });
  const [isPreview, setIsPreview] = useState({ open: false, id: null });
  const [rowSelected, setRowSelected] = useState<any>(selectedTemplate || []);
  const [rowSelectedKey, setRowSelectedKey] = useState<any>([]);
  const [nameFile, setNameFile] = useState<string | undefined>();

  const {
    data: listTemplate,
    isLoading,
    isError,
  } = useQueryLegacy({
    queryKey: ["get-template-email-list", pagination],

    queryFn: () => {
      const params = {
        limit: pagination?.limit || 10,
        page: pagination?.page || 1,
      };
      return AdministratorApi.getListTemplateEmail({ params });
    },

    gcTime: 300000,
    staleTime: 300000,
  });

  const { mutate: mutateDownload } = useMutationLegacy({
    mutationFn: (variables: any) => TemplateMailApi.download(variables),

    onSuccess: (res) => {
      if (res?.code === 200) {
        const date = moment().format("DDMMYYYY_HHmmss");
        downloadFile(res?.data, nameFile ?? `template_mail_${date}`);

        notification.success({
          message: res?.msg,
        });
      }
    },
  });

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setPagination({
      page: Number(pageSize) !== Number(pagination?.limit) ? 1 : page,
      limit: pageSize,
    });
  };

  const handleOk = () => {
    onOk(rowSelected);
  };

  const columns: any = [
    {
      title: "Tên mẫu email",
      dataIndex: "name",
      width: "30%",
      render: (data) => <p className="line-clamp-2">{data}</p>,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: "64%",
      render: (val, record) =>
        val ? (
          <div className="line-clamp-2">{val}</div>
        ) : (
          <div
            className="text-blue-500 cursor-pointer inline"
            onClick={(e) => {
              e.stopPropagation();
              setNameFile(record?.file_name);
              mutateDownload({ params: { template_id: record?.id } });
            }}
          >
            {record?.file_name}
          </div>
        ),
    },
    {
      width: "6%",
      fixed: "right",
      render: (record) => {
        return (
          <ActionCUD
            buttonKey={{
              detail: CAMPAIGN_PERMISSION_KEY.EMAIL_PREVIEW_EMAIL,
            }}
            onClickDetail={() => setIsPreview({ open: true, id: record?.id })}
          />
        );
      },
    },
  ];

  if (isError) {
    notification.error({ message: messageError.DATA_NOT_FOUND });
    onClose();
  }

  return (
    <Modal
      title="DANH SÁCH MẪU EMAIL"
      destroyOnClose
      okText="Đồng ý"
      cancelText="Hủy"
      closeIcon={false}
      width={1200}
      onCancel={onClose}
      onOk={handleOk}
      {...props}
    >
      <Spin spinning={isLoading}>
        <div className="bg-white shadow-xsm rounded-[5px] overflow-hidden">
          <TableTera
            columns={columns}
            data={listTemplate?.data?.data || []}
            rowSelection={{
              type: "radio",
              selectedRowKeys: rowSelectedKey,
              onChange: (keys, records) => {
                setRowSelectedKey(keys);
                setRowSelected(records);
              },
            }}
            onRow={(record: any) => ({
              onClick: () => {
                if (rowSelectedKey?.includes(record.id)) {
                  setRowSelectedKey([]);
                  setRowSelected([]);
                  return;
                }
                setRowSelectedKey([record.id]);
                setRowSelected([record]);
              },
              className:
                rowSelected?.includes(record?.id) &&
                "tera-table-cell-row-focused",
            })}
            loading={isLoading}
          />
          {listTemplate?.data?.total > 0 && (
            <PaginationCustom
              onChange={handleChangePage}
              to={listTemplate?.data?.to}
              from={listTemplate?.data?.from}
              current={listTemplate?.data?.current_page}
              pageSize={listTemplate?.data?.per_page}
              total={listTemplate?.data?.total}
            />
          )}
        </div>
      </Spin>
      {isPreview?.open && (
        <ModalPreview
          open={isPreview?.open}
          id={isPreview?.id}
          onClose={() => setIsPreview({ open: false, id: null })}
        />
      )}
    </Modal>
  );
}

export default ModalTemplateEmail;
