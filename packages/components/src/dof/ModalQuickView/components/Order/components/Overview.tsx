import React, { ReactNode } from "react";
import QRcode from "@tera/themes/images/QR-code.png";

type OverviewProps = {
  businessName: string;
  invoiceNo: string;
  reference: ReactNode;
  statusNode: ReactNode;
};
const Overview = ({
  businessName,
  invoiceNo,
  reference,
  statusNode,
}: OverviewProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">{businessName}</h4>
        <p>Số đơn hàng: {invoiceNo}</p>
        <p>
          Tham chiếu: <span>{reference}</span>
        </p>
        <p className="flex items-start gap-1">
          <span className="flex-1">Trạng thái:</span> {statusNode}
        </p>
      </div>

      <img src={QRcode} />
    </div>
  );
};

export default Overview;
