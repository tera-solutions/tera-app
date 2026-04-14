import { useQuery } from "@tanstack/react-query";
import NoData from "@tera/components/web/NoData";
import { DATE_FORMAT } from "@tera/commons/constants/common";
import RangePicker from "@tera/components/dof/Control/RangePicker";
import Select from "@tera/components/dof/Control/Select";
import FormTera, { FormTeraItem } from "@tera/components/dof/FormTera";
import { groupBy } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import customTwMerge from "tailwind-merge.config";
import { CalendarDaysOutlined, Spin } from "tera-dls";
import ActivityLogApi from "../_api/activityLog";
import { ACTION_TYPE_OPTIONS } from "../common";
import Item from "./Item";
import { usePermission } from "@tera/commons/hooks/usePermission";
import { QUICK_ACTION_PERMISSION_KEY } from "@tera/commons/constants/permission";
type ActivityLogProps = {
  object_type: string;
  object_id: number;
  isScroll: boolean;
};
function ActivityLog({ object_type, object_id, isScroll }: ActivityLogProps) {
  const form = useForm();
  const { hasPage } = usePermission();
  const { watch } = form;
  const [date, actionType] = watch(["date", "action_type"]);
  const { data: response, isLoading } = useQuery({
    queryKey: [
      "get-activity-log-list",
      object_type,
      object_id,
      date,
      actionType,
    ],

    queryFn: () => {
      const params = {
        object_type,
        object_id,
        start_date: date?.[0].format(DATE_FORMAT),
        end_date: date?.[1].format(DATE_FORMAT),
        action_type: actionType,
        page: 1,
        limit: 9999,
      };
      return ActivityLogApi.getList({ params });
    },

    enabled: !!object_type,
  });

  const data = response?.data;
  const renderList = useMemo(() => {
    if (!data || data?.length === 0) return <NoData />;
    const groupDate = groupBy(data, (item) =>
      moment(item?.created_at).format(DATE_FORMAT),
    );

    return Object.keys(groupDate)?.map((group) => (
      <div key={group} className="space-y-2.5">
        <h3 className="text-gray-800 font-semibold flex items-center gap-x-2.5">
          <i className="w-5 text-red-300">
            <CalendarDaysOutlined />
          </i>
          <span>{group}</span>
        </h3>
        <div className="flex flex-col gap-4 divide-y divide-dashed">
          {groupDate[group].map((item, index) => (
            <Item key={index} data={item} />
          ))}
        </div>
      </div>
    ));
  }, [data]);

  return (
    <Spin spinning={isLoading}>
      {hasPage(QUICK_ACTION_PERMISSION_KEY.DRAWER_HISTORY_SEARCH) && (
        <FormTera
          form={form}
          className={customTwMerge(
            "sticky top-0 -mx-4 p-4 z-10 bg-white transition-shadow duration-300",
            isScroll && "shadow-xsm",
          )}
        >
          <FormTeraItem name="action_type" className="mb-0 w-full">
            <Select
              options={ACTION_TYPE_OPTIONS}
              allowClear
              className="rounded-[39px]"
            />
          </FormTeraItem>
          <div className="flex gap-2.5 mt-2.5">
            <FormTeraItem name="date" className="mb-0 w-full">
              <RangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                className="!rounded-[39px]"
                format={DATE_FORMAT}
              />
            </FormTeraItem>
          </div>
        </FormTera>
      )}

      <div className="space-y-5">{renderList}</div>
    </Spin>
  );
}

export default ActivityLog;
