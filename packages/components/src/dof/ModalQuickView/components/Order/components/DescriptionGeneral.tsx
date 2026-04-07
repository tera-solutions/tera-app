import { ReactNode } from "react";
import { Row } from "tera-dls";

type DescriptionGeneralProps = {
  data?: { title: ReactNode; value: ReactNode }[];
};
const DescriptionGeneral = ({ data }: DescriptionGeneralProps) => {
  return (
    <Row className="grid-cols-2 gap-y-1.5">
      {data.map(({ title, value }) => (
        <p className="text-gray-800">
          <span className="font-medium">{title ? `${title}:` : ""} </span>
          <span>{value}</span>
        </p>
      ))}
    </Row>
  );
};

export default DescriptionGeneral;
