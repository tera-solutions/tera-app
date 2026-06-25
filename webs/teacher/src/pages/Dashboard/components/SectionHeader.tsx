import { ReactNode } from "react";

import { CARD_LINK, CARD_TITLE, SECTION_HEADER } from "_common/constants/dashboard";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader = ({
  title,
  icon,
  actionLabel,
  onAction,
}: SectionHeaderProps) => {
  return (
    <div className={SECTION_HEADER}>
      <div className="flex items-center gap-2">
        {icon && (
          <i className="flex h-5 w-5 items-center justify-center text-brand [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </i>
        )}
        <h3 className={CARD_TITLE}>{title}</h3>
      </div>
      {actionLabel && (
        <button type="button" className={CARD_LINK} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
