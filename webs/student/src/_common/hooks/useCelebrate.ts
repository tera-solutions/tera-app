import { useEffect, useRef, useState } from "react";

/**
 * Trả về `true` trong một khoảng ngắn mỗi khi `value` THAY ĐỔI — dùng để bật
 * hiệu ứng khen thưởng (lửa bùng, sao loé) đúng lúc bé vừa đạt được gì đó,
 * thay vì cho hiệu ứng chạy vô hạn làm bé phân tâm khỏi bài học.
 *
 * Lần đầu có giá trị cũng bùng một lần (vừa mở app: "streak của con đây!").
 */
export const useCelebrate = (value?: number | string, duration = 1800) => {
  const [active, setActive] = useState(false);
  const previous = useRef<number | string | undefined>(undefined);

  useEffect(() => {
    if (value === undefined || value === null) return;

    const isFirst = previous.current === undefined;
    const changed = !isFirst && previous.current !== value;
    previous.current = value;

    if (!isFirst && !changed) return;

    setActive(true);
    const timer = setTimeout(() => setActive(false), duration);
    return () => clearTimeout(timer);
  }, [value, duration]);

  return active;
};

export default useCelebrate;
