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
    if (events.length === 0) {
        return [];
    }

    // Sort events by start time only
    const sortedEvents = [...events].sort((a, b) => {
        const startA = new Date(a.start).getTime();
        const startB = new Date(b.start).getTime();

        return startA - startB;
    });

    const layout: IEventLayout[] = [];
    const processedEvents = new Set<string>();

    // Process each event and find its overlapping group
    for (const event of sortedEvents) {
        if (processedEvents.has(event.id)) continue;

        // Find all events that overlap with this event
        const overlappingGroup = [event];
        for (const otherEvent of sortedEvents) {
            if (otherEvent.id !== event.id && !processedEvents.has(otherEvent.id)) {
                // Check if otherEvent overlaps with any event in the current group
                const overlapsWithGroup = overlappingGroup.some((groupEvent) => eventsOverlap(groupEvent, otherEvent));

                if (overlapsWithGroup) {
                    overlappingGroup.push(otherEvent);
                }
            }
        }

        // If there's only one event in the group, it doesn't overlap with anything
        if (overlappingGroup.length === 1) {
            layout.push({
                event,
                column: 0,
                totalColumns: 1,
            });
            processedEvents.add(event.id);
            continue;
        }

        // For overlapping events, assign columns
        const columns: ICalendarEvent[][] = [];

        for (const groupEvent of overlappingGroup) {
            let columnIndex = 0;

            // Find the first column where this event doesn't overlap with any existing event
            while (columnIndex < columns.length) {
                const hasOverlap = columns[columnIndex].some((existingEvent) => eventsOverlap(groupEvent, existingEvent));

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
            columns[columnIndex].push(groupEvent);

            layout.push({
                event: groupEvent,
                column: columnIndex,
                totalColumns: columns.length,
            });

            processedEvents.add(groupEvent.id);
        }

        // Update totalColumns for all events in this overlapping group
        const groupTotalColumns = columns.length;
        layout.forEach((item) => {
            if (overlappingGroup.some((groupEvent) => groupEvent.id === item.event.id)) {
                item.totalColumns = groupTotalColumns;
            }
        });
    }

    return layout;
};
