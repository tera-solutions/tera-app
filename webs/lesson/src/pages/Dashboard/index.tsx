import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const DashboardPage = () => {
  const docs = [
    {
      uri: "https://lesson.anhnguhana.com/unit1/lesson1/index.pptx", // Link file từ VPS hoặc Storage
      fileType: "pptx",
      fileName: "Bai_Giang_Tieng_Anh.pptx",
    },
  ];

  return (
    <div className="h-screen w-screen">
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{ height: "100vh" }}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
          },
          csvDelimiter: ",",
          pdfZoom: {
            defaultZoom: 1.1,
            zoomJump: 0.2,
          },
        }}
      />
    </div>
  );
};

export default DashboardPage;
