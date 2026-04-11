import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useQueries } from "@tanstack/react-query";
import PaginationCustom from "@tera/components/web/PaginationCustom";
import { messageValidate } from "@tera/commons/constants/message";
import DatePicker from "@tera/components/dof/Control/DatePicker";
import Search from "@tera/components/dof/Control/Search";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { usePermission } from "_common/hooks/usePermission";
import { IPagination } from "@tera/commons/interfaces";
import { getTimeRender } from "@tera/commons/utils";
import { groupBy } from "lodash";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  EllipsisHorizontalOutlined,
  FunnelOutlined,
  MagnifyingGlassOutlined,
  Modal,
  PaginationProps,
  Row,
  Spin,
  XMarkOutlined,
  notification,
} from "tera-dls";
import HeaderModalMoreView from "./Header";
import NotificationApi from "./_api";
import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import { NOTIFICATION_PERMISSION_KEY } from "@tera/commons/constants/permission";

interface IModalViewMoreNotification {
  isOpen: boolean;
  handleClose: () => void;
}

const ModalViewMoreNotification = ({
  isOpen,
  handleClose,
}: IModalViewMoreNotification) => {
  const { hasPage } = usePermission();
  const defaultValue = {
    title: "",
    start_date: null,
    end_date: null,
  };
  const newForm = useForm({
    mode: "onChange",
  });
  const [params, setParams] = useState({});
  const [idRead, setIdRead] = useState(null);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 10,
    page: 1,
  });

  const [{ data: listData, refetch }] = useQueries({
    queries: [
      {
        queryKey: ["list-notification", pagination, params],
        queryFn: () => {
          return NotificationApi.getList({
            ...pagination,
            ...params,
          });
        },
      },
      {
        queryKey: ["read-notification-modal", idRead],
        queryFn: () => {
          return NotificationApi.read(idRead);
        },
        onSuccess: (res) => {
          if (res?.code === 200) {
            notification.success({
              message: res?.msg,
            });
            refetch();
          }
        },
      },
    ],
  });

  const { mutate: mutationDelete, isLoading: loadingDelete } =
    useMutationLegacy({
      mutationFn: (id: string | number) => NotificationApi.delete(id),
    });

  const convertDataRender = (data: any[]) => {
    return data
      ? data.map((data) => ({
          ...data,
          time: getTimeRender(data?.created_at),
          avatar: data?.created_by
            ? data?.created_by?.avatar_url
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png",
        }))
      : [];
  };

  const memoDataList: any = useMemo(() => {
    return convertDataRender(listData?.data);
  }, [listData?.data]);

  const groupDataRender = useMemo(() => {
    const groupData = groupBy(memoDataList, "time");
    return Object.entries(groupData);
  }, [memoDataList]);
  const [currentTab, setCurrentTab] = useState("important");
  const handleChangeTab = (key) => {
    setCurrentTab(key);
  };

  const handleSubmitForm = (values) => {
    const convertData = {
      title: values?.title,
      start_date:
        values?.start_date && moment(values?.start_date).format("DD/MM/YYYY"),
      end_date:
        values?.end_date && moment(values?.end_date).format("DD/MM/YYYY"),
    };
    setParams(convertData);
  };

  const handleResetFilter = () => {
    newForm?.reset(defaultValue);
    setParams(defaultValue);
  };

  const handleChangeStartDate = (value) => {
    newForm?.setValue("start_date", value);
  };
  const handleChangeEndDate = (value) => {
    newForm?.setValue("end_date", value);
  };

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setPagination({ limit: pageSize, page: page });
  };

  const renderDropdown = (): DropdownItem[] => {
    // const { id, invoice_no, status } = record;
    const dropdownItems: DropdownItem[] = [];
    hasPage(NOTIFICATION_PERMISSION_KEY.CRM_NOTIFICATION_ACTION_ONE) &&
      dropdownItems.push({
        key: 1,
        label: "Action 1",
        onClick: () => {
          //   navigate(`${PRICE_QUOTATION_URL.detail.path}/${record?.id}`);
        },
      });
    hasPage(NOTIFICATION_PERMISSION_KEY.CRM_NOTIFICATION_ACTION_TWO) &&
      dropdownItems.push({
        key: 3,
        label: "Action 2",
        onClick: () => {
          //   handleReject(id, invoice_no);
        },
      });
    return dropdownItems;
  };

  const handleDeleteNotifica = (id: number | string) => {
    mutationDelete(id);
  };

  const handleRead = (id: number | string) => {
    setIdRead(id);
  };

  return (
    <Modal
      title="TẤT CẢ THÔNG BÁO"
      okText="Đóng"
      // cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="sm:w-[65%] md:w-[65%] lg:w-[50%] z-9999999"
      onOk={() => handleClose()}
      cancelButtonProps={{ className: "hidden" }}
      open={isOpen}
      centered={true}
    >
      <Spin spinning={loadingDelete}>
        <FormTera
          object_type="crm"
          form={newForm}
          onSubmit={handleSubmitForm}
          isLoading={false}
        >
          <div>
            <HeaderModalMoreView
              currentTab={currentTab}
              handleChangeTab={handleChangeTab}
            />
            <Row className="grid-cols-4 pt-4">
              <Col className="col-span-3">
                <FormTeraItem name="title">
                  <Search
                    onKeyDown={(e) => {
                      if (e?.key === "Enter") {
                        newForm?.handleSubmit(handleSubmitForm)();
                      }
                    }}
                    placeholder="Tìm kiếm thông báo"
                    icon={<MagnifyingGlassOutlined />}
                    className="w-full"
                  />
                </FormTeraItem>
              </Col>
              <Col className="flex items-center">
                <a
                  onClick={() => console.log("Đánh dấu đã đọc")}
                  className="text-blue-600 cursor-pointer"
                >
                  Đánh dấu đã đọc
                </a>
              </Col>
            </Row>
            <Row className="grid-cols-9">
              <FormTeraItem
                label="Từ ngày"
                name="start_date"
                className="col-span-4"
                rules={[
                  {
                    maxDate: {
                      key: "end_date",
                      message: messageValidate.from_date,
                    },
                  },
                ]}
              >
                <DatePicker
                  placeholder="Vui lòng chọn"
                  onChange={handleChangeStartDate}
                  format="DD/MM/YYYY"
                />
              </FormTeraItem>
              <FormTeraItem
                label="Đến ngày"
                name="end_date"
                className="col-span-4"
                rules={[
                  {
                    minDate: {
                      key: "start_date",
                      message: messageValidate.to_date,
                    },
                  },
                ]}
              >
                <DatePicker
                  placeholder="Vui lòng chọn"
                  onChange={handleChangeEndDate}
                  format="DD/MM/YYYY"
                />
              </FormTeraItem>
              <Col className="col-span-1 flex gap-5 items-center justify-end">
                <FunnelOutlined
                  onClick={() => newForm?.handleSubmit(handleSubmitForm)()}
                  className="text-blue-600 w-6 cursor-pointer"
                />
                <div onClick={() => handleResetFilter()} className="relative">
                  <FunnelOutlined className="text-red-600 w-6 cursor-pointer" />
                  <XMarkOutlined className="text-red-600 w-3 cursor-pointer absolute bottom-[-3px] right-[-2px]" />
                </div>
              </Col>
            </Row>
          </div>
        </FormTera>
        {listData?.data.length > 0 ? (
          groupDataRender.map(([time, list]) => (
            <div key={time} className="flex flex-col gap-2.5 pb-2.5">
              <p className="font-medium">{time}</p>
              {list.map((item) => (
                <Row
                  key={item?.id}
                  className="flex gap-3 grid-cols-12 border-b-[1px] border-gray-200 p-2 cursor-pointer hover:bg-blue-50"
                  onClick={() => {
                    !item?.is_view && handleRead(item?.id);
                  }}
                >
                  {!item?.is_view && (
                    <Col className="col-span-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </Col>
                  )}
                  <Col className="col-span-1 w-8 flex-shrink-0">
                    <img
                      className="w-8 h-8  rounded-full border-gray-200 border-[1px]"
                      src={item?.avatar}
                    />
                  </Col>
                  <Col className="col-span-8 w-full break-words">
                    <h4 className="font-medium">{item?.title}</h4>
                    <span className="w-full">{item?.content}</span>
                  </Col>
                  <Col className="col-span-1">
                    <Dropdown
                      menu={{ items: renderDropdown() }}
                      trigger="click"
                    >
                      <Button
                        type="alternative"
                        className="rounded-full border-none p-0"
                        icon={<EllipsisHorizontalOutlined />}
                      />
                    </Dropdown>
                  </Col>
                  <Col className="col-span-1">
                    <XMarkOutlined
                      onClick={() => handleDeleteNotifica(item?.id)}
                      className="cursor-pointer w-4 "
                    />
                  </Col>
                </Row>
              ))}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-20 w-full">
            <p>Không còn thông báo nào</p>
          </div>
        )}
        {listData?.last_page > 1 && (
          <PaginationCustom
            onChange={handleChangePage}
            total={listData?.total || 0}
            current={listData?.current_page}
            pageSize={listData?.per_page}
            to={listData?.to}
            from={listData?.from}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default observer(ModalViewMoreNotification);
