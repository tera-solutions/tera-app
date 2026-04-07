import HeaderViewList from "@tera/components/web/HeaderViewList";
import SearchTable from "@tera/components/web/SearchTable";
import { BTN_PRIMARY, HEADING_CLASS_NAME } from "@tera/commons/constants/common";
import TableTera from "@tera/components/dof/TableTera";
import classNames from "classnames";
import { useState } from "react";
import { Button, TabItemType, Tabs } from "tera-dls";
import SupportTicketFilter from "./containers/Filter";
import SupportTicketForm from "./containers/Form";

const SupportTicketPage = () => {
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [isOpenForm, setIsOpenForm] = useState({ open: false, id: null });

  const columns = [
    {
      title: "Vé ủng hộ",
      dataIndex: "name",
    },
    {
      title: "Ngày gửi",
      dataIndex: "created_at",
    },
    {
      title: "Môn học",
      dataIndex: "quantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
  ];

  const items: TabItemType[] = [
    {
      key: "1",
      label: "Tất cả",
    },
    {
      key: "2",
      label: "Chờ duyệt",
    },
    {
      key: "3",
      label: "Đã duyệt",
    },
    {
      key: "4",
      label: "Từ chối",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className={classNames(HEADING_CLASS_NAME, "!mb-0")}>Vé ủng hộ</h1>
        <Button
          className={BTN_PRIMARY}
          onClick={() => setIsOpenForm({ open: true, id: null })}
        >
          Thêm vé ủng hộ
        </Button>
      </div>
      <HeaderViewList
        onClickFilter={() => setIsOpenFilter(true)}
        actionLeftRender={
          <SearchTable
            onSearch={() => console.log()}
            placeholder="Tìm kiếm vé ủng hộ"
          />
        }
        bottomContent={<Tabs items={items} className="mb-0" />}
      >
        <TableTera columns={columns} data={[]} />
      </HeaderViewList>

      {isOpenFilter && (
        <SupportTicketFilter
          open={isOpenFilter}
          onClose={() => setIsOpenFilter(false)}
        />
      )}
      {isOpenForm.open && (
        <SupportTicketForm
          id={isOpenForm.id}
          open={isOpenForm.open}
          onClose={() => setIsOpenForm({ open: false, id: null })}
        />
      )}
    </div>
  );
};

export default SupportTicketPage;
