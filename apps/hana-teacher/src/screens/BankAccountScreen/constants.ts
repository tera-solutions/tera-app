export const MAX_LINKED_ACCOUNTS = 5;

export interface BankAccountType {
  id: string;
  bankName: string;
  maskedNumber: string;
  ownerName: string;
  color: string;
}

export const BANK_COLORS: Record<string, string> = {
  Vietcombank: '#0066cc',
  BIDV: '#16A34A',
  Techcombank: '#DC2626',
};

export const DEFAULT_BANK_COLOR = '#64748B';

// Chưa có API quản lý tài khoản ngân hàng liên kết trong module wallet
// (@services/modules/src/wallet) — toàn bộ danh sách bên dưới chỉ tồn tại
// trong local state của màn hình này (không gọi API, không đồng bộ với
// WalletWithdrawScreen), dùng để demo UI theo mockup.
export const SEED_ACCOUNTS: BankAccountType[] = [
  {
    id: 'acc-1',
    bankName: 'Vietcombank',
    maskedNumber: '**** **** **** 1234',
    ownerName: 'NGUYEN VAN A',
    color: BANK_COLORS.Vietcombank,
  },
  {
    id: 'acc-2',
    bankName: 'BIDV',
    maskedNumber: '**** **** **** 5678',
    ownerName: 'NGUYEN VAN A',
    color: BANK_COLORS.BIDV,
  },
  {
    id: 'acc-3',
    bankName: 'Techcombank',
    maskedNumber: '**** **** **** 9012',
    ownerName: 'NGUYEN VAN A',
    color: BANK_COLORS.Techcombank,
  },
];

export const SEED_WITHDRAW_HISTORY = [
  {
    id: 'tx-1',
    accountId: 'acc-1',
    label: 'Vietcombank - 1234',
    amount: 500000,
    date: '2025-05-12T10:30:00',
  },
  {
    id: 'tx-2',
    accountId: 'acc-2',
    label: 'BIDV - 5678',
    amount: 200000,
    date: '2025-05-08T14:20:00',
  },
  {
    id: 'tx-3',
    accountId: 'acc-3',
    label: 'Techcombank - 9012',
    amount: 300000,
    date: '2025-05-05T09:15:00',
  },
];
