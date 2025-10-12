import type { ICalendarEvent, IEventLayout } from './types';

/**
 * Checks if two events overlap in time
 */
const eventsOverlap = (event1: ICalendarEvent, event2: ICalendarEvent): boolean => {
    const start1 = new Date(event1.start).getTime();
    const end1 = new Date(event1.end).getTime();
    const start2 = new Date(event2.start).getTime();
    const end2 = new Date(event2.end).getTime();

    return start1 < end2 && start2 < end1;
};

/**
 * Calculates layout information for overlapping events
 * Returns array of events with their column positions
 */
export const calculateEventLayout = (events: ICalendarEvent[]): IEventLayout[] => {
    if (events.length === 0) return [];

    // Sort events by start time, then by duration (longer events first)
    const sortedEvents = [...events].sort((a, b) => {
        const startA = new Date(a.start).getTime();
        const startB = new Date(b.start).getTime();
        if (startA !== startB) return startA - startB;

        // If start times are the same, longer events go first
        const durationA = new Date(a.end).getTime() - startA;
        const durationB = new Date(b.end).getTime() - startB;

        return durationB - durationA;
    });

    const layout: IEventLayout[] = [];
    const columns: ICalendarEvent[][] = [];

    for (const event of sortedEvents) {
        let columnIndex = 0;

        // Find the first column where this event doesn't overlap with any existing event
        while (columnIndex < columns.length) {
            const hasOverlap = columns[columnIndex].some((existingEvent) => eventsOverlap(event, existingEvent));

            if (!hasOverlap) {
                break;
            }
            columnIndex++;
        }

        // If we need a new column, create it
        if (columnIndex === columns.length) {
            columns.push([]);
        }

        // Add event to the column
        columns[columnIndex].push(event);

        layout.push({
            event,
            column: columnIndex,
            totalColumns: Math.max(
                columns.length,
                layout.reduce((max, item) => Math.max(max, item.totalColumns), 1),
            ),
        });
    }

    // Update totalColumns for all events to reflect the final number of columns
    const finalTotalColumns = columns.length;

    return layout.map((item) => ({
        ...item,
        totalColumns: finalTotalColumns,
    }));
};
