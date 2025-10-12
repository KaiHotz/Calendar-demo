import { useCallback, useMemo, useState } from 'react';
import type { Dispatch, FC, MouseEvent, SetStateAction, TouchEvent } from 'react';
import {
    addDays,
    addMonths,
    addWeeks,
    differenceInMinutes,
    eachDayOfInterval,
    endOfDay,
    endOfMonth,
    format,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from 'date-fns';

import { CalendarHeader } from './CalendarHeader';
import { CalendarEvent } from './CalendarEvent';
import { MonthView } from './MonthView';
import type { ICalendarEvent, IDraggedEventState, IResizingEventState } from './types';
import { EViewType } from './types';
import { calculateEventLayout } from './utils';

interface CalendarProps {
    events: ICalendarEvent[];
    onEventsChange: Dispatch<SetStateAction<ICalendarEvent[]>>;
}

const getInitialView = (): EViewType => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return EViewType.DAY;
    }

    return EViewType.WEEK;
};

export const Calendar: FC<CalendarProps> = ({ events, onEventsChange }) => {
    const [view, setView] = useState<EViewType>(getInitialView);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [resizingEvent, setResizingEvent] = useState<IResizingEventState | null>(null);
    const [draggedEvent, setDraggedEvent] = useState<IDraggedEventState | null>(null);

    const hours: number[] = Array.from({ length: 24 }, (_, i) => i);

    const viewDates = useMemo<Date[]>(() => {
        if (view === EViewType.DAY) {
            return [currentDate];
        } else if (view === EViewType.WEEK) {
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

    const handleNavigate = useCallback(
        (direction: number): void => {
            switch (view) {
                case EViewType.DAY:
                    setCurrentDate(addDays(currentDate, direction));
                    break;
                case EViewType.WEEK:
                    setCurrentDate(addWeeks(currentDate, direction));
                    break;
                case EViewType.MONTH:
                    setCurrentDate(addMonths(currentDate, direction));
                    break;
                default:
                    setCurrentDate(addMonths(currentDate, direction));
            }
        },
        [currentDate, view],
    );

    const getEventsForDay = useCallback(
        (date: Date): ICalendarEvent[] => {
            return events.filter((event: ICalendarEvent) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                const dayStart = startOfDay(date);
                const dayEnd = endOfDay(date);

                return eventStart < dayEnd && eventEnd > dayStart;
            });
        },
        [events],
    );

    const handleAddEvent = useCallback(
        (date: Date, hour: number): void => {
            const start = new Date(date);
            start.setHours(hour, 0, 0, 0);
            const end = new Date(start);
            end.setHours(hour + 1, 0, 0, 0);

            const newEvent: ICalendarEvent = {
                id: new Date().getTime().toString(),
                title: 'New Event',
                start: start.toISOString(),
                end: end.toISOString(),
                color: '#60a5fa',
            };

            onEventsChange((prevEvents) => [...prevEvents, newEvent]);
        },
        [onEventsChange],
    );

    const handleDeleteEvent = useCallback(
        (eventId: string): void => {
            const filteredEvents = events.filter((e) => e.id !== eventId);
            onEventsChange(filteredEvents);
        },
        [events, onEventsChange],
    );

    const handleMove = useCallback(
        (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>): void => {
            if (!draggedEvent && !resizingEvent) return;

            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const hourHeight = rect.height / 24;
            const newHour = Math.floor(y / hourHeight);
            const minutes = Math.floor(((y % hourHeight) / hourHeight) * 60);

            if (draggedEvent) {
                const event = draggedEvent.event;
                const start = new Date(event.start);
                const end = new Date(event.end);
                const duration = differenceInMinutes(end, start);

                const targetDate = viewDates[Math.floor((clientX - rect.left) / (rect.width / viewDates.length))];
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
                const targetDate = viewDates[Math.floor((clientX - rect.left) / (rect.width / viewDates.length))];
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
        },
        [draggedEvent, events, onEventsChange, resizingEvent, viewDates],
    );

    const handleMouseUp = useCallback((): void => {
        if (draggedEvent || resizingEvent) {
            onEventsChange?.(events);
        }
        setDraggedEvent(null);
        setResizingEvent(null);
    }, [draggedEvent, resizingEvent, events, onEventsChange]);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <CalendarHeader
                title={
                    view === EViewType.DAY
                        ? format(currentDate, 'EEEE, MMMM d, yyyy')
                        : view === EViewType.MONTH
                          ? format(currentDate, 'MMMM yyyy')
                          : `${format(viewDates[0], 'MMM d')} - ${format(viewDates[6], 'MMM d, yyyy')}`
                }
                view={view}
                onChangeView={setView}
                navigate={handleNavigate}
                onClickToday={setCurrentDate}
            />

            {view === 'month' ? (
                <MonthView
                    currentDate={currentDate}
                    viewDates={viewDates}
                    setView={setView}
                    setCurrentDate={setCurrentDate}
                    getEventsForDay={getEventsForDay}
                />
            ) : (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="bg-white border-b">
                        <div className="flex">
                            <div className="w-16 md:w-20 flex-shrink-0" />
                            {viewDates.map((date, idx) => (
                                <div
                                    key={idx}
                                    className="flex-1 text-center py-2 md:py-3 border-l text-white bg-teal-500"
                                >
                                    <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                                    <div className="text-xs md:text-sm font-semibold">{format(date, 'dd.MM')}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <div className="flex">
                            <div className="w-16 md:w-20 flex-shrink-0 border-r bg-gray-50">
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="h-12 md:h-16 border-b flex items-start justify-end pr-1 md:pr-2 pt-1"
                                    >
                                        <span className="text-xs text-gray-500">
                                            {String(hour).padStart(2, '0')}:00
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div
                                className="flex-1 flex relative"
                                onMouseMove={handleMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchMove={handleMove}
                                onTouchEnd={handleMouseUp}
                            >
                                {viewDates.map((date, dayIdx) => (
                                    <div
                                        key={dayIdx}
                                        className="flex-1 border-r relative"
                                        title="Click to add a new event"
                                    >
                                        {hours.map((hour) => (
                                            <div
                                                key={hour}
                                                className="h-12 md:h-16 border-b cursor-pointer hover:bg-teal-500/10"
                                                onClick={() => handleAddEvent(date, hour)}
                                            />
                                        ))}
                                        {(() => {
                                            const dayEvents = getEventsForDay(date);
                                            const eventLayouts = calculateEventLayout(dayEvents);

                                            return eventLayouts.map((layout) => (
                                                <CalendarEvent
                                                    key={layout.event.id}
                                                    event={layout.event}
                                                    dayDate={date}
                                                    onDelete={handleDeleteEvent}
                                                    onResize={setResizingEvent}
                                                    onDrag={setDraggedEvent}
                                                    column={layout.column}
                                                    totalColumns={layout.totalColumns}
                                                />
                                            ));
                                        })()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
