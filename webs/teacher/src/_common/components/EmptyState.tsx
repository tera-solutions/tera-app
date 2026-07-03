import { Empty } from "tera-dls";

interface EmptyStateProps {
  description: string;
  className?: string;
  classNameImage?: string;
}

/** Shared preset for the tera-dls `Empty` placeholder. */
const EmptyState = ({
  description,
  className = "py-12",
  classNameImage = "w-28 mx-auto",
}: EmptyStateProps) => (
  <Empty className={className} classNameImage={classNameImage} description={description} />
);

export default EmptyState;
