import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spin } from "tera-dls";
import AvatarItem, { AvatarItemProps } from "./AvatarItem";
import useGetData from "../Hook/useGetData";
import useOnScreen from "@tera/commons/hooks/useOnScreen";
import { followerMode } from "@tera/components/dof/CrmProvider";

interface IProps {
  listAvatars: AvatarItemProps[];
  objectType: string;
  objectId: string;
  maximum?: number;
  open?: boolean;
  title?: string;
  onCancel?: () => void;
  mode?: followerMode;
  loadingLimit?: number;
}

function ModalViewMore({
  open,
  title,
  onCancel,
  listAvatars,
  objectType,
  objectId,
  mode,
  loadingLimit = 15,
}: IProps) {
  const [pageLimit, setPageLimit] = useState<number>(loadingLimit);
  const latestRef = useRef<HTMLDivElement>(null);
  const hasScrollRef = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatars, setAvatars] = useState<any>([]);

  const { list, refetch, isLoading } = useGetData({
    objectType,
    objectId,
    follower: true,
    mode,
    params: {
      limit: pageLimit,
      page: 1,
    },
    onSuccess: (data) => {
      if (hasScrollRef.current) {
        hasScrollRef.current = false;
        setLoading(false);
      }
      setAvatars(
        data?.data?.map((item) => ({
          src: item.avatar_url,
          alt: item.avatar_url,
          content: item?.full_name,
        })) ?? [],
      );
    },
  });

  useEffect(() => {
    mode === "soft" && setAvatars(listAvatars);
  }, [listAvatars, mode]);

  const handleObserver = (entries: any) => {
    const isLoad =
      entries[0].isIntersecting &&
      list?.data?.length <= list?.total &&
      list?.data?.length <= pageLimit &&
      list?.total > pageLimit;

    if (isLoad) {
      setLoading(true);
      hasScrollRef.current = true;
      setPageLimit((prev) => prev + loadingLimit);
      setTimeout(() => {
        refetch();
      }, 10);
    }
  };

  useOnScreen({
    callback: handleObserver,
    dependencies: [avatars],
  });

  const addingLastRef = (index) =>
    avatars.length === index + 1 &&
    avatars?.length >= loadingLimit &&
    mode === "default"
      ? latestRef
      : undefined;

  return (
    <Modal
      width={500}
      centered
      title={title}
      open={open}
      onCancel={onCancel}
      closeIcon={false}
      footer={
        <Button type="primary" onClick={onCancel}>
          Đóng
        </Button>
      }
    >
      <Spin spinning={isLoading && mode === "default" && !hasScrollRef.current}>
        <div className="flex flex-col gap-y-2.5 h-[600px] overflow-auto text-red-500">
          {avatars?.map((item, index) => (
            <AvatarItem
              src={item?.src}
              alt={item?.alt}
              content={item?.content}
              status={item?.status}
              ref={addingLastRef(index)}
            />
          ))}
          {loading && (
            <Spin wrapperClassName="w-full flex justify-center" spinning />
          )}
        </div>
      </Spin>
    </Modal>
  );
}

export default ModalViewMore;
