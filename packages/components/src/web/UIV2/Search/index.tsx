import React, { forwardRef } from "react";
import customTwMerge, { tw } from "tailwind-merge.config";
import { SearchProps, Search as SearchTera } from "tera-dls";

function Search(props: SearchProps, ref) {
  const { className, ...rest } = props;
  const classNameSearch = customTwMerge(
    tw("sm:w-full md:w-full lg:w-[400px] rounded-[39px] py-[6px]"),
    className,
  );
  return <SearchTera ref={ref} {...rest} className={classNameSearch} />;
}

export default forwardRef(Search);
