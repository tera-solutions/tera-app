import { useStores } from "hooks/useStores";
import { useEffect, useState } from "react";
import {
  ArrowsRightLeftOutlined,
  Button,
  Modal,
  mergeArrayObjectByKey,
} from "tera-dls";
import SelectedUsers from "./SelectedUsers";
import UserList from "./UserList";

const FollowingModal = () => {
  const {
    modalSelectStore: { follower, updateData, closeModal },
  } = useStores();

  // const {
  //   openModalFollower,
  //   handleSelectItemFollower,
  //   closeModalFollower,
  //   selectedFollower,
  //   title,
  // } = useCrmClient();

  const [dataSource, setDataSource] = useState<any>([]);
  // const { objectType, objectId } = openModalFollower;

  useEffect(() => {
    if (follower?.data && !follower?.objectId) setDataSource(follower?.data);
  }, [follower?.data, follower?.objectId]);
  // useEffect(() => {
  //   if (selectedFollower && !objectId) setDataSource(selectedFollower);
  // }, [selectedFollower, objectId]);

  const handleRemove = (values): void => {
    const ids = values?.map((item) => item?.id);
    ids?.length > 0 &&
      setDataSource((prev) =>
        prev.filter((item: any) => !ids?.includes(item?.id)),
      );
  };

  const handleAdd = (values): void => {
    setDataSource((prev) => mergeArrayObjectByKey(values, prev, "id"));
  };

  const handleSubmit = () => {
    updateData("follower", "data", dataSource);
    closeModal("follower");
    // handleSelectItemFollower(dataSource);
    // closeModalFollower();
  };

  return (
    <Modal
      title={
        <>
          Danh sách <span>{follower?.title}</span>
        </>
      }
      okText="Đồng ý"
      cancelText="Huỷ"
      destroyOnClose
      closeIcon={false}
      className="w-full xmd:w-[95%] lg:w-[90%]"
      onOk={handleSubmit}
      onCancel={() => closeModal("follower")}
      open={follower?.open}
      bodyClassName="!py-[16px] !h-[80vh] overflow-hidden"
      centered={true}
      {...(follower?.objectId
        ? {
            footer: (
              <Button onClick={() => closeModal("follower")}>Đóng</Button>
            ),
          }
        : { onOk: handleSubmit })}
    >
      <div className="flex flex-col items-center xmd:flex-row pt-[6px] h-full overflow-auto xmd:overflow-hidden">
        <UserList
          objectType={follower?.objectType}
          objectId={follower?.objectId}
          mode={follower?.mode}
          followers={dataSource}
          onChange={handleAdd}
        />
        <div className="grid  place-items-center w-[60px] px-5">
          <ArrowsRightLeftOutlined className="w-5 h-5 text-blue-500" />
        </div>
        <SelectedUsers
          objectType={follower?.objectType}
          objectId={follower?.objectId}
          followers={dataSource}
          onChange={handleRemove}
          mode={follower?.mode}
        />
      </div>
    </Modal>
  );
};

export default FollowingModal;
