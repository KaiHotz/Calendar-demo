import { Activity, useEffect, useState } from 'react';
import type { FC } from 'react';
import { format, isToday } from 'date-fns';

interface LiveTimeLineProps {
    date: Date;
    isVisible?: boolean;
    showLabel?: boolean;
}

export const TimeLine: FC<LiveTimeLineProps> = ({ date, isVisible = true, showLabel }) => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const updateTime = (): void => {
            setCurrentTime(new Date());
        };

        // Update immediately
        updateTime();

        // Update every 10 seconds for more responsive updates
        const interval = setInterval(updateTime, 10000);

        return () => clearInterval(interval);
    }, []);

    // Only show the line if it's today and the component is visible
    if (!isToday(date) || !isVisible) {
        return null;
    }

    // Calculate the position based on current time
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const dayMinutes = 24 * 60;
    const position = (totalMinutes / dayMinutes) * 100;

    return (
        <div
            className="absolute left-0 right-0 z-20 pointer-events-none group/time-line"
            style={{ top: `${position}%` }}
        >
            <div className="relative">
                {/* Time indicator circle */}
                <div className="absolute -left-2 -top-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />

                {/* Time label */}
                <Activity mode={showLabel ? 'visible' : 'hidden'}>
                    <div className="absolute -left-14 -top-2.5 text-xs font-medium text-red-500 bg-white px-1 py-0.5 rounded shadow-sm border">
                        {format(currentTime, 'HH:mm')}
                    </div>
                </Activity>

                {/* Horizontal line */}
                <div className="h-0.5 bg-red-500 shadow-sm" />
            </div>
        </div>
    );
};
