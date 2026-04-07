import React, { useState } from "react";

interface DefaultImageProps {
  src: string;
  alt: string;
  defaultSrc?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

function DefaultImage({
  src,
  alt,
  defaultSrc = "https://portal-api.staging.teracrm.vn/assets/upload/product/1714804696_image-default.png",
  style,
  className = "w-[15px] h-[15px]",
  onClick,
}: DefaultImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  function onError() {
    setImgSrc(defaultSrc);
  }

  return (
    <img
      src={imgSrc || defaultSrc}
      alt={alt}
      style={style}
      className={className}
      onClick={onClick}
      onError={onError}
    />
  );
}

export default DefaultImage;
