"use client";

import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("vi-VN", { hour12: false });
      const formattedDate = now.toLocaleDateString("vi-VN");
      setTime(`${formattedTime} | ${formattedDate}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-xs text-gray-600 text-right whitespace-nowrap">
      {time}
    </div>
  );
}
