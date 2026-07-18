import { makeAutoObservable, runInAction } from 'mobx';

// Giỏ hàng "Học liệu" — chưa có API giỏ hàng/đặt hàng thật ở BE (xem
// HocLieuScreen/constants.ts), nên lưu tạm ở client qua MobX store để dùng
// chung số lượng/badge giữa HocLieuScreen và HocLieuDetailScreen. Không
// persist vì đây chỉ là dữ liệu demo, không phải giỏ hàng thật.
export class CartStore {
  items: Record<string, number> = {};

  constructor() {
    makeAutoObservable(this);
  }

  clear = () => {
    runInAction(() => {
      this.items = {};
    });
  };

  addItem = (id: string, qty = 1) => {
    runInAction(() => {
      this.items = { ...this.items, [id]: (this.items[id] ?? 0) + qty };
    });
  };

  changeQty = (id: string, delta: number) => {
    runInAction(() => {
      const next = Math.max(0, (this.items[id] ?? 0) + delta);
      const updated = { ...this.items };
      if (next === 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      this.items = updated;
    });
  };

  get count() {
    return Object.values(this.items).reduce((sum, qty) => sum + qty, 0);
  }
}
