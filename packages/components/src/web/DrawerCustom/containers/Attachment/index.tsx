import { useQueryLegacy } from "@tera/commons/hooks/tanstack";
import React, { useEffect, useState } from "react";
import { IFileUpload } from "@tera/commons/interfaces";
import NoData from "@tera/components/web/NoData";
import { Spin } from "tera-dls";
import AttachmentApi from "../../_api/attachment";
import UploadFile from "./UploadFile";

function Attachment({ object_type, object_id }) {
  const [listFile, setListFile] = useState<IFileUpload[]>([]);
  const {
    data,
    isPending: isLoading, // v5 dùng isPending cho trạng thái fetch lần đầu
    isError,
  } = useQueryLegacy({
    queryKey: [object_type, object_id, "list-attachment"],
    queryFn: () =>
      AttachmentApi.getList({
        params: {
          page: 1,
          limit: 10,
          object_id: object_id, // Đã thay '1' bằng biến dynamic từ queryKey
          object_type: object_type, // Đã thay '' bằng biến dynamic từ queryKey
        },
      }),
    staleTime: 300000,
    gcTime: 300000, // cacheTime đổi tên thành gcTime (Garbage Collection)
    enabled: !!object_id && !!object_type, // Senior Tip: Chỉ fetch khi có đủ ID và Type
  });

  const handleReceiveImages = (file, listFile) => {
    setListFile(listFile);
  };

  useEffect(() => {
    if (data) {
      const files = data?.data?.map((file) => ({
        name: file?.file_name,
        url: file?.file_url,
        id: file?.id,
      }));
      setListFile(files);
    }
  }, [data]);

  if (isError) return <NoData />;

  return (
    <>
      <h1 className="font-semibold text-lg text-gray-700">Tệp đính kèm</h1>
      <Spin spinning={isLoading}>
        <UploadFile
          fileList={listFile}
          folder="attachment"
          object_key={object_id}
          object_id={object_id}
          onReceiveFiles={(file, listFile) =>
            handleReceiveImages(file, listFile)
          }
          onRemove={(fileDelete) => {
            const newList = listFile.filter(
              (file) => file.id !== fileDelete?.id,
            );
            setListFile(newList);
          }}
        />
      </Spin>
    </>
  );
}

export default Attachment;
