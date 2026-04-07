import { useDrop } from "react-dnd";
import { Checkbox, Spin } from "tera-dls";
import { IColumnType } from "../_interface";
import { TYPE_HIDDEN_TABLE_COLUMN_DND } from "../_constant";

interface IProps {
  value: Array<IColumnType>;
  onShowColumn: (val?) => void;
  onHideColumn?: (val?) => void;
  loading?: boolean;
}

const HiddenColumn = (props: IProps) => {
  const { value = [], onShowColumn, onHideColumn, loading } = props;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: TYPE_HIDDEN_TABLE_COLUMN_DND,
      drop({ id }) {
        const column = value?.find((item) => item.id == id);
        onHideColumn && onHideColumn(column);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [value, onHideColumn],
  );

  return (
    <Spin spinning={loading}>
      <div ref={drop} className={`${isOver && "bg-[#e8f5ff]"} rounded-md`}>
        {value?.map((column: IColumnType) => {
          const { id, status = "active", title, type } = column;
          return (
            <div className="pb-2.5" key={id}>
              <Checkbox
                onChange={(e) => {
                  const value = e.target.checked;
                  value ? onShowColumn(column) : onHideColumn(column);
                }}
                value={id}
                checked={status === "active"}
              >
                <span
                  className={`text-normal font-normal ${
                    status !== "active" ? "text-gray-400 " : ""
                  }`}
                >
                  {type === "action" ? "action" : title}
                </span>
              </Checkbox>
            </div>
          );
        })}
      </div>
    </Spin>
  );
};

export default HiddenColumn;
