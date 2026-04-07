import React from "react";
import { useCopyToClipboard } from "react-use";
import customTwMerge from "tailwind-merge.config";
import { DocumentDuplicateOutlined } from "tera-dls";

type CopyClipboardTextProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  valueCopy: string;
};
const CopyClipboardText = ({
  valueCopy,
  className,
  ...restProps
}: CopyClipboardTextProps) => {
  const [, copy] = useCopyToClipboard();
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        copy(valueCopy);
      }}
      className={customTwMerge(
        "text-blue-500 w-4 h-4 cursor-pointer",
        className,
      )}
      {...restProps}
    >
      <DocumentDuplicateOutlined className="text-green-500" />
    </span>
  );
};

export default CopyClipboardText;
