import { useState } from 'react';

import { Calendar, type ICalendarEvent } from '@/components/Calendar';

export function App() {
    const [events, setEvents] = useState<ICalendarEvent[]>([]);

    return <Calendar events={events} onEventsChange={setEvents} />;
}
