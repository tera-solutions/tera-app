// Bước 3/4 ("Nhạc & giọng đọc") của luồng tạo video từ vựng. Không có API
// text-to-speech/thư viện nhạc thật (cùng lý do đã ghi ở
// VocabularyVideoCreateScreen/constants.ts — chưa có video API nào). "Nghe
// thử" giọng đọc/nhạc nền đều là stub vì chưa có file âm thanh thật.
export interface VoiceOption {
  id: string;
  label: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'vn-female-north', label: 'Giọng nữ miền Bắc' },
  { id: 'vn-male-north', label: 'Giọng nam miền Bắc' },
  { id: 'vn-female-south', label: 'Giọng nữ miền Nam' },
  { id: 'en-us', label: 'Giọng Anh - Mỹ (US)' },
  { id: 'en-uk', label: 'Giọng Anh - Anh (UK)' },
];

export const SPEED_OPTIONS = ['Chậm', 'Vừa', 'Nhanh'];

export interface MusicTrack {
  id: string;
  label: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'none', label: 'Không có nhạc' },
  { id: 'cheerful', label: 'Vui tươi' },
  { id: 'gentle', label: 'Nhẹ nhàng' },
  { id: 'adventure', label: 'Phiêu lưu' },
];

export const VOLUME_LEVELS = ['Thấp', 'Vừa', 'Cao'];
