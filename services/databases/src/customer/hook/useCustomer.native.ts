import { Q } from "@nozbe/watermelondb";
import { useEffect, useState } from "react";
import DB from "../../database";

export const useCustomer = () => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [hasUnsynced, setHasUnsynced] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Quan sát toàn bộ bảng, sắp xếp theo thời gian mới nhất
    const collection = DB.instance.get("customers");
    const countSubscription = collection
      .query(Q.where("is_delete", 0))
      .observeCount()
      .subscribe(setTotalCount);

    const checkUnsyncedStatus = async () => {
      try {
        const unsyncedCount = await collection
          .query(Q.where("_status", Q.notEq("synced")))
          .fetchCount();
        setHasUnsynced(unsyncedCount > 0);
      } catch (e) {
        // Tránh crash nếu query bị hủy
      }
    };

    const changesSubscription = collection.changes.subscribe((records: any) => {
      console.tron("Table customers has changed (Update/Insert/Delete)");
      setLastUpdate(Date.now());
      setTimeout(() => checkUnsyncedStatus(), 0);
    });

    return () => {
      countSubscription.unsubscribe();
      changesSubscription.unsubscribe();
    };
  }, []);

  return { lastUpdate, hasUnsynced, totalCount };
};
