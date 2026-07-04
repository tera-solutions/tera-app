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
  shrink?: boolean;
}

/** Circular avatar image, falling back to a user icon when `src` is missing. */
const Avatar = ({
  src,
  alt,
  sizeClassName = "h-8 w-8",
  iconClassName = "bg-sky-50 text-brand",
  iconSizeClassName = "[&_svg]:h-4 [&_svg]:w-4",
  shrink = true,
}: AvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
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
      <UserOutlined />
    </span>
  );
};

export default Avatar;
