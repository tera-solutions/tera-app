import { useQueryLegacy } from '@tera/commons/hooks/tanstack';
import HoverQuickView from '@tera/components/web/HoverQuickView';
import CardTimelineOrder from '@tera/components/web/CardTimelineOrder';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { EyeOutlined, Spin, Timeline } from 'tera-dls';

import TimeLineOrderModal from './TimeLineOrderModal';
import OperationApi from './_api/operation';
import CustomTag from './CustomTag';

const TimelineOrder = ({ id }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

const {
  data: logs,
  refetch: fetchSummary,
  isLoading,
} = useQueryLegacy({
  // 1. Query Key: Phải là mảng
  queryKey: ['get-timeline', id],
  queryFn: () =>
    OperationApi.getLogs({
      transaction_id: id,
    }),
  staleTime: 300000, 
  gcTime: 300000,
  enabled: !!id,
});

  useEffect(() => {
    id && fetchSummary();
  }, [id]);

  const items: any = useMemo(() => {
    if (!logs?.data) return [];
    const lastThreeItems = logs?.data.slice(-3);
    return lastThreeItems.map((item, index) => ({
      label: item.created_at
        ? moment(item.created_at).format('DD/MM/YYYY HH:MM')
        : null,
      children: (
        <CardTimelineOrder
          title={
            <HoverQuickView
              avatarUrl={item?.approve_by?.avatar_url}
              email={item?.approve_by?.email}
              phone={item?.approve_by?.phone}
              name={item?.approve_by?.full_name}
              sub={item?.approve_by?.customer_type_text?.title}
              code={item?.approve_by?.code}
            >
              {item?.full_name}
            </HoverQuickView>
          }
        >
          <CustomTag
            title={item.status_text}
            color={item.color}
            wrapperClassName="w-auto"
          />
        </CardTimelineOrder>
      ),
      status: index === logs.data.length - 1 ? 'success' : null,
      dotClassName: index === logs.data.length - 1 ? 'start-[63px]' : '',
    }));
  }, [logs]);

  return logs?.data?.length > 0 ? (
    <>
      <p
        className="text-blue-600 flex gap-1 cursor-pointer mb-5"
        onClick={() => setOpenModal(true)}
      >
        <EyeOutlined className="w-4" />
        Xem chi tiết
      </p>
      <Spin spinning={isLoading}>
        <Timeline items={items} />
      </Spin>
      {openModal && (
        <TimeLineOrderModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          value={logs?.data}
        />
      )}
    </>
  ) : null;
};

export default TimelineOrder;
