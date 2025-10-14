import { type FC, useMemo } from 'react';
import { format, isToday } from 'date-fns';

import { cn } from '@/utils';

import type { ICalendarEvent } from './types';
import { EViewType } from './types';

interface IMonthviewProps {
    currentDate: Date;
    viewDates: Date[];
    setView: (view: EViewType) => void;
    setCurrentDate: (date: Date) => void;
    getEventsForDay: (date: Date) => ICalendarEvent[];
}

export const MonthView: FC<IMonthviewProps> = ({
    currentDate,
    getEventsForDay,
    viewDates,
    setView,
    setCurrentDate,
}) => {
    // Split viewDates into weeks
    const weeks = useMemo(() => {
        const numberOfWeeks = Math.ceil(viewDates.length / 7);

        return Array.from({ length: numberOfWeeks }, (_, i) => viewDates.slice(i * 7, i * 7 + 7));
    }, [viewDates]);

    return (
        <div className="flex-1 overflow-auto p-1 md:p-2">
            <div className="bg-white rounded-lg shadow">
                <div className="grid grid-cols-7 border-b">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div
                            key={day}
                            className="p-2 md:p-3 text-center font-semibold bg-teal-600 text-white text-xs md:text-sm"
                        >
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.charAt(0)}</span>
                        </div>
                    ))}
                </div>
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="grid grid-cols-7">
                        {week.map((day, dayIdx) => {
                            const isTodayFlag = isToday(day);
                            const dayEvents = getEventsForDay(day);
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth();

                            return (
                                <div
                                    key={dayIdx}
                                    className={cn('min-h-20 md:min-h-32 border-r border-b p-1 md:p-2', {
                                        'bg-gray-50': !isCurrentMonth,
                                        'bg-blue-50': isTodayFlag,
                                    })}
                                >
                                    <div
                                        className={cn('text-xs md:text-sm font-semibold mb-1 text-gray-700', {
                                            'text-gray-400': !isCurrentMonth,
                                        })}
                                    >
                                        <span className={isTodayFlag ? 'text-white rounded-full bg-red-500 p-1' : ''}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5 md:space-y-1">
                                        {dayEvents.slice(0, 2).map((event) => (
                                            <div
                                                key={event.id}
                                                className="text-xs p-0.5 md:p-1 rounded truncate text-white cursor-pointer"
                                                style={{ backgroundColor: event.color }}
                                                onClick={() => {
                                                    setView(EViewType.DAY);
                                                    setCurrentDate(day);
                                                }}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
