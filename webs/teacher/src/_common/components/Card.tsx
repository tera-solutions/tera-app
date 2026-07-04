import { forwardRef, HTMLAttributes } from "react";
import classNames from "classnames";

import AnimatedHeight from "_common/components/AnimatedHeight";
import { CARD } from "_common/constants/dashboard";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
}

/**
 * Surface container shared across the portal: white rounded panel with a soft
 * shadow and responsive padding. Pass `className` to extend or override.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, animated = true, ...rest }, ref) => (
    <div
      ref={ref}
      className={classNames(CARD, "p-3 xmd:p-4", className)}
      {...rest}
    >
      {animated ? <AnimatedHeight>{children}</AnimatedHeight> : children}
    </div>
  ),
);

export default Card;
