import { useState } from "react";
import { notification, PencilSquareOutlined } from "tera-dls";

import { FileAPI, stripExtension } from "@tera/api/common/FileAPI";

import Avatar from "./Avatar";

interface AvatarUploadProps {
  src?: string | null;
  alt?: string;
  onUploaded: (url: string) => void;
  sizeClassName?: string;
  disabled?: boolean;
  /** Sets the uploaded file's title metadata; defaults to the picked filename. */
  uploadTitlePrefix?: string;
}

/** Circular avatar with a pencil-badge file picker that uploads immediately on selection. */
const AvatarUpload = ({
  src,
  alt,
  onUploaded,
  sizeClassName = "h-20 w-20",
  disabled,
  uploadTitlePrefix,
}: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await FileAPI.upload(
        file,
        uploadTitlePrefix ? { title: `${uploadTitlePrefix}-${stripExtension(file.name)}` } : undefined,
      );
      onUploaded(uploaded.url);
    } catch (err: any) {
      notification.error({ message: err?.msg ?? err?.message ?? "Tải ảnh lên thất bại" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-flex">
      <Avatar src={src} alt={alt} sizeClassName={sizeClassName} />
      <label className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-brand text-white [&_svg]:h-3.5 [&_svg]:w-3.5">
        <PencilSquareOutlined />
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleSelect}
          disabled={disabled || uploading}
        />
      </label>
    </div>
  );
};

export default AvatarUpload;
