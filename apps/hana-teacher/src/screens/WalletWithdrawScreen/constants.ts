export const MIN_WITHDRAW_AMOUNT = 50000;

export const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

// Chưa có API quản lý tài khoản ngân hàng nhận tiền trong module wallet
// (@services/modules/src/wallet) — hiển thị tạm 1 tài khoản mẫu.
export const MOCK_BANK_ACCOUNT = {
  bankName: 'Vietcombank',
  maskedNumber: '**** **** **** 1234',
  ownerName: 'NGUYEN VAN A',
};
