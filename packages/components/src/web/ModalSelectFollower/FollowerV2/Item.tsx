import DefaultImage from "@tera/components/web/DefaultImage";
import { forwardRef } from "react";
import customTwMerge from "tailwind-merge.config";
import { Checkbox, Col, Row, TrashOutlined } from "tera-dls";

interface IProps {
  onSelect: (value: any) => void;
  onChecked?: (checked: boolean, value: any) => void;
  employee: any;
  checked: boolean;
  type: "left" | "right";
}

const Item = (props: IProps, ref: any) => {
  const { onSelect, employee, type, onChecked, checked } = props;

  return (
    <div
      ref={ref}
      className={customTwMerge(
        "flex gap-[5px] items-start p-1 w-full hover:bg-blue-50 rounded-xsm",
        type === "left" && "cursor-pointer",
      )}
      onClick={() => {
        type === "left" && onSelect(employee);
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={checked}
          onChange={(e) => onChecked(e.target.checked, employee)}
        />
      </div>
      <DefaultImage
        src={employee?.avatar_url}
        alt={employee?.id}
        className="w-[50px] h-[50px] rounded-[50px] object-cover"
      />
      <Row className="grid-cols-5 justify-between gap-0 w-full">
        <Col className="flex gap-[5px] flex-col col-start-1 col-end-4">
          <div className="font-medium truncate">{employee?.full_name}</div>
          <div className="text-gray-500 text-[13px]  h-[15px] truncate">
            {employee?.phone ?? "Đang cập nhật"}
          </div>
          <div className="text-gray-500 text-[13px] h-[15px] truncate">
            {employee?.email ?? "Đang cập nhật"}
          </div>
        </Col>
        <Col className="flex gap-2.5 col-start-4 col-end-6 justify-end">
          <div className="flex gap-[5px] flex-col w-3/4 text-right">
            <div className="text-green-500 truncate">{employee?.code}</div>
            <div className="text-gray-500 text-[13px] truncate">
              {employee?.department_text?.title ?? "Đang cập nhật"}
            </div>
            <div className="text-gray-500 text-[13px] truncate">
              {employee?.job_title_text?.title ?? "Đang cập nhật"}
            </div>
          </div>
          {type === "right" && (
            <div className="w-5 h-5 cursor-pointer text-red-500 flex-shrink-0">
              <TrashOutlined onClick={() => onSelect(employee)} />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default forwardRef(Item);
