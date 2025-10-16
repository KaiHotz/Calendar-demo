import { useCallback, useMemo } from 'react';
import type { Dispatch, FC, MouseEvent, SetStateAction, TouchEvent } from 'react';
import { endOfDay, format, isSameDay, startOfDay } from 'date-fns';
import { StretchHorizontal, Trash2 } from 'lucide-react';

import type { ICalendarEvent, IDraggedEventState, IResizingEventState } from './types';

interface ICalendarEventProps {
    event: ICalendarEvent;
    dayDate: Date;
    onDelete: (id: string) => void;
    onResize: Dispatch<SetStateAction<IResizingEventState | null>>;
    onDrag: Dispatch<SetStateAction<IDraggedEventState | null>>;
    column?: number;
    totalColumns?: number;
}

export const CalendarEvent: FC<ICalendarEventProps> = ({
    event,
    dayDate,
    onDelete,
    onResize,
    onDrag,
    column = 0,
    totalColumns = 1,
}) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    const dayStart = startOfDay(dayDate);
    const dayEnd = endOfDay(dayDate);

    const displayStart = eventStart < dayStart ? dayStart : eventStart;
    const displayEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

    const startHour = displayStart.getHours() + displayStart.getMinutes() / 60;
    const endHour = displayEnd.getHours() + displayEnd.getMinutes() / 60;

    const top = (startHour / 24) * 100;
    const height = ((endHour - startHour) / 24) * 100;

    // Calculate horizontal positioning for overlapping events
    const width = useMemo(() => (totalColumns > 1 ? 100 / totalColumns - 0.5 : 100 / totalColumns), [totalColumns]); // Subtract 0.5% for spacing
    const left = useMemo(() => column * (100 / totalColumns), [column, totalColumns]); // Add small offset for spacing

    const isMultiDay = !isSameDay(eventStart, eventEnd);
    const isLastDay = isSameDay(dayDate, eventEnd);

    const handleDrag = useCallback(
        (e: MouseEvent<HTMLDivElement>): void => {
            e.stopPropagation();
            onDrag({ event, dayDate, offsetY: e.nativeEvent.offsetY });
        },
        [dayDate, event, onDrag],
    );

    const handleResize = useCallback(
        (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>): void => {
            e.stopPropagation();
            onResize({ event, dayDate });
        },
        [dayDate, event, onResize],
    );

    return (
        <div
            className="absolute rounded px-1 md:px-2 py-1 text-xs text-white overflow-hidden cursor-move group opacity-90 min-h-4 z-10"
            style={{
                top: `${top}%`,
                height: `${height}%`,
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: event.color,
            }}
            onMouseDown={handleDrag}
        >
            <div className="font-semibold truncate text-xs md:text-sm">{event.title}</div>
            <div className="text-[9px] md:text-[10px] opacity-90">
                {format(displayStart, 'HH:mm')} - {format(displayEnd, 'HH:mm')}
            </div>
            <button
                className="absolute top-0.5 md:top-1 right-0.5 md:right-1 opacity-0 group-hover:opacity-100 bg-red-500 rounded p-0.5 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event.id);
                }}
            >
                <Trash2 size={8} className="md:w-[10px] md:h-[10px]" />
            </button>
            {(!isMultiDay || isLastDay) && (
                <div
                    className="absolute bottom-0 left-0 right-0 flex justify-center h-1.5 md:h-2 cursor-ns-resize hover:bg-gray-400/80 "
                    onMouseDown={handleResize}
                    onTouchStart={handleResize}
                >
                    <StretchHorizontal size={6} className="md:w-2 md:h-2" />
                </div>
            )}
        </div>
    );
};
