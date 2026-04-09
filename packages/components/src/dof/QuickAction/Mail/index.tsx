import { useStores } from "@tera/stores/useStores";
import Detail from "@tera/components/shared/Mail/containers/Detail";
import Sidebar from "@tera/components/shared/Mail/containers/Sidebar";
import Content from "@tera/components/shared/Mail/containers/List";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

function Mail() {
  const {
    mailStore: { mailDetailId, reset },
  } = useStores();

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="flex h-full">
      <div className="bg-white p-5 w-80 h-full flex flex-col gap-y-5 shrink-0 border">
        <Sidebar />
      </div>
      <div className="border-y">
        <Content />
      </div>
      {mailDetailId && (
        <div className="fadeIn w-[800px] border">
          <Detail />
        </div>
      )}
    </div>
  );
}

export default observer(Mail);
