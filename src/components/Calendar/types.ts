export interface ICalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
}

export interface IDraggedEventState {
    event: ICalendarEvent;
    dayDate: Date;
    offsetY: number;
}

export interface IResizingEventState {
    event: ICalendarEvent;
    dayDate: Date;
}

export enum EViewType {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
}
