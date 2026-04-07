import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import ModalViewMore from "./ModalViewMore";

interface ViewMoreProps {
  title: string;
  content: any[];
  lineClamp?: number;
  width?: number;
  maximum?: number;
  isCustom?: boolean;
}

function ViewMoreNew({
  title,
  content,
  lineClamp = 2,
  width = 350,
  maximum = 1,
  isCustom = false,
}: ViewMoreProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [remain, setRemain] = useState<number>(0);
  const [textRender, setTextRender] = useState<string>("");
  const [textRenderCustom, setTextRenderCustom] = useState<any[]>([]);

  const length = content?.length || 0;
  const elementRef = useRef(null);

  useEffect(() => {
    if (length && maximum) setRemain(length - maximum);

    if (isCustom && content?.length > 0) {
      const textSlice = content.slice(0, maximum);
      setTextRenderCustom(textSlice);
      return;
    }

    if (content?.length > 0) {
      const textSlice = content.slice(0, maximum).join(", ");
      setTextRender(textSlice);
    }
  }, [content]);

  const classBtnViewMore =
    "!text-blue-500 detail-value flex-shrink-0 cursor-pointer pl-2";

  const classText = classNames("detail-value-more", `line-clamp-${lineClamp}`);

  const classWrapper = classNames("flex");

  return (
    <div className={classWrapper}>
      {isCustom ? (
        <p className={classText} ref={elementRef}>
          {textRenderCustom?.length > 0
            ? textRenderCustom?.map((text, index) => (
                // <p className={classText}>
                <>
                  <span className="text-green-500">[{text?.code}] </span>
                  {text?.full_name}
                  {index + 1 !== textRenderCustom.length && ", "}
                </>
                // </p>
              ))
            : "Tất cả"}
        </p>
      ) : (
        <span className={classText} ref={elementRef}>
          {textRender}
          {content?.length > maximum && ",..."}
        </span>
      )}
      {remain > 0 && (
        <span className={classBtnViewMore} onClick={() => setIsOpen(true)}>
          +{remain}
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
          isCustom={isCustom}
        />
      )}
    </div>
  );
}

export default ViewMoreNew;
