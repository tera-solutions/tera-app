import React from "react";
import { CommandLineOutlined } from "tera-dls";

function PageFeatureInDevelopment() {
  return (
    <div className="flex flex-col justify-center items-center pt-10">
      <CommandLineOutlined className="w-20 h-20" />
      <h1 className="text-xl font-bold uppercase m-auto">
        Tính năng đang phát triển
      </h1>
    </div>
  );
}

export default PageFeatureInDevelopment;
