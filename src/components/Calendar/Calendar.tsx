import { type Dispatch, type FC, type SetStateAction, useMemo, useState } from 'react';
import {
    addDays,
    addMonths,
    addWeeks,
    differenceInMinutes,
    eachDayOfInterval,
    endOfDay,
    endOfMonth,
    format,
    setHours,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from 'date-fns';

import { CalendarHeader } from './CalendarHeader';
import { CalendarEvent } from './CalendarEvent';
import type { ICalendarEvent, IDraggedEventState, IResizingEventState, TViewType } from './types';

interface CalendarProps {
    events: ICalendarEvent[];
    onEventsChange: Dispatch<SetStateAction<ICalendarEvent[]>>;
}

export const Calendar: FC<CalendarProps> = ({ events, onEventsChange }) => {
    const [view, setView] = useState<TViewType>('week');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [resizingEvent, setResizingEvent] = useState<IResizingEventState | null>(null);
    const [draggedEvent, setDraggedEvent] = useState<IDraggedEventState | null>(null);

    const hours: number[] = Array.from({ length: 24 }, (_, i) => i);

    const viewDates = useMemo<Date[]>(() => {
        if (view === 'day') {
            return [currentDate];
        } else if (view === 'week') {
            const start = startOfWeek(currentDate);

            return Array.from({ length: 7 }, (_, i) => addDays(start, i));
        } else {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            const firstDay = startOfWeek(start);
            const lastDay = addDays(end, 6 - end.getDay());

            return eachDayOfInterval({ start: firstDay, end: lastDay });
        }
    }, [currentDate, view]);

    const navigate = (direction: number): void => {
        switch (view) {
            case 'day':
                setCurrentDate(addDays(currentDate, direction));
                break;
            case 'week':
                setCurrentDate(addWeeks(currentDate, direction));
                break;
            case 'month':
                setCurrentDate(addMonths(currentDate, direction));
                break;
            default:
                setCurrentDate(addMonths(currentDate, direction));
        }
    };

    const getEventsForDay = (date: Date): ICalendarEvent[] => {
        return events.filter((event: ICalendarEvent) => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);

            return eventStart < dayEnd && eventEnd > dayStart;
        });
    };

    const addEvent = (date: Date, hour: number): void => {
        const start = setHours(date, hour);
        const end = setHours(start, hour + 1);

        const newEvent: ICalendarEvent = {
            id: new Date().getTime().toString(),
            title: 'New Event',
            start: start.toISOString(),
            end: end.toISOString(),
            color: '#60a5fa',
        };

        onEventsChange((prevEvents) => [...prevEvents, newEvent]);
    };

    const deleteEvent = (eventId: string): void => {
        const filteredEvents = events.filter((e) => e.id !== eventId);
        onEventsChange(filteredEvents);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!draggedEvent && !resizingEvent) return;

        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hourHeight = rect.height / 24;
        const newHour = Math.floor(y / hourHeight);
        const minutes = Math.floor(((y % hourHeight) / hourHeight) * 60);

        if (draggedEvent) {
            const event = draggedEvent.event;
            const start = new Date(event.start);
            const end = new Date(event.end);
            const duration = differenceInMinutes(end, start);

            const targetDate = viewDates[Math.floor((e.clientX - rect.left) / (rect.width / viewDates.length))];
            if (!targetDate) return;

            const newStart = new Date(targetDate);
            newStart.setHours(Math.max(0, Math.min(23, newHour)), minutes, 0, 0);
            const newEnd = new Date(newStart.getTime() + duration * 60000);

            const updatedEvents = events.map((ev) =>
                ev.id === event.id ? { ...ev, start: newStart.toISOString(), end: newEnd.toISOString() } : ev,
            );
            onEventsChange(updatedEvents);
        }

        if (resizingEvent) {
            const event = resizingEvent.event;
            const targetDate = viewDates[Math.floor((e.clientX - rect.left) / (rect.width / viewDates.length))];
            if (!targetDate) return;

            const newEnd = new Date(targetDate);
            newEnd.setHours(Math.max(0, Math.min(23, newHour)), Math.min(59, minutes + 30), 0, 0);

            const start = new Date(event.start);
            if (newEnd > start) {
                const updatedEvents = events.map((ev) =>
                    ev.id === event.id ? { ...ev, end: newEnd.toISOString() } : ev,
                );
                onEventsChange(updatedEvents);
            }
        }
    };

    const handleMouseUp = (): void => {
        if (draggedEvent || resizingEvent) {
            onEventsChange?.(events);
        }
        setDraggedEvent(null);
        setResizingEvent(null);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <CalendarHeader
                dates={
                    view === 'day'
                        ? format(currentDate, 'EEEE, MMMM d, yyyy')
                        : view === 'month'
                          ? format(currentDate, 'MMMM yyyy')
                          : `${format(viewDates[0], 'MMM d')} - ${format(viewDates[6], 'MMM d, yyyy')}`
                }
                view={view}
                onChangeView={setView}
                navigate={navigate}
                onClickToday={setCurrentDate}
            />

            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="bg-white border-b">
                    <div className="flex">
                        <div className="w-20 flex-shrink-0" />
                        {viewDates.map((date, idx) => (
                            <div key={idx} className="flex-1 text-center py-3 border-l text-white bg-teal-500">
                                <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                                <div className="text-sm font-semibold">{format(date, 'dd.MM')}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <div className="flex">
                        <div className="w-20 flex-shrink-0 border-r bg-gray-50">
                            {hours.map((hour) => (
                                <div key={hour} className="h-16 border-b flex items-start justify-end pr-2 pt-1">
                                    <span className="text-xs text-gray-500">{String(hour).padStart(2, '0')}:00</span>
                                </div>
                            ))}
                        </div>
                        <div
                            className="flex-1 flex relative"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {viewDates.map((date, dayIdx) => (
                                <div key={dayIdx} className="flex-1 border-r relative">
                                    {hours.map((hour) => (
                                        <div
                                            key={hour}
                                            className="h-16 border-b cursor-pointer hover:bg-teal-500/10"
                                            onClick={() => addEvent(date, hour)}
                                        />
                                    ))}
                                    {getEventsForDay(date).map((event) => (
                                        <CalendarEvent
                                            key={event.id}
                                            event={event}
                                            dayDate={date}
                                            onDelete={deleteEvent}
                                            onResize={setResizingEvent}
                                            onDrag={setDraggedEvent}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
