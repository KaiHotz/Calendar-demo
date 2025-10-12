import { describe, expect, it } from 'vitest';

import { calculateEventLayout } from './utils';
import type { ICalendarEvent } from './types';

describe('Calendar Utils', () => {
    describe('calculateEventLayout', () => {
        it('should return empty array for empty input', () => {
            const result = calculateEventLayout([]);
            expect(result).toEqual([]);
        });

        it('should handle single event correctly', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Meeting',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T11:00:00',
                    color: '#blue',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                event: events[0],
                column: 0,
                totalColumns: 1,
            });
        });

        it('should handle two non-overlapping events', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Morning Meeting',
                    start: '2025-10-12T09:00:00',
                    end: '2025-10-12T10:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Afternoon Meeting',
                    start: '2025-10-12T14:00:00',
                    end: '2025-10-12T15:00:00',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                event: events[0],
                column: 0,
                totalColumns: 1,
            });
            expect(result[1]).toEqual({
                event: events[1],
                column: 0,
                totalColumns: 1,
            });
        });

        it('should handle two overlapping events', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Meeting 1',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T11:30:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Meeting 2',
                    start: '2025-10-12T11:00:00',
                    end: '2025-10-12T12:00:00',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);

            // Both events should have totalColumns: 2
            expect(result[0].totalColumns).toBe(2);
            expect(result[1].totalColumns).toBe(2);

            // Events should be in different columns
            const columns = result.map((item) => item.column);
            expect(new Set(columns).size).toBe(2);
        });

        it('should handle three overlapping events', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Meeting 1',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T12:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Meeting 2',
                    start: '2025-10-12T11:00:00',
                    end: '2025-10-12T13:00:00',
                    color: '#red',
                },
                {
                    id: '3',
                    title: 'Meeting 3',
                    start: '2025-10-12T11:30:00',
                    end: '2025-10-12T12:30:00',
                    color: '#green',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(3);

            // All events should have totalColumns: 3 since they all overlap
            result.forEach((item) => {
                expect(item.totalColumns).toBe(3);
            });

            // Each event should be in a different column
            const columns = result.map((item) => item.column);
            expect(new Set(columns).size).toBe(3);
        });

        it('should handle events with same start time but different durations', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Long Meeting',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T12:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Short Meeting',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T10:30:00',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);

            // Find the longer event (should be processed first)
            const longerEvent = result.find((item) => item.event.id === '1');
            const shorterEvent = result.find((item) => item.event.id === '2');

            expect(longerEvent).toBeDefined();
            expect(shorterEvent).toBeDefined();
            expect(longerEvent!.totalColumns).toBe(2);
            expect(shorterEvent!.totalColumns).toBe(2);
        });

        it('should handle complex overlapping scenario', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Event 1',
                    start: '2025-10-12T09:00:00',
                    end: '2025-10-12T10:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Event 2',
                    start: '2025-10-12T09:30:00',
                    end: '2025-10-12T11:00:00',
                    color: '#red',
                },
                {
                    id: '3',
                    title: 'Event 3',
                    start: '2025-10-12T10:30:00',
                    end: '2025-10-12T11:30:00',
                    color: '#green',
                },
                {
                    id: '4',
                    title: 'Event 4',
                    start: '2025-10-12T12:00:00',
                    end: '2025-10-12T13:00:00',
                    color: '#yellow',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(4);

            // Events 1, 2, 3 overlap in some way, so they should have totalColumns > 1
            const overlappingEvents = result.filter((item) => ['1', '2', '3'].includes(item.event.id));
            overlappingEvents.forEach((item) => {
                expect(item.totalColumns).toBeGreaterThan(1);
            });

            // Event 4 doesn't overlap with others, so it should have totalColumns: 1
            const event4 = result.find((item) => item.event.id === '4');
            expect(event4!.totalColumns).toBe(1);
            expect(event4!.column).toBe(0);
        });

        it('should handle events that touch but do not overlap', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Event 1',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T11:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Event 2',
                    start: '2025-10-12T11:00:00',
                    end: '2025-10-12T12:00:00',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);

            // Events that just touch but don't overlap should not be considered overlapping
            expect(result[0].totalColumns).toBe(1);
            expect(result[1].totalColumns).toBe(1);
            expect(result[0].column).toBe(0);
            expect(result[1].column).toBe(0);
        });

        it('should maintain event order in the result', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Event 1',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T11:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Event 2',
                    start: '2025-10-12T09:00:00',
                    end: '2025-10-12T10:00:00',
                    color: '#red',
                },
                {
                    id: '3',
                    title: 'Event 3',
                    start: '2025-10-12T11:00:00',
                    end: '2025-10-12T12:00:00',
                    color: '#green',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(3);

            // Events should be sorted by start time in the result
            const resultEventIds = result.map((item) => item.event.id);
            expect(resultEventIds).toEqual(['2', '1', '3']);
        });

        it('should handle events with different date formats', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Event 1',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T11:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Event 2',
                    start: '2025-10-12T10:30:00',
                    end: '2025-10-12T11:30:00',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);
            expect(result[0].totalColumns).toBe(2);
            expect(result[1].totalColumns).toBe(2);
        });

        it('should handle events with UTC date formats', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Event 1',
                    start: '2025-10-12T10:00:00.000Z',
                    end: '2025-10-12T11:00:00.000Z',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Event 2',
                    start: '2025-10-12T10:30:00.000Z',
                    end: '2025-10-12T11:30:00.000Z',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);
            expect(result[0].totalColumns).toBe(2);
            expect(result[1].totalColumns).toBe(2);
        });

        it('should handle events with zero duration', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Instant Event',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T10:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Regular Event',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-12T11:00:00',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);
            // Zero duration events don't overlap with other events due to the strict < comparison
            expect(result[0].totalColumns).toBe(1);
            expect(result[1].totalColumns).toBe(1);
        });

        it('should handle events that span multiple days', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Multi-day Event',
                    start: '2025-10-12T10:00:00',
                    end: '2025-10-13T10:00:00',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Same Day Event',
                    start: '2025-10-12T11:00:00',
                    end: '2025-10-12T12:00:00',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);
            // Multi-day event overlaps with same-day event
            expect(result[0].totalColumns).toBe(2);
            expect(result[1].totalColumns).toBe(2);
        });

        it('should handle events with millisecond precision', () => {
            const events: ICalendarEvent[] = [
                {
                    id: '1',
                    title: 'Event 1',
                    start: '2025-10-12T10:00:00.000',
                    end: '2025-10-12T10:30:00.500',
                    color: '#blue',
                },
                {
                    id: '2',
                    title: 'Event 2',
                    start: '2025-10-12T10:30:00.500',
                    end: '2025-10-12T11:00:00.000',
                    color: '#red',
                },
            ];

            const result = calculateEventLayout(events);

            expect(result).toHaveLength(2);
            // Events that touch at exact millisecond should not overlap
            expect(result[0].totalColumns).toBe(1);
            expect(result[1].totalColumns).toBe(1);
        });
    });
});
