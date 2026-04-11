import { HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import UploadFiles from "@tera/components/dof/UploadFiles";
import React from "react";
import { Col, Row } from "tera-dls";

const FileUploadedPage = () => {
  return (
    <div className="p-6">
      <h1 className={HEADING_CLASS_NAME}>Tệp đã tải lên</h1>
      <UploadFiles />
      <Row className="grid-cols-6 p-8 rounded-md shadow gap-8 mt-8">
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
        <Col className="w-full aspect-square">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="w-full rounded"
          />
        </Col>
      </Row>
    </div>
  );
};

export default FileUploadedPage;
