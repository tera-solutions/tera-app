import { ReactNode } from "react";

type HeadingProps = {
  icon: ReactNode;
  value: {
    code: string;
    name: string;
  };
};
const Heading = ({ icon, value }: HeadingProps) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="p-[5px] bg-blue-400 rounded-md">{icon}</span>
      <p className="font-semibold break-word">
        <span className="text-green-500">[{value?.code}]</span> {value?.name}
      </p>
    </div>
  );
};
export default Heading;
