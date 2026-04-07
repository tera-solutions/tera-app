import _ from "lodash";
import { useCallback, useEffect, useRef } from "react";

interface IProps {
  callback?: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  dependencies?: Array<any>;
}

const useOnScreen = ({
  callback,
  options = { threshold: 0.5 },
  dependencies = [],
}: IProps) => {
  const latestRef = useRef<HTMLDivElement>(null);
  const hasScrollRef = useRef<boolean>(true);

  const onCanScroll = (value: boolean) => {
    hasScrollRef.current = value;
  };

  const handleCallback = useCallback(
    _.debounce(
      (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        hasScrollRef.current && callback && callback(entries, observer);
      },
      100,
    ),
    [callback],
  );

  useEffect(() => {
    if (!latestRef.current) return;
    const observer = new IntersectionObserver(handleCallback, options);

    observer && observer.observe(latestRef.current);

    return () => {
      observer && observer.disconnect();
    };
  }, [latestRef.current, ...dependencies]);

  return { latestRef, hasScrollRef, onCanScroll };
};

export default useOnScreen;
