import { observer } from "mobx-react-lite";

import { useStores } from "@tera/stores/useStores";

import { getUserDisplay } from "_common/utils/user";

const DashboardGreeting = observer(() => {
  const {
    globalStore: { user },
  } = useStores();
  const { name } = getUserDisplay(user);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800">Xin chào, {name} 👋</h1>
      <p className="mt-0.5 text-sm text-slate-400">
        Đây là nhật ký ngày học hôm nay, hãy quan sát những điều thú vị!
      </p>
    </div>
  );
});

export default DashboardGreeting;
