import React from "react";
import { ILoadingIndicator } from "../_interfaces";
import { Spin } from "tera-dls";

interface IProps {
  summary?: (data: any) => React.ReactNode;
  records: any;
  loadingIndicator?: ILoadingIndicator;
}
const Summary = (props: IProps) => {
  const { summary, records, loadingIndicator = {} } = props;
  const { loading = false, indicator } = loadingIndicator;

  return (
    <>
      {loading && (
        <>
          {indicator ? (
            indicator
          ) : (
            <tr className="relative w-full font-medium bottom-0 text-blue-500 h-[35px]">
              <div className="absolute left-1/2 translate-x-[-50%]">
                <Spin spinning svgProps={{ className: "w-5" }} />
              </div>
            </tr>
          )}
        </>
      )}
      {summary && summary(records)}
    </>
  );
};

export default Summary;
