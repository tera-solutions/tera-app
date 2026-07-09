import moment from "moment";

import type { NotificationItem } from "./_interface";

const ago = (amount: number, unit: moment.unitOfTime.DurationConstructor) =>
  moment().subtract(amount, unit).toISOString();

/**
 * Static prototype data — task 032 has no working backend yet
 * (`notification queue/read/template/channel` are TODO per the service-layer
 * rules), so this screen renders entirely from this in-memory list instead
 * of calling `@tera/modules`.
 */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Họp giáo viên tháng 5",
    content:
      "<p>Thông báo lịch họp giáo viên tháng 5 sẽ diễn ra vào:</p>" +
      "<ul>" +
      "<li><strong>Thời gian:</strong> Thứ 4, ngày 15/05/2025 lúc 14:00</li>" +
      "<li><strong>Địa điểm:</strong> Phòng họp lầu 2 - Cơ sở 1</li>" +
      "<li><strong>Nội dung:</strong>" +
      "<ul>" +
      "<li>Tổng kết hoạt động tháng 4</li>" +
      "<li>Kế hoạch giảng dạy tháng 5</li>" +
      "<li>Thảo luận các vấn đề chuyên môn</li>" +
      "<li>Thông báo các sự kiện sắp tới</li>" +
      "</ul>" +
      "</li>" +
      "</ul>" +
      "<p>Đề nghị các thầy cô tham dự đầy đủ và đúng giờ.</p><p>Trân trọng!</p>",
    category: "general",
    is_read: false,
    image_url: null,
    action_url: null,
    action_label: "Trả lời",
    created_at: ago(1, "hours"),
  },
  {
    id: 2,
    title: "Cập nhật lịch dạy tuần mới",
    content:
      "<p>Lịch dạy tuần từ 15/05/2025 đến 21/05/2025 đã được cập nhật.</p>" +
      "<p>Vui lòng kiểm tra và xác nhận.</p>",
    category: "schedule",
    is_read: false,
    image_url: null,
    action_url: "/schedule",
    action_label: "Xem lịch",
    created_at: ago(1, "days"),
  },
  {
    id: 3,
    title: "Bài tập mới: Writing - Unit 5",
    content:
      "<p>Bạn đã giao bài tập Writing - Unit 5 cho lớp Starters 2A.</p>" +
      "<p>Hạn nộp: 20/05/2025.</p>",
    category: "assignment",
    is_read: true,
    image_url: null,
    action_url: "/assignment",
    action_label: "Xem bài tập",
    created_at: ago(1, "days"),
  },
  {
    id: 4,
    title: "Điểm danh lớp Starters 2A",
    content:
      "<p>Bạn chưa điểm danh cho lớp Starters 2A buổi học 13:30 - 15:00 ngày 14/05/2025.</p>",
    category: "attendance",
    is_read: true,
    image_url: null,
    action_url: "/attendance",
    action_label: "Điểm danh ngay",
    created_at: ago(2, "days"),
  },
  {
    id: 5,
    title: "Cập nhật hệ thống",
    content:
      "<p>Hana Edu đã cập nhật tính năng mới. Báo cáo tiến độ học tập, trải nghiệm ngay!</p>",
    category: "system",
    is_read: true,
    image_url: null,
    action_url: null,
    action_label: null,
    created_at: ago(2, "days"),
  },
  {
    id: 6,
    title: "Thông báo nghỉ lễ 30/04 - 01/05",
    content:
      "<p>Trung tâm nghỉ lễ 2 ngày 30/04/2025 và 01/05/2025.</p>" +
      "<p>Các lớp học sẽ trở lại bình thường từ 02/05/2025.</p>",
    category: "general",
    is_read: true,
    image_url: null,
    action_url: null,
    action_label: null,
    created_at: ago(3, "days"),
  },
  {
    id: 7,
    title: "Nhắc nhở chấm bài tập",
    content:
      "<p>Bạn còn 12 bài tập chưa chấm.</p>" +
      "<p>Vui lòng hoàn thành trước ngày 18/05/2025.</p>",
    category: "assignment",
    is_read: true,
    image_url: null,
    action_url: "/assignment",
    action_label: "Chấm bài ngay",
    created_at: ago(3, "days"),
  },
  {
    id: 8,
    title: "Lịch dạy được thay đổi",
    content:
      "<p>Lịch dạy lớp Movers 1B ngày 16/05/2025 đã được thay đổi.</p>" +
      "<p>Vui lòng kiểm tra lại.</p>",
    category: "schedule",
    is_read: true,
    image_url: null,
    action_url: "/schedule",
    action_label: "Xem lịch",
    created_at: ago(4, "days"),
  },
  {
    id: 9,
    title: "Đánh giá học viên định kỳ",
    content: "<p>Đã đến hạn đánh giá định kỳ cho lớp Flyers 3A.</p>",
    category: "general",
    is_read: true,
    image_url: null,
    action_url: null,
    action_label: null,
    created_at: ago(5, "days"),
  },
  {
    id: 10,
    title: "Điểm danh lớp Movers 1B",
    content: "<p>Điểm danh lớp Movers 1B buổi 08:00 - 09:30 đã được ghi nhận.</p>",
    category: "attendance",
    is_read: true,
    image_url: null,
    action_url: null,
    action_label: null,
    created_at: ago(6, "days"),
  },
  {
    id: 11,
    title: "Bảo trì hệ thống định kỳ",
    content:
      "<p>Hệ thống sẽ bảo trì từ 23:00 - 01:00 ngày 20/05/2025.</p>" +
      "<p>Trong thời gian này một số tính năng có thể tạm gián đoạn.</p>",
    category: "system",
    is_read: true,
    image_url: null,
    action_url: null,
    action_label: null,
    created_at: ago(7, "days"),
  },
  {
    id: 12,
    title: "Bài tập mới: Reading - Unit 4",
    content: "<p>Bạn đã giao bài tập Reading - Unit 4 cho lớp Flyers 3A. Hạn nộp: 22/05/2025.</p>",
    category: "assignment",
    is_read: true,
    image_url: null,
    action_url: "/assignment",
    action_label: "Xem bài tập",
    created_at: ago(8, "days"),
  },
];
