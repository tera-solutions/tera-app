import { useState } from "react";
import IconDotSquare from "@tera/themes/images/Icons/dot-square.svg?react";
import { Popover } from "tera-dls";
import Content from "./Content";
import ModalApplication from "./Modal";

function Application() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Popover
        trigger="click"
        content={<Content onClickViewMore={() => setOpen(true)} />}
        placement="bottom-end"
        showArrow={false}
      >
        <div className="w-6 h-6 flex rounded-full bg-[#E5E7EB] cursor-pointer">
          <span className="m-auto">
            <IconDotSquare />
          </span>
        </div>
      </Popover>
      {open && (
        <ModalApplication
          open={open}
          onCancel={() => setOpen(false)}
          title={
            <p>
              Các ứng dụng của{" "}
              <span className="font-medium text-blue-700">TERA</span>
            </p>
          }
        />
      )}
    </>
  );
}

export default Application;
