import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

interface AnimatedHeightProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedHeight = ({ children, className }: AnimatedHeightProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(node);
    setHeight(node.scrollHeight);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={classNames(
        "overflow-hidden transition-[height] duration-300 ease-in-out",
        className,
      )}
      style={height !== undefined ? { height } : undefined}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default AnimatedHeight;
