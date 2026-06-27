import { forwardRef, HTMLAttributes } from "react";
import classNames from "classnames";

import { CARD } from "_common/constants/dashboard";

export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Surface container shared across the portal: white rounded panel with a soft
 * shadow and responsive padding. Pass `className` to extend or override.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={classNames(CARD, "p-3 xmd:p-4", className)}
      {...rest}
    >
      {children}
    </div>
  ),
);

Card.displayName = "Card";

export default Card;
