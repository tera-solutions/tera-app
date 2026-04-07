import { InboxOutlined } from "tera-dls";

interface NoDataProps {
  text?: string;
}

function NoData({ text = "Không tìm thấy dữ liệu" }: NoDataProps) {
  return (
    <div className="h-full w-full flex">
      <div className="m-auto flex flex-col gap-y-2 items-center">
        <InboxOutlined className="h-[50px] w-[50px]" />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default NoData;
