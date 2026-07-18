// Không có API "phiếu học phí"/nhận xét học tập hàng tháng nào ở BE — toàn bộ
// nội dung phiếu (học phí/tháng, ngày đi học, nhận xét) do giáo viên TỰ NHẬP
// và chỉ hiển thị/chia sẻ tại máy, KHÔNG lưu lên server.
export type SlipTemplate = 'girl' | 'boy';

export interface SlipTheme {
  id: SlipTemplate;
  label: string;
  accent: string;
  accentSoft: string;
  cardBg: string;
  cardBorder: string;
}

export const SLIP_THEMES: SlipTheme[] = [
  {
    id: 'girl',
    label: 'Mẫu bé gái',
    accent: '#DB2777',
    accentSoft: '#FCE7F3',
    cardBg: '#FFF5F9',
    cardBorder: '#FBCFE8',
  },
  {
    id: 'boy',
    label: 'Mẫu bé trai',
    accent: '#2563EB',
    accentSoft: '#DBEAFE',
    cardBg: '#F0F7FF',
    cardBorder: '#BFDBFE',
  },
];

export const MAX_REMARK_LENGTH = 300;
