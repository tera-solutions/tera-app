import { useMutationLegacy } from "@tera/commons/hooks/tanstack";

import ErrorToast from "@tera/components/web/ToastCustom/ErrorsToast";
import _ from "lodash";
import PageTableColumnAPI from "../_api";
import { IColumnType } from "../_interface";
import HiddenColumn from "./HiddenColumn";
import ShowedColumn from "./ShowedColumn";

interface IProps {
  columns: any;
  setColumns: (val?) => void;
  onUpdatedData?: (val: boolean) => void;
}

const Column = (props: IProps) => {
  const { columns, setColumns, onUpdatedData } = props;

  const { mutate: mutateHiddenColumn, isLoading } = useMutationLegacy({
    mutationFn: (variable: any) =>
      PageTableColumnAPI.update(variable.id, variable.params),

    onSuccess: (res) => {
      if (res?.code === 200) {
        onUpdatedData(true);
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  const { mutate: mutateSortableColumn } = useMutationLegacy({
    mutationFn: (variable: any) =>
      PageTableColumnAPI.update(variable?.id, variable?.params),

    onSuccess: (res) => {
      if (res?.code === 200) {
        onUpdatedData(true);
      }
    },

    onError: (error: any) => {
      ErrorToast({ errorProp: error?.data });
    },
  });

  const handleSortColumn = (dragColumn, dropColumn): void => {
    const value = _.pick(dragColumn, ["code", "title", "type", "table_id"]);
    let stand_behind;
    if (typeof dropColumn.standing_behind === "object") {
      stand_behind = dropColumn.standing_behind.id;
    } else {
      stand_behind = dropColumn.standing_behind;
    }

    mutateSortableColumn({
      id: dragColumn?.id,
      params: {
        ...value,
        stand_behind: stand_behind,
      },
    });
  };

  const handleHideColumn = (column: any): void => {
    const value = _.pick(column, ["code", "title", "type", "table_id"]);
    if (typeof column.standing_behind === "object") {
      value["stand_behind"] = column.standing_behind.id;
    } else {
      value["stand_behind"] = column.standing_behind;
    }

    setColumns((prev) =>
      prev.map((item) =>
        item.id === column?.id ? { ...item, status: false } : item,
      ),
    );
    mutateHiddenColumn({
      id: column?.id,
      params: { ...value, status: "inactive" },
    });
  };

  const handleShowColumn = (column: any): void => {
    const value = _.pick(column, ["code", "title", "type", "table_id"]);
    if (typeof column.standing_behind === "object") {
      value["stand_behind"] = column.standing_behind.id;
    } else {
      value["stand_behind"] = column.standing_behind;
    }

    setColumns((prev) => {
      const newColumns = prev.map((item) =>
        item.id === column?.id ? { ...item, status: true } : item,
      );
      return newColumns;
    });
    mutateHiddenColumn({
      id: column?.id,
      params: { ...value, status: "active" },
    });
  };

  const showedColumnValue: Array<IColumnType> = columns?.filter(
    (item) => item.status === "active",
  );

  return (
    <div className="flex justify-between gap-x-5 h-full" key="0">
      <div className="flex-1 max-h-[450px] overflow-auto p-1">
        <HiddenColumn
          onShowColumn={handleShowColumn}
          onHideColumn={handleHideColumn}
          value={columns}
          loading={isLoading}
        />
      </div>
      <div className="w-[1px] h-full bg-[#E5E7EB]" />
      <div className="flex-1 flex flex-col gap-y-[0.9375rem] max-h-[450px] overflow-auto p-1">
        <ShowedColumn
          value={showedColumnValue}
          onHideColumn={handleHideColumn}
          onSortColumn={handleSortColumn}
        />
      </div>
    </div>
  );
};

export default Column;
