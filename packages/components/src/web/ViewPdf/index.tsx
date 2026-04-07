import React from "react";
import { DocumentOutlined } from "tera-dls";

interface ViewPdfProps {
  name?: string;
  url: string;
}

function ViewPdf({ name = "file pdf", url }: ViewPdfProps) {
  return (
    <>
      {url ? (
        <object
          title={name}
          data={`${url}#page=1&zoom=85`}
          type="application/pdf"
          className="w-full h-full flex items-center justify-center border rounded"
        >
          Không thể tải file hiển thị
        </object>
      ) : (
        <div className="h-full w-full flex justify-center items-center border rounded">
          <DocumentOutlined className="w-[50px] h-[50px]" />
          Tệp đính kèm trống
        </div>
      )}
    </>
  );
}

export default ViewPdf;
