import { Tooltip } from 'tera-dls';
import CustomTag from './CustomTag';

export default function StatusRender({ status, statuses }) {
  status;
  return statuses ? (
    <Tooltip
      className="bg-white z-9999 shadow-md"
      title={
        <div className="flex flex-col gap-1.5 w-[150px]">
          {statuses?.map((data, index) => {
            return (
              <CustomTag
                title={data?.status_text}
                color={data?.color}
                key={data?.id}
                index={index}
                showIndex={statuses?.length > 1}
                wrapperClassName="inline-block w-auto"
              />
            );
          })}
        </div>
      }
      trigger="click"
      placement="bottom-start"
    >
      <span>
        <CustomTag
          title={statuses[statuses?.length - 1]?.status_text}
          color={statuses[statuses?.length - 1]?.color}
          index={statuses?.length - 1}
          showIndex={statuses?.length > 1}
          wrapperClassName="cursor-pointer"
        />
      </span>
    </Tooltip>
  ) : null;
}
