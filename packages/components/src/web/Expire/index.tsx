import NotPermissionIcon from "@tera/themes/images/uiNew/not-permission-icon.png";
import SaveTime from "@tera/themes/images/uiNew/save-time.png";

function Expire() {
  return (
    <div className="grid grid-cols-2">
      <div className="col-span-1 grid place-items-center h-full">
        <div className="flex flex-col items-center gap-2.5  w-[366px]">
          <img src={NotPermissionIcon} width={264} height={200} />
          <div className="text-blue-500 text-sm font-light text-center">
            <div className="font-medium">Tài khoản của bạn đã hết hạn</div>
            <div>Để tiếp tục sử dụng phần mềm, hãy liên hệ ngay với Tera</div>
          </div>
        </div>
      </div>
      <div className="col-span-1 h-full flex justify-end">
        <img src={SaveTime} />
      </div>
    </div>
  );
}

export default Expire;
