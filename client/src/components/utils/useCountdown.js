// components/utils/useCountdown.js
import { useEffect, useState } from "react";

export const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const getReturnValues = (countDown) => {
    const hours = Math.floor((countDown / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((countDown / (1000 * 60)) % 60);
    const seconds = Math.floor((countDown / 1000) % 60);
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ];
  };

  return getReturnValues(countDown > 0 ? countDown : 0);
};
