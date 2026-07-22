import Cloud from "./Cloud";
import Sparkle from "./Sparkle";

/**
 * Nền trời + mây trang trí cho các màn ngoài đăng nhập (login/register/quên mật khẩu).
 *
 * Dùng `fixed inset-0 -z-10` nên nền LUÔN phủ kín khung nhìn dù nội dung dài
 * ngắn thế nào — tránh được lỗi lộ dải trắng ở đáy khi có phần tử tràn ra ngoài
 * thẻ bọc (đã gặp với mấy vệt mây đặt `-bottom-10`).
 */
const CloudBackdrop = () => (
  <div
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#dceafc] via-[#eaf3ff] to-[#cbe0fb]"
    aria-hidden
  >
    {/* mây lớn mờ phía sau tạo chiều sâu */}
    <Cloud className="hana-float absolute -left-16 top-[6%] h-40 w-80 text-white/85 blur-[4px]" />
    <Cloud className="hana-float-slow absolute -right-20 top-[14%] h-44 w-96 text-white/80 blur-[5px]" />
    <Cloud className="hana-float-slow absolute -left-24 bottom-[8%] h-48 w-[26rem] text-white/80 blur-[6px]" />

    {/* mây nhỏ nét hơn ở lớp trước */}
    <Cloud className="hana-float absolute left-[18%] top-[3%] h-16 w-32 text-white blur-[0.5px]" />
    <Cloud className="hana-float-slow absolute right-[22%] top-[8%] h-12 w-24 text-white/95 blur-[0.5px]" />
    <Cloud className="hana-float absolute left-[8%] bottom-[16%] h-14 w-28 text-white/95 blur-[0.5px]" />
    <Cloud className="hana-float-slow absolute right-[8%] bottom-[6%] h-20 w-40 text-white/90 blur-[1px]" />
    <Cloud className="hana-float absolute right-[38%] bottom-[2%] h-12 w-24 text-white/85 blur-[1px]" />

    {/* vài ngôi sao lấp lánh cho hợp không khí trẻ em */}
    <Sparkle className="absolute left-[30%] top-[18%] h-5 w-5 text-white/80" />
    <Sparkle className="absolute right-[30%] top-[26%] h-4 w-4 text-hana-sun/70" />
    <Sparkle className="absolute left-[12%] bottom-[30%] h-4 w-4 text-white/70" />
  </div>
);

export default CloudBackdrop;
