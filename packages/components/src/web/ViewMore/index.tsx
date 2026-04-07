import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalViewMore from "./ModalViewMore";
import classNames from "classnames";

interface ViewMoreProps {
  text: string;
  title: string;
  content: React.ReactNode | string[] | string;
  lineClamp?: number;
  width?: number;
}

function ViewMore({
  text,
  title,
  content,
  lineClamp = 1,
  width = 350,
}: ViewMoreProps) {
  const [isViewMore, setIsViewMore] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const elementRef = useRef(null);

  const renderBtnViewMore = useCallback(() => {
    if (elementRef && text) {
      if (elementRef.current.scrollHeight > elementRef.current.clientHeight)
        setIsViewMore(true);
    }
  }, [text, elementRef]);

  useEffect(() => {
    renderBtnViewMore();
    return () => {
      setIsViewMore(false);
    };
  }, [text, elementRef]);

  const classBtnViewMore =
    "detail-value flex-shrink-0 cursor-pointer pl-2 !text-blue-600";

  const classText = classNames("detail-value-more", `line-clamp-${lineClamp}`);

  const classWrapper = classNames("flex", { "items-end": isViewMore });

  return (
    <div className={classWrapper}>
      <span className={classText} ref={elementRef}>
        {text}
      </span>
      {isViewMore && (
        <span className={classBtnViewMore} onClick={() => setIsOpen(true)}>
          Xem thêm
        </span>
      )}
      {isOpen && (
        <ModalViewMore
          open={isOpen}
          title={title}
          content={content}
          onCloseModal={() => {
            setIsOpen(false);
          }}
          width={width}
        />
      )}
    </div>
  );
}

export default ViewMore;
