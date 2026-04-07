import { createContext, useMemo } from "react";

export const TableContext = createContext({});

const TeraTableContext = ({ columns, data, children, ...restProps }) => {
  const tableReturn = useMemo(() => {
    return {
      columns,
      data,
      ...restProps,
    };
  }, [columns, data, restProps]);

  return (
    <TableContext.Provider value={tableReturn}>
      {children}
    </TableContext.Provider>
  );
};

export default TeraTableContext;
