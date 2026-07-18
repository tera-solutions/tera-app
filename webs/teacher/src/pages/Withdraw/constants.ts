/**
 * ✅ Bật thật (2026-07-17): rút tiền giờ đi qua `fin/wallet-request/create` — một YÊU CẦU
 * chờ admin duyệt rồi TỰ chuyển khoản ngoài hệ thống, sau đó đánh dấu hoàn tất mới trừ ví
 * (`WalletRequestService::complete`). Không có cổng thanh toán/payout tự động.
 */
export const WITHDRAW_ENABLED = true;

/** Hạn mức phía sản phẩm (lấy từ thiết kế `picture's page/rut tien.png`). */
export const MIN_AMOUNT = 50_000;
export const MAX_AMOUNT = 50_000_000;

/** ⚠️ BE không có bảng phí → "Miễn phí" là hiện trạng, không phải mock. */
export const TRANSACTION_FEE = 0;

