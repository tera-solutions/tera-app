import { useQueryLegacy, useMutationLegacy } from "@tera/commons/hooks/tanstack";

import NoData from "@tera/components/web/NoData";
import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import UploadFiles from "@tera/components/dof/UploadFiles";
import useConfirm from "@tera/states/hooks/useConfirm";
import { useEffect, useState } from "react";
import { notification } from "tera-dls";
import AttachmentApi from "../_api/attachment";
import { usePermission } from "@tera/states/hooks";
import { QUICK_ACTION_PERMISSION_KEY } from "@tera/commons/constants/permission";

function Attachment({ object_type, object_id }) {
  const [listFile, setListFile] = useState([]);
  const [limit, setLimit] = useState<number>(15);
  const { hasPage } = usePermission();

  const confirm = useConfirm();

  const {
    data: listAttachment,
    isError,
    refetch,
  } = useQueryLegacy({
    queryKey: ["get-list-attachment", object_type, object_id, limit],

    queryFn: () => {
      const params = {
        object_type,
        object_id,
        limit: limit,
      };
      return AttachmentApi.getList({ params });
    },

    enabled: !!object_type,
    gcTime: 300000,
    staleTime: 300000,
  });

  const { mutate: deleteFile } = useMutationLegacy({
    mutationFn: (id) => AttachmentApi.delete(id),

    onSuccess: (res) => {
      if (res?.code === 200) {
        refetch();
        notification.success({
          message: res?.msg,
        });
      }
    },
  });

  const formatListFile = (data) => {
    return data?.map((item) => ({
      url: item?.file_url,
      name: item?.file_name,
      id: item?.id,
      type: item?.file_type,
      size: item?.file_size,
      created_at: item?.created_at,
      created_by: item?.created_by,
    }));
  };

  const handleRemoveFile = (file) => {
    confirm.warning({
      title: "XÓA TỆP ĐÍNH KÈM",
      content: "Bạn có chắc muốn xóa tệp đính kèm này",
      onOk: () => deleteFile(file?.id),
    });
  };

  useEffect(() => {
    if (listAttachment) {
      const newList = formatListFile(listAttachment?.data);
      setListFile(newList);
    }
  }, [listAttachment]);

  const permission = {
    upload: QUICK_ACTION_PERMISSION_KEY?.DRAWER_FILE_UPLOAD,
    download: QUICK_ACTION_PERMISSION_KEY?.DRAWER_FILE_DOWNLOAD,
    delete: QUICK_ACTION_PERMISSION_KEY?.DRAWER_FILE_DELETE,
    list: QUICK_ACTION_PERMISSION_KEY?.DRAWER_FILE_VIEW_LIST,
    view: QUICK_ACTION_PERMISSION_KEY.DRAWER_FILE_VIEW_FILE,
  };

  const listOption = () => {
    const arrData = [];
    if (hasPage(QUICK_ACTION_PERMISSION_KEY?.DRAWER_FILE_VIEW_FILE))
      arrData.push("detail");
    if (hasPage(QUICK_ACTION_PERMISSION_KEY?.DRAWER_FILE_DELETE))
      arrData.push("delete");
    if (hasPage(QUICK_ACTION_PERMISSION_KEY?.DRAWER_FILE_DOWNLOAD))
      arrData.push("download");
    return arrData;
  };

  if (isError) {
    return <NoData />;
  }

  return (
    <>
      {hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_FILE_UPLOAD) && (
        <div className="mt-4">
          <UploadFiles
            object_id={String(object_id)}
            object_key={object_type}
            folder={object_type}
            onReceiveFiles={() => refetch()}
            fileList={listFile}
            mode="edit"
            activeButtons={listOption()}
            onRemove={handleRemoveFile}
            permission={permission}
          />
        </div>
      )}

      {listAttachment?.total > listAttachment?.to && (
        <div className="w-full text-center">
          <span
            className="cursor-pointer hover:underline text-blue-600"
            onClick={() => setLimit((prev) => prev + 10)}
          >
            Xem thêm
          </span>
        </div>
      )}
    </>
  );
}

export default Attachment;
