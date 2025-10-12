import { useState } from 'react';

import { Calendar, type ICalendarEvent } from '@/components/Calendar';

export function App() {
    const [events, setEvents] = useState<ICalendarEvent[]>([
        {
            id: '1',
            title: 'Eid',
            start: new Date(2024, 3, 1, 9, 0).toISOString(),
            end: new Date(2024, 3, 1, 10, 30).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '2',
            title: 'Eid',
            start: new Date(2024, 3, 2, 9, 0).toISOString(),
            end: new Date(2024, 3, 2, 10, 30).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '3',
            title: 'Lösc...',
            start: new Date(2024, 3, 2, 10, 30).toISOString(),
            end: new Date(2024, 3, 3, 11, 0).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '4',
            title: 'Commerzba...',
            start: new Date(2024, 3, 3, 10, 30).toISOString(),
            end: new Date(2024, 3, 3, 14, 0).toISOString(),
            color: '#60a5fa',
        },
        {
            id: '5',
            title: 'MVG im RZ',
            start: new Date(2024, 3, 3, 4, 30).toISOString(),
            end: new Date(2024, 3, 3, 9, 0).toISOString(),
            color: '#60a5fa',
        },
    ]);

    return <Calendar events={events} onEventsChange={setEvents} />;
}
