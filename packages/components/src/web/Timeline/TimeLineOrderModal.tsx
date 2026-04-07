import CardTimelineOrder from '@tera/components/web/CardTimelineOrder';
import HoverQuickView from '@tera/components/web/HoverQuickView';
import moment from 'moment';
import { useMemo } from 'react';
import { Button, Modal, Timeline } from 'tera-dls';
import CustomTag from './CustomTag';

interface IProps {
  open: boolean;
  onClose?: () => void;
  value: any;
}

const TimeLineOrderModal = ({ onClose, open, value }: IProps) => {
  const items: any = useMemo(() => {
    if (!value) return [];
    return value.map((item, index) => ({
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
      status: index === value.length - 1 ? 'success' : null,
      dotClassName: index === value.length - 1 ? 'start-[63px]' : '',
    }));
  }, [value]);

  return (
    <Modal
      title={'Chi tiết vận chuyển'}
      destroyOnClose
      closeIcon={false}
      open={open}
      width={600}
      footer={
        <Button className="w-[70px]" onClick={onClose}>
          Đóng
        </Button>
      }
    >
      <div className="px-2.5 max-h-[600px] overflow-auto">
        <Timeline items={items} />
      </div>
    </Modal>
  );
};

export default TimeLineOrderModal;
