import { useState } from 'react';

import { Calendar, type ICalendarEvent } from '@/components/Calendar';

export function App() {
    const [events, setEvents] = useState<ICalendarEvent[]>([
        {
            id: '1',
            title: 'Eid',
            start: new Date(2025, 3, 1, 9, 0).toISOString(),
            end: new Date(2025, 3, 1, 10, 30).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '2',
            title: 'Eid',
            start: new Date(2025, 3, 2, 9, 0).toISOString(),
            end: new Date(2025, 3, 2, 10, 30).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '3',
            title: 'Lösc...',
            start: new Date(2025, 3, 2, 10, 30).toISOString(),
            end: new Date(2025, 3, 3, 11, 0).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '4',
            title: 'Commerzba...',
            start: new Date(2025, 3, 3, 10, 30).toISOString(),
            end: new Date(2025, 3, 3, 14, 0).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '5',
            title: 'MVG im RZ',
            start: new Date(2024, 3, 3, 4, 30).toISOString(),
            end: new Date(2024, 3, 3, 9, 0).toISOString(),
            color: '#60a5fa',
        },
        // Added overlapping events for testing on October 15, 2025
        {
            id: '6',
            title: 'Meeting A',
            start: new Date(2025, 9, 15, 9, 0).toISOString(),
            end: new Date(2025, 9, 15, 11, 0).toISOString(),
            color: '#ef4444',
        },
        {
            id: '7',
            title: 'Meeting B',
            start: new Date(2025, 9, 15, 10, 0).toISOString(),
            end: new Date(2025, 9, 15, 12, 0).toISOString(),
            color: '#22c55e',
        },
        {
            id: '8',
            title: 'Meeting C',
            start: new Date(2025, 9, 15, 10, 30).toISOString(),
            end: new Date(2025, 9, 15, 11, 30).toISOString(),
            color: '#8b5cf6',
        },
    ]);

    return <Calendar events={events} onEventsChange={setEvents} />;
}
