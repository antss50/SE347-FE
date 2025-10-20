import { useEffect, useState } from "react";

function TimeBox({ startTime }: { startTime: string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const target = parseAuctionDate(startTime);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = target.getTime() - now;

            if (distance <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / (1000 * 60)) % 60),
                seconds: Math.floor((distance / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    return (
        <div className="flex justify-center gap-4 mb-4 text-center">
            <TimeBoxItem label="Ngày" value={timeLeft.days} />
            <TimeBoxItem label="Giờ" value={timeLeft.hours} />
            <TimeBoxItem label="Phút" value={timeLeft.minutes} />
            <TimeBoxItem label="Giây" value={timeLeft.seconds} />
        </div>
    );
}

/* Item hiển thị 1 ô */
function TimeBoxItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-blue-700">{String(value).padStart(2, "0")}</p>
            <p className="text-xs text-gray-600">{label}</p>
        </div>
    );
}

/* Helper: parse chuỗi time dạng "09:00 - 29/09/2025" */
function parseAuctionDate(timeStr: string): Date {
    try {
        const [timePart, datePart] = timeStr.split(" - ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hour, minute);
    } catch {
        return new Date(); // fallback
    }
}

export default TimeBox;
