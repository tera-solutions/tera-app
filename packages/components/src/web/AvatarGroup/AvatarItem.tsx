import React, { ReactNode } from "react";
import DefaultImage from "../DefaultImage";
import { CheckCircleOutlined, XCircleOutlined } from "tera-dls";

export type TSizeAvatarItem = "small" | "medium" | "large";

export interface AvatarItemProps {
  src: string;
  alt: string;
  content?: ReactNode;
  status?: "approve" | "reject";
  size?: TSizeAvatarItem;
}

function AvatarItem({
  src,
  alt,
  content,
  status,
  size = "medium",
}: AvatarItemProps) {
  const renderStatus = (status) => {
    switch (status) {
      case "approve":
        return (
          <CheckCircleOutlined className="w-5 h-5 text-green-600 shrink-0" />
        );
      case "reject":
        return <XCircleOutlined className="w-5 h-5 text-red-600 shrink-0" />;
      default:
        return;
    }
  };

  const renderSize = (size: TSizeAvatarItem) => {
    switch (size) {
      case "small":
        return "w-5 h-5";
      case "medium":
        return "w-9 h-9";
      case "small":
        return "w-12 h-12";
    }
  };

  return (
    <div className="flex gap-x-2.5 items-center">
      <div
        className={`${renderSize(
          size,
        )} rounded-full bg-gray overflow-hidden shrink-0 border`}
      >
        <DefaultImage
          src={src}
          alt={alt}
          className="w-full h-full"
          style={{ objectFit: "cover" }}
        />
      </div>
      <p className="text-gray-800 line-clamp-1 break-word">{content}</p>
      {renderStatus(status)}
    </div>
  );
}

export default AvatarItem;
