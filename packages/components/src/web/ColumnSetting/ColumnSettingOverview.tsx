import { useQueryLegacy } from "@tera/commons/hooks/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import { useStores } from "hooks/useStores";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Tabs } from "tera-dls";
import Column from "./Column";
import PageTableColumnAPI from "./_api";
import { IColumnType } from "./_interface";
import Setting from "./Setting";

interface IProps {
  objectType: string;
}

const ColumnSettingOverview = (props: IProps) => {
  const { objectType } = props;
  const [tab, setTab] = useState<string>("0");
  const {
    columnSettingStore: { columns: storeColumns, add },
  } = useStores();
  const queryClient = useQueryClient();

  const [columns, setColumns] = useState<Array<IColumnType>>();
  const [updatedData, setUpdatedData] = useState<boolean>(false);

  useEffect(() => {
    setColumns(toJS(storeColumns?.[objectType]));
  }, [storeColumns?.[objectType]]);

  const refetchTableData = () =>
    queryClient.invalidateQueries({
      queryKey: ["page-table-column"],
    });

  useEffect(() => {
    return () => {
      setColumns([]);
      updatedData && refetchTableData();
    };
  }, [updatedData]);

  const { refetch, data, isLoading } = useQueryLegacy({
    queryKey: ["page-table-config-modal", objectType],
    queryFn: () =>
      PageTableColumnAPI.getTableConfig({ object_type: objectType }),

    onSuccess: (data) => {
      if (!data) return;
      if (data.status === "inactive") return;
      setColumns(data?.column_configs);
      add(data?.column_configs, objectType);
    },

    enabled: !!objectType,
    staleTime: 300000,
    gcTime: 300000,
  });

  const tableConfig = data?.status === "active" ? data : {};

  useEffect(() => {
    objectType && refetch();
  }, [objectType]);

  const handleChangeTabs = (key: string): void => setTab(key);

  const tabItems = [
    {
      key: "0",
      label: <p>Cột</p>,
    },
    {
      key: "1",
      label: <p>Cấu hình cột</p>,
    },
  ];

  const handleUpdatedData = (val) => {
    setUpdatedData(val);
    refetch();
    // refetchTableData();
  };
  return (
    <>
      <div className="bg-white rounded-2xl ">
        <Tabs
          activeKey={tab}
          onChange={handleChangeTabs}
          items={tabItems}
          itemClassName="pt-0 pb-2.5"
          className="mb-3"
        />
        <div className="h-[500px] overflow-auto">
          {tab === "0" ? (
            <Column
              {...{ columns, setColumns, onUpdatedData: handleUpdatedData }}
            />
          ) : (
            <Setting
              {...{
                value: columns,
                tableId: tableConfig?.id,
                loading: isLoading,
                onUpdatedData: handleUpdatedData,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default observer(ColumnSettingOverview);
