import { type FC } from 'react';
import { format, isSameDay } from 'date-fns';

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
    const weeks: Date[][] = [];
    for (let i = 0; i < viewDates.length; i += 7) {
        weeks.push(viewDates.slice(i, i + 7));
    }

    return (
        <div className="flex-1 overflow-auto p-2">
            <div className="bg-white rounded-lg shadow">
                <div className="grid grid-cols-7 border-b">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-teal-600 ">
                            {day}
                        </div>
                    ))}
                </div>
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="grid grid-cols-7">
                        {week.map((day, dayIdx) => {
                            const dayEvents = getEventsForDay(day);
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth();

                            return (
                                <div
                                    key={dayIdx}
                                    className={`min-h-32 border-r border-b p-2 ${
                                        !isCurrentMonth ? 'bg-gray-50' : ''
                                    } ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}
                                >
                                    <div
                                        className={`text-sm font-semibold mb-1 ${
                                            !isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
                                        }`}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 3).map((event) => (
                                            <div
                                                key={event.id}
                                                className="text-xs p-1 rounded truncate text-white cursor-pointer"
                                                style={{ backgroundColor: event.color }}
                                                onClick={() => {
                                                    setView(EViewType.DAY);
                                                    setCurrentDate(day);
                                                }}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
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
