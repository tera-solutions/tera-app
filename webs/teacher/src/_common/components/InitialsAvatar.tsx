import { useEffect, useState } from "react";
import classNames from "classnames";

interface InitialsAvatarProps {
  src?: string | null;
  alt?: string;
  initials: string;
  /** Tailwind size classes, e.g. "h-9 w-9". */
  sizeClassName?: string;
  /** Extra classes applied to both the image and the fallback (e.g. a border). */
  className?: string;
  /** Fallback background/text color classes. */
  bgClassName?: string;
  /** Fallback text size/weight classes. */
  textClassName?: string;
}

/** Circular avatar that falls back to initials-on-brand once `src` is missing or fails to load. */
const InitialsAvatar = ({
  src,
  alt,
  initials,
  sizeClassName = "h-9 w-9",
  className,
  bgClassName = "bg-brand text-white",
  textClassName = "text-sm font-semibold",
}: InitialsAvatarProps) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className={classNames(sizeClassName, className, "rounded-full object-cover")}
      />
    );
  }

  return (
    <span
      className={classNames(
        "flex items-center justify-center rounded-full",
        sizeClassName,
        className,
        bgClassName,
        textClassName,
      )}
    >
      {initials}
    </span>
  );
};

export default InitialsAvatar;
