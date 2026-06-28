import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerProps {
  initialMinutes: number;
  onExpire?: () => void;
}

export function useTimer({ initialMinutes, onExpire }: UseTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const onExpireRef = useRef(onExpire);

  // Keep track of the latest onExpire callback without re-triggering effects
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Tick function
  useEffect(() => {
    if (initialMinutes > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSecondsLeft(initialMinutes * 60);
    }
  }, [initialMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (onExpireRef.current) {
              onExpireRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback((minutes: number = initialMinutes) => {
    setIsActive(false);
    setSecondsLeft(minutes * 60);
  }, [initialMinutes]);

  // Format MM:SS
  const formatTime = useCallback(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  return {
    secondsLeft,
    isActive,
    isExpired: secondsLeft === 0,
    formattedTime: formatTime(),
    start,
    pause,
    reset,
    setSecondsLeft
  };
}
