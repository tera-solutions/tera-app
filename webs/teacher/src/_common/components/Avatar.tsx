import { ReactNode, useEffect, useState } from "react";
import { UserOutlined } from "tera-dls";
import classNames from "classnames";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  /** Tailwind size classes, e.g. "h-8 w-8". */
  sizeClassName?: string;
  /** Fallback icon box color classes. */
  iconClassName?: string;
  /** Fallback icon svg size classes. */
  iconSizeClassName?: string;
  /** Icon shown when `src` is missing. Defaults to a user icon. */
  fallbackIcon?: ReactNode;
  shrink?: boolean;
}

/** Circular avatar image, falling back to an icon when `src` is missing. */
const Avatar = ({
  src,
  alt,
  sizeClassName = "h-8 w-8",
  iconClassName = "bg-sky-50 text-brand",
  iconSizeClassName = "[&_svg]:h-4 [&_svg]:w-4",
  fallbackIcon = <UserOutlined />,
  shrink = true,
}: AvatarProps) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={classNames(sizeClassName, shrink && "shrink-0", "rounded-full object-cover")}
      />
    );
  }

  return (
    <span
      className={classNames(
        "flex items-center justify-center rounded-full",
        sizeClassName,
        shrink && "shrink-0",
        iconClassName,
        iconSizeClassName,
      )}
    >
      {fallbackIcon}
    </span>
  );
};

export default Avatar;
