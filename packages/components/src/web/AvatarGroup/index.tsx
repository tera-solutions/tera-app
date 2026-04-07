import React, { useEffect, useState } from "react";
import DefaultImage from "../DefaultImage";
import ModalViewMore from "./ModalViewMore";
import { Tooltip } from "tera-dls";
import AvatarItem, { AvatarItemProps, TSizeAvatarItem } from "./AvatarItem";
import customTwMerge from "tailwind-merge.config";

interface AvatarGroupProps {
  avatars: AvatarItemProps[];
  maximum?: number;
  type?: "vertical" | "horizontal";
  titleModal?: string;
  isShowRemain?: boolean;
  size?: TSizeAvatarItem;
}

function AvatarGroup({
  size = "small",
  type = "horizontal",
  avatars,
  maximum = 3,
  titleModal,
  isShowRemain,
}: AvatarGroupProps) {
  const [remain, setRemain] = useState<number>(0);
  const [isViewMore, setIsViewMore] = useState<boolean>(false);

  const length = avatars?.length || 0;
  const showAvatar = () => {
    if (length > maximum) {
      const maxAvatar = avatars.slice(0, maximum);
      return maxAvatar;
    }
    return avatars;
  };

  const renderSize = (size: TSizeAvatarItem) => {
    switch (size) {
      case "small":
        return "w-5 h-5";
      case "medium":
        return "w-[30px] h-[30px]";
      case "large":
        return "w-9 h-9";
    }
  };

  const renderSizeText = (size: TSizeAvatarItem) => {
    switch (size) {
      case "small":
        return "text-[8px]";
      case "medium":
        return "text-[12px]";
      case "large":
        return "text-[16px]";
    }
  };

  const renderSizeSpace = (size: TSizeAvatarItem) => {
    switch (size) {
      case "small":
        return "-space-x-1";
      case "medium":
        return "-space-x-3";
      case "large":
        return "-space-x-5";
    }
  };

  const renderUI = () => {
    switch (type) {
      case "horizontal":
        return (
          <div className="flex items-center gap-x-1">
            <div
              className={customTwMerge(
                "flex items-center",
                renderSizeSpace(size),
              )}
            >
              {showAvatar()?.map((avatar, index) => (
                <Tooltip title={avatar?.content} key={index}>
                  <div>
                    <DefaultImage
                      className={`${renderSize(
                        size,
                      )} border-2 b /order-white rounded-full dark:border-gray-800 `}
                      src={avatar?.src}
                      alt={avatar?.alt}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
            {remain > 0 && isShowRemain && (
              <p
                className={`${renderSizeText(size)}  ${renderSize(
                  size,
                )} rounded-full bg-gray-200 text-green-500 flex justify-center items-center cursor-pointer hover:text-blue-600`}
                onClick={() => setIsViewMore(true)}
              >
                +{remain}
              </p>
            )}
          </div>
        );
      case "vertical":
        return (
          <div className="flex flex-col">
            {showAvatar()?.map((avatar, index) => (
              <div className="p-[5px]" key={index}>
                <AvatarItem
                  alt={avatar?.alt}
                  content={avatar?.content}
                  src={avatar?.src}
                  status={avatar?.status}
                />
              </div>
            ))}

            {remain > 0 && isShowRemain && (
              <p
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsViewMore(true)}
              >
                +{remain} người khác
              </p>
            )}
          </div>
        );
    }
  };

  useEffect(() => {
    if (!length) {
      setRemain(0);
      return;
    }
    if (length && maximum) setRemain(length - maximum);
  }, [avatars]);

  return (
    <>
      {renderUI()}
      {isViewMore && (
        <ModalViewMore
          open={isViewMore}
          onCancel={() => setIsViewMore(false)}
          title={titleModal}
          listAvatars={avatars}
        />
      )}
    </>
  );
}

export default AvatarGroup;
