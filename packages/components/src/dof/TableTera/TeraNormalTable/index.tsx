import { Table } from "tera-dls";
import useTeraTable from "../useTeraTable";

const TeraNormalTable = () => {
  const { ...restData } = useTeraTable();

  return <Table {...restData} />;
};

export default TeraNormalTable;
