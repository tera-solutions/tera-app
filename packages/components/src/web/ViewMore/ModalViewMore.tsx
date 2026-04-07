import React, { useMemo, useState } from "react";
import {
  Modal,
  MagnifyingGlassOutlined,
  Row,
  removeDiacritics,
  Button,
} from "tera-dls";
import NoData from "../NoData";
import FormTera, { FormTeraItem, useFormTera } from "@tera/components/dof/FormTera";
import Search from "@tera/components/dof/Control/Search";

interface ModalViewMoreProps {
  title: string;
  open: boolean;
  onCloseModal: () => void;
  content: React.ReactNode | string[] | string;
  width?: number;
  isCustom?: boolean;
}

function ModalViewMore({
  title,
  open,
  onCloseModal,
  content,
  width,
  isCustom,
}: ModalViewMoreProps) {
  const [formRef] = useFormTera();
  const [listDepartment, setListDepartment] = useState<any>(content);

  const handleSearch = (value) => {
    if (value?.keyword === "") {
      setListDepartment(content);
      return;
    }
    const findItem = listDepartment.filter((item) => {
      const convertItem = isCustom ? item?.full_name : item;
      return removeDiacritics(convertItem.toLowerCase()).includes(
        removeDiacritics(value?.keyword.toLowerCase()),
      );
    });
    setListDepartment(findItem);
  };

  const renderContent = useMemo(() => {
    if (!content) return <NoData />;

    if (typeof content === "string") {
      return <div>{content}</div>;
    }

    if (Array.isArray(content)) {
      return (
        <>
          <FormTera
            ref={formRef}
            object_type="crm"
            onSubmit={handleSearch}
            isLoading={false}
          >
            <Row className="flex w-full">
              <FormTeraItem className="w-full" name="keyword">
                <Search
                  placeholder={"Tìm kiếm " + title.toLowerCase()}
                  icon={<MagnifyingGlassOutlined />}
                  className="!w-full"
                />
              </FormTeraItem>
            </Row>
          </FormTera>
          <ul className="pl-5 list-disc flex flex-col gap-y-2.5 max-h-[50vh] overflow-scroll">
            {listDepartment?.map((item) => {
              if (isCustom) {
                return (
                  <li>
                    <span className="leading-5 break-word">
                      <span className="text-green-500">[{item?.code}] </span>
                      {item?.full_name}
                    </span>
                  </li>
                );
              }
              return (
                <li>
                  <span className="leading-5 break-word">{item}</span>
                </li>
              );
            })}
          </ul>
        </>
      );
    }

    return <>{content}</>;
  }, [content, listDepartment]);

  return (
    <Modal
      width={width}
      centered
      title={title}
      cancelText="Đóng"
      open={open}
      onCancel={onCloseModal}
      footer={
        <Button type="primary" onClick={onCloseModal}>
          Đóng
        </Button>
      }
      closeIcon={false}
    >
      {renderContent}
    </Modal>
  );
}

export default ModalViewMore;
