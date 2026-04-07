import { convertSize } from "@tera/commons/utils";
import IconExcel from "@tera/themes/images/Icons/icon-excel.svg?react";
import { XMarkOutlined } from "tera-dls";

function Item({ file, onRemove }) {
  return (
    <div className="flex flex-col gap-y-2.5 p-2.5 bg-gray-50 rounded-2xl border border-gray-200">
      <div className="flex gap-x-2.5 items-center">
        <IconExcel className="w-8 h-8 shrink-0" />
        <div className="flex-1 flex flex-col justify-between">
          <p className="text-[#1F2937]">{file?.name}</p>
          <p className="text-gray-500 text-[10px]">{convertSize(file?.size)}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end justify-between">
          <span>
            {file?.percent === 100 && (
              <XMarkOutlined
                className="w-4 h-4 text-red-500 cursor-pointer"
                onClick={onRemove}
              />
            )}
          </span>
          <p>
            {file?.percent < 100 ? (
              `${file?.percent || 0}%`
            ) : (
              <span className="text-green-500">Hoàn thành</span>
            )}
          </p>
        </div>
      </div>
      {file?.percent < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
          <div
            className="bg-blue-300 h-1.5 rounded-full dark:bg-blue-500"
            style={{ width: file?.percent ? `${file?.percent}%` : 0 }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Item;
