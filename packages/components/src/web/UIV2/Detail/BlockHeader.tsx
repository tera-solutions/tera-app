import { RectangleStackOutlined } from "tera-dls";

interface BlockHeaderProps {
  title: string | JSX.Element;
  content: string | JSX.Element;
  icon: JSX.Element;
}

function BlockHeader(props: BlockHeaderProps) {
  const { title, content, icon = <RectangleStackOutlined /> } = props;

  return (
    <div className="px-4 py-2.5 rounded bg-gray-100 flex flex-col gap-y-4">
      <div className="flex gap-x-1 items-center">
        <span className="text-blue-400">{icon}</span>
        <span className="text-gray-500 break-word">{title}</span>
      </div>
      <span className="text-gray-700 break-word">{content}</span>
    </div>
  );
}

export default BlockHeader;
