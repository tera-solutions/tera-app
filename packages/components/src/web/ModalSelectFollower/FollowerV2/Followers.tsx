import { followerMode } from "@tera/components/dof/CrmProvider";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { PlusOutlined } from "tera-dls";
import AvatarGroup from "./AvatarGroup";
import useGetData from "./Hook/useGetData";

interface IProps {
  objectType: string;
  objectId: string;
  mode?: followerMode;
  onChange: (value: any) => void;
  title?: string;
}

const Followers = (props: IProps) => {
  const {
    objectType,
    objectId,
    mode = "default",
    onChange,
    title = "người theo dõi",
  } = props;
  const {
    modalSelectStore: { follower, clearData, openModal },
  } = useStores();
  // const { selectedFollower, clearStore, handleOpenModalFollower } =
  //   useCrmClient();

  const { list, refetch } = useGetData({
    objectType,
    objectId,
    follower: true,
    mode,
    params: {
      limit: 10,
      page: 1,
    },
  });

  useEffect(() => {
    follower?.data && onChange(follower?.data);
  }, [follower?.data]);
  // useEffect(() => {
  //   selectedFollower && onChange(selectedFollower);
  // }, [selectedFollower]);

  useEffect(() => {
    objectType && objectId && refetch();
    return () => {
      clearData("follower");
    };
  }, [objectType, objectId]);

  const data = mode == "soft" ? follower?.data : (list?.data ?? []);

  return (
    <>
      <AvatarGroup
        size="medium"
        objectId={objectId}
        objectType={objectType}
        avatars={
          data?.map((item) => ({
            src: item.avatar_url,
            alt: item.avatar_url,
            content: item?.full_name,
          })) ?? []
        }
        total={mode === "soft" ? follower?.data?.length : list?.total}
        titleModal={title}
        isShowRemain
        mode={mode}
      />
      <PlusOutlined
        className="following-button"
        onClick={() => {
          openModal("follower", {
            open: true,
            title,
            mode,
            objectType,
            objectId,
          });
        }}
      />
    </>
  );
};

export default observer(Followers);
