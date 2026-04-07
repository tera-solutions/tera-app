import { ReactNode } from "react";
import {
  CodeBracketOutlined,
  EnvelopeOutlined,
  PhoneOutlined,
  Popover,
} from "tera-dls";
import DefaultImage from "../DefaultImage";
import customTwMerge from "tailwind-merge.config";
interface IProps {
  children: ReactNode;
  avatarUrl?: string;
  name?: string;
  sub?: string;
  email?: string;
  phone?: string;
  code?: ReactNode;
  className?: string;
}

const HoverQuickView = (props: IProps) => {
  const { children, avatarUrl, name, sub, email, phone, code, className } =
    props;

  return (
    <Popover
      content={
        <div
          className="flex flex-col gap-[7px] max-w-[250px] min-w-[120px]"
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-[7px]">
            <div className="flex items-center ">
              <div className="relative w-[40px] h-[40px] shrink-x-0">
                <DefaultImage
                  src={avatarUrl}
                  alt=""
                  className="rounded-full w-[40px] h-[40px] object-cover "
                />
                <div className="w-[10px] h-[10px] rounded-full bg-green-500 absolute bottom-0 right-0 z-1" />
              </div>
            </div>

            <div className="flex flex-col flex-1 gap-[6px] break-word">
              <div className="text-blue-500 line-clamp-2">{name}</div>
              <div className="text-gray-400 text-[10px] font-light line-clamp-2">
                {sub ?? "Đang cập nhật"}
              </div>
            </div>
          </div>
          <div className="text-gray-700 text-[13px] leading-[13px] flex flex-col gap-[7px]">
            {code && (
              <div className="break-word flex gap-[5px] items-center">
                <CodeBracketOutlined className="w-[16px] shrink-0 text-gray-500" />
                <div className="line-clamp-2 text-green-500">{code}</div>
              </div>
            )}
            {email && (
              <div className="break-word flex gap-[5px] items-center">
                <EnvelopeOutlined className="w-[16px] shrink-0 text-gray-500" />
                <div className="line-clamp-2">{email}</div>
              </div>
            )}
            {phone && (
              <div className="break-word flex gap-[5px] items-center">
                <PhoneOutlined className="w-[16px] shrink-0 text-gray-500" />
                <div className="line-clamp-2">{phone}</div>
              </div>
            )}
          </div>
        </div>
      }
      className="p-2.5 shadow-md"
      trigger="hover"
      placement="bottom-end"
    >
      <span
        className={customTwMerge(
          "cursor-pointer text-blue-600 inline-block",
          className,
        )}
      >
        {children}
      </span>
    </Popover>
  );
};

export default HoverQuickView;
