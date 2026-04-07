import { useState, useEffect, useCallback } from "react";

interface UseCountDownProps {
  initialTime: number;
  onTimeChange?: (time: number) => void;
}

const useCountDown = ({ initialTime, onTimeChange }: UseCountDownProps) => {
  const [time, setTime] = useState(initialTime);

  const decrementTime = useCallback(() => {
    if (time > 0) {
      setTime((prevTime) => prevTime - 1);
    }
  }, [time]);

  const resetCountdown = useCallback(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    const intervalId = setInterval(decrementTime, 1000);

    return () => clearInterval(intervalId);
  }, [decrementTime]);

  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(time);
    }
  }, [time, onTimeChange]);

  return { time, resetCountdown };
};

export default useCountDown;
