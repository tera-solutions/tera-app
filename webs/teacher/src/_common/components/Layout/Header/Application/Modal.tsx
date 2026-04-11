import Icons from "@tera/components/web/Icons";
import React from "react";
import { Col, Modal, ModalProps, Row } from "tera-dls";
import { modules } from "./Content";
import { TypeIcon } from "@tera/components/web/Icons/interface";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import Search from "@tera/components/web/UIV2/Search";
import { useForm } from "react-hook-form";

function ModalApplication(props: ModalProps) {
  const form = useForm();
  return (
    <Modal
      {...props}
      bodyStyle={{ background: "#F3F3F9" }}
      okButtonProps={{ className: "hidden" }}
      cancelText="Đóng"
      className="xmd:w-[800px] xl:w-[1000px]"
    >
      <div className="flex flex-col gap-y-4">
        <FormTera form={form}>
          <FormTeraItem name="keyword" className="mb-0">
            <Search />
          </FormTeraItem>
        </FormTera>
        <p>CRM</p>
        <Row className="grid-cols-2 xmd:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-4">
          {modules.map((module) => (
            <Col className="flex flex-col gap-y-1 rounded bg-white p-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.1),0_-4px_4px_0_rgba(0,0,0,0.05)]">
              <div className="flex gap-x-2.5 items-center">
                <div className="flex w-[30px] h-[30px] rounded-[6px] bg-blue-700">
                  <span className="m-auto tera-application">
                    <Icons icon={module.icon as TypeIcon} />
                  </span>
                </div>
                <p className="font-medium text-blue-700">{module.title}</p>
              </div>
              <p className="text-gray-500 text-light">
                Giúp bạn khai thác tối đa giá trị tập sản phẩm hiện hữu và kiến
                tạo sản phẩm trung thành với thương hiệu
              </p>
              <span className="ml-auto text-blue-600 hover:underline hover:cursor-pointer">
                Chi tiết
              </span>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
}

export default ModalApplication;
