import { ReactNode } from "react";
import classNames from "classnames";

import { CARD } from "_common/constants/dashboard";

import SectionHeader from "./SectionHeader";

interface DashboardCardProps {
  title?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

const DashboardCard = ({
  title,
  icon,
  actionLabel,
  onAction,
  className,
  bodyClassName,
  children,
}: DashboardCardProps) => {
  return (
    <section className={classNames(CARD, "p-4", className)}>
      {title && (
        <SectionHeader
          title={title}
          icon={icon}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
};

export default DashboardCard;
