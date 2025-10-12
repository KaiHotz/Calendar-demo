import { type Dispatch, type FC, type MouseEvent, type SetStateAction } from 'react';
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
    const width = totalColumns > 1 ? 100 / totalColumns - 1 : 100 / totalColumns; // Subtract 1% for spacing
    const left = column * (100 / totalColumns) + (column > 0 ? 0.5 : 0); // Add small offset for spacing

    const isMultiDay = !isSameDay(eventStart, eventEnd);
    const isLastDay = isSameDay(dayDate, eventEnd);

    const handleDrag = (e: MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        onDrag({ event, dayDate, offsetY: e.nativeEvent.offsetY });
    };

    const handleResize = (e: MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        onResize({ event, dayDate });
    };

    return (
        <div
            className="absolute rounded px-2 py-1 text-xs text-white overflow-hidden cursor-move group opacity-90"
            style={{
                top: `${top}%`,
                height: `${height}%`,
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: event.color,
                minHeight: '20px',
                zIndex: 10,
            }}
            onMouseDown={handleDrag}
        >
            <div className="font-semibold truncate">{event.title}</div>
            <div className="text-[10px] opacity-90">
                {format(displayStart, 'HH:mm')} - {format(displayEnd, 'HH:mm')}
            </div>
            <button
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 rounded p-0.5 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event.id);
                }}
            >
                <Trash2 size={10} />
            </button>
            {(!isMultiDay || isLastDay) && (
                <div
                    className="absolute bottom-0 left-0 right-0 flex justify-center h-2 cursor-ns-resize hover:bg-gray-400/80 "
                    onMouseDown={handleResize}
                >
                    <StretchHorizontal size={8} />
                </div>
            )}
        </div>
    );
};
