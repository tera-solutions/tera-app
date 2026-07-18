// Bước 4/4 ("Hoàn thành") của luồng tạo video từ vựng. Không có API render
// video thật (cùng lý do đã ghi ở VocabularyVideoCreateScreen/constants.ts —
// chưa có video API nào). Quá trình "Đang xử lý video..." chỉ là thanh tiến
// trình MÔ PHỎNG (setInterval tăng dần ở client), không tạo ra file video
// thật. Thông tin tóm tắt dưới đây dùng lại đúng dữ liệu MẪU mặc định của
// bước 1 (chưa có state dùng chung giữa các bước nên không phản ánh nội dung
// người dùng thực sự đã nhập).
export const VIDEO_SUMMARY = {
  title: 'Animals – Động vật',
  topic: 'Động vật',
  wordCount: 5,
  durationLabel: '~15 giây',
};
