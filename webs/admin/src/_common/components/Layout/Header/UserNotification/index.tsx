import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useQueries } from "@tanstack/react-query";
import { BUTTON_KEY } from "@tera/commons/constants/permission";
import { usePermission } from "_common/hooks/usePermission";
import { getTimeRender } from "@tera/commons/utils";
import { groupBy } from "lodash";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  EllipsisHorizontalOutlined,
  Row,
  Spin,
  XMarkOutlined,
  notification,
} from "tera-dls";
import HeaderModalMoreView from "./Header";
import NotificationApi from "./_api";
import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";

interface IPropUserNotification {
  handleModal: () => void;
}

const UserNotification = ({ handleModal }: IPropUserNotification) => {
  const [currentTab, setCurrentTab] = useState("important");
  const [idRead, setIdRead] = useState(null);

  const { hasPage } = usePermission();

  const handleChangeTab = (key) => {
    setCurrentTab(key);
  };

  const [{ data: listData, isLoading, refetch }, {}] = useQueries({
    queries: [
      {
        queryKey: ["list-notification"],
        queryFn: () => {
          return NotificationApi.getList();
        },
      },
      {
        queryKey: ["read-notification", idRead],
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

  const memoDataList = useMemo(() => {
    return convertDataRender(listData?.data);
  }, [listData?.data]);

  const groupDataRender = useMemo(() => {
    const groupData = groupBy(memoDataList.slice(0, 4), "time");
    return Object.entries(groupData);
  }, [memoDataList]);

  const renderDropdown = (): DropdownItem[] => {
    // const { id, invoice_no, status } = record;
    const dropdownItems: DropdownItem[] = [];
    hasPage(BUTTON_KEY.PRICE_QUOTE_LIST_DETAIL) &&
      dropdownItems.push({
        key: 1,
        label: "Action",
        onClick: () => {
          //   navigate(`${PRICE_QUOTATION_URL.detail.path}/${record?.id}`);
        },
      });
    hasPage(BUTTON_KEY.PRICE_QUOTE_LIST_APPROVE) &&
      dropdownItems.push({
        key: 3,
        label: "Xoá",
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
    <>
      <div className="bg-white shadow-xsm rounded-[5px]">
        <Spin spinning={isLoading && loadingDelete}>
          <HeaderModalMoreView
            currentTab={currentTab}
            handleChangeTab={handleChangeTab}
          />
          <div className="px-5">
            <div className="flex justify-end py-2.5">
              <a
                onClick={() => {
                  console.log("đánh dấu đã đọc");
                }}
                className="text-blue-600 cursor-pointer font-normal"
              >
                Đánh dấu đã đọc
              </a>
            </div>
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
                        {/* <EllipsisHorizontalOutlined className="cursor-pointer w-6" /> */}
                      </Col>
                      <Col className="col-span-1">
                        <XMarkOutlined
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteNotifica(item?.id);
                          }}
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

            <div className="flex justify-center items-center p-2">
              <a
                onClick={() => {
                  handleModal();
                }}
                className="text-blue-600 cursor-pointer"
              >
                Xem tất cả thông báo
              </a>
            </div>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default observer(UserNotification);
