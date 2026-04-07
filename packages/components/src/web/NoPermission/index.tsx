import { InboxOutlined } from "tera-dls";

function NoPermission() {
  return (
    <div className="h-full w-full flex pb-5">
      <div className="m-auto flex flex-col gap-y-2 items-center">
        <InboxOutlined className="h-[50px] w-[50px]" />
        <p>Bạn không có quyền truy cập!</p>
      </div>
    </div>
  );
}

export default NoPermission;
